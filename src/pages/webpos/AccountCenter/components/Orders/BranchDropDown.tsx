import React, { useEffect, FC, Dispatch } from 'react';
import { Select, Row, Col } from 'antd';
import sort from 'fast-sort';
const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string;
  currentOrder,
  setCurrentOrderId,
  dispatch?: (string) => void;
  branchSelectorDisable,
  allBranchInformation?: any[] | undefined;
  setIslocationApplied: (any) => void;
  setSelectedBranchId: (any) => void;
  setCurrentBranchName?: (string) => void;
  requestOneBranchInfo?: (string) => void;
  setIsStaffApplied?: (string) => void;
}

const style = {
  position: 'relative',
  top: 0,
  width: 220,
  marginTop: 20,
  marginLeft: 10,
  marginBottom: 20,
  fontWeight: 400,
};

export const BranchDropDownList = ({
  isInvoiceExist,
  allBranchInformation,
  currentBranchName,
  currentOrder,
  setCurrentOrderId,
  oneBranchInfo,
  branchSelectorDisable,
  resetLocationAndStaffApplied,
  setCurrentLocaiton,
  setCurrentStaff,
  dispatch,
  setBranchDropDropDownDisable,
  setSelectedBranchId,
  setIslocationApplied,
  setIsStaffApplied,
  setCurrentBranchName,
  requestOneBranchInfo,
}) => {

  const allBranchInformationLocal = allBranchInformation.filter(each => each.isInactive === false)
  const currentBranchId = currentOrder && currentOrder.currentOrder && currentOrder.currentOrder.branchId
  const currentOrderL = currentOrder.currentOrder

  useEffect(() => {
    // 初始化默认数据
    if (allBranchInformationLocal.length !== 0 && allBranchInformationLocal[0].isShop == false) {
      dispatch({
        type: 'currentPOSData/switchShopStatus',
        payload: {
          branchId: allBranchInformationLocal[0].id,
        },
      });
    }

    if (allBranchInformationLocal.length !== 0) {
      setCurrentBranchName(allBranchInformationLocal[0].shortName);
      setSelectedBranchId(allBranchInformationLocal[0].id);
      requestOneBranchInfo(allBranchInformationLocal[0].id);

      // 当加载完Branch，请求Location
      dispatch({
        type: 'currentPOSData/fetchLocation',
        payload: {
          branchId: allBranchInformationLocal[0].id,
        },
      });
    }
  }, [allBranchInformation]); // 初始化


  useEffect(() => {
    // 当数据Resume的时候，更新当前的BranchId

    if (currentBranchId && allBranchInformation.length !== 0) {
      console.log('useEffect891,allBranchInformation', allBranchInformation);
      const branchName = allBranchInformation.filter(each => each.id == currentBranchId)[0].shortName

      setSelectedBranchId(currentBranchId)
      setCurrentBranchName(branchName)

      setCurrentOrderId(currentOrderL.id)
      requestOneBranchInfo(currentBranchId) // 为了拿到Location和Staff
    }
  }, [currentBranchId, allBranchInformation]);

  useEffect(() => {
    // 更换Branch，重设isLocationApplied
    console.log('oneBranchInfo010', oneBranchInfo);
    oneBranchInfo && resetLocationAndStaffApplied(oneBranchInfo.isLocationApplied, oneBranchInfo.isBeauticianApplied)
    setCurrentLocaiton()
    setCurrentStaff()
  }, [oneBranchInfo]);

  useEffect(() => {
    console.log('currentOrderL456', currentOrderL);
    if (currentOrderL && currentOrderL.branchId) {
      setBranchDropDropDownDisable(true)
    } else {
      setBranchDropDropDownDisable(false)
    }
  }, [currentOrderL]);

  const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
  const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'staff'

  return (
    <section>
      <label style={{ fontWeight: 600 }}>Branch: </label>

      <Select
        placeholder="Select a branch"
        showSearch
        style={style}
        disabled={branchSelectorDisable || isInvoiceExist}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          const branchInformation = allBranchInformationLocal

          requestOneBranchInfo(branchInformation && branchInformation[key].id);

          setIslocationApplied(branchInformation && branchInformation[key].isLocationApplied);
          setIsStaffApplied(branchInformation && branchInformation[key].isBeauticianApplied);

          setSelectedBranchId(branchInformation && branchInformation[key].id);
          setCurrentBranchName(branchInformation && branchInformation[key].shortName);
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {allBranchInformationLocal &&
          allBranchInformationLocal.map((branch, index) => {
            if (!branch.isInactive && branch.isShop) {
              return <Option key={index} value={index}>{`${branch.shortName}`}</Option>;
            } else {
              return null;
            }
          })}
      </Select>

      <Row>
        <Col span={12}>
          <div style={{ color: 'lightgray' }}>{`Is Location Applied: ${oneBranchInfo && oneBranchInfo.isLocationApplied ? 'Yes' : "No"}`}</div>
        </Col>

        <Col span={12}>
          <div style={{ color: 'lightgray' }}>{`Is ${staffName.replace(/^\S/, s => s.toUpperCase())} Applied: ${oneBranchInfo && oneBranchInfo.isBeauticianApplied ? 'Yes' : "No"}`}</div>
        </Col>
      </Row>

    </section>
  );
};

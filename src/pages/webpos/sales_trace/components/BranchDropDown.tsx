import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';
import sort from 'fast-sort';
const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string,
  allBranchInformation?: any[] | undefined,
  setSelectedBranchId: (any) => void,
  setCurrentBranchName?: (string) => void,
  requestBranchData?: (string) => void,
}


export const BranchDropDown: FC<SelectBranchInterface> = (props) => {

  const { requestBranchData, fetchOneBranchInfo, allBranchInformation, dispatch, setSelectedBranchId, currentBranchName, setCurrentBranchName } = props;

  console.log('currentBranchName=', currentBranchName);

  sort(allBranchInformation).asc(user => user.shortName.toLowerCase())

  const allBranchInformationLocal = allBranchInformation.filter(each=>each.isInactive == false)

  useEffect(() => {
    console.log('allBranchInformation484=', allBranchInformationLocal);
    allBranchInformationLocal
    if (allBranchInformationLocal.length !== 0) {
      requestBranchData(allBranchInformationLocal[0].id)
      setCurrentBranchName(allBranchInformationLocal[0].shortName)
      setSelectedBranchId(allBranchInformationLocal[0].id)

      // 当加载完Branch，请求Location
      dispatch({
        type: 'currentPOSData/fetchLocation',
        payload:{
          branchId: allBranchInformationLocal[0].id
        }
      });
    }
  }, [allBranchInformation]) // 初始化

  const style = {
    position: 'relative',
    top: 0,
    width: 220,
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
    // color: "#1890ff", 
    fontWeight: 400,
    // border: "1px solid #1890ff"
  }

  return (
    <section style={{marginLeft: 5}}>
      <label style={{ fontWeight: 450, marginRight: 10}}>Branch: </label>
      <Select
        placeholder='Select a branch'
        showSearch
        style={style}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          // alert(allBranchInformation[key].id)
          requestBranchData(allBranchInformation[key].id)
          fetchOneBranchInfo(allBranchInformation[key].id)
          setSelectedBranchId(allBranchInformation && allBranchInformation[key].id)
          setCurrentBranchName(allBranchInformation && allBranchInformation[key].shortName)
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {allBranchInformation.length == 0 && <Option >Waiting data...</Option>}
        {allBranchInformation && allBranchInformation.map((branch, index) => {
          if(branch.isInactive){
            return null
          } else {
            return (
              <Option key={index} value={index}>{`${branch.shortName}`}</Option>
            )
          }
        })}
      </Select>
    </section>
  )
}

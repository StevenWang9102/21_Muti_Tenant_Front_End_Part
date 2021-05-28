import React, { useEffect } from 'react';
import { Select } from 'antd';
import { Dispatch } from 'umi';
import sort from 'fast-sort';

const { Option } = Select;

interface BranchSelectorInterface {
  fromPage: string,
  branchNameIds?: object,
  dispatch: Dispatch;
  setCurrentBranchId: (string )=>void,
  setCurrentBranchName: (string )=>void,
  setBreadSliceName: (string )=>void,
  allBranchReport?: object | undefined,
  setSearchType?: (string )=>void,
}

export const BranchSelector = (props: BranchSelectorInterface) => {
  const { branchNameIds, dispatch, setCurrentBranchId, allBranchReport } = props;
  const { setCurrentBranchName, fromPage, setBreadSliceName } = props;

  useEffect(() => {
    dispatch({
      type: 'branchManagement/getAllBranchNameGlobal',
    });
  }, []);

  console.log('allBranchReport',allBranchReport);
  sort(allBranchReport).asc(each => each.shortName.toLowerCase())

  return (
    <section style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <label style={{ margin: '0 40px 0 10px', width: 120 }}>
        <b>Branch</b>
      </label>
      <Select
        showSearch
        style={{ width: 400 }}
        placeholder="All Branches"
        optionFilterProp="children"
        onChange={function handleChange(value) {
          
          setBreadSliceName(''); // 清空Bread Slice的选中状态
 
          if (fromPage === 'Payment' ||
          fromPage === 'Category' ||
          fromPage === 'ItemReport' ||
          fromPage === 'ItemDailyReport' ||
          fromPage === 'HourlyReport' ||
          fromPage === 'MonthlyReport' ||
          fromPage === 'CategoryReport'
          ) {
            const branchId = branchNameIds && branchNameIds[value];
            setCurrentBranchName(value);
            setCurrentBranchId(branchId);
          } else {
            if (value === 'AllBranch') {
            } else {
              const branchId = branchNameIds[value];
              dispatch({
                type: `report/getOneBranchSales`,
                payload: branchId,
              });
              setCurrentBranchName(value);
              setCurrentBranchId(branchId);
            }
          }
        }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="AllBranch"> All Branch </Option>

        {allBranchReport &&
          allBranchReport.map((branchInfo, index) => {
            let name = '';
            if (
              fromPage === 'Payment' ||
              fromPage === 'ItemReport' ||
              fromPage === 'ItemDailyReport' ||
              fromPage === 'CategoryReport' ||
              fromPage === 'HourlyReport' ||
              fromPage === 'DailyReport' ||
              fromPage === 'MonthlyReport'
            )
              name = 'shortName';
            else name = 'branchName';

            return <Option value={branchInfo[name]}>{branchInfo[name]}</Option>;
          })}
      </Select>
    </section>
  );
};

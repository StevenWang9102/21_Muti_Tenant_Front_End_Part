import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string,
  allBranchInformation?: any[] | undefined,
  setSelectedBranchId: (string) => void,
  setCurrentBranchId: (string) => void,
  setCurrentBranchName?: (string) => void,
  requestBranchAddsOn?: (string) => void,
}


export const DropDownList: FC<SelectBranchInterface> = (props) => {

  const { allBranchInformation, setCurrentBranchId, currentBranchName, setCurrentBranchName,
    requestBranchAddsOn } = props;
  console.log("allBranchInformation=", allBranchInformation);
  
  useEffect(()=>{
    setCurrentBranchName(allBranchInformation && allBranchInformation[0].shortName)
  }, [allBranchInformation])

  return (
      <Select
        showSearch
        style={{ width: 240, marginLeft: "20px", marginTop: 30, color: "#1890ff", fontWeight: 400, border: "1px solid #1890ff" }}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          const branchId = allBranchInformation && allBranchInformation[key].id
          const branchName = allBranchInformation && allBranchInformation[key].shortName
        
          setCurrentBranchName(branchName)
          setCurrentBranchId(branchId)
          requestBranchAddsOn(branchId)
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {allBranchInformation && allBranchInformation.map((branch, index) => {
          return (
            <Option key={index}>{`${branch.shortName}`}</Option>
          )
        })}
      </Select>
  )
}

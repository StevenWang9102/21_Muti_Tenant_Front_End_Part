import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string,
  allBranchInformation?: any[] | undefined,
  setSelectedBranchId: (string) => void,
  setCurrentBranchName?: (string) => void,
}


export const DropDownList: FC<SelectBranchInterface> = (props) => {

  const { allBranchInformation, setSelectedBranchId, currentBranchName, setCurrentBranchName } = props;

  return (
    <section>
      <Select
        showSearch
        style={{ width: 240, marginTop: 30, color: "#1890ff", fontWeight: 400, border: "1px solid #1890ff" }}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          // setSelectedBranchId(key)
          setSelectedBranchId(allBranchInformation && allBranchInformation[key].id)
          setCurrentBranchName(allBranchInformation && allBranchInformation[key].shortName)
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
    </section>
  )
}

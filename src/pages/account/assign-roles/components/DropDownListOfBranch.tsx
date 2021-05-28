import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';
import sort from 'fast-sort';
const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string,
  allBranchInformation?: any[] | undefined,
  setSelectedBranchId: (any) => void,
  setCurrentBranchName?: (string) => void,
}


export const BranchDropDownList: FC<SelectBranchInterface> = (props) => {

  const { allBranchInformation, setSelectedBranchId, currentBranchName, setCurrentBranchName } = props;

  console.log('BranchDropDownList,allBranchInformation=', allBranchInformation);
  sort(allBranchInformation).asc(user => user.shortName.toLowerCase())

  const style = {
    position: 'relative',
    top: 0,
    width: 220, 
    marginLeft:5 , 
    fontWeight: 400, 
  }

  return (
    <section>
      <Select
        placeholder='Select a branch'
        showSearch
        style={style}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          if(key==='all'){
            setSelectedBranchId('All Branches')
            setCurrentBranchName('All Branches')
          } else {
            setSelectedBranchId(allBranchInformation && allBranchInformation[key].id)
            setCurrentBranchName(allBranchInformation && allBranchInformation[key].shortName)
          }
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option key='all' value='all'> All Branches </Option>
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

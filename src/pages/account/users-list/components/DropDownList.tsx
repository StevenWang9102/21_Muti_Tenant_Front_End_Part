import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectBranchInterface {
  currentBranchName: string,
  allBranchInformation?: any[] | undefined,
  setSelectedBranchId: (string) => void,
  setCurrentBranchName?: (string) => void,
  requestBranchUserInformation?: (string) => void,
}

export const DropDownList: FC<SelectBranchInterface> = (props) => {

  const { currentBranchName, allBranchInformation, requestBranchUserInformation, setSelectedBranchId, setCurrentBranchName } = props;
  
  const myStyle = {
    width: 240, 
    marginLeft: 20,
    marginTop: 30,
    display: "inlineBlock",
  }

  useEffect(()=>{
    setCurrentBranchName('All Branch')
  }, [allBranchInformation])
  
  return (
      <Select
        showSearch
        style={myStyle}
        value={currentBranchName}
        optionFilterProp="children"
        onChange={(key) => {
          const currentBranchInfo = allBranchInformation.filter(each=>each.id == key )[0]
          console.log('onChange18,key', key);
          console.log('onChange18,allBranchInformation', allBranchInformation);
          console.log('onChange18,currentBranchInfo', currentBranchInfo);

          if(key == 'all'){
            requestBranchUserInformation('All Branch')
          } else {
            requestBranchUserInformation(key)
            setSelectedBranchId(key)
            setCurrentBranchName(currentBranchInfo.shortName)
          }
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option key="all"> All Branch </Option>
        
        {allBranchInformation && allBranchInformation.map((branch, index) => {          
          return (
            <Option 
              key={branch.id}>{`${branch.shortName}`}
            </Option>
          )
        })}
      </Select>
  )
}

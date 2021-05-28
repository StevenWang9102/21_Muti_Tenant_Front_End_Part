import React, { useEffect, FC, Dispatch } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface SelectBranchInterface {
  currentRoleName: string,
  allRoleInformation?: any[] | undefined,
  setSelectedRoleId: (string) => void,
  setCurrentRoleName?: (string) => void,
}


export const RoleDropDownList: FC<SelectBranchInterface> = (props) => {

  const { allRoleInformation, setSelectedRoleId, currentRoleName, setCurrentRoleName } = props;

  console.log(allRoleInformation);
  

  const style = { 
    position: 'relative',
    top: -33,
    left: 240,
    width: 220, 
    // color: "#1890ff", 
    fontWeight: 400, 
    // border: "1px solid #1890ff" 
  }

  return (
    <section>
      <Select
        placeholder='Select a role'
        showSearch
        style={style}
        value={currentRoleName}
        optionFilterProp="children"
        onChange={(key) => {
          if(key==='all'){
            setSelectedRoleId('All Roles')
            setCurrentRoleName('All Roles')
          } else {
          setSelectedRoleId(allRoleInformation && allRoleInformation[key].id)
          setCurrentRoleName(allRoleInformation && allRoleInformation[key].name)
          }
        }}
        filterOption={(input, option) =>
          option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option key= 'all' value='all'>All Roles</Option>
        {allRoleInformation && allRoleInformation.map((each, index) => {
          return (
            <Option key={index} value={index} >{`${each.name==='TenantAdmin'? 'Admin': each.name}`}</Option>
          )
        })}
      </Select>
    </section>
  )
}

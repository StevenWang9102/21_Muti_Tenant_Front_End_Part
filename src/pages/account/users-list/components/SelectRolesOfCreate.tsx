import React, {useState } from 'react'
import { Select, Button } from 'antd';
import 'antd/dist/antd.css';
import style from '../style.less';
import { formatMessage } from 'umi';

const { Option } = Select;

export const SelectRolesOfCreate = ({
  multiSelection, 
  currentBranchTitles, 
  allBranchInformation, 
  setCurrentBranchTitles,
  selectedBranchIds, 
  setSelectedBranchIds, 
  selectedRoleIds, 
  selectedRoleNames,
  allRoles, 
  selectValues,
  setSelectValues,
  setSelectedRoleIds,
  setSelectedRoleNames, 
  setMultiSelection 
}) => {


  console.log('SelectRolesOfCreate,selectedRoleNames', selectedRoleNames);
  console.log('SelectRolesOfCreate,multiSelection', multiSelection);
  

  return (
    <>
      <h3 className={style.h3Header}>{formatMessage({ id: 'user.management.selectbranch' })}</h3>
      {
        multiSelection.map((item, index) => {
          console.log('multiSelection19818,currentBranchTitles', currentBranchTitles);
          console.log('multiSelection19818,currentBranchTitles[index]', currentBranchTitles[index]);
          
          return (
            <div className={style.selectionRow}>
              <Select
                value={currentBranchTitles[index]}
                style={{ width: 150, margin: 5 }}
                placeholder="Select a branch"
                optionFilterProp="children"
                onChange={
                  function handleChange(indexOfSelect, option) {
                    // 转换对应标签的文字内容
                    var indexAndBranchName = [...currentBranchTitles]
                    indexAndBranchName[index] = allBranchInformation[indexOfSelect].shortName
                    setCurrentBranchTitles(indexAndBranchName)

                    var selectedBranchId = allBranchInformation![parseInt(indexOfSelect)].id
                    var temp = [...selectedBranchIds]
                    temp[index] = selectedBranchId
                    setSelectedBranchIds(temp)
                  }
                }
              >
                {allBranchInformation && allBranchInformation.map((branch, index) => {
                  return (
                    // 选择过的名字则不显示
                    (!currentBranchTitles.includes(branch.shortName)
                    && !branch.isInactive) 
                    && <Option key={index}>{branch.shortName}</Option>
                  )
                })}
              </Select>

              <Select
                mode="multiple"
                style={{ width: 260, margin: 5 }}
                placeholder="Select roles"
                value={selectedRoleIds[index]}
                onChange={ (value, options) => {
                    var tempSelectedRoleId = [...selectedRoleIds]
                    var tempSelectedRoleNames = [...selectedRoleNames]
                    console.log('onChange18181,value=', value);
                    console.log('onChange18181,options=', options);
        
                    const roleNames = options.map(each=>each.children)
                    tempSelectedRoleId[index] = value
                    tempSelectedRoleNames[index] = roleNames

                    setSelectedRoleIds(tempSelectedRoleId)
                    setSelectedRoleNames(tempSelectedRoleNames)
                  }
                }
              >
                {allRoles.map((each, index)=>{
                  if(each.name == 'TenantAdmin'){
                    return <Option key={index} value={each.id}>Admin</Option>
                  } else {
                    return <Option key={index} value={each.id}>{each.name}</Option>
                  }
                })}
              </Select>

              {index !== 0 && (
                <div
                  className={index === 0 ? style.delete0 : style.delete}
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    if (index > 0) {
                      let temp = [...multiSelection]
                      temp.pop()
                      setMultiSelection(temp)
                    }
                  }}
                > Delete </div>
              )}

            </div>
          )
        })
      }

      <Button
        type="primary"
        htmlType="button"
        className={style.addmore}
        onClick={() => {
          let temp = [...multiSelection]
          temp.push('-')
          setMultiSelection(temp)
        }}
      >Add a Row</Button>
    </>
  )
}
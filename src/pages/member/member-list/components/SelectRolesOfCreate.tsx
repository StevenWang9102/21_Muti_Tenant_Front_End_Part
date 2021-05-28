import React from 'react'
import { Select, Button } from 'antd';
import 'antd/dist/antd.css';
import style from '../style.less';
import { formatMessage } from 'umi';

const { Option } = Select;

export const SelectRolesOfCreate = (props) => {
  const { multiSelection, currentBranchTitles, allBranchInformation, setCurrentBranchTitles } = props
  const { selectedBranchIds, setSelectedBranchIds, selectedRoleIds, selectedRoleNames } = props
  const { allRoles, setSelectedRoleIds, setSelectedRoleNames } = props
  const { setMultiSelection } = props
  const optionChildren = [];

  for (let i = 0; i < (allRoles && allRoles.length); i++) {
    if(allRoles[i].name == 'TenantAdmin'){
      optionChildren.push(<Option key={i}>Admin</Option>);
    } else {
      optionChildren.push(<Option key={i}>{allRoles[i].name}</Option>);
    }
  }

  return (
    <>
      <h3 className={style.h3Header}>{formatMessage({ id: 'user.management.selectbranch' })}</h3>
      {
        multiSelection.map((item, index) => {
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
                onChange={
                  function onRoleSelectionChange(value) {
                    var tempSelectedRoleId = [...selectedRoleIds]
                    var tempSelectedRoleNames = [...selectedRoleNames]

                    var roleIdArray = []
                    var rolesArray = []

                    for (var i = 0; i < value.length; i++) {
                      const oneSelectedRoleId = allRoles[value[i]] && allRoles[value[i]].id
                      const oneSelectedRoleName = allRoles[value[i]] && allRoles[value[i]].name

                      roleIdArray.push(oneSelectedRoleId)
                      rolesArray.push(oneSelectedRoleName)
                    }

                    tempSelectedRoleId[index] = roleIdArray
                    tempSelectedRoleNames[index] = rolesArray

                    setSelectedRoleIds(tempSelectedRoleId)
                    setSelectedRoleNames(tempSelectedRoleNames)
                  }
                }
              >
                {optionChildren}
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
import React, { useEffect, useState } from 'react'
import { Select, Button } from 'antd';
// import 'antd/dist/antd.css';
import style from '../style.less';
import { formatMessage } from 'umi';
import * as service from '../service';

const { Option } = Select;

export const BranchRoleSelector = (props) => {
  const { multiSelection, branchesData, rolesData, setMultiSelection, setSelectedRoleIds, setSelectedRoleNames } = props
  const { fromPage, selectedBranchIds, setSelectedBranchIds, selectedRoleIds, selectedRoleNames } = props
  const [optionChildren1, setOptionChildren] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [allBranches, setAllBranches] = useState([])
  const [currentBranchTitles, setCurrentBranchTitles] = useState([]);

  console.log('BranchRoleSelector,fromPage', fromPage);
  

  useEffect(() => {
    initialComponentData()
    initialComponentData()
    setMultiSelection(['-'])
  }, [])

  const initialComponentData = async () => {
    const optionChildren = [];
    for (let i = 0; i < (rolesData && rolesData.length); i++) {
      optionChildren.push(<Option key={i}>{rolesData[i].name}</Option>);
    }

    const allBranchData = branchesData.filter(each=>each.isInactive == false)
    setOptionChildren(optionChildren)
    setAllRoles(rolesData)
    setAllBranches(allBranchData)
  }

  const title = fromPage == 'Delete' ? 'Dismiss staff from branch and role' : 'Select a branch and role'

  return (
    <>
      <h3 className={style.h3Header}>{title}</h3>
      { multiSelection && multiSelection.map((item, index) => {
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
                    indexAndBranchName[index] = allBranches[indexOfSelect].shortName
                    setCurrentBranchTitles(indexAndBranchName)

                    var selectedBranchId = allBranches![parseInt(indexOfSelect)].id
                    var temp = [...selectedBranchIds]
                    temp[index] = selectedBranchId
                    setSelectedBranchIds(temp)
                  }
                }
              >
                {allBranches && allBranches.map((branch, index) => {
                  return (
                    // 选择过的名字则不显示
                    !currentBranchTitles.includes(branch.shortName)
                    && <Option key={index}>{branch.shortName}</Option>
                  )
                })}
              </Select>

              <Select
                mode= {fromPage != 'Delete' && "multiple"}
                style={{ width: 240, margin: 5 }}
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

                    console.log("tempSelectedRoleId=", tempSelectedRoleId);
                    console.log("tempSelectedRoleNames=", tempSelectedRoleId);

                    setSelectedRoleIds(tempSelectedRoleId)
                    setSelectedRoleNames(tempSelectedRoleNames)
                  }
                }
              >
                {optionChildren1}
              </Select>

              {index !== 0 && (
                <div
                  className={index === 0 ? style.delete0 : style.delete}
                  style={{ marginLeft: 6, marginTop: 10, float: 'right', fontWeight: 600 }}
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

      {fromPage === 'Assign' && <Button
        type="primary"
        htmlType="button"
        className={style.addmore}
        onClick={() => {
          let temp = [...multiSelection]
          temp.push('-')
          setMultiSelection(temp)
        }}
      >Add a Row</Button>}

    </>
  )
}
import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import 'antd/dist/antd.css';
import style from '../style.less';
import { formatMessage } from 'umi';
import { IsSuperAdmin } from '@/utils/authority';

const { Option } = Select;

const unique = (arr) =>{
  return arr.filter(
    function(item, index, arr){
      return arr.indexOf(item, 0) === index
    }
  )
}


export const SelectRolesOfEdit = (props) => {
  const {
    setSelectedBranchIds,
    isSuperAdmin,
    setSelectedRoleIds,
    allBranchInformation,
    allRoles,
    visible,
    optionChildren,
    oneUserBranchRoles,
    currentBranchTitles,
    setCurrentBranchTitles,
  } = props;

  const [currentSelectedBranchIds, setCurrentSelectedBranchIds] = useState([]);
  const [currentSelectedRoleNames, setCurrentSelectedRoles] = useState(undefined);

  // 检索Roles用
  let rolesIdsAndNames = {};
  let roleNamesIds = {};
  let rolesIndexAndIds = {};
  let rolesIndexAndNames = {};

  allRoles && allRoles.forEach((eachRole, index) => {
    rolesIndexAndIds[index] = eachRole.id;
    rolesIndexAndNames[index] = eachRole.name;

    rolesIdsAndNames[eachRole.id] = eachRole.name;
    roleNamesIds[eachRole.name] = eachRole.id;
  });

  // 检索Branch用
  let branchIds = [];
  let branchIdsNames = [];

  allBranchInformation.forEach((each, index) => {
    branchIds[index] = each.id;
    branchIdsNames[each.id] = each.shortName;
  });

  const oneUserBranchRolesLocal = oneUserBranchRoles || []  
  // 设置渲染Branch的数据（已经去重复的BranchId）
  let branchRenderArray = [];
  oneUserBranchRolesLocal.forEach((each, index) => {    
    if (!branchRenderArray.includes(each.branchId)) {
      branchRenderArray.push(each.branchId);
    }
  });
  
  // 设置渲染Role的数据
  let roleRenderArray = [];
  oneUserBranchRolesLocal.forEach((each, index) => {
    // BranchID中Push对应的Role名字
    let indexOfSoleBranch = branchRenderArray.indexOf(each.branchId).toString();
    if (roleRenderArray[indexOfSoleBranch]) {
      roleRenderArray[indexOfSoleBranch].push(each.roleName);
    } else {
      roleRenderArray[indexOfSoleBranch] = [];
      roleRenderArray[indexOfSoleBranch].push(each.roleName);
    }
  });

  console.log("roleRenderArray,optionChildren",optionChildren);
  console.log("roleRenderArray,currentSelectedRoleNames",currentSelectedRoleNames);
  console.log("roleRenderArray,optionChildren",optionChildren);

  const newSelectedRoleNames =  currentSelectedRoleNames && currentSelectedRoleNames.map(each=>{
    console.log("roleRenderArray,each",each);
    const temp = each.map(each1=>{
      if(each1=='TenantAdmin') return 'Admin'
      else return each1
    })
    return temp
  })
  console.log("roleRenderArray,newSelectedRoleNames",newSelectedRoleNames);

  // 初始化：清空原有的数据
  useEffect(() => {
    setCurrentSelectedBranchIds([]);
    setCurrentSelectedRoles([]);
  }, [visible]);

  // 数据返回后，设置当前Branch和Role数据
  useEffect(() => {
    setCurrentSelectedBranchIds(branchRenderArray);
    setCurrentSelectedRoles(roleRenderArray);
  }, [oneUserBranchRoles]);

  // ------------------------- 获取当前页面的BranchId -------------------------
  useEffect(() => {
    const temp = [];
    currentSelectedBranchIds &&
      currentSelectedBranchIds.forEach((each) => {
        temp.push(each);
      });
    setSelectedBranchIds(temp);
  }, [currentSelectedBranchIds]);

  // ------------------------- 获取当前页面的RoleId -------------------------
  useEffect(() => {
    const temp = [];
    currentSelectedRoleNames &&
      currentSelectedRoleNames.forEach((eachRow, index) => {
        temp[index] = [];
        console.log('setSelectedRoleIds,eachRow', eachRow);

        eachRow.forEach((each, indexI) => {
          let roleId = roleNamesIds[each=="Admin"? 'TenantAdmin': each]; // 检索
          temp[index].push(roleId);
        });
      });

      console.log('setSelectedRoleIds,temp', temp);
    setSelectedRoleIds(temp);
  }, [currentSelectedRoleNames]);

  // ------------------------- 设置当前的Branch的Titles -------------------------
  useEffect(() => {
    var temp = [];
    currentSelectedBranchIds &&
      currentSelectedBranchIds.forEach((eachId, index) => {        
        var existBranchName = branchIdsNames[eachId];
        temp.push(existBranchName);
      });
    setCurrentBranchTitles(temp);
  }, [currentSelectedBranchIds]);
  

  // ------------------------- On Branch Change -------------------------
  const onBranchChange = (brnachId, rowIndex) => {
    // 设置当前的BranchIds
    let temp1 = [...currentSelectedBranchIds];
    temp1[rowIndex] = brnachId;
    setCurrentSelectedBranchIds(temp1);
    
    // 设置当前选中的Branch Names
    var temp = [...currentBranchTitles];
    temp[rowIndex] = branchIdsNames[brnachId]
    console.log(temp);
    setCurrentBranchTitles(temp);
  };

  // ------------------------- On Role Change -------------------------
  const onRoleChange = (valueList, rowIndex) => {
    console.log('onRoleChange,valueList',valueList);

    // 前提：获取当前Roles的所有Id（实时）
    const thisRowRolesIds = [];
    const thisRowRolesNames = [];

    valueList.forEach((each, index) => {
      if (rolesIndexAndIds[each]) {
        let roleId = rolesIndexAndIds[each];
        let roleName = rolesIndexAndNames[each];
        thisRowRolesIds.push(roleId);
        thisRowRolesNames.push(roleName === 'TenantAdmin'? 'Admin': roleName);
      } else {
        thisRowRolesIds.push(roleNamesIds[each]);
        thisRowRolesNames.push(each);
      }
    });

    // 重新渲染页面
    let temp = [...currentSelectedRoleNames];
    temp[rowIndex] = unique(thisRowRolesNames);
    console.log('onRoleChange,temp',temp);
    setCurrentSelectedRoles(temp);
  };

  return (
    <section>
      <h3 className={style.h3Header}>{formatMessage({ id: 'user.management.selectbranch' })}</h3>
      {currentSelectedBranchIds &&
        currentSelectedBranchIds.map((item, index) => {
          return (
            <div className={style.selectionRow}>
              {/* ----------------- Branch Select ----------------- */}
              <Select
                disabled={IsSuperAdmin()? false: isSuperAdmin}
                value={branchIdsNames[currentSelectedBranchIds[index]]}
                style={{ width: 150, margin: 5 }}
                placeholder="Select a branch"
                optionFilterProp="children"
                onChange={function handleChange(indexOfSelect, option) {
                  onBranchChange(indexOfSelect, index);
                }}
              >
                {allBranchInformation &&
                  allBranchInformation.map((branch, index) => {
                    return (
                      <>
                        {
                          (!currentBranchTitles.includes(branch.shortName) && 
                          !branch.isInactive) &&
                           <Option 
                              key={index}
                              value={branch.id}
                          >{branch.shortName}</Option>
                        }
                      </>
                    );
                  })}
              </Select>

              {/* ----------------- Role Select ----------------- */}
              <Select
                disabled={IsSuperAdmin()? false: isSuperAdmin}
                value={newSelectedRoleNames[index] != [] && newSelectedRoleNames[index]}
                mode="multiple"
                style={{ width: 270, margin: 5 }}
                placeholder="Select Roles"
                onChange={function onRoleSelectionChange(value) {
                  onRoleChange(value, index);
                }}
              >
                {optionChildren}
              </Select>

              {index !== 0 && (
                <div
                  className={index === 0 ? style.delete0 : style.delete}
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    if (index > 0) {
                      // 设置页面显示行数
                      let temp = [...currentSelectedBranchIds];
                      temp.pop();
                      setCurrentSelectedBranchIds(temp);

                      let temp1 = [...currentSelectedRoleNames];
                      temp1.pop();
                      setCurrentSelectedRoles(temp1);
                    }
                  }}
                >
                  Delete
                </div>
              )}
            </div>
          );
        })}

      <Button
        type="primary"
        htmlType="button"
        className={style.addmore}
        onClick={() => {
          let temp = [...currentSelectedBranchIds];
          temp.push('');
          setCurrentSelectedBranchIds(temp);

          let temp1 = [...currentSelectedRoleNames];
          temp1.push([]);
          setCurrentSelectedRoles(temp1);
        }}
      >
        Add a Row
      </Button>
    </section>
  );
};

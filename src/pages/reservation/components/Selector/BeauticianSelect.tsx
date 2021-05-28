import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select, TreeSelect } from 'antd';

const { Option } = Select;

const BeauticianSelect = ({
    currentBranchInfo,
    myTreeData,
    roleUserPairs,
    currentBeauticianInfo,
    setCurrentBeauticianInfo,
}) => {

    const BRANCH_ROLE_PAIRS = 'BRANCH_ROLE_PAIRS'
    const [renderTreeData, setRenderTreeData] = useState([])

    const branchRolePairs = JSON.parse(localStorage.getItem(BRANCH_ROLE_PAIRS)) || {}
    const currentBranchRole = branchRolePairs[currentBranchInfo.branchId] || {}

    console.log('BeauticianSelect,branchRolePairs', branchRolePairs);
    console.log('BeauticianSelect,currentBranchRole', currentBranchRole);
    console.log('BeauticianSelect,currentBranchInfo', currentBranchInfo);
    console.log('BeauticianSelect,currentBeauticianInfo', currentBeauticianInfo);
    console.log('BeauticianSelect,myTreeData', myTreeData);
    console.log('BeauticianSelect,roleUserPairs', roleUserPairs);

    const filteredRoleUserPairs = []
    Array.isArray(roleUserPairs) && roleUserPairs.forEach(each => {
        const currentUserIds = filteredRoleUserPairs.map(each => each.userId)
        if (!currentUserIds.includes(each.userId)) filteredRoleUserPairs.push(each)
    })

    useEffect(() => {
        const targetRole = currentBranchRole
        // console.log('useEffect876,targetRole',targetRole);
        const temp = myTreeData.filter(each => each.value === targetRole.roleId)

        if (temp.length !== 0) {
            const roleUser = temp[0].children
            console.log('useEffect876,temp', temp);
            console.log('useEffect876,roleUser', roleUser);
            setRenderTreeData(roleUser)
        }

    }, [currentBranchRole, myTreeData])

    const isDefaultStaffSelected = currentBranchRole.roleId && currentBranchRole.roleId != 'All Staff'
    const ALL_STAFF = 'All Staff'

    return (
        <Select
            showSearch
            style={{ width: 180 }}
            placeholder='Select a beautician'
            value={currentBeauticianInfo.id || ALL_STAFF}
            optionFilterProp="children"
            onChange={(value, option) => {
                // 设置当前的Beautication 
                console.log('Select.onChange,value', value);
                console.log('Select.onChange,option', option);
                setCurrentBeauticianInfo({
                    id: value,
                    name: option[0]
                })
            }}
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='All Staff'>All Staff</Option>
            {isDefaultStaffSelected && <> {renderTreeData.map(each => {
                return <Option value={each.value}>{each.title}</Option>
            })}</> }
            
            {!isDefaultStaffSelected && <> {filteredRoleUserPairs.map(each => {
                return <Option value={each.userId}>{each.userName}</Option>
            })}</> }

        </Select>
    )
}


export default connect(() => ({}))(BeauticianSelect);

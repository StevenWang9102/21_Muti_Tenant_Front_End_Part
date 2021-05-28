import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select, Row, Col } from 'antd';
// import { unique } from './functions/unique'

const { Option } = Select;

const BranchSelect = ({
    branchSelectValue,
    branchList,
    branchUserPairs,
    setBranchUserPairs,
    dispatch,
}) => {

    const BRANCH_ROLE_PAIRS = 'BRANCH_ROLE_PAIRS'

    const [currentRoleInfo, setCurrentRoleInfo] = useState([])
    // const [currentBranchRole, setCurrentBranchRole] = useState({})

    useEffect(() => {
        const branchRoles = JSON.parse(localStorage.getItem(BRANCH_ROLE_PAIRS)) || {}
        console.log('BranchRole213', branchRoles);

        // @@@@@@@@@@@@@@@@@@@@@@@@@@@
        setBranchUserPairs(branchRoles)
        // setCurrentBranchRole(currentBranchRole)

        // 每次进来做两件事
        // 从LocalStorage 读下来数据，并且渲染当前的
    }, [])

    console.log('BranchSelect,branchList', branchSelectValue);
    console.log('BranchSelect,branchUserPairs', branchUserPairs);


    const requestBranchUsers = (branchId) => {
        dispatch({
            type: 'reservation/requestBranchUsers',
            payload: {
                branchId: branchId
            },
            callback: (res) => {
                console.log('requestBranchUsers41484,res', res);

                const temp = []
                res.forEach(each => {
                    console.log('requestBranchUsers41484,temp', temp);
                    const currentExistRoleIds = temp.map(each => each.roleId)
                    if (!currentExistRoleIds.includes(each.roleId)) {
                        temp.push(each)
                    } else {

                    }
                });
                setCurrentRoleInfo(temp)
            }
        })
    }

    const branchRolePairs = JSON.parse(localStorage.getItem(BRANCH_ROLE_PAIRS))
    console.log('branchRolePairs15', branchRolePairs);

    return (
        <section>
            {branchList && branchList.map(each => {

                const eachBranchId = each.id
                const defaultValue = branchUserPairs[eachBranchId]? branchUserPairs[eachBranchId].roleName: undefined
                
                console.log('defaultValue87', defaultValue);
                
                return <Row style={{ margin: '5px 0' }}>
                    <Col span={8}> <b> {each.shortName}：</b> </Col>
                    <Col span={12}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select a default role"
                            optionFilterProp="children"
                            defaultValue={defaultValue}
                            onClick={(value) => {
                                console.log('onClick18', eachBranchId)
                                requestBranchUsers(eachBranchId)
                            }}
                            onSelect={(val, opt) => {
                                console.log('onSelect98,val', val)
                                console.log('onSelect98,opt', opt)
                                setBranchUserPairs({
                                    ...branchUserPairs,
                                    [eachBranchId]: {
                                        roleId: val,
                                        roleName: opt.children,
                                    }
                                })
                            }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value='All Staff'>All Staff</Option>
                            {currentRoleInfo.map(each => <Option value={each.roleId}>{each.roleName}</Option>)}
                        </Select> 
                    </Col>
                </Row>
            })}
        </section>
    )
}


export default connect(() => ({}))(BranchSelect);

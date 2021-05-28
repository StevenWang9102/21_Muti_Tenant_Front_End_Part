import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select, Row, Col } from 'antd';
import { TimePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

const BranchOpening = ({
    branchSelectValue,
    branchList,
    branchOpenPairs, 
    setBranchOpenPairs,
    branchUserPairs,
    setBranchUserPairs,
    dispatch,
}) => {

    const [branchOpening, setBranchOpening] = useState({})
    
    useEffect(()=>{
        var temp = {}
        branchList.forEach(each => {
            temp[each.id] = [moment(each.openTime), moment(each.closeTime)]
        });
        setBranchOpening(temp)
    }, [branchList])

    console.log('BranchSelect,branchList', branchList);
    console.log('BranchSelect,branchOpening', branchOpening);

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 思路，更新的时候，记录每一个branch对应的时间区间
    // 然后在点击comfirm的时候，循环patch
    // 完成之后，给提示即可

    return (
        <section>
            {branchList && branchList.map(each => {
                const eachBranchId = each.id
                console.log('branchOpening[eachBranchId]',branchOpening[eachBranchId]);
                const start = moment(branchOpening[eachBranchId] && branchOpening[eachBranchId][0])
                const end = moment(branchOpening[eachBranchId] && branchOpening[eachBranchId][1])
                

                return <Row style={{ margin: '5px 0' }}>
                    <Col span={8}> <b> {each.shortName}：</b> </Col>
                    <Col span={12}>
                        <TimePicker.RangePicker
                            defaultValue={[start, end]}
                            // value={branchOpening[eachBranchId]}
                            format='HH: mm'
                            minuteStep={30}
                            onChange={(time)=>{
                                console.log('TimePicker, time', time);
                                setBranchOpenPairs({
                                    ...branchOpenPairs,
                                    [eachBranchId]: time
                                })
                            }}
                        />
                    </Col>
                </Row>
            })}
        </section>
    )
}


export default connect(() => ({}))(BranchOpening);

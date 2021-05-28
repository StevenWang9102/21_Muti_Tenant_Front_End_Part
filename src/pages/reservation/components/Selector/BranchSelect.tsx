import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select } from 'antd';

const { Option } = Select;

const BranchSelect = ({
    ALL_BRANCH,
    branchSelectValue,
    branchList,
    WAITING_DATA,
    onOneBranchSelected,
}) => {

    console.log('BranchSelect,branchSelectValue', branchSelectValue);
    

    return (
        <Select
            style={{ width: 180 }}
            value={branchSelectValue || ALL_BRANCH}
            placeholder='Select a branch'
            onChange={(value, option) => {
                onOneBranchSelected(value, option)   }}
        >
            {branchList.length == 0 ? <>
                <Option value={WAITING_DATA}>{WAITING_DATA}</Option>
            </> : <>
                    {Array.isArray(branchList) && branchList.map(each => {
                        return <Option value={each.id}>{each.shortName}</Option>
                    })}</>}

        </Select>
    )
}


export default connect(() => ({}))(BranchSelect);

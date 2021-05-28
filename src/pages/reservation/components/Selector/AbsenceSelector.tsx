import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select } from 'antd';

const { Option } = Select;

const AbsenceSelector = ({
    setCurrentAbsence,
}) => {

    return (
        <Select
            style={{ width: 180 }}
            placeholder='Select a location'
            defaultValue='All'
            onChange={(value, option) => setCurrentAbsence(value)}
        >
            <Option value='All'>All Attendance</Option>
            <Option value='Present'>Present</Option>
            <Option value='Absent'>Absent</Option>
        
        </Select>
    )
}


export default connect(() => ({}))(AbsenceSelector);

import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select } from 'antd';

const { Option } = Select;

const LocationSelect = ({
    locationList,
    setCurrentLocationId,
    ALL_LOCATION,
}) => {

    console.log('LocationSelect,locationList', locationList);

    return (
        <Select
            style={{ width: 180 }}
            placeholder='Select a location'
            defaultValue={ALL_LOCATION}
            onChange={(value, option) => setCurrentLocationId(value)}
        >
            <Option value={ALL_LOCATION}>{ALL_LOCATION}</Option>
            {locationList && locationList.map(each => {
                return <Option value={each.id}>{each.name}</Option>
            })}
        </Select>
    )
}


export default connect(() => ({}))(LocationSelect);

import React, { useState, useEffect } from 'react'
import { connect, Dispatch } from 'umi';
import { Select, TreeSelect } from 'antd';
import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION, ALL_BEAUTICIAN, MY_STAFF_NAME, MY_STAFF_NAME_LOWER, MY_STAFF_NAME_UPPER} from '../../../public-component/names'
import { CaretRightOutlined } from '@ant-design/icons'

const { Option } = Select;

const BeauticianSelect = ({
    myTreeData,
    currentBeauticianInfo,
    setCurrentBeauticianInfo,
}) => {
    
    // const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
    // const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'staff'
    // const ALL_BEAUTICIAN = `All ${staffName.replace(/^\S/, s => s.toUpperCase())}`
    console.log('BeauticianSelect,myTreeData',myTreeData);
    console.log('BeauticianSelect,currentBeauticianInfo',currentBeauticianInfo.id);
    
    return (
        <TreeSelect
            style={{ width: 180 }}
            // showArrow={true}
            // switcherIcon={<CaretRightOutlined />}
            showSearch={true}
            placeholder='Select a beautician'
            value={currentBeauticianInfo.id || ALL_BEAUTICIAN}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={myTreeData}
            listHeight={400}
            onChange={(value, option) => {
                // 设置新的Beautication 
                console.log('TreeSelect.onChange,value', value);
                console.log('TreeSelect.onChange,option', option[0]);
                setCurrentBeauticianInfo({
                    id: value,
                    name: option[0]
                })
            }}
        />
    )
}


export default connect(() => ({}))(BeauticianSelect);

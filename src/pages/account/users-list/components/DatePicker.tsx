import React, {useEffect} from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';


const dateFormat = 'DD / MM / YYYY';

export const MyDatePicker = (props) => {

  const {dateOfBirth, setDateOfBirth} = props

  return (
    <Space direction="vertical" size={12}>
      <DatePicker 
        format={dateFormat}
        placeholder= 'Select a Date'
        value={dateOfBirth ? moment(dateOfBirth) : undefined} // 给undefined是为了不显示任何日期，避免invalid date出现
        allowClear={false}
        style={{width: 215}}
        onChange={(date, dateString)=>{            
            setDateOfBirth(moment(date).format('YYYY-MM-DD'))
        }}
        />
    </Space>
  );
};

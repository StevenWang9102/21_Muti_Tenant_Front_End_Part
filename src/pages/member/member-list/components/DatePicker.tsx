import React, { useEffect } from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';


const dateFormat = 'DD/MMM/YYYY';

export const MyDatePicker = (props) => {

  const { dateOfBirth, setDateOfBirth, width } = props

  return (
      <DatePicker
        style={{ width: width }} 
        format={dateFormat}
        placeholder='Select a Date'
        value={dateOfBirth}
        allowClear={false}
        onChange={(date, dateString) => {
          const myDate = moment(date)
          setDateOfBirth(myDate)
        }}
      />
  );
};

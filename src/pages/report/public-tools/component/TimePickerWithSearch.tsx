import React, { useState } from 'react';
import { DatePicker, Button, message } from 'antd';
import { monthDay } from '../functions/dates'

const { RangePicker } = DatePicker;

interface TimePickerInterface {
  fromPage: string,
  currentBranchId: string,
  startTimeOfTimePicker: any, 
  endTimeOfTimePicker: any, 
  setStartTime: (string) => void,
  setEndTime: (string) => void,
  setBreadSliceName: (string) => void,
  setSearchType: (string) => void,
  requestSourceData: (arg0: any, arg1: any | undefined) => any,
  filterOfSourceData?: (string) => void,
}

export const TimePickerWithSearch = (props: TimePickerInterface) => {
  const { fromPage, setStartTime, setEndTime, setBreadSliceName, startTimeOfTimePicker, endTimeOfTimePicker } = props;
  const { currentBranchId, setSearchType, requestSourceData } = props;
  const myDateFormat = 'DD MMM YYYY'; // 新西兰样式 日月年
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  
  const onDatePickerChange = (date) => {    
    setStartTime('')
    setEndTime('')


    if (date && date.length > 1) {
      if(fromPage==='MonthlyReport'){ // 需要减去当天到月初的时间
        setStartTime(date[0].subtract(monthDay-1, 'days'));
        setEndTime(date[1].subtract(monthDay, 'days').add(1, 'month'));
      } else {
        setStartTime(date[0]);
        setEndTime(date[1]);
      }
      setIsTimeSelected(true);

    } else {
      setIsTimeSelected(false);
    }
  };

  const onGoButtonClick = (currentBranchId) => {
    if (currentBranchId === 'AllBranch') {
      requestSourceData('Only_Date_Search', undefined);
      setSearchType('Only_Date_Search');
    } else {
      requestSourceData('Branch_Date_Search', currentBranchId);
      setSearchType('Branch_Date_Search');
    }
  }

  return (
    <section style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <label style={{ margin: '0 10px', width: 120 }}>
        <b>Date Range</b>
      </label>

      {fromPage === 'MonthlyReport' ? (
        <RangePicker
          picker="month"
          style={{ width: 400 }}
          format={'MMM YYYY'}
          value={[startTimeOfTimePicker, endTimeOfTimePicker]}
          onChange={(date, dataString) => {
            onDatePickerChange(date);
          }}
        />
      ) : (
          <RangePicker
            style={{ width: 400 }}
            format={myDateFormat}
            value={[startTimeOfTimePicker, endTimeOfTimePicker]}
            onChange={(date, dataString) => {
              onDatePickerChange(date);
            }}
          />
        )}

      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => {
          
          if (!(startTimeOfTimePicker || endTimeOfTimePicker)) {
            message.error('Please Select Start and End Dates.');
          } else {
            setBreadSliceName(''); // 清空Bread Slice的选中状态
            if (fromPage === 'Payment') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'Category') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'ItemReport') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'BranchReport') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'HourlyReport') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'DailyReport') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'ItemDailyReport') {
              onGoButtonClick(currentBranchId)
            } else if (fromPage === 'MonthlyReport') {
              onGoButtonClick(currentBranchId)
            } else {
              onGoButtonClick(currentBranchId)
            }
          }
        }}
      >
        Go!
      </Button>
    </section>
  );
};

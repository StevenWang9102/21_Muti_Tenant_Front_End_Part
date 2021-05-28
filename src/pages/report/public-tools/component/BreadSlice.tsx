import React from 'react';
import { Breadcrumb } from 'antd';

interface BreadSliceInterface {
  fromPage: string,
  currentBranchId: string,
  searchType?: string,
  clickedKey?: number,
  breadSliceName: string,
  setBreadSliceName: (string)=>void,
  setClickedKey: (string)=>void,
  setSearchType: (string)=>void,
  setStartOfTimePicker: (string)=>void,
  setSourceData: (any)=>void,
  setEndOfTimePicker: (string)=>void,
  requestSourceData: (arg0: any, arg1: any | undefined)=> any,
}
         
export const BreadSlice = (props: BreadSliceInterface) => {
  const {
    fromPage,
    currentBranchId,
    searchType,
    setBreadSliceName,
    setClickedKey,
    breadSliceName,
    setSearchType,
    requestSourceData,
    setStartOfTimePicker,
    setEndOfTimePicker,
    setSourceData,
  } = props;
  let renderArray = [];

  if (fromPage === 'MonthlyReport')
    renderArray = ['This Year', 'Last 12 Month', 'Compared With Last Year'];
  if (
    fromPage === 'PaymentReport' ||
    fromPage === 'CategoryReport' ||
    fromPage === 'SalesReport' ||
    fromPage === 'HourlyReport' ||
    fromPage === 'DailyReport' || 
    fromPage === 'CategoryBranchReport' ||
    fromPage === 'ItemBranchReport'
  )
    renderArray = [
      'Today',
      'Yesterday',
      'This Week',
      'Last Week',
      'This Month',
      'Last Month',
      'Last Three Month',
    ];

  const myStyle = {
    width: '500px',
    marginLeft: '60px',
    zIndex: 20,
    fontSize: 17,
    textAlign: 'center',
    // border: '2px solid green'
  };

  const style1 = {
    color: 'blue',
    fontWeight: 500,
  };
  const style2 = {
    color: 'gray',
    fontWeight: 400,
  };


  return (
    <Breadcrumb style={myStyle}>
      {renderArray.map((sliceName, index) => {
        return (
          <Breadcrumb.Item>
            <a
              style={
                breadSliceName === sliceName && searchType !== 'Branch_Date_Search'
                  ? style1
                  : style2
              }
              onClick={() => {       
                setSourceData([[],[],[]]) // 先清空数据源，防止数据类型紊乱
                requestSourceData(sliceName, currentBranchId); // 传递一个标识
                setSearchType(sliceName);
                setClickedKey(index);
                setBreadSliceName(sliceName);

                // 清空时间选择器中的当前
                setStartOfTimePicker(undefined)
                setEndOfTimePicker(undefined)
              }}
            >
              {sliceName.toUpperCase()}
            </a>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

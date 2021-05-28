import React, { useEffect, useState, FC } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../data';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setFromAndToDay } from '../../public-tools/functions/setDisplayDay';
import { BranchSelector } from '../../public-tools/component/BranchSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { SortedTable } from '../../public-tools/charts/SortedTable';

const { Header, Content } = Layout;

export const ItemReport: FC<AddUserlInterface> = (props) => {
  const { dispatch, allBranchReport, branchNameIds, allItemReport } = props;
  // const allBranchReportLocal = allBranchReport || [];
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [displayTime, setDisplayTime] = useState({});
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();

  

  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    dispatch({
      type: 'branchManagement/getAllBranchNameGlobal',
    });

    requestSourceData('Today', undefined);
  }, []);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker);
    if (branchId && branchId !== 'AllBranch') {
      dispatch({
        type: 'CategoryReport/getOneBranchItemData',
        payload: {
          timeRange: timeRange,
          branchId: branchId,
        },
      });
    } else {
      dispatch({
        type: 'CategoryReport/getSpecifiedDayData',
        payload: timeRange,
      });
    }
  };

  // ----------------------- 设置显示时间 -----------------------
  useEffect(() => {
    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker);
    setDisplayTime(days);
    setCurrentBranchTitle(currentBranchName)
  }, [allItemReport]);

  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage="ItemReport"
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          allBranchReport={allBranchReport}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="Category"
          startTimeOfTimePicker={startTimeOfTimePicker}
          endTimeOfTimePicker={endTimeOfTimePicker}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setStartTime={(n) => setStartOfTimePicker(n)}
          setEndTime={(n) => setEndOfTimePicker(n)}
          currentBranchId={currentBranchId}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      {/* --------------------------- 面包屑 ----------------------------- */}
      <Header style={headerSytles}>
        <BreadSlice
          fromPage="CategoryReport"
          clickedKey={clickedKey}
          breadSliceName={breadSliceName}
          currentBranchId={currentBranchId}
          setSourceData={(parms) => {}}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setStartOfTimePicker={(parms) => setStartOfTimePicker(parms)}
          setEndOfTimePicker={(parms) => setEndOfTimePicker(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setClickedKey={(parms) => setClickedKey(parms)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <Content>
        <ReportTitle
          fromPage="ItemReport"
          searchType={searchType}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle} />

        <SortedTable
          fromPage='ItemReport'
          sourceData={allItemReport}
        />
      </Content>
    </Layout>
  );
};

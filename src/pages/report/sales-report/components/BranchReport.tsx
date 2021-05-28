import React, { useEffect, useState, FC } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../data';
import { Row, Col } from 'antd';
import { BarChart } from '../../public-tools/charts/BarChart';
import { PieChart } from '../../public-tools/charts/PieChart';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setFromAndToDay } from '../../public-tools/functions/setDisplayDay';
import { sourceDataFilter } from '../functions/sourceDataFilter'
import { ReportTitle } from '../../public-tools/component/ReportTitle'

const { Header } = Layout;

export const BranchReport: FC<AddUserlInterface> = (props) => {
  const { dispatch, allBranchReport, branchReportWithQueryData } = props;
  const allBranchReportLocal = (allBranchReport && allBranchReport.data) || [];
  const [currentTabKey, setCurrentTabKey] = useState('1');

  const branchList = [];
  allBranchReportLocal.forEach((item, index) => {
    branchList.push(item.branchName);
  });

  const [sourceData, setSourceData] = useState([])
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [clickedBread, setClickedBread] = useState();
  const [breadSliceName, setBreadSliceName] = useState('Today')
  const [displayTime, setDisplayTime] = useState({})
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();

  // ----------------------- 进入组件-----------------------
  useEffect(() => {
    requestSourceData('Today', undefined)
  }, []);

  const requestSourceData = (sliceName, branchId) => {
    let timeRange = setRequestTime(sliceName, startTimeOfTimePicker, endTimeOfTimePicker);
    dispatch({
      type: 'SalesReport/getSalesReportWithQuery',
      payload: timeRange,
    });
  };

  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    const length = branchReportWithQueryData && branchReportWithQueryData.length
    const sourceData = sourceDataFilter('Branch Data With Query', length, branchReportWithQueryData, null, null, true)
    setSourceData(sourceData)

    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
  }, [branchReportWithQueryData]);

  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };

  return (
    <Layout style={{ backgroundColor: 'white' }}>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="BranchReport"
          startTimeOfTimePicker={startTimeOfTimePicker}
          endTimeOfTimePicker={endTimeOfTimePicker}
          setStartTime={(n) => setStartOfTimePicker(n)}
          setEndTime={(n) => setEndOfTimePicker(n)}
          currentBranchId={currentBranchId}
          setBreadSliceName={(m) => { setBreadSliceName(m) }}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <Header style={headerSytles}>
        <BreadSlice
          fromPage="SalesReport"
          clickedKey={clickedKey}
          searchType={searchType}
          breadSliceName={breadSliceName}
          currentBranchId={currentBranchId}
          setSourceData={(parms) => setSourceData(parms)}
          setBreadSliceName={(m) => { setBreadSliceName(m) }}
          setClickedBread={(m) => { setClickedBread(m) }}
          setStartOfTimePicker={(parms) => setStartOfTimePicker(parms)}
          setEndOfTimePicker={(parms) => setEndOfTimePicker(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setClickedKey={(parms) => setClickedKey(parms)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <ReportTitle
        fromPage='BranchReport'
        searchType={searchType}
        displayTime={displayTime || {}}
        currentBranchName="All Branch"
      />

      <Row style={{ backgroundColor: 'white' }}>
        {/* ------------------- 柱状图 ------------------- */}
        <Col span={15} style={{zIndex: 10}}>
          <BarChart
            fromPage='BranchReport'
            source={sourceData}
            setCurrentTabKey={(parms) => setCurrentTabKey(parms)}
          />
        </Col>

        {/* ------------------- 饼状图 ------------------- */}
        <Col span={8}>
          <PieChart
            fromPage="BranchReport"
            currentTabKey={currentTabKey}
            allReportData={sourceData}
          />
        </Col>
      </Row>
    </Layout>
  );
};

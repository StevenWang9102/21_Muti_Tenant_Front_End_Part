import React, { useEffect, useState, FC } from 'react';
import { Layout, Tabs } from 'antd';
import 'antd/dist/antd.css';
// import { AddUserlInterface } from '../data';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setFromAndToDay } from '../../public-tools/functions/setDisplayDay';
import { sourceDataFilter } from '../../public-tools/functions/sourceDataFilter';
import { BranchSelector } from '../../public-tools/component/BranchSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BarChart } from '../../public-tools/charts/BarChart';
import { LineChart } from '../../public-tools/charts/LineChart';
import { MiltLineChart } from '../../public-tools/charts/MiltLineChart';
import { SimpleExcel } from '../../public-tools/component/SimpleExcel';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { ReportTitle } from '../../public-tools/component/ReportTitle';

const { Header, Content } = Layout;
const { TabPane } = Tabs;


export const DailyReport = (props) => {
  const { dispatch, allBranchReport, dailyDataWithBranchId } = props;
  const { branchNameIds, dailyReportWithQuery } = props;
  const allBranchReportLocal = allBranchReport || [];
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [currentTab, setCurrentTabKey] = useState('1');
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [sourceData, setSourceData] = useState([[], [], []]);
  const [displayTime, setDisplayTime] = useState({});
  const [breadSliceName, setBreadSliceName] = useState('Today')
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();
  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };

  console.log('sourceData23', sourceData[0]);
  
  useEffect(() => {
    requestSourceData('Today', undefined);
  }, []);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker);
    if (branchId && branchId !== 'AllBranch') {
      dispatch({
        type: 'SalesReport/getSpecifiedBranchAndDayData',
        payload: {
          timeRange: timeRange,
          branchId: branchId,
        },
      });
    } else {
      dispatch({
        type: 'SalesReport/getSpecifiedDailyData',
        payload: timeRange,
      });
    }
  };

  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    // alert('branchId')
    const length = dailyDataWithBranchId && dailyDataWithBranchId.length;
    const sourceData = sourceDataFilter(
      searchType,
      length,
      dailyDataWithBranchId,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      true,
      "DailyReport"
    );
    console.log('useEffect,sourceData22,', sourceData);

    var temp=[...sourceData]
    temp[1] = sourceData[1].map(each=>{
      return {
        index: each.index,
        x: each.x,
        y: Math.abs(each.y)
      }
    })
    console.log('useEffect,sourceData22,temp', temp);

    setSourceData(temp);
    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker);
    setDisplayTime(days);
    setCurrentBranchTitle(currentBranchName)
  }, [dailyDataWithBranchId]);


  useEffect(() => {
    // alert('query')
    const length = dailyReportWithQuery && dailyReportWithQuery.length;
    const sourceData = sourceDataFilter(
      searchType,
      length,
      dailyReportWithQuery,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      true,
      "DailyReport"
    );
    console.log('useEffect,sourceData1,', sourceData);
    var temp=[...sourceData]
    temp[1] = sourceData[1].map(each=>{
      return {
        index: each.index,
        x: each.x,
        y: Math.abs(each.y)
      }
    })
    console.log('useEffect,temp,', temp);

    setSourceData(temp);
    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker);
    setDisplayTime(days);
    setCurrentBranchTitle(currentBranchName)
  }, [dailyReportWithQuery]);


  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage="DailyReport"
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
          allBranchReport={allBranchReportLocal}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="DailyReport"
          startTimeOfTimePicker={startTimeOfTimePicker}
          endTimeOfTimePicker={endTimeOfTimePicker}
          setStartTime={(n) => setStartOfTimePicker(n)}
          setEndTime={(n) => setEndOfTimePicker(n)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          currentBranchId={currentBranchId}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      {/* --------------------------- 面包屑 ----------------------------- */}
      <Header style={headerSytles}>
        <BreadSlice
          fromPage="DailyReport"
          clickedKey={clickedKey}
          searchType={searchType}
          breadSliceName={breadSliceName}
          currentBranchId={currentBranchId}
          setSourceData={(parms) => setSourceData(parms)}
          setStartOfTimePicker={(parms) => setStartOfTimePicker(parms)}
          setEndOfTimePicker={(parms) => setEndOfTimePicker(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setClickedKey={(parms) => setClickedKey(parms)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <Content>
        <ReportTitle
          fromPage='DailyReport'
          displayTime={displayTime || {}}
          searchType={searchType}
          currentBranchName={currentBranchTitle}
        />

        {/* ---------------------- 简单表 ---------------------- */}
        {(searchType === 'Today' || searchType === 'Yesterday') && (
          <SimpleExcel
            totalSales={sourceData[0].totalSales}
            profits={Math.abs(sourceData[0].profits)}
            transactions={sourceData[0].transactions}
            averageSize={Math.abs(sourceData[0].averageSize && sourceData[0].averageSize.toFixed(1))}
            margin={sourceData[0].margin}
          />
        )}

        {/* ---------------------- 柱状图 ---------------------- */}
        {(searchType === 'This Week' ||
         searchType === 'Last Week') && (
          <BarChart
            fromPage="DailyReport"
            source={sourceData}
            setCurrentTabKey={(m) => setCurrentTabKey(m)}
          />
        )}


        {/* ---------------------- 折线图 1 ---------------------- */}
        {(searchType === 'This Month' ||
          searchType === 'Last Month'
        ) && (
            <Tabs
              defaultActiveKey="1"
              centered={true}
              tabPosition="left"
              style={{ backgroundColor: 'white', padding: 40 }}
            >
              <TabPane tab="Total Sales" key="1" style={{ padding: 30 }}>
                <MiltLineChart type="DailyReport" tag="Total Sales" source={sourceData[0]} />
              </TabPane>

              <TabPane tab="Profit" key="2" style={{ padding: 30 }}>
                <MiltLineChart type="DailyReport" tag="Profit" source={sourceData[1]} />
              </TabPane>

              <TabPane tab="Transactions" key="3" style={{ padding: 30 }}>
                <MiltLineChart type="DailyReport" tag="Transactions" source={sourceData[2]} />
              </TabPane>
            </Tabs>
          )}


        {/* ---------------------- 折线图 2 ---------------------- */}
        {(searchType === 'Only_Date_Search' || searchType === 'Branch_Date_Search' ||
          searchType === 'Last Three Month') && (
            <Tabs
              defaultActiveKey="1"
              centered={true}
              tabPosition="left"
              style={{ backgroundColor: 'white', padding: 40 }}
            >
              <TabPane tab="Total Sales" key="1" style={{ padding: 30 }}>
                <LineChart
                  fromPage="DailyReport"
                  type="Sales"
                  source={sourceData[0]}
                  searchType={searchType}
                />
              </TabPane>

              <TabPane tab="Profit" key="2" style={{ padding: 30 }}>
                <LineChart
                  fromPage="DailyReport"
                  type="Profits"
                  source={sourceData[1]}
                  searchType={searchType}
                />
              </TabPane>

              <TabPane tab="Transactions" key="3" style={{ padding: 30 }}>
                <LineChart
                  fromPage="DailyReport"
                  type="Transactions"
                  source={sourceData[2]}
                  searchType={searchType}
                />
              </TabPane>
            </Tabs>
          )
        }
      </Content>
    </Layout>
  );
};

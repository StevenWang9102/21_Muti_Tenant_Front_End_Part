import React, { useEffect, useState, FC } from 'react';
import { Layout, Tabs } from 'antd';
import 'antd/dist/antd.css';
import { SalesReportComponent } from '../data';
import { GroupChart } from '../../public-tools/charts/GroupChart';
import { Bar } from 'ant-design-pro/lib/Charts';
import { BranchSelector } from '../../public-tools/component/BranchSelector'
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch'
import { BarChart } from '../../public-tools/charts/BarChart'
import { BreadSlice } from '../../public-tools/component/BreadSlice'
import { ReportTitle } from '../../public-tools/component/ReportTitle'
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'

const { Header, Content } = Layout;
const { TabPane } = Tabs;

export const MonthlyReport: FC<SalesReportComponent> = (props) => {
  const { dispatch, allBranchReport, monthlyDataWithQuery } = props;
  const { branchNameIds, monthlyBranchData, comnpareLastYearData } = props;
  const [searchType, setSearchType] = useState('This Year')
  const [clickedKey, setClickedKey] = useState(0)
  const [breadSliceName, setBreadSliceName] = useState('This Year')
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch')
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch')
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch')
  const [sourceData, setSourceData] = useState([])
  const [sourceData1, setSourceData1] = useState([])
  const [displayTime, setDisplayTime] = useState({})
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();

  useEffect(() => {
    requestSourceData('This Year', undefined);
  }, []);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {

    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker);
    if (currentBranchId && currentBranchId !== 'AllBranch') {
      if (type === 'Compared With Last Year') {
        dispatch({
          type: 'SalesReport/getComparedMonthlyData',
          payload: {
            timeRange: timeRange,
            branchId: currentBranchId,
          },
        });
      } else {
        dispatch({
          type: 'SalesReport/getSpecifiedBranchMonthlyData',
          payload: {
            timeRange: timeRange,
            branchId: currentBranchId,
          },
        });
      }
    } else {
      if (type === 'Compared With Last Year') {
        dispatch({
          type: 'SalesReport/getComparedMonthlyData',
          payload: {
            timeRange: timeRange
          },
        });
      } else {
        dispatch({
          type: 'SalesReport/getSpecifiedMonthlyData',
          payload: timeRange,
        });
      }
    }
  };


  // ------------------------ 当数据变化，设置表格数据源 ------------------------
  useEffect(() => {
    setAllDisplaySourceData(
      'MonthlyReport',
      monthlyBranchData,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
  }, [monthlyBranchData]);

  useEffect(() => {
    setAllDisplaySourceData(
      'MonthlyReport',
      monthlyDataWithQuery,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
  }, [monthlyDataWithQuery]);

  useEffect(() => {
    setAllDisplaySourceData(
      'MonthlyReport',
      comnpareLastYearData,
      setSourceData1,
      'Compare_Last_Year',
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
  }, [comnpareLastYearData]);


  const headerSytles = { height: 70, width: 800, marginLeft: "auto", marginRight: "auto" }
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage='MonthlyReport'
          allBranchReport={allBranchReport}
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          setSearchType={(parms) => setSearchType(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="MonthlyReport"
          startTimeOfTimePicker={startTimeOfTimePicker}
          endTimeOfTimePicker={endTimeOfTimePicker}
          setStartTime={(n) => setStartOfTimePicker(n)}
          setEndTime={(n) => setEndOfTimePicker(n)}
          currentBranchId={currentBranchId}
          setSearchType={(parms) => setSearchType(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
        />
      </Header>

      {/* --------------------------- 面包屑 ----------------------------- */}
      <Header style={headerSytles}>
        <BreadSlice
          fromPage="MonthlyReport"
          currentBranchId={'AllBranch'}
          searchType={searchType}
          clickedKey={clickedKey}
          breadSliceName={breadSliceName}
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
          fromPage='MonthlyReport'
          searchType={searchType}
          displayTime={displayTime}
          currentBranchName={currentBranchTitle}
        />

        {/* ---------------------------- 柱状图 ------------------- */}
        {['allMonthlyReport', 'Branch_Date_Search', 'Only_Date_Search',
          'This Year', 'Last 12 Month'].includes(searchType) &&
          <BarChart
            fromPage='MonthlyReport'
            source={{}}
            totalSaleSourceData={sourceData[0]}
            profitsSourceData={sourceData[1]}
            invoiceSourceData={sourceData[2]}
          />}

        {/* ---------------------------- 折线图 ------------------- */}
        {searchType === 'Only_Date_Search' && <>
          <Bar height={400} title="" data={[]} />
        </>
        }

        {/* ---------------------------- 对比图 ------------------- */}
        {searchType === 'Compared With Last Year' && <>
          <Tabs
            defaultActiveKey="1"
            centered={true}
            tabPosition="left"
            style={{ backgroundColor: 'white', padding: 40 }}
          >
            <TabPane tab="Total Sales" key="1" style={{ padding: 30 }}>
              <GroupChart
                type='Sales'
                sourceData={sourceData1}
              />
            </TabPane>

            <TabPane tab="Profit" key="2" >
              <GroupChart
                type='Profits'
                sourceData={sourceData1}
              />
            </TabPane>

            <TabPane tab="Transactions" key="3" style={{ padding: 30 }}>
              <GroupChart
                type='Transaction'
                sourceData={sourceData1}
              />
            </TabPane>
          </Tabs>
        </>
        }
      </Content>
    </Layout>
  );
};


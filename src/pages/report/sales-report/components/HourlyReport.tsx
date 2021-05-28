import React, { useEffect, useState, FC } from 'react'
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../data';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setFromAndToDay } from '../../public-tools/functions/setDisplayDay';
import { sourceDataFilter } from '../functions/sourceDataFilter'
import { BranchSelector } from '../../public-tools/component/BranchSelector'
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch'
import { MiltLineChart } from '../../public-tools/charts/MiltLineChart'
import { PieChart } from '../../public-tools/charts/PieChart'
import { BreadSlice } from '../../public-tools/component/BreadSlice'
import { ReportTitle } from '../../public-tools/component/ReportTitle'

const { Header, Content } = Layout;

export const HourlyReport = (props) => {
  const { dispatch, allBranchReport, allPaymentMethod, salesReportWithQueryData } = props;
  const { branchNameIds } = props;
  const [searchType, setSearchType] = useState('Today')
  const [clickedKey, setClickedKey] = useState(0)
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch')
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch')
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch')
  const [sourceData, setSourceData] = useState([])
  const [breadSliceName, setBreadSliceName] = useState('Today')
  const [displayTime, setDisplayTime] = useState({})
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState()
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState()
  
  // ----------------------- 进入组件-----------------------
  useEffect(() => {
    requestSourceData('Today', undefined)
  }, []);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker)
    
    if(branchId && branchId !=='AllBranch'){
      dispatch({
        type: 'SalesReport/getSpecifiedBranchHourlyReport',
        payload: {
          timeRange: timeRange,
          branchId: branchId
        }
      });
    } else {
      dispatch({
        type: 'SalesReport/getSpecifiedDayData',
        payload: timeRange
      });
    }
  }
  
  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    const length = allPaymentMethod && allPaymentMethod.length
    const sourceData = sourceDataFilter('Data with All Date', length, allPaymentMethod, null, null, true)
    setSourceData(sourceData)

    let days = setFromAndToDay('Data with All Date', startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
  }, [allPaymentMethod]);

  useEffect(() => {
    const length = salesReportWithQueryData && salesReportWithQueryData.length
    const sourceData = sourceDataFilter('Hourly Report - No Branch', length, salesReportWithQueryData, null, null, true)
    setSourceData(sourceData[0])

    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
    setCurrentBranchTitle(currentBranchName)
  }, [salesReportWithQueryData]);

  const headerSytles = { height: 70, width: 800, marginLeft: "auto", marginRight: "auto" }

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage='HourlyReport'
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          setSearchType={(parms) => setSearchType(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
          allBranchReport={allBranchReport}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage='HourlyReport'
          startTimeOfTimePicker={startTimeOfTimePicker}
          endTimeOfTimePicker={endTimeOfTimePicker}
          setStartTime={(n) => setStartOfTimePicker(n)}
          setEndTime={(n) => setEndOfTimePicker(n)}
          currentBranchId={currentBranchId}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      {/* --------------------------- 面包屑 ----------------------------- */}
      <Header style={headerSytles}>
        <BreadSlice
          fromPage='HourlyReport'
          clickedKey={clickedKey}
          searchType={searchType}
          currentBranchId={currentBranchId}
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

      <ReportTitle
        searchType={searchType}
        displayTime={displayTime || {}}
        currentBranchName={currentBranchTitle}
      />

      {/* ------------------- 折线图 ------------------- */}
      <MiltLineChart
        type='HourlyReport'
        source={sourceData}
      />
  
    </Layout>
  )
}


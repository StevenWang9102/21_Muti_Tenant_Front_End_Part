import React, { useEffect, useState, FC } from 'react'
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import dateFormat from "dateformat";
import { AddUserlInterface } from '../data';
import { thisMonthStart, thisMonthEnd} from '../functions/dates';
import { setRequestTime } from '../functions/setRequestTime';
import { setFromAndToDay } from '../functions/setFromAndToDay';
import { sourceDataFilter } from '../components/../functions/sourceDataFilter'
import { BranchSelector } from '../../public-tools/component/BranchSelector'
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch'
import { BarChart } from '../../public-tools/charts/BarChart'
import { PieChart } from '../../public-tools/charts/PieChart'
import { BreadSlice } from '../../public-tools/component/BreadSlice'
import { ReportTitle } from '../../public-tools/component/ReportTitle'
import { Row, Col } from 'antd';

const { Header, Content } = Layout;

export const InvoiceReport: FC<AddUserlInterface> = (props) => {

  console.log(thisMonthStart);
  console.log(thisMonthEnd);
  
  const { dispatch, allBranchReport, paymentWithQuery, allPaymentMethod } = props;
  const { branchNameIds } = props;

  const allBranchReportLocal = allBranchReport || []
  const [searchType, setSearchType] = useState('All Payment Data')
  const [clickedKey, setClickedKey] = useState(0)
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch')
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch')
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch')
  const [sourceData, setSourceData] = useState([])

  // 设置当前起止日期的
  const [displayTime, setDisplayTime] = useState({})

  // 获取当前TimePicker选中的时间的
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState()
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState()
  
  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker)
    if(branchId && branchId !=='AllBranch'){
      dispatch({
        type: 'PaymentReport/getSpecifiedBranchAndDayData',
        payload: {
          timeRange: timeRange,
          branchId: branchId
        }
      });
    } else {
      dispatch({
        type: 'PaymentReport/getSpecifiedDayData',
        payload: timeRange
      });
    }
  }

  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    const length = allPaymentMethod && allPaymentMethod.length
    const sourceData = sourceDataFilter('Data with All Date', length, allPaymentMethod, null, null, true)
    setSourceData(sourceData[0])
    let days = setFromAndToDay('Data with All Date', startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
  }, [allPaymentMethod]);

  useEffect(() => {
    const length = paymentWithQuery && paymentWithQuery.length
    const sourceData = sourceDataFilter('Data with Query', length, paymentWithQuery, null, null, true)
    setSourceData(sourceData[0])
    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
  }, [paymentWithQuery]);

  const headerSytles = { height: 70, width: 800, marginLeft: "auto", marginRight: "auto" }

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage='Payment'
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          setSearchType={(parms) => setSearchType(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
          allBranchReportLocal={allBranchReportLocal}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage='Payment'
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
          fromPage='PaymentReport'
          clickedKey={clickedKey}
          currentBranchId={currentBranchId}
          setSourceData={(parms) => setSourceData(parms)}
          setStartOfTimePicker={(parms) => setStartOfTimePicker(parms)}
          setEndOfTimePicker={(parms) => setEndOfTimePicker(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setClickedKey={(parms) => setClickedKey(parms)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <Content>

        <ReportTitle
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />

        <Row>
          {/* ------------------- 柱状图 ------------------- */}
          <Col span={14}>
            <BarChart
              fromPage="Payment"
              totalSaleSourceData={sourceData}
            />
          </Col>

          {/* ------------------- 饼状图 ------------------- */}
          <Col span={10}>
            <PieChart
              searchType={searchType}
              paymentWithQuery={paymentWithQuery}
              allReportData={allPaymentMethod}
            />
          </Col>
        </Row>

      </Content>
    </Layout>
  )
}


import React, { useEffect, useState, FC } from 'react'
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../data';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { setFromAndToDay } from '../../public-tools/functions/setDisplayDay';
import { sourceDataFilter } from '../components/../functions/sourceDataFilter'
import { BranchSelector } from '../../public-tools/component/BranchSelector'
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch'
import { BarChart } from '../../public-tools/charts/BarChart'
import { PieChart } from '../../public-tools/charts/PieChart'
import { BreadSlice } from '../../public-tools/component/BreadSlice'
import { ReportTitle } from '../../public-tools/component/ReportTitle'
import { Row, Col } from 'antd';

const { Header, Content } = Layout;

export const PaymentReport: FC<AddUserlInterface> = (props) => {

  const { dispatch, allBranchReport, paymentWithQuery, allPaymentMethod } = props;
  const { branchNameIds } = props;
  const [searchType, setSearchType] = useState('Today')
  const [clickedKey, setClickedKey] = useState(0)
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch')
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch')
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch')
  const [sourceData, setSourceData] = useState([])
  const [displayTime, setDisplayTime] = useState({})
  const [breadSliceName, setBreadSliceName] = useState('Today')
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState()
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState()

  // -------------- 初始化 --------------
  useEffect(() => {
    requestSourceData('Today', undefined);
  }, []);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    let timeRange = setRequestTime(type, startTimeOfTimePicker, endTimeOfTimePicker)
    if (branchId && branchId !== 'AllBranch') {
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
    setCurrentBranchTitle(currentBranchName)

  }, [allPaymentMethod]);

  useEffect(() => {
    const length = paymentWithQuery && paymentWithQuery.length
    const sourceData = sourceDataFilter('Data with Query', length, paymentWithQuery, null, null, true)
    setSourceData(sourceData[0])
    let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker)
    setDisplayTime(days)
    setCurrentBranchTitle(currentBranchName)
  }, [paymentWithQuery]);

  const headerSytles = { height: 70, width: 800, marginLeft: "auto", marginRight: "auto" }

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Header style={headerSytles}>
        <BranchSelector
          fromPage='Payment'
          branchNameIds={branchNameIds}
          allBranchReport={allBranchReport}
          dispatch={(n) => dispatch(n)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>

      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage='Payment'
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
          fromPage='PaymentReport'
          clickedKey={clickedKey}
          currentBranchId={currentBranchId}
          breadSliceName={breadSliceName}
          setSourceData={(parms) => setSourceData(parms)}
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
          fromPage='PaymentReport'
          searchType={searchType}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />

        <Row>
          {/* ------------------- 柱状图 ------------------- */}
          <Col span={12} style={{zIndex: 20}}>
            <BarChart
              fromPage="Payment"
              source={{}}
              totalSaleSourceData={sourceData}
            />
          </Col>

          {/* ------------------- 饼状图 ------------------- */}
          <Col span={10} offset={1}>
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


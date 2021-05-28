import React, { useEffect, useState, FC } from 'react';
import { Layout, Tabs } from 'antd';
import 'antd/dist/antd.css';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { BranchSelector } from '../../public-tools/component/BranchSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { HorizontalBarChart } from '../../public-tools/charts/HorizontalBarChart'
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'

const { Header } = Layout;
const { TabPane } = Tabs;

export const ItemTop10Report: FC<any> = (props) => {

  const {dispatch, allBranchReport, branchNameIds, allItemReport } = props;
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [displayTime, setDisplayTime] = useState({});
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();
  const [sourceData, setSourceData] = useState([[], [], []]);

  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    setSourceData([[],[],[]])
    requestSourceData('Today', undefined);
    requestSourceData('Today', undefined);
  }, []);

  console.log('sourceData998', sourceData);
  

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (type, branchId) => {
    setActiveTabKey('1')
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
    console.log('allItemReport1615',allItemReport);

    setAllDisplaySourceData(
      'ItemTop10Report',
      allItemReport,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
  }, [allItemReport, branchNameIds]); // 这里闪烁是因为，后来又有变量发生变化，但是，Hook没有跟踪到

  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };

  return (
    <Layout style={{ height: "800px", backgroundColor: 'white' }}>
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
          setSourceData={(parms) => setSourceData(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setStartOfTimePicker={(parms) => setStartOfTimePicker(parms)}
          setEndOfTimePicker={(parms) => setEndOfTimePicker(parms)}
          requestSourceData={(parms1, parms2) => requestSourceData(parms1, parms2)}
          setClickedKey={(parms) => setClickedKey(parms)}
          setSearchType={(parms) => setSearchType(parms)}
        />
      </Header>

      <ReportTitle
        fromPage="ItemTop10"
        searchType={searchType}
        displayTime={displayTime || {}}
        currentBranchName={currentBranchTitle} />

      {/* ----------------------------- 水平柱状图 ----------------------------- */}
      <Tabs
          defaultActiveKey="1"
          centered={true}
          tabPosition="left"
          activeKey={activeTabKey}
          onTabClick={(key)=>{
            // alert(key)
            setActiveTabKey(key)
          }}
          style={{ backgroundColor: 'white', padding: 40 }}
        >
          <TabPane tab="Sales" key="1">
            <HorizontalBarChart
              type='Sales'
              sourceData={sourceData[1]}
            />
          </TabPane>

          <TabPane tab="Profit" key="2">
            <HorizontalBarChart
              type='Profit'
              sourceData={sourceData[2]}
            />
          </TabPane>

          <TabPane tab="Transactions" key="3">
            <HorizontalBarChart
              type='Transactions'
              sourceData={sourceData[0]}
            />
          </TabPane>
        </Tabs>

    </Layout>
  );
};

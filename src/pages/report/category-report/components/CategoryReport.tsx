import React, { useEffect, useState, FC, Dispatch } from 'react';
import { Layout, Tabs } from 'antd';
import 'antd/dist/antd.css';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { BranchSelector } from '../../public-tools/component/BranchSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { SortedTable } from '../../public-tools/charts/SortedTable';
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'
import { HorizontalBarChart1 } from '../../public-tools/charts/HorizontalBarChart1'

const { Header, Content } = Layout;
const { TabPane } = Tabs;

interface ItemDailyReportInterface {
  dispatch: (any) => void,
  allItemNames: any,
  allBranchReport: object,
  paymentWithQuery: any,
  oneBranchItemReport: any,
  branchNameIds: any,
  itemDailyData: any,
}

export const CategoryReport: FC<ItemDailyReportInterface> = (props) => {
  const { dispatch, categoryDataWithoutBranch, categoryDataWithBranch, allBranchReport, branchNameIds } = props;
  const [searchType, setSearchType] = useState('Today');
  const [activeKey, setActiveKey] = useState('1');
  const [clickedKey, setClickedKey] = useState(0);
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [sourceData, setSourceData] = useState([]);
  const [displayTime, setDisplayTime] = useState({});
  const [currentItemName, setCurrentItemName] = useState('');
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();

  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    dispatch({
      type: 'branchManagement/getAllBranchNameGlobal',
    });
    requestSourceData('Today', undefined);
  }, []);

  console.log('CategoryReport,sourceData',sourceData);
  


  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (sliceName, branchId) => {
    let timeRange = setRequestTime(sliceName, startTimeOfTimePicker, endTimeOfTimePicker);
    setActiveKey('1')
    if (currentBranchId && currentBranchId !== 'AllBranch') {
      dispatch({
        type: 'CategoryReport/getSpecifiedBranchCategoryReport',
        payload: {
          timeRange: timeRange,
          branchId: currentBranchId,
        },
      });
    } else {
      dispatch({
        type: 'CategoryReport/getAllCategoryReportData',
        payload: { timeRange: timeRange },
      });
    }
  };


  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    // 携带分支的情况
    setAllDisplaySourceData(
      'CategoryReport',
      categoryDataWithBranch,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )

  }, [categoryDataWithBranch, allBranchReport]);

  useEffect(() => {
    // 不携带分支的情况
    setAllDisplaySourceData(
      'CategoryReport',
      categoryDataWithoutBranch,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
  }, [categoryDataWithoutBranch, allBranchReport]);


  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };


  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {/* --------------------------- 分支选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <BranchSelector
          fromPage="CategoryReport"
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          allBranchReport={allBranchReport}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>

      {/* --------------------------- 时间选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="ItemDailyReport"
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

      <Content>

        <ReportTitle
          fromPage="CategoryReport"
          searchType={searchType}
          currentItemName={currentItemName}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />

        {/* ----------------------- 折线图 ----------------------- */}
        <Tabs
          defaultActiveKey="1"
          centered={true}
          tabPosition="top"
          activeKey={activeKey}
          onTabClick={(key)=>{
            setActiveKey(key)
          }}
          style={{ backgroundColor: 'white', padding: "5px 50px 50px 50px" }}
        >
          <TabPane tab="Chart" key="1">
            <HorizontalBarChart1
              type='Transactions'
              sourceData={sourceData[0]}
            />
          </TabPane>

          <TabPane tab="Table" key="2">
            <SortedTable
              sourceData={sourceData[1]}
              fromPage='CategoryReport'
            />
          </TabPane>

        </Tabs>
      </Content>
    </Layout>
  );
};

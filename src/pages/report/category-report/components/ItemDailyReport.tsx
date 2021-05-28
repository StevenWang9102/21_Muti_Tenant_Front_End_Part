import React, { useEffect, useState, FC, Dispatch } from 'react';
import { Layout, Tabs } from 'antd';
import 'antd/dist/antd.css';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { BranchSelector } from '../../public-tools/component/BranchSelector';
import { ItemSelector } from '../../public-tools/component/ItemSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { LineChart } from '../../public-tools/charts/LineChart';
import { BarChart } from '../../public-tools/charts/BarChart';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { SimpleExcel } from '../../public-tools/component/SimpleExcel';
import { searchItemIdWithName } from '../../public-tools/functions/getBranchNameWithIds'
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'

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

export const ItemDailyReport: FC<ItemDailyReportInterface> = (props) => {
  const { dispatch, allItemNames, allBranchReport, oneBranchItemReport, branchNameIds, itemDailyData } = props;
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [selectedItem, setSelectedItem] = useState('');
  const [sourceData, setSourceData] = useState([]);
  const [displayTime, setDisplayTime] = useState({});
  const [currentItemName, setCurrentItemName] = useState('');
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();

  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    dispatch({
      type: 'CategoryReport/getAllItemNames',
    });

    dispatch({
      type: 'branchManagement/getAllBranchNameGlobal',
    });

  }, []);

  useEffect(() => {
    // 当拿到所有Item名字之后，去请求当天的数据。
    if (allItemNames.length !== 0) requestSourceData('Today', undefined);
    console.log(allItemNames);
    setCurrentItemName(allItemNames && allItemNames[0] && allItemNames[0].name)
  }, [allItemNames]);



  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (sliceName, branchId) => {
    let timeRange = setRequestTime(sliceName, startTimeOfTimePicker, endTimeOfTimePicker);
    console.log(timeRange);
    const defaultItemId = allItemNames && allItemNames[0] && allItemNames[0].id;

    if (currentBranchId && currentBranchId !== 'AllBranch') {
      dispatch({
        type: 'CategoryReport/getSpecifiedBranchAndDayData',
        payload: {
          timeRange: timeRange,
          branchId: currentBranchId,
          itemId: selectedItem || defaultItemId,
        },
      });
    } else {
      dispatch({
        type: 'CategoryReport/getSpecifiedItemDailyData',
        payload: {
          timeRange: timeRange,
          itemId: selectedItem || defaultItemId,
        },
      });
    }
  };


  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {
    // 携带分支的情况
    setAllDisplaySourceData(
      'ItemDailyReport',
      oneBranchItemReport,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
    const currentItemName = searchItemIdWithName(allItemNames, selectedItem)
    setCurrentItemName(currentItemName)

  }, [oneBranchItemReport]);


  useEffect(() => {
    // 不携带分支的情况
    setAllDisplaySourceData(
      'ItemDailyReport',
      itemDailyData,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )
    console.log(selectedItem);
    console.log(allItemNames);
    
    const currentItemName = searchItemIdWithName(allItemNames, selectedItem)
    currentItemName && setCurrentItemName(currentItemName)
  }, [itemDailyData]);

  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };
  const total = sourceData[0] && sourceData[0].totalSales
  const profit = sourceData[0] ? Math.abs(sourceData[0].profits): 0
  const transactions = sourceData[0] && sourceData[0].transactions
  const averageSize = total == 0? 0 : total/transactions

  console.log('sourceData48115',sourceData);
  
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      {/* --------------------------- 分支选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <BranchSelector
          fromPage="ItemDailyReport"
          branchNameIds={branchNameIds}
          dispatch={(n) => dispatch(n)}
          allBranchReport={allBranchReport}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>


      {/* --------------------------- 产品选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <ItemSelector
          fromPage="ItemDailyReport"
          setSelectedItem={(n) => setSelectedItem(n)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setCurrentItemName={() => {}}
          allItemNames={allItemNames}
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
          fromPage="ItemDailyReport"
          searchType={searchType}
          currentItemName={currentItemName}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />

        {/* ----------------------- 简单展示 ----------------------- */}
        {(searchType === 'Today' || searchType === 'Yesterday') && 
 

        <SimpleExcel
            totalSales={total}
            profits={profit}
            transactions={transactions}
            averageSize={averageSize}
          />
        }

        {/* ----------------------- 柱状图 ----------------------- */}
        {(searchType === 'This Week' || searchType === 'Last Week') && (
          <BarChart
            fromPage="ItemDailyReport"
            searchType={searchType}
            source={sourceData}
          />
        )}

        {/* ----------------------------- 水平柱状图 ----------------------------- */}
        {
          ( searchType === 'This Month' ||
          searchType === 'Last Month' ||
          searchType === 'Last Three Month' ||
          searchType === 'Branch_Date_Search' ||
          searchType === 'Only_Date_Search'
          ) && <Tabs
            defaultActiveKey="1"
            centered={true}
            tabPosition="left"
            style={{ backgroundColor: 'white', padding: 40 }}
          >
            <TabPane tab="Sales" key="1" style={{ padding: 30 }}>
              <LineChart
                fromPage="DailyReport"
                type="Sales"
                source={sourceData[0]}
                searchType={searchType}
              />
            </TabPane>

            <TabPane tab="Profits" key="2" style={{ padding: 30 }}>
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
          </Tabs>}
      </Content>
    </Layout>
  );
};

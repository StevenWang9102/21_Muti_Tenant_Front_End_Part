import React, { useEffect, useState, FC, Dispatch } from 'react';
import { Layout, Tabs, Row, Col, message } from 'antd';
import 'antd/dist/antd.css';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { ItemSelector } from '../../public-tools/component/ItemSelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'
import { MiltiBarChart } from '../../public-tools/charts/MiltiBarChart'
import { PieChart } from '../../public-tools/charts/PieChart'

const { Header, Content } = Layout;

interface ItemDailyReportInterface {
  dispatch: (any) => void,
  allItemNames: any,
  allBranchReport: object,
  paymentWithQuery: any,
  oneBranchItemReport: any,
  branchNameIds: any,
  itemDailyData: any,
}

export const ItemBranchReport: FC<ItemDailyReportInterface> = (props) => {
  const { dispatch, allItemNames,itemBranchReportWithQuery } = props;
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [selectedItem, setSelectedItem] = useState('');
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [currentDisplayItemName, setCurrentDisplayItemName] = useState('');
  const [sourceData, setSourceData] = useState([]);
  const [displayTime, setDisplayTime] = useState({});
  const [currentItemName, setCurrentItemName] = useState('');
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();


  console.log(itemBranchReportWithQuery);

  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    dispatch({
      type: 'CategoryReport/getAllItemNames',
    });
  }, []);

  // 当Item数据返回值后,发送一个今天的请求
  useEffect(() => {
    console.log(allItemNames);
    
    if(allItemNames.length !==0){
      requestSourceData('Today', undefined);
    }
  }, [allItemNames]);

  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (sliceName, branchId) => {
    let timeRange = setRequestTime(sliceName, startTimeOfTimePicker, endTimeOfTimePicker);
    const defaultItemId = allItemNames && allItemNames[0] && allItemNames[0].id;

    dispatch({
      type: 'CategoryReport/getItemBranchReportWithId',
      payload: {
        timeRange: timeRange,
        itemId: selectedItem || defaultItemId,
      },
    });
  };

  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {

    console.log(itemBranchReportWithQuery);
    console.log(searchType);

    setAllDisplaySourceData(
      'ItemBranchReport', // 借用这个名字
      itemBranchReportWithQuery,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )


    // setCurrentCategoryName(allCategoryNames && allCategoryNames[currentCategoryId - 1].name)
    setCurrentDisplayItemName(currentItemName)
  }, [itemBranchReportWithQuery]);


  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };


  return (
    <Layout style={{ backgroundColor: 'white' }}>

      {/* --------------------------- 分支选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <ItemSelector
          fromPage="ItemBranchReport"
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSelectedItem={(n) => setSelectedItem(n)}
          setCurrentItemName={(n) => setCurrentItemName(n)}
          allItemNames={allItemNames}
        />
      </Header>

      {/* --------------------------- 时间选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="ItemBranchReport"
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
          fromPage="ItemBranchReport"
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
          fromPage="ItemBranchReport"
          searchType={searchType}
          currentItemName={currentDisplayItemName}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />
        
        {/* ----------------------- 多态柱状图 ----------------------- */}
        <Row gutter={24} >
          <Col xl={13} lg={13} md={13} sm={13} xs={1134}>
            <MiltiBarChart
              sourceData={sourceData[0]}
            />
          </Col>

          <Col xl={9} lg={9} md={9} sm={9} xs={9} style={{zIndex: 11}}>
            <PieChart
              fromPage='ItemBranchReport'
              sourceData={sourceData[1]}
            />
          </Col>
        </Row>

      </Content>
    </Layout>
  );
};

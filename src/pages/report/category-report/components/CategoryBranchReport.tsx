import React, { useEffect, useState, FC, Dispatch } from 'react';
import { Layout, Tabs, Row, Col, message } from 'antd';
import 'antd/dist/antd.css';
import { ReportTitle } from '../../public-tools/component/ReportTitle';
import { setRequestTime } from '../../public-tools/functions/setRequestTime';
import { CategorySelector } from '../../public-tools/component/CategorySelector';
import { TimePickerWithSearch } from '../../public-tools/component/TimePickerWithSearch';
import { BreadSlice } from '../../public-tools/component/BreadSlice';
import { setAllDisplaySourceData } from '../../public-tools/functions/setAllDisplaySourceData'
import { MiltiBarChart } from '../../public-tools/charts/MiltiBarChart'
import { PieChart } from '../../public-tools/charts/PieChart'

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

export const CategoryBranchReport: FC<ItemDailyReportInterface> = (props) => {
  const { dispatch, categoryBranchDataWithCategoryId,} = props;
  const { allBranchReport, allCategoryNames, branchNameIds } = props;
  const [searchType, setSearchType] = useState('Today');
  const [clickedKey, setClickedKey] = useState(0);
  const [breadSliceName, setBreadSliceName] = useState('Today');
  const [currentBranchId, setCurrentBranchId] = useState('AllBranch');
  const [currentCategoryId, setCurrentCategoryId] = useState(1);
  const [currentBranchName, setCurrentBranchName] = useState('AllBranch');
  const [currentBranchTitle, setCurrentBranchTitle] = useState('AllBranch');
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const [sourceData, setSourceData] = useState([]);
  const [displayTime, setDisplayTime] = useState({});
  const [currentItemName, setCurrentItemName] = useState('');
  const [startTimeOfTimePicker, setStartOfTimePicker] = useState();
  const [endTimeOfTimePicker, setEndOfTimePicker] = useState();
  const [isCategorySelected, setIsCategorySelected] = useState(false)


  // ----------------------- 初始化 -----------------------
  useEffect(() => {
    dispatch({
      type: 'CategoryReport/getAllCategoriesNames',
    });
    requestSourceData("Today", currentBranchId); // 传递一个标识
  }, []);


  // ----------------------- 请求数据 -----------------------
  const requestSourceData = (sliceName, branchId) => {
    let timeRange = setRequestTime(sliceName, startTimeOfTimePicker, endTimeOfTimePicker);

      dispatch({
          type: 'CategoryReport/getCategoryReportWithCategoryId',
          payload: {
            timeRange: timeRange,
            categoryId: currentCategoryId,
          },
        });

  };

  // ----------------------- 当数据变化，渲染图表 -----------------------
  useEffect(() => {

    console.log(categoryBranchDataWithCategoryId);
    console.log(searchType);

    setAllDisplaySourceData(
      'CategoryBranchReport',
      categoryBranchDataWithCategoryId,
      setSourceData,
      searchType,
      startTimeOfTimePicker,
      endTimeOfTimePicker,
      setDisplayTime,
      currentBranchName,
      setCurrentBranchTitle,
    )

      console.log('categoryBranchDataWithCategoryId,allCategoryNames',allCategoryNames);
      const temp = allCategoryNames && allCategoryNames.filter(each=> each.id == currentCategoryId)[0].name
      setCurrentCategoryName(temp)
  }, [categoryBranchDataWithCategoryId]);


  const headerSytles = { height: 70, width: 800, marginLeft: 'auto', marginRight: 'auto' };


  return (
    <Layout style={{ backgroundColor: 'white' }}>

      {/* --------------------------- 分支选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <CategorySelector
          fromPage="CategoryBranchReport"
          branchNameIds={branchNameIds}
          currentCategoryId={currentCategoryId}
          setCurrentCategoryId={(parms) => setCurrentCategoryId(parms)}
          dispatch={(n) => dispatch(n)}
          allCategoryNames={allCategoryNames}
          allBranchReport={allBranchReport}
          setIsCategorySelected={(parms) => setIsCategorySelected(parms)}
          setBreadSliceName={(parms) => setBreadSliceName(parms)}
          setSearchType={(parms) => setSearchType(parms)}
          setCurrentBranchName={(n) => setCurrentBranchName(n)}
          setCurrentBranchId={(n) => setCurrentBranchId(n)}
        />
      </Header>

      {/* --------------------------- 时间选择器 ----------------------------- */}
      <Header style={headerSytles}>
        <TimePickerWithSearch
          fromPage="CategoryBranchReport"
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
          fromPage="CategoryBranchReport"
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
          fromPage="CategoryBranchReport"
          searchType={searchType}
          // currentItemName={currentItemName}
          currentCategoryName={currentCategoryName}
          displayTime={displayTime || {}}
          currentBranchName={currentBranchTitle}
        />
        {/* ----------------------- 多态柱状图 ----------------------- */}

        <Row gutter={24}  >
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <MiltiBarChart 
              sourceData={sourceData[0]}
            />
          </Col>

          <Col xl={10} lg={10} md={10} sm={10} xs={10}>
            <PieChart
              fromPage='CategoryBranchReport'
              sourceData={sourceData[1]}
            />
          </Col>
        </Row>

      </Content>
    </Layout>
  );
};

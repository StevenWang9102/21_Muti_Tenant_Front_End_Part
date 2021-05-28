import React, { useEffect, useState } from 'react';
import { connect, Dispatch, history } from 'umi';
import { Tabs } from 'antd';
import { CategoryReport as Category_Report } from './components/CategoryReport';
import { CategoryBranchReport } from './components/CategoryBranchReport';
import { ItemReport } from './components/ItemReport';
import { ItemTop10Report } from './components/ItemTop10Report';
import { ItemBranchReport } from './components/ItemBranchReport';
import { ItemDailyReport } from './components/ItemDailyReport';
import { getBranchNameWithIds, getItemNameWithIds } from './functions/getBranchNameWithIds'
import 'antd/dist/antd.css';

interface ReportInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  CategoryReport?: LocalPropsInterface;
  submittingOfSwitch?: boolean;
  status?: string;
}

interface LocalPropsInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  allItemReport?: any[];
  categoryDataWithBranch?: any;
  categoryDataWithoutBranch?: any;
  allDailyReport?: any[];
  warningMessage?: object;
  OneBranchInfo?: any[];
  allBranchNames: any[];
  allRoles: any[];
  visible: boolean;
  visibleOfNewUser: boolean;
}
const { TabPane } = Tabs;

const Report: React.FC<ReportInterface> = (props) => {
  const { dispatch, branchManagement, CategoryReport } = props;
  const [fromPage, setFromPage] = useState('BranchReport')

  // 转化数据结构, 不要转移，很多函数共享这个检索
  let branchNameIds = getBranchNameWithIds(branchManagement.allBranchInfo)
  let itemNamesIds = getItemNameWithIds(CategoryReport.allItemNames)


  var onTabClickKey = '1'
  const historyArray = history.location.pathname.split('/')
  console.log('history15115', history);
  console.log('history15115,historyArray', historyArray);

  if (historyArray[3]) onTabClickKey = historyArray[3]


  return (
    <>
      <Tabs
        defaultActiveKey="1"
        activeKey={onTabClickKey}
        onChange={function callback(key) {
          history.push(`/report/category-report/${key}`)
        }}
        style={{ backgroundColor: "white", padding: '20px 20px' }}
      >

        <TabPane tab="Category Report" key="1">
          <Category_Report
            // fromPage={fromPage}
            allItemReport={props.CategoryReport.allItemReport}
            categoryDataWithBranch={CategoryReport.categoryDataWithBranch}
            categoryDataWithoutBranch={CategoryReport.categoryDataWithoutBranch}
            allBranchReport={props.branchManagement.allBranchInfo} // 借用branch数据
            allDailyReport={props.CategoryReport.allDailyReport}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            branchNameIds={branchNameIds}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Category Branch Report" key="2">
          <CategoryBranchReport
            // fromPage={fromPage}
            allItemReport={props.CategoryReport.allItemReport}
            allBranchReport={props.branchManagement.allBranchInfo}
            allDailyReport={props.CategoryReport.allDailyReport}
            allCategoryNames={props.CategoryReport.allCategoryNames}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            categoryBranchDataWithCategoryId={props.CategoryReport.categoryBranchDataWithCategoryId}
            branchNameIds={branchNameIds}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Item Top 10" key="3">
          <ItemTop10Report
            // fromPage={fromPage}
            allItemReport={props.CategoryReport.allItemReport}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            allBranchReport={props.branchManagement.allBranchInfo} // 借用branch数据
            branchNameIds={branchNameIds}
            allDailyReport={props.CategoryReport.allDailyReport}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Item Report" key="4">
          <ItemReport
            // fromPage={fromPage}
            allItemReport={props.CategoryReport.allItemReport}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            allBranchReport={props.branchManagement.allBranchInfo} // 借用branch数据
            branchNameIds={branchNameIds}
            allDailyReport={props.CategoryReport.allDailyReport}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Item Daily Report" key="5">
          <ItemDailyReport
            itemNamesIds={itemNamesIds}
            allItemNames={props.CategoryReport.allItemNames}
            itemDailyData={props.CategoryReport.itemDailyData}
            oneBranchItemReport={props.CategoryReport.allItemReport}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            allBranchReport={props.branchManagement.allBranchInfo} // 借用branch数据
            branchNameIds={branchNameIds}
            allDailyReport={props.CategoryReport.allDailyReport}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Item Branch Report" key="6">
          <ItemBranchReport
            // fromPage={fromPage}
            allItemNames={props.CategoryReport.allItemNames}
            allItemReport={props.CategoryReport.allItemReport}
            itemBranchReportWithQuery={props.CategoryReport.itemBranchReportWithQuery}
            allBranchReport={props.branchManagement.allBranchInfo}
            allDailyReport={props.CategoryReport.allDailyReport}
            allCategoryNames={props.CategoryReport.allCategoryNames}
            itemReportWithQuery={props.CategoryReport.itemReportWithQuery}
            categoryBranchDataWithCategoryId={props.CategoryReport.categoryBranchDataWithCategoryId}
            branchNameIds={branchNameIds}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

const mapStateToProps = ({ CategoryReport, loading, branchManagement }: {
  CategoryReport: LocalPropsInterface;
  branchManagement: BranchSettingInterface;
  loading: { effects: { [key: string]: boolean; }; };
}) => ({
  branchManagement, CategoryReport,
  submitting: loading.effects['CategoryReport/getAllUserInformation'],
})

export default connect(mapStateToProps)(Report);

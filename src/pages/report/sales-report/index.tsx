import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect, Dispatch, Link, history } from 'umi';
import { Tabs } from 'antd';
import { BranchReport } from './components/BranchReport';
import { DailyReport } from './components/DailyReport';
import { MonthlyReport } from './components/MonthlyReport';
import { HourlyReport } from './components/HourlyReport';
import 'antd/dist/antd.css';

interface UserManagementInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  SalesReport?: LocalPropsInterface;
  submittingOfSwitch?: boolean;
  status?: string;
}

interface LocalPropsInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  warningMessage?: object;
  OneBranchInfo?: any[];
  allBranchNames: any[];
  allRoles: any[];
  visible: boolean;
  visibleOfNewUser: boolean;
}
const { TabPane } = Tabs;


const Report: React.FC<UserManagementInterface> = (props) => {
  const { dispatch, branchManagement, SalesReport } = props;
  const [fromPage, setFromPage] = useState('BranchReport')
  
  console.log('history151', history);
  const historyArray = history.location.pathname.split('/')
  var onTabClickKey = '1'

  if(historyArray[3]) onTabClickKey =  historyArray[3] 

  useEffect(() => {
    console.log('history151', history);

    dispatch({
      type: 'SalesReport/getAllBranchNameGlobal',
      payload: 'no message'
    });

    dispatch({
      type: `SalesReport/getAllMonthSales`,
    });
  }, []);

  // 转化数据结构
  const branchNameIds = {}
  const allBranchInfo = branchManagement && (branchManagement.allBranchInfo || [])
  allBranchInfo.forEach((eachBranch, index) => {
    branchNameIds[eachBranch.shortName] = eachBranch.id
  })

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        activeKey={onTabClickKey}
        onChange={function callback(key) {
          history.push(`/report/sales-report/${key}`)
          if (key === "1") { setFromPage('BranchReport')}
          if (key === "2") { setFromPage('DailyReport')}
          if (key === "3") { setFromPage('MonthlyReport')}
          if(key==="4") { setFromPage('HourlyReport')}
        }}
        style={{ backgroundColor: "white", padding: '20px 20px' }}
      >

          <TabPane tab="Branch Report" key="1" >  
            <BranchReport
              fromPage={fromPage}
              allBranchReport={props.SalesReport.allBranchNames}
              branchReportWithQueryData={props.SalesReport.branchReportWithQueryData}
              allDailyReport={props.SalesReport.allDailyReport}
              dispatch={(n) => dispatch(n)}
            />
          </TabPane>
        
        <TabPane tab="Hourly Report" key="2">
          <HourlyReport
            fromPage={fromPage}
            branchNameIds={branchNameIds}
            salesReportWithQueryData={props.SalesReport.salesReportWithQueryData}
            allBranchReport={props.SalesReport.allBranchNames}
            allDailyReport={props.SalesReport.allDailyReport}
            monthlySalesData={props.SalesReport.monthlySalesData}
            oneBranchSalesData={props.SalesReport.oneBranchSalesData}
            dispatch={(n) => dispatch(n)
            }/>
        </TabPane>


        <TabPane tab="Daily Report" key="3">
          <DailyReport
            fromPage={fromPage}
            branchNameIds={branchNameIds}
            allBranchReport={props.SalesReport.allBranchNames}
            allDailyReport={props.SalesReport.allDailyReport}
            dailyDataWithBranchId={props.SalesReport.dailyDataWithBranchId}
            dailyReportWithQuery={props.SalesReport.dailyReportWithQuery}
            oneBranchSalesData={props.SalesReport.oneBranchSalesData}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>

        <TabPane tab="Monthly Report" key="4">
          <MonthlyReport
            fromPage={fromPage}
            branchNameIds={branchNameIds}
            SalesReport={props.SalesReport}
            comnpareLastYearData={props.SalesReport.comnpareLastYearData}
            monthlyBranchData={props.SalesReport.monthlyBranchData}
            allBranchReport={props.SalesReport.allBranchNames}
            monthlyDataWithQuery={props.SalesReport.monthlyDataWithQuery}
            allDailyReport={props.SalesReport.allDailyReport}
            monthlySalesData={props.SalesReport.monthlySalesData}
            oneBranchSalesData={props.SalesReport.oneBranchSalesData}
            dispatch={(n) => dispatch(n)
            } />
        </TabPane>
      </Tabs>
    </>
  );
};

const mapStateToProps = ({ SalesReport, loading, branchManagement }: {
  SalesReport: LocalPropsInterface;
  branchManagement: BranchSettingInterface;
  loading: { effects: { [key: string]: boolean; }; };
}) => ({
  branchManagement, SalesReport,
  submitting: loading.effects['SalesReport/getAllUserInformation'],
})

export default connect(mapStateToProps)(Report);

import React, { useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Tabs } from 'antd';
import { PaymentReport as Payment} from './components/PaymentReport';
import 'antd/dist/antd.css';

interface UserManagementInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  PaymentReport?: LocalPropsInterface;
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
  const { dispatch, branchManagement, PaymentReport } = props;
  const [fromPage, setFromPage] = useState('BranchReport')
  

  useEffect(() => {
    dispatch({
      type: 'branchManagement/getAllBranchNameGlobal',
    });
  }, []);

  const branchNameIds = {}
  const allBranchInfo = branchManagement && (branchManagement.allBranchInfo || [])
  allBranchInfo.forEach((eachBranch, index) => {
    branchNameIds[eachBranch.shortName] = eachBranch.id
  })
  
  return (
    < >
      <Tabs
        defaultActiveKey="1"
        style={{ backgroundColor: "white", padding: '20px 20px' }}
        onChange={function callback(key) {
          if (key === "1") setFromPage('BranchReport')
          if (key === "2") setFromPage('DailyReport')
          if (key === "3") setFromPage('MonthlyReport')
          if(key==="4") setFromPage('HourlyReport')
        }}
      >

        <TabPane tab="Payment Report" key="1">
          <Payment
            fromPage={fromPage}
            allPaymentMethod = {PaymentReport.allPaymentMethod}
            allBranchReport={branchManagement.allBranchInfo} // 借用branch数据
            allDailyReport={PaymentReport.allDailyReport}
            paymentWithQuery={PaymentReport.paymentWithQuery}
            branchNameIds={branchNameIds}
            dispatch={(n) => dispatch(n)}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

const mapStateToProps = ({ PaymentReport, loading, branchManagement }: {
  PaymentReport: LocalPropsInterface;
  branchManagement: BranchSettingInterface;
  loading: { effects: { [key: string]: boolean; }; };
}) => ({
  branchManagement, PaymentReport,
  submitting: loading.effects['PaymentReport/getAllUserInformation'],
})

export default connect(mapStateToProps)(Report);

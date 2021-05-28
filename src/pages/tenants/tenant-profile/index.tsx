
import { Route, Redirect } from "react-router-dom";
import {Button, Card,Statistic,  Descriptions,} from 'antd';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment, } from 'react';
import { connect, Dispatch } from 'umi';
import { AdvancedProfileData } from './data.d';
import styles from './style.less';
import { RouteChildrenProps } from 'react-router';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import dateFormat from "dateformat";
import { Link  } from 'umi';


interface TenantProfileProps extends RouteChildrenProps {
  loading: boolean;
  dispatch: Dispatch;
  tenantsAndtenantProfile: AdvancedProfileData
}

interface TenantProfileState {
  operationKey: string;
  tabActiveKey: string;
}

class TenantProfile extends Component<TenantProfileProps, TenantProfileState> {
  public state: TenantProfileState = {
    operationKey: 'tab1',
    tabActiveKey: 'detail',
  };


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tenantsAndtenantProfile/ResetStatus',
    });
  }

  componentDidMount() {
    const { dispatch, location } = this.props;

    dispatch({
      type: 'tenantsAndtenantProfile/fetchOneCandidateTA',
      payload: {
        id: location.state && location.state.tenantApplicationFormId,
      },
    });
  }

  onOperationTabChange = (key: string) => {
    this.setState({ operationKey: key });
  };

  onTabChange = (tabActiveKey: string) => {
    this.setState({ tabActiveKey });
  };


  handleApproveCandidate = () => {
    const { dispatch, location } = this.props;
    console.log(location.state.tenantApplicationFormId);
    for (let i = 0; i < 10; i++) {
      dispatch({
        type: 'tenantsAndtenantProfile/approveCandidateSA',
        payload: { id: location.state.tenantApplicationFormId },
      });
    }
  };

  handleDenyCandidate = () => {
    const { dispatch, location } = this.props;
    console.log(location.state.tenantApplicationFormId);
    dispatch({
      type: 'tenantsAndtenantProfile/denyCandidateSA',
      payload: {
        id: location.state.tenantApplicationFormId,
      },
    });
  };


  render() {
    const { tabActiveKey } = this.state;
    const { tenantsAndtenantProfile, loading } = this.props;
    const { tenantProfile, } = tenantsAndtenantProfile;
    console.log(tenantsAndtenantProfile)
    console.log('tenantProfile461',tenantProfile.createdTime)
    console.log('tenantProfile461', dateFormat(tenantProfile.createdTime, "dd/mm/yyyy"))

    // dateFormat(today, "yyyy-mm-dd")
    const extra = (
      <div className={styles.moreInfo}>
        <Statistic
          title="Status"
          style={{ color: 'red' }}
          value={tenantProfile.isApproved === null ? 'Pending' : tenantProfile.isApproved ? 'Approved' : 'Denied'} />
      </div>
    );

    // ------------------- 右侧的状态区域 -------------------
    const action = (
      <Fragment>
      
        {tenantProfile.isApproved === null && (
          <>
            <Button type="primary" onClick={() => this.handleApproveCandidate()}>Approve</Button>
            <Button type="primary" danger onClick={() => this.handleDenyCandidate()}>Deny</Button>
          </>
        )}
      </Fragment>
    );

    const userName = tenantProfile.userMiddleName?  
    `${tenantProfile.userFirstName} ${tenantProfile.userMiddleName} ${tenantProfile.userLastName}`:
    `${tenantProfile.userFirstName} ${tenantProfile.userLastName}`

    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="Staff Name">{userName}</Descriptions.Item>
            <Descriptions.Item label="Created Time">{tenantProfile.createdTime && dateFormat(tenantProfile.createdTime, "dd/mm/yyyy")}</Descriptions.Item>
            <Descriptions.Item label="Candidate ID">{tenantProfile.id}</Descriptions.Item>
            {/* <Descriptions.Item label="Note"> Please comfirm within two working days</Descriptions.Item> */}
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );


    console.log(tenantProfile);
    console.log(tenantsAndtenantProfile);


    return (
      <Route>
        {(tenantsAndtenantProfile.denySuccess || tenantsAndtenantProfile.approveSuccess) ?
          <Redirect to="/tenants/tenant-application-list" />
          :
          <div>
            <PageHeaderWrapper
              title='Basic Information'
              extra={IsSuperAdmin() ? action : null}
              className={styles.pageHeader}
              content={description}
              extraContent={extra}
              tabActiveKey={tabActiveKey}
              onTabChange={this.onTabChange}
              breadcrumb={[]}
              padding='20'
            >
              <Card title="Company Information" style={{ margin: 0 }} bordered={false}>
                <Descriptions style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Trading Name">{tenantProfile.tradingName}</Descriptions.Item>
                  <Descriptions.Item label="Legal Name">{tenantProfile.legalName}</Descriptions.Item>
                  <Descriptions.Item label="Company Name">{tenantProfile.shortName}</Descriptions.Item>
                  <Descriptions.Item label="GST Number">{tenantProfile.gstNumber}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{tenantProfile.phone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{tenantProfile.email}</Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {`${tenantProfile.street}, ${tenantProfile.suburb}, ${tenantProfile.city}, ${tenantProfile.country}`}
                  </Descriptions.Item>
                </Descriptions>

                <Button type='primary' style={{textAlign: 'center'}}>
                  <Link to="/dashboard/workplace">Go to DashBoard</Link>
                </Button>
                
              </Card>
            </PageHeaderWrapper>
          </div>
        } </Route>
    );
  }
}

export default connect(
  ({
    tenantsAndtenantProfile,
    loading,
  }: {
    tenantsAndtenantProfile: AdvancedProfileData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    tenantsAndtenantProfile,
    loading: loading.effects['tenantsAndtenantProfile/fetchAdvanced'],
  }),
)(TenantProfile);

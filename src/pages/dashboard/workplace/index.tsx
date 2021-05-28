import { Avatar, Card, Col, List, Skeleton, Row, Statistic, Timeline } from 'antd';
import React, { Component } from 'react';
import CollapseGroup from './components/CollapseGroup'
import { CompanyList } from './components/CompanyList/index'
import { Link, Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { ModalState } from './model';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import jwt from 'jsonwebtoken'


interface WorkplaceProps {
  currentUser?: CurrentUser;
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
  dispatch: Dispatch;
  currentUserLoading: boolean;
  projectLoading: boolean;
  activitiesLoading: boolean;
}

const PageHeaderContent: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={'https://p3.pstatp.com/large/pgc-image/15337177846531748ac16fb'} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          Hello, welcome to menuhub
        </div>
        <div>
          {/* {IsTenantAdmin? ""} */}
        </div>
        <div>
          You can find your application status and other useful information here.
        </div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{}> = () => (
  <div className={styles.extraContent}>
    {/* <div className={styles.statItem}>
      <Statistic title="Orders Quantity" value={56} />
    </div> */}
    {/* <div className={styles.statItem}>
      <Statistic title="Visits Quantity" value={2223} />
    </div> */}
  </div>
);




class Workplace extends Component<WorkplaceProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'dashboardAndworkplace/init',
    });

    dispatch({
      type: 'dashboardAndworkplace/fetchBranch',
    });

    dispatch({
      type: 'dashboardAndworkplace/fetchProgreStatus',
    });

    dispatch({
      type: 'dashboardAndworkplace/fetchAllCandidates',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/clear',
    });
  }

  getHostUserApproved = () => {
    const gposToken = getToken();
    const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
    console.log('workspace48,allCandidates,decoded', decoded);
    return decoded !== null && decoded['TenantUserId'] ? true : false;
  }

  renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };



  render() {
    const {
      currentUser,
      allCandidates,
    } = this.props;

    const isBranchApproved = this.getHostUserApproved()
    const isBranchBuiled = this.props.allBranches && this.props.allBranches.length > 1
    const isPaymentModeCreated = this.props.allPayments && this.props.allPayments.length > 1
    const isUserCreated = this.props.allUsers && this.props.allUsers.length > 1
    const isItemCreated = this.props.allItems && this.props.allItems.length >= 1
    const isRoleCreated = this.props.allRoles && this.props.allRoles.length > 1
    const isCategoryCreated = this.props.allCategories && this.props.allCategories.length >= 1
    const allCandidatesLocal = (allCandidates && allCandidates.allCandidates) || {}
    const allCompanies = allCandidatesLocal.data || []
    console.log('workspace48,this.props', this.props);
    console.log('workspace48,allCandidates.data', allCandidates);
    console.log('workspace48,allCompanies', allCompanies);

    if (!currentUser || !currentUser.userid) {
      return null;
    }

    const isApplicationFormCreated = (!allCandidates || (allCandidates && allCandidates.allCandidates && allCandidates.allCandidates.data.length == 0))
    const doneimage = <img 
      style={{ height: 32, width: 34, marginLeft: 5, marginTop: -4 }} 
      src={require('./image/done2.png')} 
      alt='' 
      />

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        extraContent={<ExtraContent />}
      >
        <Row gutter={24}>
          <Col xl={14} lg={24} md={24} sm={24} xs={24}>

            {/* ------------------------------- 进度信息 ------------------------------- */}
            <Card
              style={{ marginBottom: 24 }}
              title="Your Progress"
              bordered={false}
              bodyStyle={{ padding: 30 }}
            >
              <Timeline mode='right' style={{ marginLeft: '100px' }}>
                <Timeline.Item
                  color="blue"
                  label={doneimage}
                  style={{ fontSize: 14 }}
                >
                  Register an account.
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isApplicationFormCreated ? "" : doneimage}
                  color={isApplicationFormCreated ? 'gray' : 'blue'}
                >
                  Create a company application <Link to="/tenants/tenant-application-form" style={{ textDecoration: "underline" }}> form</Link>.
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isApplicationFormCreated ? "" : doneimage}
                  color={isApplicationFormCreated ? 'gray' : 'blue'}
                >
                  Wait for menuhub admin to approve.
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isBranchApproved ? doneimage : ''}
                  color={isBranchApproved ? 'blue' : 'gray'}
                >
                  Approved.
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isBranchBuiled ? doneimage : ''}
                  color={isBranchBuiled ? 'blue' : isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/settings/branches-list" style={{ textDecoration: "underline" }} target="_blank">branches</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isPaymentModeCreated ? doneimage : ''}
                  color={isPaymentModeCreated? 'blue': isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/payment-settings/payment-modes" style={{ textDecoration: "underline" }} target="_blank">payment methods</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isRoleCreated ? doneimage : ''}
                  color={isRoleCreated? 'blue': isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/account/roles-list" style={{ textDecoration: "underline" }} target="_blank">roles</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isUserCreated ? doneimage : ''}
                  color={isUserCreated? 'blue': isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/account/users-list" style={{ textDecoration: "underline" }} target="_blank">users</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isCategoryCreated ? doneimage : ''}
                  color={isCategoryCreated? 'blue': isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/items/categories" style={{ textDecoration: "underline" }} target="_blank">categories</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  label={isItemCreated ? doneimage : ''}
                  color={isItemCreated? 'blue': isBranchApproved ? 'orange' : 'gray'}
                >
                  Add some <Link to="/items/items" style={{ textDecoration: "underline" }} target="_blank">items</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  color={isBranchApproved ? 'orange' : 'gray'}
                >
                  Order on <Link to="/webpos/pos" style={{ textDecoration: "underline" }}>Web POS</Link>
                </Timeline.Item>

                <Timeline.Item
                  style={{ fontSize: 14 }}
                  color={isBranchApproved ? 'orange' : 'gray'}
                >
                  Read <Link to="/report/sales-report" style={{ textDecoration: "underline" }}>reports</Link>
                </Timeline.Item>

              </Timeline>
            </Card>

            {/* ------------------------------- 进度信息 ------------------------------- */}
            <Card
              style={{ marginBottom: 24 }}
              title="Your Companies"
              bordered={false}
              bodyStyle={{ padding: 30 }}
            >
              <CompanyList
                allCandidates={allCompanies}
              />
            </Card>

            {/* <Card
              //className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="How to become a tenant"
              bordered={false}
              //extra={<Link to="/">全部项目</Link>}
              //loading={projectLoading}
              //bodyStyle={{ padding: 0 }}
            >
               {projectNotice.map((item) => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo} />
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card> */}

            {/* <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="Visit history"
              loading={activitiesLoading}
            >
              <List<ActivitiesType>
                loading={activitiesLoading}
                renderItem={(item) => this.renderActivities(item)}
                dataSource={activities}
                className={styles.activitiesList}
                size="large"
              />
            </Card> */}
          </Col>

          {/* ------------------------------- 常见问题 ------------------------------- */}

          <Col xl={10} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title="User Guide"
              bordered={false}
              bodyStyle={{ padding: 20 }}
            >
              <CollapseGroup
              />
            </Card>

            {/* <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card> */}

            {/* <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="团队"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {projectNotice.map((item) => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card> */}
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    dashboardAndworkplace: { 
      allUsers, allItems, currentUser, projectNotice, activities, allRoles,
      radarData, allCandidates, allBranches, allPayments, allCategories },
    loading,
  }: {
    dashboardAndworkplace: ModalState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    currentUser,
    allUsers,
    allRoles,
    allItems,
    allCategories,
    projectNotice,
    activities,
    radarData,
    allBranches,
    allCandidates,
    allPayments,
    currentUserLoading: loading.effects['dashboardAndworkplace/fetchUserCurrent'],
    projectLoading: loading.effects['dashboardAndworkplace/fetchProjectNotice'],
    activitiesLoading: loading.effects['dashboardAndworkplace/fetchActivitiesList'],
  }),
)(Workplace);

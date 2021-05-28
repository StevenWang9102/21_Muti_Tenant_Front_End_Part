import { DownOutlined } from '@ant-design/icons';
import { Col, Select, Row, DatePicker, Menu, Button, Dropdown } from 'antd';
import React, { Component, Suspense } from 'react';
import { Dispatch } from 'redux';
import moment from 'moment';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
// import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import { AnalysisData } from './data.d';
import styles from './style.less';
import { FormattedMessage } from 'umi';
import dateFormat from "dateformat";
import { Top10SoldItemsCard } from '../Analysis/components/Top10SoldItemsCard'
import { CategorySalesCard } from '../Analysis/components/CategorySalesCard'
import { IntroduceRow } from '../Analysis/components/IntroduceRow'
import { PaymentsCard } from '../Analysis/components/PaymentsCard'

const { RangePicker } = DatePicker;

interface DashboardProps {
  dashboard: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface DashboardState {
  paymentsDataType: 'hour' | 'day' | 'week' | 'month' | 'year' | 'mode';
  Top10SoldItemsType: 'Best Selling' | 'Slow Selling';
  // rangePickerValue: RangePickerValue;
  pageHeaderDropdownButtonName: string;
  pageHeaderDropdownButtonClass: string;
  PaymentsCardDropdownButtonName: string;
  PaymentsCardDropdownButtonClass: string;
  rangePickedMode: string;
  rangePickerFormat: string;
}

@connect(
  ({
    dashboard,
    loading,
  }: {
    dashboard: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboard,
    loading: loading.effects['dashboard/fetch'],
  }),
)
class Dashboard extends Component<
DashboardProps,
DashboardState
> {
  state: DashboardState = {
    paymentsDataType: 'hour',
    Top10SoldItemsType: 'Best Selling',
    rangePickerValue: getTimeDistance('today'),
    pageHeaderDropdownButtonName: 'More',
    pageHeaderDropdownButtonClass: '',
    PaymentsCardDropdownButtonName: 'More',
    PaymentsCardDropdownButtonClass: '',
    rangePickedMode: '',
    rangePickerFormat: 'DD-MM-YYYY',
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboard/fetch',
        payload: {
          startdatetime: rangePickerValue[0].format("YYYY-MM-DD"),
          enddatetime: rangePickerValue[1].format("YYYY-MM-DD"),
        }
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  dataSourceMaker = () => {
    const { paymentsDataType } = this.state;
    const { dashboard } = this.props;
    const {
      dailyPaymentsData,
      hourlyPaymentsData,
      weeklkPaymentsData,
      monthlyPaymentsData,
      paymentsByModeData,
    } = dashboard;

    let source;
    
    switch (paymentsDataType) {
      case 'hour':
        source = this.handleHourlyPaymentsData(hourlyPaymentsData);
        break;
      case 'day':
        source = this.handleDailyPaymentsData(dailyPaymentsData);
        break;
      case 'week':
        source = this.handleWeeklyPaymentsData(dailyPaymentsData);
        break;
      case 'month':
        source = this.handleMonthlyPaymentsData(monthlyPaymentsData);
        break;
      case 'year':
        source = this.handleYearlyPaymentsData(monthlyPaymentsData);
        break;
      case 'mode':
        source = this.handlePaymentsByModeData(paymentsByModeData);
        break;
      default:
        break;
    }
    return source;
  };

  handleHourlyPaymentsData = (data) => {
    const temp = [];

    const myObject = {}
    data.forEach((each)=> {
      myObject[each.invoiceHour] = each.totalInclGst
    })

    console.log("handleHourlyPaymentsData, data=", data);
    console.log("handleHourlyPaymentsData, myObject=", myObject);

    for(var i = 1; i<=24; i++){
      temp.push({
        x: `${i}: 00`,
        y: myObject[i] || 0,
      })
    }
    console.log("handleHourlyPaymentsData, temp=", temp);

    return temp;
  }

  handleDailyPaymentsData = (data) => {
    console.log("handleDailyPaymentsData, data=", data);
    const myArray = []

    if(data.length < 5){
      myArray.push({
        x: '',
        y: 0
      })
    } 
    
    data.forEach((each)=> {
      const date = dateFormat(each.invoiceDate, "dd/mm")
      myArray.push({
        x: date,
        y: each.totalInclGst
      })
    })
    
    return myArray;
  }

  handleWeeklyPaymentsData = (data) => {
    console.log("handleWeeklyPaymentsData, data=", data);
    const paymentsdData = [];
    if(data?.length < 4){
      paymentsdData.push({
        x: ``,
        y: 0,
      })
    }


    for (let i = 0; i < data?.length; i += 1) {
      const each = data[i]
      const invoiceDate = data[i].invoiceDate
      console.log("handleWeeklyPaymentsData, each=", each);
      console.log("handleWeeklyPaymentsData, invoiceDate=", invoiceDate);
      console.log("handleWeeklyPaymentsData, week=", moment(invoiceDate).weeks());
      console.log("handleWeeklyPaymentsData, year=", moment(invoiceDate).year());

      const week = moment(invoiceDate).weeks()
      const year = moment(invoiceDate).year()

      paymentsdData.push({
        x: `Week${week}/${year}`,
        y: each.totalInclGst,
      })
    }
    return paymentsdData;
  }

  handleMonthlyPaymentsData = (data) => {
    console.log("handleMonthlyPaymentsData, data=", data);
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemer", "October", "November", "December"]

    var myObject = {}

    data.forEach(each => {
      myObject[each.invoiceMonth] = each.totalInclGst
    });

    const paymentsdData = [];

    for(var i =0; i< 12; i++){
      paymentsdData.push({
        x: monthList[i],
        y: myObject[i+1] || 0,
      })
    }
    console.log("handleMonthlyPaymentsData, myObject=", myObject);
    console.log("handleMonthlyPaymentsData, paymentsdData=", paymentsdData);
    return paymentsdData;

  }

  handleYearlyPaymentsData = (data) => {
    var paymentsdData = [];
    const myObeject = {}
    // 在对应的年份，累加数据

    data.forEach(each => {
      if(myObeject[each.invoiceYear]){
        myObeject[each.invoiceYear] =  myObeject[each.invoiceYear] + each.totalInclGst
      } else {
        myObeject[each.invoiceYear] = each.totalInclGst
      }
    });

    const keys = Object.keys(myObeject)
    keys.forEach(each=>{
      paymentsdData.push({
        x: each,
        y: myObeject[each]
      })
    })
    
    if(paymentsdData.length <= 5) {
      const fil = {x: '', y: 0}
      paymentsdData = [...[fil], ...paymentsdData, ...[fil]]
    }

    console.log("handleYearlyPaymentsData, paymentsdData=", paymentsdData);
    console.log("handleYearlyPaymentsData, myObeject=", myObeject);
    console.log("handleYearlyPaymentsData, keys=", keys);
    console.log("handleYearlyPaymentsData, paymentsdData=", paymentsdData);
    return paymentsdData;
  }

  handlePaymentsByModeData = (data) => {
    const paymentsdData = [];
    for (let i = 0; i < data?.length; i += 1) {
      let x = data[i]?.mode.toString();
      let y = data[i]?.totalInclGst;
      paymentsdData.push({
        x: x,
        y: y,
      });
    }
    return paymentsdData;
  }


  onRangePickerChange = (rangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'dashboard/fetch',
      payload: {
        startdatetime: rangePickerValue[0].format("YYYY-MM-DD"),
        enddatetime: rangePickerValue[1].format("YYYY-MM-DD"),
      },
      callback: ()=>{
        this.dataSourceMaker()
      }
    });
  };

  onDateRangeSelected = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year') => {
    const { dispatch } = this.props;
    const timeRange = getTimeDistance(type);
    
    this.setState({
      rangePickerValue: timeRange,
    });

    this.handlePageHeaderDropdownButton(type);
    console.log('onDateRangeSelected,timeRange1',timeRange[0].format("YYYY-MM-DD"));
    console.log('onDateRangeSelected,timeRange2',timeRange[1].format("YYYY-MM-DD"));

    dispatch({
      type: 'dashboard/fetch',
      payload: {
        startdatetime: timeRange[0].format("YYYY-MM-DD"),
        enddatetime: timeRange[1].format("YYYY-MM-DD"),
      }
    });
  };

  handlePageHeaderDropdownButton = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year') => {
    switch (type) {
      case 'week':
        this.setState({
          pageHeaderDropdownButtonName: 'This Week',
          pageHeaderDropdownButtonClass: styles.pageHeaderCurrentButton,
        });
        break;

      case 'month':
        this.setState({
          pageHeaderDropdownButtonName: 'This Month',
          pageHeaderDropdownButtonClass: styles.pageHeaderCurrentButton,
        });
        break;

      case 'year':
        this.setState({
          pageHeaderDropdownButtonName: 'This Year',
          pageHeaderDropdownButtonClass: styles.pageHeaderCurrentButton,
        });
        break;

      default:
        this.setState({
          pageHeaderDropdownButtonName: 'More',
          pageHeaderDropdownButtonClass: '',
        });
        break;
    }
  };

  isActive = (type: 'today' | 'yesterday' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.pageHeaderCurrentButton;
    }
    return '';
  };

  pageHeader = () => {
    const { rangePickerValue, pageHeaderDropdownButtonName, pageHeaderDropdownButtonClass } = this.state;
    const handleMenuClick = (e) => { this.onDateRangeSelected(e.key); }
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="week" className={this.isActive('week')}><FormattedMessage id="dashboard.analysis.this-week" defaultMessage="This Week" /></Menu.Item>
        <Menu.Item key="month" className={this.isActive('month')}><FormattedMessage id="dashboard.analysis.this-month" defaultMessage="This Month" /></Menu.Item>
        <Menu.Item key="year" className={this.isActive('year')}><FormattedMessage id="dashboard.analysis.this-year" defaultMessage="This Year" /></Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <Button 
            className={this.isActive('today')} 
            onClick={() => this.onDateRangeSelected('today')} >
              <FormattedMessage id="dashboard.analysis.today" defaultMessage="Today" />
          </Button>
          
          <Button 
            className={this.isActive('yesterday')} 
            onClick={() => this.onDateRangeSelected('yesterday')} >
              <FormattedMessage id="dashboard.analysis.yesterday" defaultMessage="Yesterday" />
          </Button>
          
          <Dropdown overlay={menu}>
            <Button className={pageHeaderDropdownButtonClass}>
              {pageHeaderDropdownButtonName} <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <RangePicker
          allowClear={false}
          value={rangePickerValue}
          onChange={this.onRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
  }

  onPaymentTypeChanged = (type: 'hour' | 'day' | 'week' | 'month' | 'year' | 'mode') => {
    this.setState({
      paymentsDataType: type,
    });

    console.log('onPaymentTypeChanged', type);

    switch (type) {

      case 'week':
        this.setState({
          rangePickedMode: '',
          rangePickerFormat: 'DD-MM-YYYY',
          PaymentsCardDropdownButtonName: 'Week',
          PaymentsCardDropdownButtonClass: styles.paymentsCardcurrentButton,
        });
        break;

      case 'month':
        this.setState({
          rangePickerFormat: 'MM-YYYY',
          rangePickedMode: 'month',
          PaymentsCardDropdownButtonName: 'Month',
          PaymentsCardDropdownButtonClass: styles.paymentsCardcurrentButton,
        });
        break;

      case 'year':
        this.setState({
          rangePickedMode: '',
          rangePickerFormat: 'DD-MM-YYYY',
          PaymentsCardDropdownButtonName: 'Year',
          PaymentsCardDropdownButtonClass: styles.paymentsCardcurrentButton,
        });
        break;

      case 'mode':
        this.setState({
          rangePickedMode: '',
          rangePickerFormat: 'DD-MM-YYYY',
          PaymentsCardDropdownButtonName: 'Mode',
          PaymentsCardDropdownButtonClass: styles.paymentsCardcurrentButton,
        });
        break;

      default:
        this.setState({
          rangePickedMode: '',
          rangePickerFormat: 'DD-MM-YYYY',
          PaymentsCardDropdownButtonName: 'More',
          PaymentsCardDropdownButtonClass: '',
        });
        break;
    }
  };

  handlePaymentButtonClass = (type: 'hour' | 'day' | 'week' | 'month' | 'year' | 'mode') => {
    const { paymentsDataType } = this.state;
    if (paymentsDataType == type) {
      return styles.paymentsCardcurrentButton;
    }
    return '';
  };


  handleTop10SoldItemsData = () => {
    const { dashboard: { top10SoldItemsBestSellingData, top10SoldItemsSlowSellingData } } = this.props;
    const { Top10SoldItemsType } = this.state;
    const top10SoldItemsData = Top10SoldItemsType == 'Best Selling' ? top10SoldItemsBestSellingData : top10SoldItemsSlowSellingData;
    const newData = [];
    for (let i = 0; i < top10SoldItemsData?.length; i += 1) {
      newData.push({
        number: i + 1,
        ...top10SoldItemsData[i],
      });
    }
    return newData;
  }


  handleCategorySalesData = () => {
    const { dashboard: { categorySalesData } } = this.props;
    //console.log("handleCategorySalesData, data=", categorySalesData);
    const newData = [];
    for (let i = 0; i < categorySalesData?.length; i += 1) {
      newData.push({
        x: categorySalesData[i].categoryName,
        y: categorySalesData[i].amountInclGst,
      });
    }
    return newData;
  }

  requestTopItemSales = (type) => {

    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;

    dispatch({
      type: 'dashboard/requestTopItemSales',
      payload: {
        type: type,
        startDateTime: rangePickerValue[0].format("YYYY-MM-DD"),
        endDatetime: rangePickerValue[1].format("YYYY-MM-DD"),
      }
    });
  };

  requestCategoryData = (type) => {
    const { dispatch } = this.props;
    const { rangePickerValue } = this.state;

    dispatch({
      type: 'dashboard/requestCategoryData',
      payload: {
        startDateTime: rangePickerValue[0].format("YYYY-MM-DD"),
        endDatetime: rangePickerValue[1].format("YYYY-MM-DD"),
      }
    });
  };

  render() {
    const { dashboard: { }, loading } = this.props;
    console.log("this.props,analysis=", this.props)
    
    return (
      <PageHeaderWrapper
        title="Analysis"
        extra={this.pageHeader()}
      >
        <GridContent>
          <React.Fragment>
            {/* ------------------------------- 第一行 ------------------------------- */}
            <Suspense fallback={<PageLoading />}>
              <IntroduceRow 
                loading={loading}
                dailyPaymentsData={this.props.dashboard.dailyPaymentsData}
              />
            </Suspense>

            {/* ------------------------------- 第二行 ------------------------------- */}
            <Suspense fallback={null}>
              <PaymentsCard
                dataSource={this.dataSourceMaker()}
                dispatch={this.props.dispatch}
                loading={loading}
                dashboard={this.props.dashboard}
                handlePaymentButtonClass={this.handlePaymentButtonClass}
                onPaymentTypeChanged={this.onPaymentTypeChanged}
              />
            </Suspense>

            {/* ------------------------------- 第三行 ------------------------------- */}
            <Row
              gutter={24}
              type="flex"
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
                <Suspense fallback={null}>
                  <Top10SoldItemsCard
                    loading={loading}
                    itemSalesTop10={this.props.dashboard.itemSalesTop10}
                    rangePickerValue={this.state.rangePickerValue}
                    requestTopItemSales={(n)=>{
                      this.requestTopItemSales(n)
                    }}
                    searchType={this.state.Top10SoldItemsType}
                    setTop10SoldItemsType={(m)=>this.setState({Top10SoldItemsType: m})}
                  />
                </Suspense>
              </Col>

              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
                <Suspense fallback={null}>
                  <CategorySalesCard
                    loading={loading}
                    rangePickerValue={this.state.rangePickerValue}
                    categorySalesData={this.props.dashboard.categorySalesData}
                    requestCategoryData={this.requestCategoryData}
                  />
                </Suspense>
              </Col>
            </Row>
          </React.Fragment>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Dashboard;

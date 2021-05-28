import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, message, Row, Select, Tag, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import * as service from './service';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { OrderParams, TableListPagination, TableListParams } from './data.d';
import UnitDollar from '@/utils/UnitDollar';
import ResumeButtons from './components/ResumeButtons';
import { BranchDropDown } from '../components/BranchDropDown'
import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION,  ALL_BEAUTICIAN, MY_STAFF_NAME, MY_STAFF_NAME_LOWER, MY_STAFF_NAME_UPPER}  from '../../../public-component/names'
import sort from 'fast-sort';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
} from '@ant-design/icons';
import styles from './style.less';
import { history } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  obj && Object.keys(obj)
    .map(key => obj[key])
    .join(',');


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'ordersData/fetchOrders'
      | 'ordersData/fetchOneOrder'
      | 'ordersData/resumeOrder'
      | 'ordersData/fetchUsers'
      | 'currentPOSData/fetchOneOrder'
      | 'currentPOSData/isResumeOrder'
      | 'ordersData/fetchLocations'
    >
  >;
  loading: boolean;
  ordersData: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: OrderParams[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<OrderParams>;
  expandedData: OrderParams[];
  currentBranchId: string;
  currentBranchName: string;
  allBranchInformation: any[];
  currentStaffName: string;
  currentLocaitonName: string;
  currentPage: number;
  pagination: Object;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    ordersData,
    loading,
  }: {
    ordersData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    ordersData,
    loading: loading.models.ordersData,
  }),
)

class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    expandedData: [],
    currentBranchId: '',
    currentBranchName: "",
    allBranchInformation: [],
    currentStaffName: '',
    currentLocaitonName: '',
    currentPage:1,
    pagination: {}
  };


  componentDidMount() {
    this.fetchInitialData();
    this.setState({
      currentStaffName: '',
      currentLocaitonName: ''
    })
  }

  fetchInitialData = async () => {
    const { dispatch } = this.props;
    const hide = message.loading('Loading...')
    var branchResponse = await service.fetchBranchesList(undefined);
    console.log('branchResponse 1=', branchResponse);
    branchResponse = branchResponse.filter(each=> !each.isInactive)
    console.log('branchResponse 2=', branchResponse);

    this.setState({
      allBranchInformation: branchResponse,
      currentBranchId: branchResponse[0].id
    });

    hide()

    dispatch({
      type: 'ordersData/fetchOrders',
      payload: {
        pagenumber: 1,
        pagesize: 20,
        branchId: branchResponse[0].id
      },
    });

    dispatch({
      type: 'ordersData/fetchUsers',
    });

    dispatch({
      type: 'ordersData/fetchLocations',
      payload:{
        branchId: branchResponse[0].id
      }
    });
  };

  requestBranchData = (branchId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'ordersData/fetchOrders',
      payload: {
        PageNumber: 1,
        branchId: branchId,
        isInvoiced: false,
      },
    });
  }

  columns: StandardTableColumnProps[] = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      width: "6%"
    },

    {
      title: 'Operator',
      dataIndex: 'currentStartUserName',
      width: "10%",
      render: (value, index) => (
        <div style={{ fontWeight: 500, color: 'blue' }}> {value} </div>
      ),
    },

    {
      title: 'Start Date',
      dataIndex: 'startDateTime',
      width: "18%",
      render: value => moment(value).format('DD/MM/YYYY, hh:mm a'),
    },

    {
      title: 'Customer',
      dataIndex: 'customerName',
      render(value) {
      return <Tag color="green">{value}</Tag>;
      },
    },

    
    {
      title: `${MY_STAFF_NAME_UPPER}`,
      dataIndex: 'beauticianName',
      width: "12%",
      render: (value, index) => (
        <Tag color="orange"> {value} </Tag>
      ),
    },

    {
      title: 'Location',
      dataIndex: 'currentLocationName',
      width: "12%",
      render: (value, index) => (
        <Tag color="green"> {value} </Tag>
      ),
    },

    {
      title: 'Sales Total',
      dataIndex: 'totalInclGst',
      width: "10%",
      render: val => (
        <Tag color="geekblue">
          <UnitDollar decimalPoint=".00">{val}</UnitDollar>
        </Tag>
      ),
    },

    {
      title: 'Action',
      width: "14%",
      render: (text, record) => {
        
        const ActionButtonsMethods = { 
          handleResumeOrder: this.handleResumeOrder 
        };

        return (
          <ResumeButtons
            record={record}
            {...ActionButtonsMethods}
          />
        )
      },
    },
  ];

  handleResumeOrder = record => {
    console.log("handleResumeOrder record=", record);
    this.setLastOrder(record.id);
    history.push('/webpos/pos');

    const { dispatch } = this.props;

    const orderId = record.id
    const branchId = record.branchId

    this.setState({
      currentBranchId: branchId
    })

    dispatch({
      type: 'currentPOSData/isResumeOrder',
      payload: true
    });

    dispatch({
      type: 'currentPOSData/fetchOneOrder',
      payload: {
        orderId: orderId,
        branchId: branchId,
      },
    });

    // this.props.setCurrentCustomerId()

  };

  setLastOrder = (orderId: number) => {
    localStorage.setItem('pos-last-order', orderId.toString());
    return;
  };


  handleFormReset = () => {
    const { dispatch, form } = this.props;

    form.resetFields();
    this.setState({
      formValues: {},
      currentPage: 1,
      currentStaffName: '',
      currentLocaitonName: '',
      pagination: {}
    });

    const pagination = {pagenumber: 1, pagesize: 20}

    form.validateFields((err, fieldsValue) => {
      // 请求
      dispatch({
        type: 'ordersData/fetchOrders',
        payload: {
          branchId: this.state.currentBranchId,
          ...pagination,
        },
      })
    });

  };

  onPageButtonClick = (pagination) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log("handleSearch,err=", err);
      console.log("handleSearch,fieldsValue=", fieldsValue);
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      });

      // 请求
      dispatch({
        type: 'ordersData/fetchOrders',
        payload: {
          branchId: this.state.currentBranchId,
          ...pagination,
          search: { 
            ...fieldsValue, 
            ...{ 
              staff: this.state.currentStaffName,
              location: this.state.currentLocaitonName
            } 
          },
        },
      })
    });
  }

  handleOneOrder = (orderId: number) => {
    const { dispatch } = this.props;
    const { expandedData } = this.state;

    dispatch({
      type: 'ordersData/fetchOneOrder',
      payload: {
        id: orderId,
        branchId: this.state.currentBranchId,
      },
      callback: (res: OrderParams) => {
        console.log('res002=', res);

        let currentExpandedData = expandedData;
        const newExpandedData = [...currentExpandedData, res];
        console.log('handleOneOrder,currentExpandedData=', currentExpandedData);
        console.log('handleOneOrder,newExpandedData=', newExpandedData);
        this.setState({
          expandedData: newExpandedData,
        });
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = (rows: OrderParams[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  setCurrentPage=(n)=>{
    this.setState({
      currentPage: n
    })
  }

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      console.log("handleSearch,err=", err);
      console.log("handleSearch,fieldsValue=", fieldsValue);
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
        pagination: {},
        currentPage: 1,
      });

      const pagination =  {
          pagenumber: 1,
          pagesize: 20
        }
      
      dispatch({
        type: 'ordersData/fetchOrders',
        payload: {
          branchId: this.state.currentBranchId,
          pagination,
          search: { 
            ...fieldsValue, 
            ...{ 
              staff: this.state.currentStaffName,
              location: this.state.currentLocaitonName
            } 
          },
        },
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderForm() {
    const {
      ordersData: { data },
      form: { getFieldDecorator },
    } = this.props;

    const { expandForm } = this.state;
    const type = expandForm ? 'Advanced' : 'Simple'

    console.log('data.usersList', data.usersList);

    return (
      <Form layout="inline">
        {/* ------------------------------------ Simple ------------------------------------ */}
        { type == 'Simple' ? <Row style={{ marginBottom: '20px' }} gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={10} sm={24}>
            <FormItem label="Date Range">
              {getFieldDecorator('status')(
                <RangePicker
                  style={{width: 245}}
                  format={'DD/MM/YYYY'}
                  allowClear={false}
                />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="Staff">
              {getFieldDecorator('staffId')(
                <Select
                  placeholder="Select a staff"
                  style={{ width: '180px' }}
                  onChange={(value, options) => {
                    console.log('Staffselect,value', value);
                    console.log('Staffselect,options', options);
                    const staffName = `${options.children}`
                    this.setState({
                      currentStaffName: staffName
                    })
                  }}
                >
                  {data.usersList?.map(({ id, firstName, middleName, lastName }) => {
                    console.log('middleName', middleName);

                    return (
                      <Option key={id}>
                        {middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Col>


          <Col md={6} sm={24}>
            <div className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
                Search
              </Button>

              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>

              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Expand <DownOutlined style={{height: 5}}/>
              </a>

            </div>
          </Col>

        </Row> :

          // ------------------------------------ Advanced ------------------------------------ */}
          <section>
          <Row style={{ marginBottom: '20px' }} gutter={{ md: 8, lg: 24, xl: 48 }}>

            <Col md={9} sm={24}>
              <FormItem label="Date Range">
                {getFieldDecorator('status')(
                  <RangePicker
                    style={{width: 245}}
                    format={'DD/MM/YYYY'}
                    allowClear={false}
                  />)}
              </FormItem>
            </Col>

            <Col md={6} sm={24}>
              <FormItem label="Staff">
                {getFieldDecorator('staffId')(
                  <Select
                    placeholder="Select a staff"
                    style={{ width: '170px' }}
                    onChange={(value, options) => {
                      console.log('Staffselect,value', value);
                      console.log('Staffselect,options', options);
                      const staffName = `${options.children}`
                      this.setState({
                        currentStaffName: staffName
                      })
                    }}
                  >
                    {data.usersList?.map(({ id, firstName, middleName, lastName }) => {
                      console.log('middleName', middleName);

                      return (
                        <Option key={id}>
                          {middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={24}>
              <FormItem label="Location">
                {getFieldDecorator('locationId')(
                  <Select
                    placeholder="Select a location"
                    style={{ width: '170px' }}
                    onChange={(value, options) => {
                      console.log('location,select,value', value);
                      console.log('location,select,options', options);

                      const locationName = options.children
                      this.setState({
                        currentLocaitonName: locationName
                      })
                    }}
                  >
                    {data.locationsList?.map((each) => {
                      return (
                        <Option key={each.id}>
                          {each.name}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginBottom: '20px' }} gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col offset={15} md={6} sm={24}>
              <div className={styles.submitButtons}>
                <Button type="primary" onClick={this.handleSearch}>
                  Search
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  Reset
                </Button>

                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  Back <UpOutlined style={{height: 5}}/>
                </a>
              </div>
            </Col>
          </Row>

          </section>
          }
      </Form>
    );
  }


  newOrderList = () => {
    const { ordersData: { data }, } = this.props;
    console.log('newOrderList this.props=', this.props);
    const orderList = data.ordersList;
    return orderList && orderList.length ? orderList : undefined;
  };

  render() {
    const {
      ordersData: { data },
      loading,
    } = this.props;
    console.log('sales ordered props', this.props.ordersData);

    const { selectedRows, expandedData } = this.state;
    const datas = {
      list: this.newOrderList(),
      expandedData: expandedData,
      pagination: data.pagination ? data.pagination : {},
    };

    return (
      <section style={{ backgroundColor: 'white' }}>
        <Row gutter={24} style={{ padding: '10px 10px', margin: '0 5px' }}>
          <BranchDropDown
            dispatch={this.props.dispatch}
            requestBranchData={this.requestBranchData}
            currentBranchName={this.state.currentBranchName}
            allBranchInformation={this.state.allBranchInformation}
            setSelectedBranchId={(n) => {
              this.setState({ currentBranchId: n });
            }}
            setCurrentBranchName={(n) => {
              this.setState({ currentBranchName: n });
            }}
          />
        </Row>

        <Card bordered={false} style={{marginTop: -20}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <StandardTable
              dispatch={this.props.dispatch}
              totalCount={data.totalCount}
              selectedRows={selectedRows}
              loading={loading}
              data={datas}
              columns={this.columns}
              pagination={this.state.pagination}
              setPagination={(n)=>this.setState({pagination: n})}
              onPageButtonClick={this.onPageButtonClick}
              currentPage={this.state.currentPage}
              setCurrentPage={(page)=>this.setState({currentPage: page})}
              onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
              onHandleOneOrder={this.handleOneOrder}
            />
          </div>
        </Card>
      </section>
    );
  }
}

export default Form.create<TableListProps>()(TableList);

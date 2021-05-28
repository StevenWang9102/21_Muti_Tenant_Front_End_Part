import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, message, Row, Select, Tag, DatePicker } from 'antd';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import moment from 'moment';
import * as service from './service';
import { StateType } from './model';
import { BranchDropDown } from '../components/BranchDropDown'
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import {
  InvoiceParams,
  TableListPagination,
  TableListParams,
} from './data.d';
import UnitDollar from '@/utils/UnitDollar';
import ResumeButtons from './components/ResumeButtons';

import styles from './style.less';
import { history } from 'umi';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  obj && Object.keys(obj)
    .map(key => obj[key]).join(',');


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'InvoicesPendingData/fetchInvoices'
      | 'InvoicesPendingData/fetchOneInvoice'
      | 'InvoicesPendingData/searchInvoices'
      | 'InvoicesPendingData/resumeOrder'
      | 'InvoicesPendingData/fetchUsers'
      | 'currentPOSData/fetchOneOrder'
      | 'currentPOSData/fetchOneInvoice'
    >
  >;
  loading: boolean;
  InvoicesPendingData: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: InvoiceParams[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<InvoiceParams>;
  expandedData: InvoiceParams[];
  currentBranchId: string;
  currentBranchName: string;
  allBranchInformation: any[];
  currentStaffName: string;
  currentPage: number;
  pagination: object;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    InvoicesPendingData,
    loading,
  }: {
    InvoicesPendingData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    InvoicesPendingData,
    loading: loading.models.InvoicesPendingData,
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
    pagination: {pagenumber: 1, pagesize: 20},
    currentPage: 1,
  };

  componentDidMount() {
    this.fetchBranchData();
  }

  fetchBranchData = async () => {
    const { dispatch } = this.props;
    const hide = message.loading('Loading...')
    const branchResponse = await service.fetchBranchesList(undefined);
    console.log('branchResponse=', branchResponse);

    this.setState({
      allBranchInformation: branchResponse,
    });

    hide()
    const pagination = { pagenumber: 1, pagesize: 20}

    dispatch({
      type: 'InvoicesPendingData/fetchInvoices',
      payload: {
        ...pagination,
        branchId: branchResponse[0].id,
      },
    });

    dispatch({
      type: 'InvoicesPendingData/fetchUsers',
    });

  };

  requestBranchData=( branchId )=>{
    const { dispatch } = this.props;
    const pagination = { pagenumber: 1, pagesize: 20}
    
    dispatch({
      type: 'InvoicesPendingData/fetchInvoices',
      payload: {
        ...pagination,
        branchId: branchId,
      },
    });
  }


  columns: StandardTableColumnProps[] = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
    },

    {
      title: 'Operator',
      dataIndex: 'currentStartUserName',
      width: '13%',
      render: value => (
        <div style={{fontWeight: 500}}>
          {value}
        </div>
      ),
    },

    {
      title: 'Open Date',
      dataIndex: 'startDateTime',
      render: value => moment(value).format('DD/MM/YYYY, hh:mm a'),
    },

    {
      title: 'Balance',
      dataIndex: 'balanceInclGst',
      render: val => (
        <Tag color="geekblue">
          <UnitDollar decimalPoint=".00">{val}</UnitDollar>
        </Tag>
      ),
    },

    {
      title: 'Total',
      dataIndex: 'totalInclGst',
      render: val => (
        <Tag color="geekblue">
          <UnitDollar decimalPoint=".00">{val}</UnitDollar>
        </Tag>
      ),
    },


    // {
    //   title: 'Status',
    //   dataIndex: 'isPaid',
    //   render: (value: number)=>{
    //       return <Tag color='red'>Invoiced, Unpaid</Tag>;
    //   }
    // },

    {
      title: 'Customer',
      dataIndex: 'customerName',
      render(value) {
      return <Tag color="green">{value}</Tag>;
      },
    },
    
    {
      title: 'Action',
      render: (text, record) => this.ActionButton(record),
    },
  ];

  onPageButtonClick = (pagination) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log("onPageButtonClick,err=", err);
      console.log("onPageButtonClick,fieldsValue=", fieldsValue);
      if (err) return;
      this.setState({
        formValues: { ...fieldsValue },
      });

      dispatch({
        type: 'InvoicesPendingData/fetchInvoices',
        payload: {
          branchId: this.state.currentBranchId,
          ...pagination,
          search: fieldsValue,
        },
      })
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      currentPage: 1,
      formValues: {},
    });

    const pagination = { pagenumber: 1, pagesize: 20}

    dispatch({
      type: 'InvoicesPendingData/fetchInvoices',
      payload: {
        branchId: this.state.currentBranchId,
        ...pagination,
      },
    })
  };

  ActionButton(record) {
    const ActionButtonsMethods = {
      handleResumeOrder: this.handleResumeOrder,
    };
    return <ResumeButtons record={record} {...ActionButtonsMethods} />;
  }


  handleResumeOrder = record => {
    console.log("record222=", record);
    this.setLastOrder(record.orderId);
    history.push('/webpos/pos');
    const { dispatch } = this.props;

    // 这里应该渲染左边的列表
    const orderId = record.orderId
    const invoiceId = record.id
    const branchId = record.branchId

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

      callback: () => {
        // 请求当前Invoice的数据
        dispatch({
          type: 'currentPOSData/fetchOneInvoice',
          payload: {
            orderId: orderId,
            branchId: branchId,
            invoiceId: invoiceId,
          },
        });
      },
    });
  };

  setLastOrder = (orderId: number) => {
    localStorage.setItem('pos-last-order', orderId.toString());
    return;
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof InvoiceParams, string[]>,
    sorter: any,
  ) => {
  };

 

  requestOneOrder = (record: any) => {
    console.log('requestOneOrder, record 790', record);

    const { dispatch } = this.props;
    dispatch({
      type: 'InvoicesPendingData/fetchOneInvoiceByInvoiceId',
      payload: {
        orderId: record.orderId,
        invoiceId: record.id
      },
      callback: (res: InvoiceParams) => {
        console.log('requestOneOrder,res0001=', res);

        let temp = this.state.expandedData;
        const newExpandedData = [...temp, res];
        console.log('requestOneOrder,currentExpandedData=', temp);
        console.log('requestOneOrder,newExpandedData=', newExpandedData);

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

  handleSelectRows = (rows: InvoiceParams[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      console.log("handleSearch,err=",err);
      console.log("handleSearch,fieldsValue=",fieldsValue);
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      const pagination = { pagenumber: 1, pagesize: 20}

      this.setState({
        formValues: values,
        currentPage: 1,
        pagination: pagination,
      });

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    
    dispatch({
        type: 'InvoicesPendingData/fetchInvoices',
        payload: {
          branchId: this.state.currentBranchId,
          ...pagination,
          search: {...fieldsValue, ...{staff: this.state.currentStaffName}},
        },
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      InvoicesPendingData: { data },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" style={{marginBottom: 20}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={14} sm={24}>
            <FormItem label="Date Range">{
              getFieldDecorator('status')(
              <RangePicker 
                format={'DD/MM/YYYY'}
                allowClear={false}
                />)}</FormItem>
          </Col>
        

          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch} >
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>

        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      InvoicesPendingData: { data },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  newOrderList = () => {
    const {
      InvoicesPendingData: { data },
    } = this.props;
    const invoicesList = data.invoicesList;

    console.log('newInvoicesList', invoicesList);
  
    return invoicesList && invoicesList.length ? invoicesList : undefined;
  };

  render() {
    const {
      InvoicesPendingData: { data },
      loading,
    } = this.props;
    console.log('sales pending props', this.props);
    const { selectedRows, expandedData } = this.state;

    const datas = {
      list: this.newOrderList(),
      expandedData: expandedData,
      pagination: data.pagination ? data.pagination : {},
    };

    console.log('datas,', datas);
    
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
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <StandardTable
              InvoicesPendingData={this.props.InvoicesPendingData}
              selectedRows={selectedRows}
              loading={loading}
              datas={datas}
              columns={this.columns}
              currentPage={this.state.currentPage}
              setCurrentPage={(n)=>this.setState({currentPage: n})}
              pagination={this.state.pagination}
              setPagination={(m)=> this.setState({ pagination: m})}
              onPageButtonClick={this.onPageButtonClick}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              requestOneOrder={this.requestOneOrder}
            />
            
        </Card>
      </section>

    );
  }
}

export default Form.create<TableListProps>()(TableList);

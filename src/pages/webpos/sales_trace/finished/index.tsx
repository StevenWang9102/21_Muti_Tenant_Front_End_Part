import { getToken } from '@/utils/authority';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Modal, Row, Select, Tag, DatePicker, message } from 'antd';
import React, { Component } from 'react';
import { Dispatch, Action } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import ResumeButtons from './components/ResumeButtons';
import { BranchDropDown } from '../components/BranchDropDown';
import { InvoiceParams, TableListPagination, TableListParams } from './data.d';
import UnitDollar from '@/utils/UnitDollar';
import PrintReceiptServer from './components/ServerPrinter'
import PrintReceiptBrowser from './components/BrowserPrinterForInovice'
import * as service from './service';
import styles from './style.less';
import { history } from 'umi';
import sort from 'fast-sort';
import html2canvas from 'html2canvas';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const getValue = (obj: { [x: string]: string[] }) =>
  obj &&
  Object.keys(obj)
    .map((key) => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'InvoicesFinishedData/fetchInvoices'
      | 'InvoicesFinishedData/fetchOneOrder'
      | 'InvoicesFinishedData/fetchOneInvoice'
      | 'InvoicesFinishedData/searchInvoices'
      | 'InvoicesFinishedData/resumeOrder'
      | 'InvoicesFinishedData/fetchOneOrderMuti'
      | 'currentPOSData/isResumeOrder'
    >
  >;
  loading: boolean;
  InvoicesFinishedData: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  record: any;
  selectedRows: InvoiceParams[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<InvoiceParams>;
  expandedData: InvoiceParams[];
  expandRowByClick: boolean;
  currentBranchId: string;
  currentBranchName: string;
  allBranchInformation: any[];
  allOrders: any[];
  multiOrderDetails: any;
  currentPage: number;
  isPrinterSuccess: boolean;
  allInformation: any;
  oneBranchInfo: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    InvoicesFinishedData,
    loading,
  }: {
    InvoicesFinishedData: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    InvoicesFinishedData,
    loading: loading.models.InvoicesFinishedData,
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
    expandRowByClick: true,
    currentBranchId: '',
    record: {},
    currentBranchName: '',
    allOrders: [],
    isPrinterSuccess: false,
    allBranchInformation: [],
    multiOrderDetails: {},
    currentPage: 1,
    allInformation: [],
    oneBranchInfo: {},
  };

  componentDidMount() {
    this.fetchInitialData();
  }

  multiOrders = [];

  fetchInitialData = async () => {
    const hide = message.loading('Loading...')

    let branchResponse = await service.fetchBranchesList(undefined);
    sort(branchResponse).asc(each => each.shortName)
    branchResponse = branchResponse.filter(each=>each.isInactive == false)

    console.log('fetchInitialData,branchResponse', branchResponse);

    if(branchResponse[0]){

      const defaultBranchId = branchResponse[0].id
      this.requestOneBranchInfo(defaultBranchId);
      this.fetchOneBranchInfo(defaultBranchId)

      const invoiceList = await service.fetchInvoices({
        PageNumber: 1,
        branchId: defaultBranchId,
      });
      console.log('fetchInitialData,invoiceList', invoiceList);

      this.setState({
        allBranchInformation: branchResponse,
        currentBranchId: defaultBranchId,
      });
    }
    hide()
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
    },

    {
      title: 'Operator',
      dataIndex: 'currentStartUserName',
      render: (value) => <div style={{ fontWeight: 500 }}>{value}</div>,
    },

    {
      title: 'Open Date',
      dataIndex: 'startDateTime',
      render: (value) => moment(value).format('DD/MM/YYYY, hh:mm a'),
    },

    {
      title: 'Close Date',
      dataIndex: 'endDateTime',
      render: (value) => moment(value).format('DD/MM/YYYY, hh:mm a'),
    },

    {
      title: 'Total',
      dataIndex: 'totalInclGst',
      render: (val) => (
        <Tag color="geekblue">
          <UnitDollar decimalPoint=".00">{val}</UnitDollar>
        </Tag>
      ),
    },

    {
      title: 'Gst Amount',
      dataIndex: 'gstAmount',
      render: (val) => (
        <Tag color="blue">
          <UnitDollar decimalPoint=".00">{val}</UnitDollar>
        </Tag>
      ),
    },

    {
      title: 'Customer',
      dataIndex: 'customerName',
      render(value) {
      return <Tag color="green">{value}</Tag>;
      },
    },

    {
      title: 'Action',
      render: (text, record) => {

      const methods = {
        handleEmailInvoice: this.handleEmailInvoice,
        handleRefundOrder: this.handleRefundOrder1,
      };

        return (
          <ResumeButtons
            dispatch={this.props.dispatch}
            fetchOneInvoice={this.fetchOrderInvoice}
            invoiceData={this.props.InvoicesFinishedData.data}
            record={record}
            multiOrderDetails={this.state.multiOrderDetails}
            fetchOneOrder={this.fetchOneOrder}
            isPrinterSuccess={this.state.isPrinterSuccess}
            setVisible={(m)=>this.setState({modalVisible: m})}
            setRecord={(m)=>{ this.setState({record: m}) }}
            {...methods}
          />
        );
      },
    },
  ];

  onPageButtonClick = (page) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log('onPageButtonClick,err=', err);
      console.log('onPageButtonClick,fieldsValue=', fieldsValue);
      if (err) return;

      this.setState({
        formValues: { ...fieldsValue },
      });

      dispatch({
        type: 'InvoicesFinishedData/fetchInvoices',
        payload: {
          PageNumber: page,
          branchId: this.state.currentBranchId,
          search: fieldsValue,
        },
      });
    });
  };

  handleEmailInvoice = (record) => {
    console.log('handleEmailInvoice,record', record);
  };

  fetchOneOrderMuti = (record) => {
    const { dispatch } = this.props;

    const orderId = record.orderId;
    const branchId = record.branchId;

    dispatch({
      type: 'InvoicesFinishedData/fetchOneOrderMuti',
      payload: {
        orderId: orderId,
        branchId: branchId,
      },
      callback: (res)=>{
        var temp = {...this.state.multiOrderDetails}
        temp[res.id] = res

        this.setState({
          multiOrderDetails: temp
        })
      }
    });
  };

  fetchOneOrder = (record) => {
    const { dispatch } = this.props;

    const orderId = record.orderId;
    const branchId = record.branchId;

    dispatch({
      type: 'InvoicesFinishedData/fetchOneOrder',
      payload: {
        orderId: orderId,
        branchId: branchId,
      },
    });
  };

  fetchOrderInvoice = (record) => {
    const { dispatch } = this.props;
    // 这里应该渲染左边的列表
    const orderId = record.orderId;
    const branchId = record.branchId;
    const invoiceId = record.id;

    dispatch({
      type: 'InvoicesFinishedData/fetchOrderInvoice',
      payload: {
        orderId: orderId,
        branchId: branchId,
        invoiceId: invoiceId,
      },
    });
  };

  handleRefundOrder1 = (record) => {
    console.log('record222=', record);
    this.setLastOrder(record.orderId);
    history.push('/webpos/pos');
    const { dispatch } = this.props;

    dispatch({
      type: 'currentPOSData/isResumeOrder',
      payload: true
    });

    // 这里应该渲染左边的列表
    const orderId = record.orderId;
    const invoiceId = record.id;
    const branchId = record.branchId;
    
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

  handleResumeOrder = (record) => {
    this.setLastOrder(record.orderId);
    history.push('/webpos/pos');
    const { dispatch } = this.props;
        
    dispatch({
      type: 'currentPOSData/isResumeOrder',
      payload: true
    });
  };

  requestBranchData = (branchId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'InvoicesFinishedData/fetchInvoices',
      payload: {
        PageNumber: 1,
        branchId: branchId,
      },
    });

    this.requestOneBranchInfo(branchId);
  };

  requestOneBranchInfo = (branchId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'InvoicesFinishedData/fetchOneBranch',
      payload: {
        branchId: branchId
      }
    });
  }

  fetchOneBranchInfo = ( branchId ) =>{
    const { dispatch } = this.props;

    dispatch({
      type: 'receiptPrinting/fetchOneBranch',
      payload: {
        branchId: branchId,
      },
      callback: (res) => {
        console.log('fetchOneBranch188,res', res);
        this.setState({
          oneBranchInfo: res,
        })
      },
    });
  }

  setLastOrder = (orderId: number) => {
    localStorage.setItem('pos-last-order', orderId.toString());
    return;
  };


  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof InvoiceParams, string[]>,
    sorter: any,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'InvoicesFinishedData/fetchInvoices',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    this.fetchInitialData();
    form.resetFields();
    this.setState({
      currentPage: 1,
      formValues: {},
    });
  };

  handleOneOrder = (orderId: number) => {
    const { dispatch } = this.props;
    const { expandedData } = this.state;
    dispatch({
      type: 'InvoicesFinishedData/fetchOneInvoice',
      payload: { id: orderId },
      callback: (res: InvoiceParams) => {
        let currentExpandedData = expandedData;
        const newExpandedData = [...currentExpandedData, res];

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

      if (err) return;
      this.setState({
        formValues: {...fieldsValue},
        currentPage: 1,
      });

      dispatch({
        type: 'InvoicesFinishedData/fetchInvoices',
        payload: {
          branchId: this.state.currentBranchId,
          PageNumber: 1,
          search: fieldsValue,
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
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom: 20, marginTop: -30}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24}>
            <FormItem label="Date Range">
              {getFieldDecorator('status')(
                <RangePicker format={'DD/MM/YYYY'} allowClear={false} />,
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
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
      InvoicesFinishedData: { data },
    } = this.props;

    console.log('this.props482', this.props);
    const invoicesList = data.invoicesList;
    const newInvoicesList = [];
    for (const i in invoicesList) {
      const c = invoicesList[i];
      newInvoicesList.push({
        status: 2,
        ...c,
      });
    }
    return newInvoicesList.length ? newInvoicesList : undefined;
  };

  openBrowerPrinter = () =>{

    var root = document.getElementById('PrintReceiptBrowser')
    var print = document.getElementById("ifmcontentstoprint").contentWindow;
    
    console.log('openBrowerPrinter,root', root.style.width);
    
    print.document.open();
    print.document.write(root.innerHTML);
    print.document.close();
    print.focus();
    print.print();
  }


  render() {
    const {
      InvoicesFinishedData: { data },
      loading,
    } = this.props;
    console.log('sales finished props', this.props);
    const { selectedRows, expandedData, expandRowByClick } = this.state;
    console.log('sales finished state', expandRowByClick);
    console.log('sales finished record', this.state.record);

    // record

    const datas = {
      list: this.newOrderList(),
      expandedData: expandedData,
      pagination: data.pagination ? data.pagination : {},
    };


    return (
      <section style={{ backgroundColor: 'white', marginTop: 50 }}>
        <iframe 
          id="ifmcontentstoprint" 
          style={{
            height: 0,
            width: 0,
            position: 'absolute'
            }}>
        </iframe>

        {/* ---------------------- 用于服务器打印 ---------------------- */}
        <PrintReceiptServer
          dispatch={this.props.dispatch}
          token={getToken()}
          oneBranchInfoForPrinter={this.state.oneBranchInfo}
          openBrowerPrinter={()=>this.openBrowerPrinter()}
          setAllInformation={(m)=>this.setState({allInformation: m})}
          record={this.state.record || {}}
          visible={this.state.modalVisible}
          setVisible={()=>this.setState({modalVisible: false})}
          setIsPrinterSuccess={(n)=>this.setState({isPrinterSuccess: n})}
        />

        {/* ---------------------- 用于浏览器打印 ---------------------- */}
        <PrintReceiptBrowser
          dispatch={this.props.dispatch}
          oneBranchInfoForPrinter={this.state.oneBranchInfo}
          allInformation={this.state.allInformation}
          token={getToken()}
          record={this.state.record || {}}
          visible={this.state.modalVisible}
          setVisible={()=>this.setState({modalVisible: false})}
          setIsPrinterSuccess={(n)=>this.setState({isPrinterSuccess: n})}
        />

        <Row gutter={100} style={{ padding: '10px 10px', margin: '0 5px' }}>
          <BranchDropDown
            dispatch={this.props.dispatch}
            requestBranchData={this.requestBranchData}
            fetchOneBranchInfo={this.fetchOneBranchInfo}
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


        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              InvoicesFinishedData={this.props.InvoicesFinishedData}
              selectedRows={selectedRows}
              loading={loading}
              data={datas}
              columns={this.columns}
              expandRowByClick={expandRowByClick}
              onSelectRow={this.handleSelectRows}
              currentPage={this.state.currentPage}
              setCurrentPage={(m)=>this.setState({currentPage: m})}
              onPageButtonClick={this.onPageButtonClick}
              onChange={this.handleStandardTableChange}
              onHandleOneOrder={this.handleOneOrder}
            />
          </div>
        </Card>

      </section>
    );
  }
}

export default Form.create<TableListProps>()(TableList);

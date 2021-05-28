import { Table, Row, Col, Descriptions, Tag, Divider } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, CSSProperties } from 'react';
import UnitDollar from '@/utils/UnitDollar';
import { InvoiceParams } from '../../data.d';
import styles from './index.less';
import moment from 'moment';
import { Pagination } from 'antd';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  expandRowByClick: boolean;
  data: {
    list: InvoiceParams[];
    expandedData: InvoiceParams[];
    pagination: StandardTableProps<InvoiceParams>['pagination'];
  };
  selectedRows: InvoiceParams[];
  InvoicesFinishedData: any;
  onSelectRow: (rows: any) => void;
  onHandleOneOrder: (orderId: number) => void;
  onPageButtonClick: (page: number) => void;
}

export interface StandardTableColumnProps extends ColumnProps<InvoiceParams> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  expandedRowKeys: string[];
  selectedRowKeys: string[];
  currentPage: number;
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<InvoiceParams>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<InvoiceParams>) {
    console.log('getDerivedStateFromProps,nextProps=', nextProps);
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<InvoiceParams>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      expandedRowKeys: [],
      selectedRowKeys: [],
      needTotalList,
      currentPage: 1,
    };
  }

  handleRowSelectChange: TableRowSelection<InvoiceParams>['onChange'] = (
    selectedRowKeys,
    selectedRows: InvoiceParams[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<InvoiceParams>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  handleTableExpand = (expanded: boolean, record: { id: number }) => {
    console.log('handleTableExpand');
    const { onHandleOneOrder } = this.props;
    const {
      data: { expandedData = [] },
    } = this.props;
    let keys: string[] = [];
    console.log(expandedData);
    if (expanded) {
      keys.push(record.id.toString());
      const expandedOrder =
        expandedData.length > 0 ? expandedData.find(invoice => invoice.id === record.id) : null;
      console.log('handleTableExpand,expandedOrder=', expandedOrder);
      if (expandedOrder === null || expandedOrder === undefined) onHandleOneOrder(record.id);
    }
    console.log(keys);
    this.setState({ expandedRowKeys: keys });
  };

  handleExpandedRowsChange = () => {
    console.log('handleExpandedRowsChange');
    this.setState({
      //expandedRowKeys: currentExpandedRowsKeys,
    });
  };

  expandedRowRender = (record: { id: number }) => {
    console.log('expandedRowRender');
    const {
      data: { expandedData = [] },
    } = this.props;
    const columns = [
      { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      {
        title: 'Normal Price (Incl. GST)',
        dataIndex: 'normalPriceInclGst',
        key: 'normalPriceInclGst',
        render: val => (
          <Tag color="purple">
            <UnitDollar decimalPoint=".00">{val}</UnitDollar>
          </Tag>
        ),
      },
      {
        title: 'Sales Price (Incl. GST)',
        dataIndex: 'commitPriceInclGst',
        key: 'commitPriceInclGst',
        render: val => (
          <Tag color="geekblue">
            <UnitDollar decimalPoint=".00">{val}</UnitDollar>
          </Tag>
        ),
      },
    ];

    const expandedInvoice =
      expandedData.length > 0 ? expandedData.find(invoice => invoice.id === record.id) : null;
    const orderItems = expandedInvoice ? expandedInvoice['order']['orderItems'] : [];
    const paymentFooterDetailLeftStyle: CSSProperties = {
      marginLeft: '10px',
    };

    const paymentFooterDetailRightStyle: CSSProperties = {
      float: 'right',
      fontWeight: 500,
      marginRight: '0px',
    };
    const paymentDetail = expandedInvoice
      ? expandedInvoice['payments'].map(({ paymentModeName, dateTime, amount }, index) => (
          <>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <span style={paymentFooterDetailLeftStyle}>
                  {paymentModeName}
                  <span style={{ marginLeft: '10px', fontSize: '10px', display: 'block' }}>
                    {moment(dateTime).format('DD-MM-YYYY HH:mm:ss')}
                  </span>
                </span>
              </Col>
              <Col span={12}>
                <span style={paymentFooterDetailRightStyle}>
                  <UnitDollar decimalPoint=".00">{amount}</UnitDollar>
                  <span style={{ display: 'block' }}>&nbsp;</span>
                </span>
              </Col>
            </Row>
            {expandedInvoice['payments'].length - 1 != index ? (
              <Divider style={{ margin: 10 }} />
            ) : null}
          </>
        ))
      : null;
    return (
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Table columns={columns} dataSource={orderItems} pagination={false} />
        </Col>
        <Col span={12}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Subtotal">
              <UnitDollar decimalPoint=".00">{expandedInvoice?.totalInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Included Tax">
              <UnitDollar decimalPoint=".00">{expandedInvoice?.gstAmount}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Discount">
              <UnitDollar decimalPoint=".00">{expandedInvoice?.priceCutInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Items Total">
              <UnitDollar decimalPoint=".00">{expandedInvoice?.priceCutInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item
              className={styles.expandedTotal}
              label={<span className={styles.expandedTotal}>Sales Total</span>}
            >
              <UnitDollar decimalPoint=".00">{expandedInvoice?.totalInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item
              className={styles.expandedTotal}
              label={<span className={styles.expandedTotal}>Balance</span>}
            >
              <UnitDollar decimalPoint=".00">{expandedInvoice?.balanceInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Payments" span={2}>
              {paymentDetail}
            </Descriptions.Item>
            <Descriptions.Item label="Note" span={2}>
              {expandedInvoice?.note}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    );
  };

  componentDidUpdate() {
    const { expandedRowKeys } = this.state;
    console.log('componentDidUpdate, expandedRowKeys=', expandedRowKeys);
  }

  render() {
    const { expandedRowKeys, selectedRowKeys } = this.state;
    const { data, onPageButtonClick, InvoicesFinishedData, setCurrentPage, currentPage, expandRowByClick, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    console.log('standardTable=', data);
    console.log('render,expandedRowKeys=', expandedRowKeys);
    console.log('this.props=', this.props);
    console.log('InvoicesFinishedData=', InvoicesFinishedData);

    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;

    const rowSelection: TableRowSelection<InvoiceParams> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: InvoiceParams) => ({
      }),
    };

    const totalCount = InvoicesFinishedData.data.totalCount

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={record => record.id && record.id.toString()}
          bordered={true}
          dataSource={list}
          pagination={false}
          onChange={this.handleTableChange}
          {...rest}
        />

      <Pagination
          style={{float: 'right', marginTop: 15, marginRight: 50}}
          defaultCurrent={this.state.currentPage}
          current={currentPage}
          hideOnSinglePage={true}
          onChange={(page) => {
            onPageButtonClick(page)
            setCurrentPage(page)
          }}
          pageSize={20}
          total={totalCount||1}
        />
      </div>
    );
  }
}

export default StandardTable;

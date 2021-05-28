import { Table, Row, Col, Descriptions, Tag } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component } from 'react';
import UnitDollar from '@/utils/UnitDollar';
import { OrderParams } from '../../data.d';
import styles from './index.less';
import { Pagination } from 'antd';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: OrderParams[];
    expandedData: OrderParams[];
    pagination: StandardTableProps<OrderParams>['pagination'];
  };
  selectedRows: OrderParams[];
  totalCount: number;
  dispatch: (params: any) => void;
  onSelectRow: (rows: any) => void;
  onHandleOneOrder: (orderId: number) => void;
  onPageButtonClick: (any) => void;
  setCurrentPage: (any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<OrderParams> {
  onPageButtonClick?: (any) => void;
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach((column) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  expandedRowKeys: string[];
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<OrderParams>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<OrderParams>) {
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

  constructor(props: StandardTableProps<OrderParams>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      expandedRowKeys: [],
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<OrderParams>['onChange'] = (
    selectedRowKeys,
    selectedRows: OrderParams[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map((item) => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  // handleTableChange: TableProps<OrderParams>['onChange'] = (
  //   pagination,
  //   filters,
  //   sorter,
  //   ...rest
  // ) => {
  //   const { onChange } = this.props;
  //   if (onChange) {
  //     onChange(pagination, filters, sorter, ...rest);
  //   }
  // };



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
        expandedData.length > 0 ? expandedData.find((order) => order.id === record.id) : null;
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
      { title: 'Item Name', dataIndex: 'itemDescription', key: 'itemName' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      {
        title: 'Normal Price (Incl. GST)',
        dataIndex: 'normalPriceInclGst',
        key: 'normalPriceInclGst',
        render: (val) => (
          <Tag color="purple">
            <UnitDollar decimalPoint=".00">{val}</UnitDollar>
          </Tag>
        ),
      },
      {
        title: 'Sales Price (Incl. GST)',
        dataIndex: 'commitPriceInclGst',
        key: 'commitPriceInclGst',
        render: (val) => (
          <Tag color="geekblue">
            <UnitDollar decimalPoint=".00">{val}</UnitDollar>
          </Tag>
        ),
      },
    ];
    const expandedOrder =
      expandedData.length > 0 ? expandedData.find((order) => order.id === record.id) : null;
    const orderItems = expandedOrder ? expandedOrder['orderItems'] : [];

    console.log('orderItems678', orderItems);

    return (
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Table columns={columns} dataSource={orderItems} pagination={false} />
        </Col>
        <Col span={12}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Subtotal">
              <UnitDollar decimalPoint=".00">{expandedOrder?.totalInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Included Tax">
              <UnitDollar decimalPoint=".00">{expandedOrder?.gstAmount}</UnitDollar>
            </Descriptions.Item>

            <Descriptions.Item label="Items Total">
              <UnitDollar decimalPoint=".00">{expandedOrder?.priceCutInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item
              className={styles.expandedTotal}
              label={<span className={styles.expandedTotal}>Sales Total</span>}
            >
              <UnitDollar decimalPoint=".00">{expandedOrder?.totalInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item
              className={styles.expandedTotal}
              label={<span className={styles.expandedTotal}>Balance</span>}
            >
              <UnitDollar decimalPoint=".00">{expandedOrder?.totalInclGst}</UnitDollar>
            </Descriptions.Item>
            <Descriptions.Item label="Note" span={2}>
              {expandedOrder?.note}
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
    const { expandedRowKeys } = this.state;
    const { data, rowKey, pagination, currentPage, setPagination, ...rest } = this.props;
    const { list = [] } = data || {};
    console.log('standardTable=', data);
    console.log('standardTable,expandedRowKeys=', expandedRowKeys);
    console.log('standardTable,totalCount=', this.props.totalCount);

    return (
      <section className={styles.standardTable}>
        <Table
          rowKey={(record) => record.id.toString()}
          expandedRowRender={this.expandedRowRender}
          expandRowByClick={true}
          dataSource={list}
          pagination={false}
          // onChange={this.handleTableChange}
          expandedRowKeys={expandedRowKeys}
          onExpand={this.handleTableExpand}
          {...rest}
        />
          <Pagination
            style={{ float: 'right', marginRight: '40px', marginTop: '20px' }}
            defaultCurrent={1}
            current={pagination.pagenumber || 1}
            pageSize={pagination.pagesize || 20}
            total={this.props.totalCount}
            hideOnSinglePage={true}
            onShowSizeChange={(page, size) => {
              const {onPageButtonClick, setCurrentPage} = this.props
              onPageButtonClick({ pagenumber: page,  pagesize: size});
              setPagination({ pagenumber: page, pagesize: size});
              setCurrentPage(page)
            }}
            onChange={(page, size) => {
              const {onPageButtonClick, setCurrentPage} = this.props
              onPageButtonClick({ pagenumber: page,  pagesize: size});
              setPagination({ pagenumber: page, pagesize: size});
              setCurrentPage(page)
            }}
          />
        
      </section>
    );
  }
}

export default StandardTable;

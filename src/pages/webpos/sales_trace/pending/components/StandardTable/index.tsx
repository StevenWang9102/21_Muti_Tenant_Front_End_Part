import { Table, Row, Col } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component } from 'react';
import { InvoiceParams } from '../../data.d';
import styles from './index.less';
import { Pagination } from 'antd';
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  datas: {
    list: InvoiceParams[];
    expandedData: InvoiceParams[];
    pagination: StandardTableProps<InvoiceParams>['pagination'];
  };
  selectedRows: InvoiceParams[];
  onPageButtonClick: (page: any) => void;
  InvoicesPendingData: (record: any) => void;
  onSelectRow: (rows: any) => void;
  requestOneOrder: (record: any) => void;
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
      dataSource: [],
      currentPage: 1,
      tableData: [],
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

  // 请求单行数据
  onTableExpand = (expanded: boolean, record: { id: number }) => {
    let currentKey: string[] = [];

    const expandedData = this.props.datas.expandedData


    if (expanded) {
      currentKey.push(record.id.toString());

      console.log('onTableExpand1484, expandedData', expandedData);
      console.log('onTableExpand1484, record =', record);
      console.log('onTableExpand1484, expanded =', expanded);
      console.log('onTableExpand1484, currentKey', currentKey);

      const currentInvoice = expandedData.length > 0 ? expandedData.find(invoice => invoice.id === record.id) : null;
      console.log('onTableExpand1484, expandedOrder=', currentInvoice);

      if (currentInvoice === null || currentInvoice === undefined) {
        this.props.requestOneOrder(record);
      }
    }

    this.setState({ 
      expandedRowKeys: currentKey 
    });
  };

  // 渲染单行数据
  expandedRowRender = async (record: { id: number }) => {
    const expandedData = this.props.datas.expandedData

    console.log('onTableExpand1484, record', record);
    console.log('onTableExpand1484, expandedData', expandedData);

    const columns = [
      { title: 'Item', dataIndex: 'branchId', key: 'branchId' },
      { title: 'Total', dataIndex: 'totalInclGst', key: 'totalInclGst' },
      { title: 'Balance', dataIndex: 'balanceInclGst', key: 'balanceInclGst' },
    ];

    const expandedInvoice =
      expandedData.length > 0 ? expandedData.find(invoice => invoice.id === record.id) : [];
    console.log('onTableExpand1484, expandedInvoice', expandedInvoice);
    console.log('onTableExpand1484, [expandedInvoice]', [expandedInvoice]);

    return (
      <Table
        style={{ height: 300 }}
        columns={columns}
        dataSource={[expandedInvoice]}
        pagination={false}
      />
    );
  };

  handleExpandedRowsChange = () => {
    console.log('handleExpandedRowsChange');
    this.setState({
      //expandedRowKeys: currentExpandedRowsKeys,
    });
  };
  

  componentDidUpdate() {
    const { expandedRowKeys } = this.state;
    console.log('componentDidUpdate, expandedRowKeys=', expandedRowKeys);
  }

  render() {
    const { expandedRowKeys } = this.state;
    const { datas, InvoicesPendingData, onPageButtonClick, setCurrentPage, currentPage, rowKey, ...rest } = this.props;
    const { pagination, setPagination } = this.props
    const { list = [] } = datas || {};
    console.log('render,expandedRowKeys=', expandedRowKeys);
    console.log('this.props48=', this.props);
    console.log('InvoicesPendingData=', InvoicesPendingData)

    const totalCount = this.props.InvoicesPendingData.data.totalCount
    console.log('totalCount482=', totalCount);

    return (
      <div className={styles.standardTable} style={{padding: 15}}>
        <Table
          rowKey={record => record.id && record.id.toString()}
          onChange={this.handleTableChange} // 管理页码变化等
          dataSource={list}
          {...rest}
          pagination={false}
        />

        <Pagination
          style={{ float: 'right', marginTop: 20, marginRight: 10 }}
          bordered={true}
          pageSize={pagination.pagesize}
          hideOnSinglePage={true}
          defaultCurrent={this.state.currentPage}
          current={pagination.pagenumber}
          onShowSizeChange={(page,size) => {
            onPageButtonClick({pagenumber: page, pagesize: size})
            setCurrentPage(page)
            setPagination({pagenumber: page, pagesize: size})
          }}
          onChange={(page,size) => {
            onPageButtonClick({pagenumber: page, pagesize: size})
            setCurrentPage(page)
            setPagination({pagenumber: page, pagesize: size})
          }}
          total={totalCount || 1}
        />
      </div>
    );
  }
}

export default StandardTable;

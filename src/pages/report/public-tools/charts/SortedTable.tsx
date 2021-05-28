import { Table, Typography } from 'antd';
import React from 'react';
const { Text } = Typography;

interface SortedTable {
  fromPage: string,
  sourceData: any,
}

export const SortedTable = (props: SortedTable) => {
  const { fromPage, sourceData } = props;

  let columns;
  let source = [];

      // --------------------------- 来自 Category 页面 ---------------------------
  if (fromPage === 'CategoryReport') {
    columns = [
      {
        title: 'Category',
        dataIndex: 'name',
        width: "25%",
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },

      {
        title: 'Total Sales',
        dataIndex: 'sales',
        width: "25%",
        sorter: (a, b) => a.sales - b.sales,
      },

      {
        title: 'Profit (IncGST)',
        dataIndex: 'profits',
        width: "25%",
        onFilter: (value, record) => record.quantity.indexOf(value) === 0,
        sorter: (a, b) => a.quantity - b.quantity,
        sortDirections: ['descend', 'ascend'],
      },

      {
        title: 'Transaction',
        dataIndex: 'quantity',
        width: "25%",
        onFilter: (value, record) => record.quantity.indexOf(value) === 0,
        sorter: (a, b) => a.quantity - b.quantity,
        sortDirections: ['descend', 'ascend'],
      },

    ];

    console.log('CategoryReport,sourceData',sourceData);
    
    // 处理数据源
    sourceData &&
      sourceData.forEach((each, index) => {
        console.log('sourceData,each',each);

        source.push({
          key: (index + 1).toString(),
          name: each.categoryName,
          sales: Math.abs(each.totalInclGst.toFixed(2)),
          profits: Math.abs(each.profitInclGst.toFixed(2)),
          quantity: each.itemQuantity,
        });

        console.log('sourceData,source',source);

      });
  }

  // --------------------------- 来自 Item 页面 ---------------------------
  if (fromPage === 'ItemReport') {

    console.log('ItemReport,sourceData',sourceData);
    
    columns = [
      {
        title: 'Item Name',
        dataIndex: 'name',
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },

      {
        title: 'Sales',
        dataIndex: 'sales',
        sorter: (a, b) => a.sales - b.sales,
      },


      {
        title: 'Quantity',
        dataIndex: 'quantity',
        onFilter: (value, record) => record.quantity.indexOf(value) === 0,
        sorter: (a, b) => a.quantity - b.quantity,
        sortDirections: ['descend', 'ascend'],
      },
    ];

    // 数据源
    sourceData &&
      sourceData.forEach((each, index) => {
        source.push({
          key: (index + 1).toString(),
          name: sourceData[index].itemName,
          sales: Math.abs(sourceData[index].totalInclGst).toFixed(2),
          profits: Math.abs(sourceData[index].profitInclGst).toFixed(2),
          quantity: Math.abs(sourceData[index].itemQuantity),
        });
      });
  }


  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  const isPagination = source.length > 10? null :false
  console.log('source4481',source);
  
  return (
    <>
      <Table
        pagination={isPagination}
        columns={columns}
        dataSource={source}
        style={{ padding: '20px 80px' }}
        onChange={onChange}
        summary={(pageData) => {
          console.log('summary,pagedata', pageData);

          let totalSales = 0;
          let totalTransaction = 0;
          let profits1 = 0;

          pageData.forEach(({ sales, quantity, profits }) => {
            console.log('summary,foreach', sales);
            console.log('summary,foreach,typeof', typeof sales);

            totalSales += parseFloat(sales);
            totalTransaction += parseFloat(quantity) ;
            profits1 += profits
          });

          console.log('summary,totalSales', totalSales );
          
          return (
            <>
              <Table.Summary.Row style={{ minHeight: 1900 }}>
                <Table.Summary.Cell index ={1}>
                  <b style={{color: 'blue'}}>Total</b>
                  </Table.Summary.Cell>

                <Table.Summary.Cell index ={2}>
                  <Text><b style={{color: 'blue'}}>{totalSales === 0 ? "" : totalSales.toFixed(2)}</b></Text>
                </Table.Summary.Cell>


                {fromPage === 'CategoryReport' && (
                  <Table.Summary.Cell index ={4}>
                    <Text><b style={{color: 'blue'}}>{profits1 === 0 ? '' : profits1.toFixed(2)}</b></Text>
                  </Table.Summary.Cell>
                )}

                
                <Table.Summary.Cell index ={3}>
                  <Text ><b style={{color: 'blue'}}>{totalTransaction === 0 ? '' : totalTransaction}</b></Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

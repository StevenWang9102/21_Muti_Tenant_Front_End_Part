import { Card, Table } from 'antd';
import { FormattedMessage } from 'umi';
import { Col, Select, Row, DatePicker, Menu, Button, Dropdown } from 'antd';
import React, { useEffect } from 'react';
import sort from 'fast-sort';
import { Top10SoldItemsData } from '../data.d';
import styles from '../style.less';
const { Option } = Select;

const columns = [
  {
    title: '#',
    dataIndex: 'number',
    key: 'number',
  },

  {
    title: (
      <FormattedMessage id="dashboard.top10-sold-items.item-name" defaultMessage="Item Name" />
    ),
    dataIndex: 'itemName',
    key: 'itemName',
    render: (text: React.ReactNode) => <a>{text}</a>,
  },

  {
    title: <FormattedMessage id="dashboard.top10-sold-items.item-qty" defaultMessage="Quantity" />,
    dataIndex: 'quantity',
    key: 'quantity',
    className: styles.alignRight,
  },
];

export const Top10SoldItemsCard = ({
  loading,
  searchType,
  itemSalesTop10,
  rangePickerValue,
  setTop10SoldItemsType,
  requestTopItemSales,
}) => {

  const dataSourceMaker = () => {
    const source = []
    console.log('itemSalesTop10189,searchType', searchType);
    console.log('itemSalesTop10189,itemSalesTop10', itemSalesTop10);

    if (searchType == 'Slow Selling') {
      sort(itemSalesTop10).asc(user => user.itemQuantity)
    } else {
      sort(itemSalesTop10).desc(user => user.itemQuantity)
    }

    if (itemSalesTop10) {
      if(itemSalesTop10.length > 10 ){
        itemSalesTop10.forEach((each, index) => {
          index < 10 && source.push({
            number: index + 1,
            itemName: each.itemName,
            quantity: each.itemQuantity,
          })
        });
      } else {
        itemSalesTop10.forEach((each, index) => {
            source.push({
            number: index + 1,
            itemName: each.itemName,
            quantity: each.itemQuantity,
          })
        });
      }


    }
    console.log('itemSalesTop10189,source', source);
    return source
  }



  useEffect(() => {
    requestTopItemSales(searchType);
  }, [searchType, rangePickerValue]);

  return (
    <Card
      loading={loading}
      bordered={false}
      title={
        <FormattedMessage id="dashboard.top10-sold-items.title" defaultMessage="Top 10 Items" />
      }
      extra={
        <div>
          <Select
            defaultValue="Best Selling"
            style={{ width: 120 }}
            onChange={(value) => {
              setTop10SoldItemsType(value);
            }}
          >
            <Option value="Best Selling">Best Selling</Option>
            <Option value="Slow Selling">Slow Selling</Option>
          </Select>
        </div>
      }
      style={{
        height: '100%',
      }}
    >
      <Table<any>
        rowKey={(record) => record.index}
        size="small"
        columns={columns}
        dataSource={dataSourceMaker()}
        pagination={false}
      />
    </Card>
  );
};


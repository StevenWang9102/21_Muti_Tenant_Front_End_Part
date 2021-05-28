import React, { useEffect, useState, FC } from 'react';
import 'antd/dist/antd.css';
import { AddUserlInterface } from '../sales-report/data';
import { ChartCard, yuan, Field } from 'ant-design-pro/lib/Charts';
import { Row, Col, Tooltip } from 'antd';
import average from '../../../public-component/Icons/average5.png'
import sales from '../../../public-component/Icons/sales.png'
import margin1 from '../../../public-component/Icons/margin.png'
import transactionsImg from '../../../public-component/Icons/transactions.png'
import profitsImg from '../../../public-component/Icons/profits.png'

export const SimpleExcel: FC<AddUserlInterface> = (props) => {
  const { totalSales, profits, transactions, averageSize } = props;

  const style = {
    border: '2px solid #DFDFDF', 
    padding: "10px 10px 0 10px",
    borderRadius: 10,
    fontSize: 20,
  }

  const margin = totalSales ? `${(profits / totalSales * 100).toFixed(2)} %` : "0"

  const PriceBlock = (name, price, src) => {
    return <Row style={style}>
      <Col span={10} style={{padding: 8}}>
        <img
          style={{ width: '60px', height: '60px' }}
          src= {src}
          alt="img"
        />
      </Col>
      <Col span={14}>
        <h1>{name}</h1>
        <p>{price}</p>
      </Col>
    </Row>
  }

  const span = 8

  return (
    <section style={{marginTop: 20, padding: '0 20px'}}>
      <Row gutter={[20, 20]} style={{ backgroundColor: 'white' }}>
        <Col span={span} >
          {PriceBlock('Total Sales', `$ ${totalSales || 0}`, sales)}
        </Col>

        <Col span={span} >
          {PriceBlock('Profits', `$ ${profits || 0}`, profitsImg)}
        </Col>

        <Col span={span} >
          {PriceBlock('Transactions', `${transactions || 0}`, transactionsImg)}
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ backgroundColor: 'white' }}>
        <Col span={span} >
          {PriceBlock('Average Size', `$ ${averageSize || 0}`, average)}
        </Col>

        <Col span={span} >
          {PriceBlock('Margin', margin, margin1)}
        </Col>
      </Row>
    </section>

  );
};

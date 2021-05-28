import {
  Card,
  Col,
  Row,
  List,
} from 'antd';
import UnitDollar from '@/utils/UnitDollar';
import { PaymentFooter } from '../../../../AccountCenter/components/Payment/PaymentFooter'
import React, { Component, CSSProperties, useState, useEffect } from 'react';
import { OrderItemsParams, InvoiceParams } from '../../data.d';
import { OrderItems } from './orderItems'
import dateFormat from 'dateformat'

const { Meta } = Card;

interface AdvancedState {
}

interface Props {
  allProps: any;
  invoiceData: any;
  data: any;
  oneBranchInfo: any; 
  currentOrderDetail: any;
  showAllPaymentsModal: (any) => void;
  currentOrderItems: Partial<OrderItemsParams[]>;
  currentInvoice?: InvoiceParams;
}

const size = 13
const fontFamily = 'Helvetica'
const fontWeight = 750

 const myStyle = {
   color: 'black',
   fontSize: size,
   marginRight: 130,
   fontWeight: 700,
   fontFamily: fontFamily,
 }

 const basicInfoStyle = {
   color: 'black',
   fontSize: size,
   fontWeight: 700,
   fontFamily: fontFamily,
 }


 const taxInvStyle = {
   color: 'black',
   fontSize: 15,
   fontWeight: 800,
   fontFamily: fontFamily,
 }

 const receiptTotal: CSSProperties = {
   color: 'black',
   fontSize: size + 1,
   fontWeight: 700,
   marginRight: '5px',
   fontFamily: fontFamily,
 };
 
 const receiptLeft: CSSProperties = {
   color: 'black',
   fontSize: size,
   fontWeight: 700,
   marginRight: '5px',
   fontFamily: fontFamily,
 };
   
const receiptRight: CSSProperties = {
 color: 'black',
 fontWeight: 700,
 fontSize: size,
 float: 'right',
 marginRight: '5px',
 fontFamily: fontFamily,
};
 


class PrintReceipt extends Component<Props, AdvancedState> {
  public state: AdvancedState = {
  };

  render() {
   const { currentInvoice, record, paymentHistory, oneBranchInfo={}, multiOrderDetails } = this.props;

  

    return (
      <Card bordered={false} style={{ padding: 5, width: 320, color: 'black' }}>
        <h3 style={taxInvStyle}> TAX INVOICE </h3>
{/* 
        <Row>
          <Col span={24} style={myStyle}> {header} </Col>
        </Row>

        {divider()} */}

        {/* ------------------------------- 基本信息 ----------------------------- */}
        {/* {render && render.map(each => {
          return <section>
            { each.value === ''? null : 
            <Row style={{ margin: '5px 0', color: 'black'}}>
              <Col span={24} style={basicInfoStyle}> {`${each.name} ${each.value}`} </Col>
            </Row>}
          </section>
        })}

        {divider()} */}

        {/* ------------------------------- 商品内容 ----------------------------- */}
        {/* <OrderItems
          currentOrder={currentOrderDetail}
        />

        <Row gutter={[5, 5]}>
          <Col span={11}>
            <span style={receiptTotal}>Total</span>
          </Col>

          <Col span={11}>
            <span style={receiptRight}>
              <UnitDollar decimalPoint=".00">{total}</UnitDollar>
            </span>
          </Col>
        </Row>

        { paymentHistory && paymentHistory.map(({ paymentModeName, dateTime, amount }) => {
            return (
              <Row gutter={[5, 5]}>
                <Col span={10} offset = {1}>
                  <span style={receiptLeft}>
                    {paymentModeName}
                  </span>
                </Col>

                <Col span={10} offset = {1}>
                  <span style={receiptRight}>
                    <UnitDollar decimalPoint=".00">{amount !== 0 && amount}</UnitDollar>
                    <span style={{ display: 'block' }}></span>
                  </span>
                </Col>
              </Row>
            )
          })}

        <Row gutter={[16, 16]}>
          <Col span={11}>
            <span style={receiptLeft}>Include Tax</span>
            <span></span>
          </Col>
          <Col span={11}>
            <span style={receiptRight}>
              <UnitDollar decimalPoint=".00">{gstAmount}</UnitDollar>
            </span>
          </Col>
        </Row>

        {divider()}
        <Row>
          <Col span={24} style={myStyle}> {footer} </Col>
        </Row> */}
      </Card>
    );
  }
}

export default PrintReceipt;

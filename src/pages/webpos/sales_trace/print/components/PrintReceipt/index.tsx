import {
  Card,
  Col,
  Row,
  List,
} from 'antd';
import UnitDollar from '@/utils/UnitDollar';
import React, { Component, CSSProperties, useState, useEffect } from 'react';
import { OrderItemsParams, InvoiceParams } from '../../data.d';
import { OrderItems } from './OrderItems'
import dateFormat from 'dateformat'

const { Meta } = Card;

interface AdvancedState {
}

interface PropsInterface {
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
 


class PrintReceipt1 extends Component<PropsInterface, AdvancedState> {
  public state: AdvancedState = {
  };

  render() {
    const { currentInvoice, oneBranchInfo, currentOrderDetail } = this.props;
    console.log('Print891,currentInvoice', currentInvoice);

    const paymentHistory = (currentInvoice && currentInvoice.payments) || []
    const branchName = oneBranchInfo.tradingName
    const total = currentInvoice.totalInclGst 
    const startDateTime = currentInvoice.startDateTime
    const endDateTime = currentInvoice.endDateTime
    const gstAmount = currentInvoice.gstAmount

    const gstNumber = oneBranchInfo.gstNumber
    const invoiceId = currentInvoice.id
    const orderId = currentInvoice.orderId
    const note = currentInvoice.note
    const startUserName = currentInvoice.startUserName
    const endUserName = currentInvoice.endUserName
    const address = `${oneBranchInfo.street} ${oneBranchInfo.suburb} ${oneBranchInfo.country} ${oneBranchInfo.city}`
    const phone = oneBranchInfo.phone
    
    const beauticianName = currentOrderDetail.beauticianName
    const locationName = currentOrderDetail.locationName

    const header = oneBranchInfo.receiptHeader
    const footer = oneBranchInfo.receiptFooter

    const render = [

      {
        name: '',
        value: branchName  || '',
      },

      {
        name: 'Address:',
        value: address || '',
      },

      {
        name: 'Phone:',
        value: phone || '',
      },

      {
        name: 'Gst:',
        value: gstNumber  || '',
      },

      {
        name: 'Order:',
        value: orderId  || '',
      },

      {
        name: 'INV#:',
        value: invoiceId  || '',
      },

      {
        name: 'Sale:',
        value: beauticianName || '',
      },

      {
        name: 'Location:',
        value: locationName || '',
      },

      {
        name: 'Start Date:',
        value: dateFormat(startDateTime, 'dd-mm-yyyy, h:MM:ss TT') || '', 
      },

      {
        name: 'End Date:',
        value: dateFormat(endDateTime, 'dd-mm-yyyy, h:MM:ss TT') || '', 
      },

      {
        name: 'Start Staff:',
        value: startUserName || '', 
      },

      {
        name: 'End Staff:',
        value: endUserName || '', 
      },

      {
        name: 'Note:',
        value: note || '', 
      },
    ]

    const divider = () => {
      return <div style={{ margin: "10px 0px" }}> =========================== </div>
    }

    return (
      <Card id='root' bordered={false} style={{ padding: 5, width: 320, color: 'black' }}>
        <h3 style={taxInvStyle}> TAX INVOICE </h3>

        <Row>
          <Col span={24} style={myStyle}> {header} </Col>
        </Row>

        {divider()}

        {/* ------------------------------- 基本信息 ----------------------------- */}
        {render && render.map(each => {
          return <section>
            { each.value === ''? null : 
            <Row style={{ margin: '5px 0', color: 'black'}}>
              <Col span={24} style={basicInfoStyle}> {`${each.name} ${each.value}`} </Col>
            </Row>}
          </section>
        })}

        {divider()}

        {/* ------------------------------- 商品内容 ----------------------------- */}
        <OrderItems currentOrder={currentOrderDetail} />

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
        </Row>
      </Card>
    );
  }
}

export default PrintReceipt1;

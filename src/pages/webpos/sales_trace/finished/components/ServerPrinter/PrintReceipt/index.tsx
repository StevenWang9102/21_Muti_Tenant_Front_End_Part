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
import { OrderItems } from './OrderItems'
import dateFormat from 'dateformat'

const { Meta } = Card;

interface AdvancedState {
}

interface PropsInterface {
}

const size = 13
const fontFamily = 'Helvetica'
const fontWeight = 750

 const myStyle = {
   Position: 'relative',
   left: 0,
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
 


class PrintReceipt1 extends Component<PropsInterface> {

  render() {
    const { currentInvoice, oneBranchInfo, currentOrderDetail } = this.props;
    console.log('Print841891,currentInvoice', currentInvoice);
    console.log('Print841891,oneBranchInfo', oneBranchInfo);
    console.log('Print841891,currentOrderDetail', currentOrderDetail);

    const paymentHistory = (currentInvoice && currentInvoice.payments) || []
    const branchName = oneBranchInfo.tradingName
    const total = currentInvoice.totalInclGst 
    const startDateTime = currentInvoice.startDateTime
    const endDateTime = currentInvoice.endDateTime
    const gstAmount = currentInvoice.gstAmount
    const customerName = currentOrderDetail.customerName

    const gstNumber = oneBranchInfo.gstNumber
    const invoiceId = currentInvoice.id
    const orderId = currentInvoice.orderId
    const note = currentInvoice.note
    const startUserName = currentInvoice.startUserName
    const endUserName = currentInvoice.endUserName
    const street = oneBranchInfo.street || ''
    const suburb = oneBranchInfo.suburb || ''
    const country = oneBranchInfo.country || ''
    const city = oneBranchInfo.city || ''

    const address = `${street} ${suburb} ${country} ${city}`
    console.log('Print891,address', address);
    console.log('Print891,address,street', street);
    console.log('Print891,address,suburb', suburb);
    console.log('Print891,address,country', country);
    console.log('Print891,address,city', city);

    
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
        name: 'Gst Num:',
        value: gstNumber  || '',
      },

      {
        name: 'Order ID:',
        value: orderId  || '',
      },

      {
        name: 'Invoice ID:',
        value: invoiceId  || '',
      },

      {
        name: 'Customer Name:',
        value: customerName || '',
      },

      {
        name: 'Sale Name:',
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

    const myCardStyle = {
      position: 'absolute', 
      top: 0,
      zIndex: -1,
      padding: '10px 5px', 
      width: 320, 
      color: 'black' 
    }

    return (
      <Card id= 'PrintReceiptServer' bordered={false} style={myCardStyle}>
        <h3 style={taxInvStyle}> TAX INVOICE </h3>

        <Row>
          <Col span={24} style={myStyle}> {header} </Col>
        </Row>

        {divider()}

        {/* ------------------------------- 基本信息 ----------------------------- */}
        {render && render.map(each => {
          return <section>
            { each.value === ''? null : 
            <Row style={{ margin: '5px 0', color: 'black', width: '100%', textAlign: 'left'}}>
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

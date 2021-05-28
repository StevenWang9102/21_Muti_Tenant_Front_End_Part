import {
  Card,
  Col,
  Row,
  List,
} from 'antd';
import UnitDollar from '@/utils/UnitDollar';
import { PaymentFooter } from '../../../../AccountCenter/components/Payment/PaymentFooter'
import React, { Component, CSSProperties, useState, useEffect } from 'react';
// import { OrderItemsParams, InvoiceParams } from '../../data.d';
import { OrderItems } from './OrderItems'
import dateFormat from 'dateformat'

const { Meta } = Card;

interface AdvancedState {
}

interface PropsInterface {
  oneBranchInfo: any;
  currentOrderDetail: any;
  currentInvoice?: any;
}

const size = 13
const fontFamily = 'Helvetica'

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


const size1 = 12

const itemStyle = {
  color: 'black',
  fontSize: size1,
  textAlign: 'left',
  margin: '10px 0px',
  borderBottom: '1px dashed gray',
  fontWeight: 700,
  fontFamily: fontFamily,
}

const quantityStyle = {
  color: 'black',
  float: 'right',
  textAlign: 'right',
  margin: '10px 0px',
  // border: '2px solid red',
  fontSize: size1,
  fontWeight: 700,
  borderBottom: '1px dashed gray',
  fontFamily: fontFamily,
}

const noteStyle = {
  color: 'black',
  fontSize: size1,
  fontWeight: 700,
  fontFamily: fontFamily,
}

class PrintReceipt1 extends Component<PropsInterface> {

  render() {
    const { currentInvoice, oneBranchInfo, currentOrderDetail } = this.props;
    console.log('Print41891,oneBranchInfo', oneBranchInfo);
    console.log('Print41891,currentInvoice', currentInvoice);
    console.log('Print41891,currentOrderDetail', currentOrderDetail);

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
    const phone = oneBranchInfo.phone

    const beauticianName = currentOrderDetail.beauticianName
    const locationName = currentOrderDetail.locationName

    const header = oneBranchInfo.receiptHeader
    const footer = oneBranchInfo.receiptFooter

    const render = [

      {
        name: '',
        value: branchName || '',
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
        value: gstNumber || '',
      },

      {
        name: 'Order ID:',
        value: orderId || '',
      },

      {
        name: 'Invoice ID:',
        value: invoiceId || '',
      },

      {
        name: 'Customer Name:',
        value: customerName || '',
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
      return <div style={{ margin: "2px 0px" }}> =========================== </div>
    }

    const myCardStyle = {
      position: 'absolute',
      top: 0,
      zIndex: -1,
      padding: '0px 5px 10px 5px',
      width: 320,
      color: 'black'
    }

    return (
      <Card id='PrintPOSReceiptServer' style={myCardStyle} bordered={false}>
        <h3 style={taxInvStyle}> TAX INVOICE </h3>

        <Row>
          <Col span={24} style={myStyle}> {header} </Col>
        </Row>

        {divider()}

        {/* ------------------------------- 基本信息 ----------------------------- */}
        {render && render.map(each => {
          return <section>
            {each.value === '' ? null :
              <Row style={{ margin: '2px 0', padding: '0 8px', color: 'black', width: '100%', textAlign: 'left' }}>
                <Col span={24} style={basicInfoStyle}> {`${each.name} ${each.value}`} </Col>
              </Row>}
          </section>
        })}

        {divider()}

        {/* ------------------------------- 商品内容 ----------------------------- */}
        <List
          size="small"
          rowKey="id"
          dataSource={currentOrderDetail.orderItems}
          renderItem={(item: any) => {
            const note = item.note
            const bundleItem = item.orderBundleItems.map(each => `${each.itemName}×${each.quantity}`)
            const itemName = bundleItem.length > 0 ? `${item.itemName} (${bundleItem.join('; ')})` : `${item.itemName}`

            return (
              <section style={{ margin: 0, color: 'black' }}>
                <Row>
                  <Col span={14} style={itemStyle}>
                    {itemName.toLowerCase()}
                  </Col>

                  <Col span={10} style={quantityStyle}>
                    {`${item.quantity} x $${item.commitPriceInclGst}`}
                  </Col>
                </Row>
                {note === '' ? null : <Row><p style={noteStyle}>{note}</p></Row>}
              </section>
            )
          }}
        />

        <Row gutter={[5, 5]}>
          <Col span={12}>
            <span style={receiptTotal}>Total</span>
          </Col>

          <Col span={12}>
            <span style={receiptRight}>
              <UnitDollar decimalPoint=".00">{total}</UnitDollar>
            </span>
          </Col>
        </Row>

        { paymentHistory && paymentHistory.map(({ paymentModeName, dateTime, amount }) => {
          return (
            <Row gutter={[5, 5]}>
              <Col span={11} offset={1}>
                <span style={receiptLeft}>
                  {paymentModeName}
                </span>
              </Col>

              <Col span={12}>
                <span style={receiptRight}>
                  <UnitDollar decimalPoint=".00">{amount !== 0 && amount}</UnitDollar>
                  <span style={{ display: 'block' }}></span>
                </span>
              </Col>
            </Row>
          )
        })}

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <span style={receiptLeft}>Include Tax</span>
            <span></span>
          </Col>
          <Col span={12}>
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

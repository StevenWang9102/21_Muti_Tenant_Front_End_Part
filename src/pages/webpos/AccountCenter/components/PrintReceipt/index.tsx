import {
  Card,
  Descriptions,
  Divider,
  Col,
  Row,
  List,
} from 'antd';
import { PaymentFooter } from '../Payment/PaymentFooter'
import React, { Component, CSSProperties } from 'react';
import { OrderItemsParams, InvoiceParams } from '../../data.d';
import { current } from './date'
import * as services from '../../service'

const { Meta } = Card;

interface AdvancedState {
}

interface Props {
  allProps: any;
  data: any;
  showAllPaymentsModal: (any) => void;
  currentOrderItems: Partial<OrderItemsParams[]>;
  currentInvoice?: InvoiceParams;
}


const size = 13
const fontFamily = 'Helvetica'
const fontWeight = 750


const taxInvStyle: CSSProperties = {
  color: 'black',
  fontSize: 15,
  fontWeight: fontWeight,
  fontFamily: fontFamily,
}

const headerStyle: CSSProperties = {
  fontSize: size,
  marginRight: 130,
  fontWeight: fontWeight,
  fontFamily: fontFamily,
}

const basicInfoStyle: CSSProperties = {
  fontSize: size,
  fontWeight: fontWeight,
  fontFamily: fontFamily,
}

const quantityStyle: CSSProperties = {
  float: 'right',
  fontSize: size,
  fontWeight: fontWeight,
  marginRight: '3px',
  fontFamily: fontFamily,
}

const noteStyle: CSSProperties = {
  fontSize: size,
  color: 'grey',
  fontWeight: fontWeight,
  fontFamily: fontFamily,
}


class PrintReceipt extends Component<Props, AdvancedState> {
  public state: AdvancedState = {
  };

  render() {
    const { currentOrderItems } = this.props;
    const oneBranchInfo = this.props.data.oneBranchInfo

    console.log('Printer001, props', this.props);
    console.log('Printer001, oneBranchInfo=', oneBranchInfo);

    const branch = oneBranchInfo.tradingName
    const address = `${oneBranchInfo.street} ${oneBranchInfo.suburb} ${oneBranchInfo.city} ${oneBranchInfo.country}`
    const phone = `${oneBranchInfo.phone}`

    const sales = this.props.data.staff // Redux 
    const location = this.props.data.location

    const invoice = this.props.data.currentInvoice[0].id
    const gstNumber = oneBranchInfo.gstNumber
    const date = `${current}`

    const header = oneBranchInfo.receiptHeader
    const footer = oneBranchInfo.receiptFooter
    const note = oneBranchInfo.note

    console.log('Printer001, oneBranchInfo=', oneBranchInfo);
    console.log('Printer001, oneBranchInfo,header', header);
    console.log('Printer001, oneBranchInfo,footer', footer);
    console.log('Printer001, oneBranchInfo,note', note);


    const divider = () => {
      return <div style={{ margin: '10px 0px' }}> =============================== </div>
    }

    const render = [
      {
        name: '',
        value: branch || ' ',
      },

      {
        name: 'Address:',
        value: address  || ' ',
      },

      {
        name: 'Phone:',
        value: phone || ' ',
      },

      {
        name: 'Gst:',
        value: gstNumber  || ' ',
      },

      {
        name: 'INV#:',
        value: invoice  || ' ',
      },

      {
        name: 'Date:',
        value: date || ' ',
      },

      
      {
        name: 'Sales:',
        value: sales || ' ',
      },
      
      {
        name: 'Location:',
        value: location || ' ',
      },

    ]

    return (
      <Card bordered={false} style={{ padding: 5, width: 320, fontFamily: "Helvetica", color: 'black' }}>
        <h3 style={taxInvStyle}> TAX INVOICE </h3>

        <Row>
          <Col span={24} style={headerStyle}> {header} </Col>
        </Row>
        {divider()}

        {/* ------------------------------- 基本信息 ----------------------------- */}
        {render.map(each => {
          console.log('each.value',each.value);
          
          return <section>
            {each.value ? <Row style={{ margin: '5px 0' }}>
              <Col span={24} style={basicInfoStyle}> {`${each.name} ${each.value}`} </Col>
            </Row> : <Row style={{ margin: '5px 0' }}>
              <Col span={24} style={basicInfoStyle}> </Col>
            </Row>}
          </section>
        })}

        {divider()}

        {/* ------------------------------- 商品内容 ----------------------------- */}
        <List
          size="small"
          rowKey="id"
          dataSource={currentOrderItems}
          renderItem={item => {
            const note = item.note
            const bundleItem = item.orderBundleItems.map(each=>`${each.itemName}×${each.quantity/item.quantity}`)
            const itemName = bundleItem.length > 0 ? `${item.itemName} (${bundleItem.join('; ')})`: `${item.itemName}`
            
            return (
              <section style={{ margin: 0, color: 'black', fontFamily: fontFamily }}>
                <label style={headerStyle}>{itemName}</label>
                <span style={quantityStyle}>{`${item.quantity} x $${item.commitPriceInclGst}`}</span>
                {note === '' ? null :
                  <p style={noteStyle}>{note}</p>}
                <div style={{ fontWeight: 400, marginBottom: 5 }}> ----------------------------------------------------- </div>
              </section>
            )
          }}
        />

        <PaymentFooter
          // getLastOrder,
          // data,
          // openLocationModal,
          // setLacationStaffVisible,
          // oneBranchInfo,
          fromPage='PrintReceipt'
          data={this.props.allProps.currentPOSData.data}
          showAllPaymentsModal={this.props.showAllPaymentsModal}
          allProps={this.props.allProps.currentPOSData.data}
          openLocationModal={this.props.openLocationModal}
        />

        {divider()}
        <Row style={{marginBottom: 10}}>
          <Col span={24} style={headerStyle}> {footer} </Col>
        </Row>
      </Card>
    );
  }
}

export default PrintReceipt;

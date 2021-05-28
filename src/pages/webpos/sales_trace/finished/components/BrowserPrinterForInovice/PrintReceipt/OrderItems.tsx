import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import 'antd/dist/antd.css';

interface ReportInterface {
  currentInvoice: any,
  currentOrder: any,
}

const size = 13
const fontFamily = 'Helvetica'

const labelStyle = {
  color: 'black',
  fontSize: size,
  fontWeight: 700,
  fontFamily: fontFamily,
}

const quantityStyle = {
  float: 'right',
  color: 'black',
  fontSize: size,
  fontWeight: 700,
  paddingRight: '5px',
  fontFamily: fontFamily,
}

const noteStyle = {
  color: 'black',
  fontSize: size,
  fontWeight: 700,
  fontFamily: fontFamily,
}

export const OrderItems: React.FC<ReportInterface> = ({
  currentOrder={},
}) => {

  console.log('currentOrder.currentOrder', currentOrder);
  
  return (
    <List
      size="small"
      rowKey="id"
      dataSource={currentOrder.orderItems}
      renderItem={(item: any) => {
        const note = item.note
        const bundleItem = item.orderBundleItems.map(each => `${each.itemName}×${each.quantity}`)
        const itemName = bundleItem.length > 0 ? `${item.itemName} (${bundleItem.join('; ')})` : `${item.itemName}`

        // console.log('currentOrderItems4848', currentOrder.orderItems);

        return (
          <section style={{ marginLeft: "-12px", marginTop: 0, color: 'black' }}>
            <label style={labelStyle}>{itemName}</label>
            <span style={quantityStyle}>{`${item.quantity} x $${item.commitPriceInclGst}`}</span>

            {note === '' ? null : <p style={noteStyle}>{note}</p>}
            <div style={{ fontWeight: 400, margin: '7px 0', color: 'black', border: '1px dashed gray' }}>  </div>
          </section>
        )
      }}
    />
  );
};


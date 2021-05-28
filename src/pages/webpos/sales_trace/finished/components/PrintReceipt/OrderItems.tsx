import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import 'antd/dist/antd.css';

interface ReportInterface {
    currentOrder: any,
}

const size = 13
const fontFamily = 'Helvetica'

const myStyle = {
    color: 'black',
    fontSize: size,
    marginRight: 130,
    fontWeight: 700,
    fontFamily: fontFamily,
  }

  const quantityStyle = {
    color: 'black',
    float: 'right',
    fontSize: size,
    fontWeight: 700,
    marginRight: '3px',
    fontFamily: fontFamily,
  }

  const noteStyle = {
    color: 'black',
    fontSize: size,
    fontWeight: 700,
    fontFamily: fontFamily,
  }

export const OrderItems: React.FC<ReportInterface> = ({
    currentOrder,
}) => {

    useEffect(()=>{
        console.log('OrderItems,currentOrder',currentOrder);
        setOrderItems(currentOrder.orderItems)
    }, [currentOrder])

    const [orderItems, setOrderItems]=useState([])
 
  return (
    <List
          size="small"
          rowKey="id"
          dataSource={orderItems}
          renderItem={(item: any) => {
            const note = item.note
            const bundleItem = item.orderBundleItems.map(each=>`${each.itemName}×${each.quantity}`)
            const itemName = bundleItem.length > 0 ? `${item.itemName} (${bundleItem.join('; ')})`: `${item.itemName}`
            
            // console.log('currentOrderItems4848',currentOrder.orderItems);
            
            return (
              <section style={{ margin: 0, color: 'black' }}>
                <label style={myStyle}>{itemName}</label>
                <span style={quantityStyle}>{`${item.quantity} x $${item.commitPriceInclGst}`}</span>
                {note === '' ? null :
                  <p style={noteStyle}>{note}</p>}
                <div style={{ fontWeight: 400, marginBottom: 5, color: 'black' }}> ---------------------------------------------- </div>
              </section>
            )
          }}
        /> 
  );
};



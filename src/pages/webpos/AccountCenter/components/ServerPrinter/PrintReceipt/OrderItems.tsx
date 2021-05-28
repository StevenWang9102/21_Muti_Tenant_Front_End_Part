
import React, { useEffect, useState } from 'react';
import { List, Row, Col} from 'antd';
import 'antd/dist/antd.css';

interface ReportInterface {
    currentOrder: any,
}

const size1 = 11
const fontFamily = 'Helvetica'

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

export const OrderItems: React.FC<ReportInterface> = ({
    currentOrder,
}) => {

  return (
    <List
          size="small"
          rowKey="id"
          dataSource={currentOrder.orderItems}
          renderItem={(item: any) => {
            const note = item.note
            const bundleItem = item.orderBundleItems.map(each=>`${each.itemName}×${each.quantity}`)
            const itemName = bundleItem.length > 0 ? `${item.itemName} (${bundleItem.join('; ')})`: `${item.itemName}`
                        
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
  );
};



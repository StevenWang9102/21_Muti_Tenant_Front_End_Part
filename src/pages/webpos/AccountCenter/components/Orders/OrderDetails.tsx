import {
  Card, Input, Button, Skeleton, Modal
} from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  DeleteTwoTone,
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { basicBlue } from '../../../../public-component/color'
import { QuestionCircleOutlined, EditTwoTone } from '@ant-design/icons';
import { Divider, Row, Col } from 'antd';
import sort from 'fast-sort';

const { Meta } = Card;



const demoInfiniteContainer: CSSProperties = {
  border: '1px solid #e8e8e8',
  borderRadius: '4px',
  overflow: 'auto',
  padding: '25px 24px',
  height: '460px',
};


export const OrderDetails = ({
  data,
  fromPage,
  handleSaveOrder,
  handleDeleteOrder,
  handleResumeOrder,
  onSearchItemClick,
  editAndDelete,
  footerContent,
}) => {

  const [currentSearchValue, setCurrentValue] = useState('')

  // 如果当前订单，已经支付过，则不能修改
  let canNotDelete;
  if (data.currentInvoice) {
    const currentInvoice = data.currentInvoice[0] || {};
    if (currentInvoice.balanceInclGst < currentInvoice.totalInclGst)
      canNotDelete = true
    else canNotDelete = false
  } else canNotDelete = false

  const currentOrderItems = data?.currentOrderItems && data?.currentOrderItems;
  console.log('OrderDetails,data', data);
  console.log('OrderDetails,currentOrderItems', currentOrderItems);

  const Buttons = (
    < div style={{ padding: 0 }}>
      {canNotDelete ? null : <Button
        type="primary"
        style={{ float: 'left', marginRight: 5, borderRadius: 5 }}
        onClick={() => handleSaveOrder()}
      >
        Save Sale
      </Button>}

      {canNotDelete ? null : <Button
        type="danger"
        style={{ float: 'left', marginRight: 5, borderRadius: 5 }}
      >
        <Popconfirm title="Are you sure to remove this sale?"
          icon={<QuestionCircleOutlined
            style={{ color: 'red' }} />}
          onConfirm={() => handleDeleteOrder()}
        >
          <a href="#" style={{ color: 'white' }}>Remove Sale</a>
        </Popconfirm>
      </Button>}

      <Button
        style={{ float: 'left', borderRadius: 5 }}
        onClick={() => handleResumeOrder()}
      >
        Resume
      </Button>
    </div>
  );

  const onItemClick = (e, item) => {
    e.preventDefault();
    !canNotDelete && editAndDelete('edit', item);
  }


  const getItemName = (item, quantity) => {
    console.log('getItemName,item', item);
    const bundleItems = item.orderBundleItems.map(each => `${each.itemName}×${each.quantity / quantity}`)

    console.log('getItemName,bundleItems', bundleItems);
    if (bundleItems.length > 0) {
      return `${item.itemDescription}(${bundleItems.join('; ')}) `
    } else {
      return `${item.itemDescription || ''} `
    }
  }


  const span = 10
  const span1 = 5
  const priceSpan = 4
  const qSpan = 3
  const style1 = { borderBottom: '1px solid lightgray', paddingLeft: 7, opacity: 0.9, paddingTop: 3, paddingRight: 5 }
  const style2 = { border: '2px solid #3694FF', paddingLeft: 5, paddingTop: 3, paddingRight: 5 }
  var orderitems;

  const highLightItemStyle = (each, index) => {
    // console.log('getMyStyle481,each', each);
    // console.log('getMyStyle481,index', index);

    if (data.highLightItem && data.highLightItem.type === 'update') {
      orderitems = data.highLightItem.orderItemId
      // 高亮对应orderItemId
      if (each.id == orderitems) return style2
      else return style1
    } else {
      // 高亮最新
      if (index == 0) return style2
      else return style1
    }
  }

  console.log('currentOrderItems145', currentOrderItems);

  return (
    <section>
      {/* <h3> Order Detail</h3> */}
      <Card
        bordered={false}
        bodyStyle={{ padding: '0 2px 40px 2px' }}
        extra={fromPage === 'Payment' ? null : Buttons}
      >
        <div style={demoInfiniteContainer}>
          <Row gutter={[22, 22]}>
            {
              fromPage === 'Payment' ? null : <>
                <Col xl={span1} lg={span1} md={span1} sm={span1} xs={span1} style={{ fontWeight: 700, marginTop: 5 }}>
                  Barcode
                </Col>

                <Col xl={10} lg={10} md={10} sm={10} xs={10} >
                  <Input
                    value={currentSearchValue}
                    onKeyDown={(event) => {
                      if (event.keyCode == 13) {
                        currentSearchValue !== '' && onSearchItemClick(event.target.value)
                        setCurrentValue('')
                      }
                    }}
                    onChange={(event) => {
                      console.log('Barcode, event', event);
                      setCurrentValue(event.target.value)
                    }}
                  ></Input>
                </Col>
              </>
            }
          </Row>

          <Row>
            <Col xl={span} lg={span} md={span} sm={span} xs={span} style={{ fontWeight: 700, marginTop: 5 }}>
              Item Name
            </Col>

            <Col xl={qSpan} lg={qSpan} md={qSpan} sm={qSpan} xs={qSpan} style={{ fontWeight: 700, marginTop: 5 }}>
              Qty
            </Col>

            <Col xl={priceSpan} lg={priceSpan} md={priceSpan} sm={priceSpan} xs={priceSpan} style={{ fontWeight: 700, marginTop: 5 }}>
              Price
            </Col>

            <Col xl={priceSpan} lg={priceSpan} md={priceSpan} sm={priceSpan} xs={priceSpan} style={{ fontWeight: 700, marginTop: 5 }}>
              Total
            </Col>
          </Row>

          {/* ----------------------------- 渲染内容 ----------------------------- */}
          {currentOrderItems && currentOrderItems.map((each, index) => {
            console.log('currentOrderItems14918', each);
            return (
              <>
                <Row style={highLightItemStyle(each, index)}>
                  <Col
                    xl={span} lg={span} md={span} sm={span} xs={span}
                    style={{
                      fontWeight: 500,
                      margin: '5px 0px'
                    }}
                    onClick={(e) => { !canNotDelete && onItemClick(e, each) }}
                  >
                    {getItemName(each, each.quantity)}
                  </Col>

                  <Col xl={qSpan} lg={qSpan} md={qSpan} sm={qSpan} xs={qSpan}
                    style={{
                      fontWeight: 500,
                      margin: '10px 0px',
                      // border: '1px solid red'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      !canNotDelete && editAndDelete('edit', each);
                    }}
                  >
                    {`${each.quantity}`}
                  </Col>

                  <Col xl={priceSpan} lg={priceSpan} md={priceSpan} sm={priceSpan} xs={priceSpan} style={{
                    fontWeight: 500,
                    margin: '10px 0px',
                    // border: '1px solid red'
                  }}>
                    {`$${each.commitPriceInclGst.toFixed(2)}`}
                  </Col>

                  <Col xl={priceSpan} lg={priceSpan} md={priceSpan} sm={priceSpan} xs={priceSpan} style={{ fontWeight: 500, margin: '10px 0px' }}>
                    {`$${(each.commitPriceInclGst * each.quantity).toFixed(2)}`}
                  </Col>

                  {/* ------------------------------ 编辑、删除 ------------------------------  */}
                  <Col xl={3} lg={3} md={3} sm={3} xs={3} style={{ fontWeight: 500, margin: '10px 0px' }}>
                    {(canNotDelete || fromPage === 'Payment') ? [] :
                      [
                        <a
                          style={{ margin: '10px 10px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!canNotDelete) {
                              editAndDelete('edit', each);
                            }
                          }}
                        >
                          <EditTwoTone />
                        </a>,

                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            !canNotDelete &&
                              Modal.confirm({
                                title: 'Do you want to delete item?',
                                okText: 'Delete',
                                cancelText: 'Cancel',
                                onOk: () => {
                                  editAndDelete('delete', each)
                                },
                              });
                          }}
                        >
                          <DeleteTwoTone twoToneColor="#eb2f96" />
                        </a>,
                      ]
                    }
                  </Col>
                </Row>
                {each.note && <p style={{ color: 'grey', marginLeft: 10 }}>{`Note: ${each.note}`}</p>}
              </>
            )
          })}
        </div>
        <Meta style={{ marginTop: 20, padding: '8px 24px' }} title={footerContent} />
      </Card>
    </section>
  )
}
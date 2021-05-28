
import React, { CSSProperties, useState, useEffect } from 'react';
import UnitDollar from '@/utils/UnitDollar';
import moment from 'moment';
import { message } from 'antd';
import { LocationStaffSmall } from '../LocationStaff/LocationStaffSmall'
import {
  Col,
  Row,
  Button,
} from 'antd';

const size = 14
const fontFamily = "Helvetica"
const footerDetailLeft: CSSProperties = {
  marginLeft: '30px',
};

const footerDetailRight: CSSProperties = {
  float: 'right',
  fontWeight: 500,
  marginRight: '0px',
};

const summaryLeft: CSSProperties = {
  fontWeight: 900,
  fontSize: '20px',
  marginRight: '5px',
  fontFamily: "Helvetica",
};

const summaryRight: CSSProperties = {
  float: 'right',
  fontWeight: 900,
  marginRight: '0px',
  fontSize: '20px',
};

const receiptTotal: CSSProperties = {
  color: 'black',
  fontSize: size + 1,
  fontWeight: 750,
  marginRight: '5px',
  fontFamily: fontFamily,
};

const paymentHeader: CSSProperties = {
  color: 'black',
  fontSize: size,
  fontWeight: 700,
  marginRight: '5px',
  fontFamily: fontFamily,
};

const receiptLeft: CSSProperties = {
  color: 'black',
  fontSize: size,
  fontWeight: 750,
  marginRight: '5px',
  fontFamily: fontFamily,
};

const receiptRight: CSSProperties = {
  color: 'black',
  fontSize: size,
  fontWeight: 750,
  float: 'right',
  marginRight: '-17px',
  fontFamily: fontFamily,
};


export const PaymentFooter = ({
  fromPage,
  showAllPaymentsModal,
  getLastOrder,
  allProps,
  data,
  openLocationModal,
  setLacationStaffVisible,
  oneBranchInfo,
}) => {

  const [display, setDisplay] = useState(false)
  const _currentInvoice = data?.currentInvoice;
  const payments = _currentInvoice && _currentInvoice[0] &&
    (_currentInvoice[0].totalInclGst - _currentInvoice[0].balanceInclGst)

  let currentOrder, gst, discountRate, priceCutInclGst, subTotal, subTotalDiscount, staffId;
  let discount, total, needTopay, paymentHistory, numbers, location, currenInvoice, currentInvoice;
  let staffName, isAnyItem;

  console.log('allProps46',allProps);
  console.log('data168',data);
  

  if (allProps.currentInvoice && allProps.currentInvoice.length !== 0) {
    // 存在Invoice的情况

    currentOrder = _currentInvoice && _currentInvoice[0] && _currentInvoice[0].order || {}
    currentInvoice = allProps.currentInvoice || {}

    console.log('情况1：currentOrder', currentOrder);
    console.log('情况1：currentInvoice', currentInvoice);

    gst = currentOrder.gstAmount
    discountRate = currentOrder.discountRate
    priceCutInclGst = currentOrder.priceCutInclGst
    subTotal = _currentInvoice ? currentOrder.totalInclGst : 0

    subTotalDiscount = subTotal * discountRate;
    discount = priceCutInclGst || subTotalDiscount
    total = subTotal - (priceCutInclGst || discount)
    needTopay = _currentInvoice && _currentInvoice[0] && _currentInvoice[0].balanceInclGst || 0
    paymentHistory = _currentInvoice && _currentInvoice[0] && _currentInvoice[0].payments || []
    numbers = currentOrder.orderItems && currentOrder.orderItems.length

    location = currentOrder.currentLocationName
    staffId = currentOrder.beauticianId
    staffName = currentOrder.beauticianName

    isAnyItem = true

    console.log('PaymentFooter,isAnyItem1',isAnyItem);

  } else {
    // 是Order的情况
    currentOrder = allProps.currentOrder || {}
    currenInvoice = allProps.currenInvoice || {}

    
    console.log('情况2：currentOrder', currentOrder);
    console.log('情况2：currentInvoice', currentInvoice);

    gst = currentOrder.gstAmount
    discountRate = currentOrder.discountRate
    priceCutInclGst = currentOrder.priceCutInclGst
    subTotal = currentOrder.totalInclGst || 0

    subTotalDiscount = subTotal * discountRate;
    discount = priceCutInclGst || subTotalDiscount

    total = subTotal - (priceCutInclGst == 0 ? discount : priceCutInclGst)
    needTopay = currentOrder.totalInclGst || 0
    paymentHistory = []
    numbers = allProps.currentOrder
      && allProps.currentOrder.orderItems && allProps.currentOrder.orderItems.length

    location = currentOrder.currentLocationName
    staffId = currentOrder.beauticianId
    staffName = currentOrder.beauticianName

    isAnyItem = (currentOrder.orderItems && currentOrder.orderItems.length > 0) || false

    console.log('PaymentFooter,isAnyItem2',isAnyItem);
  }

  const checkoutStyle = {
    height: '60px',
    width: '100%',
    margin: '0px',
    background: payments === total ? 'grey' : 'green',
    fontSize: '24px'
  }

  
  
  const islocationApplied1 = oneBranchInfo && oneBranchInfo.isLocationApplied
  const isStaffApplied1 = oneBranchInfo && oneBranchInfo.isBeauticianApplied
  const CheckoutName = payments === total ? 'Finished' : 'Checkout'
  const isLocationStaffApplied = islocationApplied1 || isStaffApplied1 // 针对回溯的情况
  const displayLocal = getLastOrder !== '' || isLocationStaffApplied


  useEffect(() => {
    setDisplay(displayLocal)
  }, [displayLocal]);


  console.log('PaymentFooter,最新的needTopay',needTopay);
  
  const myStyle = ()=> {
    return fromPage === 'MainPage'? { margin: '30px 0' } : { margin: '5px 0' }
  }

  return (
    <section style={myStyle()}>

      {/* ------------------------- Location --------------------- */}
      {fromPage === 'MainPage' && display &&
        <LocationStaffSmall
          data={data}
          staffName={staffName}
          location={location}
          openLocationModal={openLocationModal}
          islocationApplied={islocationApplied1}
          isStaffApplied={isStaffApplied1}
        />}


      {fromPage !== 'PrintReceipt' && <>

        <Row gutter={[20, 16]} style={{marginTop: 10}}>
          <Col span={12}>
            <span style={fromPage === 'Payment' ? footerDetailLeft : {}}>Subtotal</span>
          </Col>

          <Col span={12}>
            <span style={footerDetailRight}>
              <UnitDollar decimalPoint=".00">{subTotal}</UnitDollar>
            </span>
          </Col>
        </Row>
      </>}

      {fromPage === 'MainPage' && (
        <Row gutter={[16, 16]} style={{marginTop: 10}}>
          <Col span={12}>
            <span>Payments</span>
          </Col>

          <Col span={12}>
            <span style={footerDetailRight}>
              <UnitDollar decimalPoint=".00">
                {payments}
              </UnitDollar>
            </span>
          </Col>
        </Row>
      )}

      {(fromPage === 'MainPage') && <>
        <Row gutter={[16, 16]} style={{marginTop: 10}}>
          <Col span={12}>
            <span style={{}}>Balance</span>
            <span></span>
          </Col>

          <Col span={12}>
            <span style={footerDetailRight}>
                <UnitDollar decimalPoint=".00">
                  {needTopay}
                </UnitDollar>
            </span>
            <span></span>
          </Col>
        </Row>
      </>
      }


      { fromPage === 'Payment' &&
        <Row gutter={[16, 16]} style={{marginTop: 10}}>
          <Col span={12}>
            <span style={fromPage === 'Payment' ? footerDetailLeft : {}}>Include Tax</span>
            <span></span>
          </Col>
          <Col span={12}>
            <span style={footerDetailRight}>
              <UnitDollar decimalPoint=".00">{gst}</UnitDollar>
            </span>
          </Col>
        </Row>}

      { fromPage !== 'PrintReceipt' && <Row gutter={[16, 16]} style={{marginTop: 10}}>
        <Col span={12}>
          <span style={summaryLeft}>{`Total (${numbers || 0} items)`}</span>
        </Col>

        <Col span={12}>
          <span style={summaryRight}>
            <UnitDollar decimalPoint=".00">{total}</UnitDollar>
          </span>
        </Col>
      </Row>}

      { fromPage === 'MainPage' &&
        <Row gutter={[16, 16]} style={{marginTop: 10}}>
          <Col span={24}>
            <Button
              style={checkoutStyle}
              disabled={payments === total}
              onClick={() => {
                // 如果必须选择Location或者Staff的地方，没有选择，要弹出

                if (CheckoutName == 'Checkout') {
  
                  console.log('Checkout,currentOrder',currentOrder);

                  const islocationApplied = oneBranchInfo && oneBranchInfo.isLocationApplied
                  const isStaffApplied = oneBranchInfo && oneBranchInfo.isBeauticianApplied

                  const islocationAppliedLocal = currentOrder.isLocationApplied !== undefined? currentOrder.isLocationApplied: islocationApplied
                  const isBeauticianLocal = currentOrder.isBeauticianApplied !== undefined? currentOrder.isBeauticianApplied: isStaffApplied

                  const flag1 = islocationAppliedLocal && (!location || location === '')
                  const flag2 = isBeauticianLocal && (!staffName || staffName === '')

                  if(!isAnyItem){
                    message.error('You do not select any item.')
                  }
                  else if (flag1 || flag2) {
                    setLacationStaffVisible(true)
                  }
                  else {
                    showAllPaymentsModal()
                  }

                } else {
                  showAllPaymentsModal()
                }
              }}
              type="primary"
              block
            >
              {CheckoutName}
            </Button>
          </Col>
        </Row>
      }


      {/* ----------------------------------- 支付细节款项 ------------------------------------- */}
      { (fromPage === 'Payment') && <>
        { paymentHistory.map(({ paymentModeName, dateTime, amount }) => {
            return (
              <Row gutter={[16, 16]}>

                <Col span={12}>
                  <span style={footerDetailLeft}>
                    {paymentModeName}
                    <span style={{ marginLeft: '30px', fontSize: '10px', display: 'block' }}>
                      {moment(dateTime).format('DD-MM-YYYY HH:mm:ss')}
                    </span>
                  </span>
                </Col>

                <Col span={12}>
                  <span style={footerDetailRight}>
                    <UnitDollar decimalPoint=".00">{amount !== 0 && amount}</UnitDollar>
                    <span style={{ display: 'block' }}></span>
                  </span>
                </Col>
              </Row>
            )
          })}
      </>}

      {/* -------------------------------- Need To Pay -------------------------------- */}
      {(fromPage === 'Payment') && <>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <span style={summaryLeft}>Balance</span>
            <span></span>
          </Col>

          <Col span={12}>
            <span style={summaryRight}>
                <UnitDollar decimalPoint=".00">
                  {needTopay}
                </UnitDollar>
            </span>
            <span></span>
          </Col>
        </Row>
      </>
      }

      {/* ------------------------- PrintReceipt   -------------------------  */}
      { fromPage === 'PrintReceipt' && <div>
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

        {
          paymentHistory.map(({ paymentModeName, dateTime, amount }) => {
            return (
              <Row gutter={[5, 5]}>
                <Col span={10} offset = {1}>
                  <span style={paymentHeader}> {paymentModeName}
                    <span style={{ marginLeft: '0px', fontSize: '11px', display: 'block', color: 'black' }}>
                      {moment(dateTime).format('DD-MM-YYYY HH:mm:ss')}
                    </span>
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
              <UnitDollar decimalPoint=".00">{gst}</UnitDollar>
            </span>
          </Col>
        </Row>

      </div>}
    </section>
  );
};

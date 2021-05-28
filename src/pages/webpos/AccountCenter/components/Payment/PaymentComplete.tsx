import {
  Typography,
  Card,
  Button,
  Result,
} from 'antd';
import { BalanceToPay } from './BalanceToPay'
import React, { useEffect,  useState } from 'react';
import { PrinterTwoTone } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

export const PaymentComplete = ({
  data,
  clearAllStatus,
  completePaymentsModal,
  handleInputChange,
  getFieldDecorator,
  cashOutValue,
  inputValue,
  setPrinterRecord,
  paymentFinished,
  kickCashDrow,
}) => {

  const style = {
    borderRadius: '5px',
    height: '60px',
    width: '70%',
    background: 'green',
    fontSize: '20px'
  }

  const _currentInvoice = data?.currentInvoice;

  const getPaymentChange = () =>{
    return _currentInvoice?.length > 0 && _currentInvoice[0] && _currentInvoice[0].balanceInclGst;
  }

  const scrollToTop = ()=>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera        
  }


  useEffect(()=>{
    console.log('paymentFinished1818841',paymentFinished);
    if(paymentFinished){
      printingFun()
    }
  }, [paymentFinished])

  console.log('_currentInvoice1984', _currentInvoice);
  
  const printingFun = () =>{
    scrollToTop()
    const currentInvoice = _currentInvoice && _currentInvoice[0]
    const record = {
      branchId: currentInvoice.branchId,
      orderId: currentInvoice.orderId,
      invoiceId: currentInvoice.id,
    }
    setPrinterRecord(record)
  }

  return (
    <Card title={paymentFinished? '': "Payment Details"} bordered={false}>
      <BalanceToPay
        fromPage="Payment Result"
        paymentFinished={paymentFinished}
        getFieldDecorator={getFieldDecorator}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        cashOutValue={cashOutValue}
        kickCashDrow={kickCashDrow}
      />

      <Result
        status="success"
        title={ getPaymentChange() > 0 ? `Change $ ${getPaymentChange()}` : `Payment Successful !`}
        extra={[
          <Button
            type="primary"
            key="console"
            block
            style={style}
            onClick={() => {
              completePaymentsModal()
              clearAllStatus()
            }}
          >
            Complete </Button>,
        ]}
      >
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              You can choose the following method to handle receipt:
            </Text>
          </Paragraph>

          <Paragraph>
            <PrinterTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
            <Button
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log('print4554', _currentInvoice);
                printingFun()
              }}
            > Print Receipt</Button>
          </Paragraph>
        </div>
      </Result>
    </Card>
  )
}
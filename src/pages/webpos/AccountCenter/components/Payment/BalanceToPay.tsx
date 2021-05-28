import {
  Typography,
  Row,
  Input,
  Col,
} from 'antd';
import {basicBlue } from '../../../../public-component/color'
import React, { useEffect, useState } from 'react';
import { Form } from '@ant-design/compatible';



export const BalanceToPay = ({
  getFieldDecorator,
  inputValue,
  fromPage,
  handleInputChange,
  cashOutValue,
  paymentFinished,
  kickCashDrow,
}) => {

  const [currentCashoutValue, setCurrentCashoutValue]= useState(0)

  useEffect(()=>{

    if(cashOutValue !== 0){
      setCurrentCashoutValue(cashOutValue)
      if(cashOutValue !== currentCashoutValue && paymentFinished){
        // 避免重复
        console.log('useEffect188,cashOutValue',cashOutValue);
        console.log('useEffect188,paymentFinished',paymentFinished);
        kickCashDrow()
      }
    }
    
  }, [cashOutValue])

  // const kickCashDrow = ()=>{

  //   const EFTPOS_PORTER = 'EFTPOS_PORTER'
  //   const EFTPOS_IP_ADDRESS = 'EFTPOS_IP_ADDRESS'

  //   const address = localStorage.getItem(EFTPOS_IP_ADDRESS) || 'localhost'
  //   const myPort = localStorage.getItem(EFTPOS_PORTER) || '5000'
  //   const requestAddress = `http://${address}:${myPort}/print/cashdraw`
  //   const userName = this.state.currentUserName
  //   console.log('kickCashDrow,userName', userName);

  //   const formData = new FormData();
  //   formData.append("user", userName);

  //   fetch(requestAddress, {
  //     method: 'POST',
  //     body: formData,
  //   }).then((response) => {
  //     console.log('kickCashDrow,response', response);
  //   })
  //   .catch();
  // }

  const style = {
    fontSize: '30px',
    color: 'red',
    fontWeight: 600,
    width: '100%',
    height: '60px',
    textAlign: 'center',
  }

  const style1 = {
    fontSize: '30px',
    color: basicBlue,
    fontWeight: 600,
    width: '100%',
    height: '60px',
    textAlign: 'center',
  }

  return (
    <>
      {fromPage === 'Payment Modes' && <Row gutter={[16, 16]}>
        <Col span={10} style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '30px', color: 'red' }}>Amount to pay:</h1>
        </Col>

        <Col span={10} style={{ textAlign: 'left' }}>
          <Form.Item>
            {getFieldDecorator('amountToPay', {
              rules: [
                {
                  required: true,
                  message: 'Please input your amount.',
                },
              ],
              initialValue: `${0}`, 
            })(
              <Input
                value={inputValue} // 实时显示
                onChange={handleInputChange}
                style={style}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>}


      { (fromPage === 'Payment Result' && cashOutValue !== 0) && <Row gutter={[16, 16]}>
        <Col span={10} style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '30px', color: basicBlue }}>Change:</h1>
        </Col>

        <Col span={10} style={{ textAlign: 'left' }}>
          <Form.Item>
            {getFieldDecorator('cashout', {
              initialValue: `${cashOutValue}`,
            })(
              <Input
                value={cashOutValue}
                style={style1}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>}
    </>
  )
}
import {
    Card,
    Col,
    Row,
    message,
} from 'antd';
import { BalanceToPay } from './BalanceToPay'
import React, { CSSProperties, useState, useEffect } from 'react';
import sort from 'fast-sort';
import cash from './img/cash.png'
import pos from './img/pos.png'

const { Meta } = Card;
const span = 12;
const clickedStyle = { border: '3px solid lightgrey' }

const imageStyle: CSSProperties = {
    objectFit: 'cover',
    width: '99%',
    height: '140px',
};

export const PaymentModes = ({
    data, form, 
    paymentFinished,
    paymentModesList, 
    getFieldDecorator, 
    handleInputChange,
    inputValue, 
    onPaymentMethodComfirm, 
    setInputValue, visibleAllPayments,
    cashOutValue, setCashOutValue,kickCashDrow
}) => {

    const [clickIndex, setClickIndex] = useState("")
    const [currentBalance, setCurrentBalance] = useState(0)
    const [paymentModes, setPaymentModes] = useState([])

    console.log('PaymentModes88=', data);
    console.log('PaymentModes88,inputValue=', inputValue);

    const currentOrder = data?.currentOrder;
    const currentInvoice = data?.currentInvoice;

    console.log('PaymentModes88, currentInvoice=', currentInvoice);
    console.log('PaymentModes88, currentOrder=', currentOrder);

    let total, priceCutInclGst, discountRate, discount, amountToPay, balance

    useEffect(()=>{
        if(paymentFinished){ setPaymentModes([])}
    },[paymentFinished])

    useEffect(()=>{
        setPaymentModes(paymentModesList)
    },[paymentModesList])

    useEffect(() => {
        // 计算当前需要支付的Balance
        if (visibleAllPayments) {
            if (currentInvoice && currentInvoice.length !== 0) {
                amountToPay = currentInvoice[0] && currentInvoice[0].balanceInclGst
                balance = currentInvoice[0] && currentInvoice[0].balanceInclGst
                setCurrentBalance(balance)
            } else {
                total = currentOrder.totalInclGst || 0;
                priceCutInclGst = currentOrder?.priceCutInclGst || 0;
                discountRate = currentOrder.discountRate || 0;
                discount = priceCutInclGst || total * discountRate;
                amountToPay = total - discount
                balance = total - discount
                setCurrentBalance(balance)
            }

            setInputValue(amountToPay) // 用来填写付款信息的
            form.setFieldsValue({
                amountToPay: amountToPay,
            });
        }
    }, [visibleAllPayments, currentInvoice]);


    const multiplePaymentModes = () => {
        const currentPaymentAmount: number = parseFloat(currentBalance < inputValue ? currentBalance: inputValue);
        sort(paymentModes).asc(each => each.name)
        
        return (
            <div style={{ padding: '20px' }}>

                <Row gutter={[40, 30]}>

                    {Array.isArray(paymentModes) && paymentModes.map(each => {
                        console.log('paymentModesList,each111=', each);
                        let imageSrc = each.imagePath ? `http://beautiesapi.gcloud.co.nz/${each.imagePath}`: 'NO';
                        let paymentName = each.name;
                        const title = each.moniker ? `${each.name} (${each.moniker})` : `${each.name}`

                        if(each.name == 'Cash') imageSrc = cash 
                        else if(each.name == 'EftPos') imageSrc = pos
                        else imageSrc = imageSrc 

                        return (
                            <>
                                {each.active ?
                                    <Col span={span} >
                                        <Card
                                            style={clickIndex === each.name ? clickedStyle : {}}
                                            hoverable
                                            cover={ imageSrc !== 'NO'?
                                                <img
                                                    alt='Payment Mode Image'
                                                    src={imageSrc}
                                                    style={imageStyle}
                                                /> : <div style ={imageStyle}></div>
                                            }

                                            onClick={() => {
                                                setClickIndex(each.name)
                                                const cashout = inputValue - currentBalance
                                                onPaymentMethodComfirm(each.paymentId, paymentName, currentPaymentAmount, cashout)
                                                console.log('onPaymentMethodComfirm,currentBalance', currentBalance);
                                                console.log('onPaymentMethodComfirm,inputValue', inputValue);
                                                
                                                if (currentBalance < inputValue) {
                                                    setCashOutValue(inputValue - currentBalance)
                                                }
                                            }}
                                        >
                                            <Meta
                                                title={title}
                                                description={each.note ? `Note: ${each.note}` : `Note:`}
                                            />
                                        </Card>

                                    </Col> : null
                                }
                            </>

                        )
                    })}
                </Row>
            </div>
        );
    };

  

    return (
        <Card 
        bordered={false}>
            <BalanceToPay
                fromPage="Payment Modes"
                getFieldDecorator={getFieldDecorator}
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                cashOutValue={cashOutValue}
                kickCashDrow={kickCashDrow}
                paymentFinished={paymentFinished}
            />

            <h2 style={{color: 'lightgray'}}>Select a payment mode: </h2>
            {multiplePaymentModes()}
        </Card>
    );
};
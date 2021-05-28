import {
    Card,
    Col,
    Row,
    List,
    Modal,
    PageHeader,
} from 'antd';
import React, { useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { PaymentModes } from './PaymentModes';
import { PaymentComplete } from './PaymentComplete';
import { OrderDetails } from '../Orders/OrderDetails'
const { Meta } = Card;

export const PaymentMainPage = ({
    data,
    visibleAllPayments,
    paymentFinished,
    closeAllPaymentsModal,
    paymentFooterContent,
    isFieldTouched,
    getFieldError,
    allProps,
    clearAllStatus,
    openLocationModal,
    showAllPaymentsModal,
    completePaymentsModal,
    setRef,
    renderContent,
    getFieldDecorator,
    getFieldsError,
    hasErrors,
    getFieldValue,
    dispatch,
    inputValue,
    form,
    setInputValue,
    currentBranchId,
    paymentModesList,
    handleInputChange,
    onPaymentMethodComfirm,
    setPrinterRecord,
    isPaymentClicked,
    kickCashDrow,
    oneBranchInfo,
}) => {

    const [cashOutValue, setCashOutValue] = useState(0)

    const paymentStatus = () => {
        const emailError = isFieldTouched('emailReceipt') && getFieldError('emailReceipt');

        return paymentFinished ? (
            <PaymentComplete
                oneBranchInfo={oneBranchInfo}
                allProps={allProps}
                kickCashDrow={kickCashDrow}
                data={data}
                cashOutValue={cashOutValue}
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                clearAllStatus={clearAllStatus}
                openLocationModal={openLocationModal}
                showAllPaymentsModal={showAllPaymentsModal}
                completePaymentsModal={completePaymentsModal}
                setRef={(ref) => setRef(ref)}
                renderContent={renderContent}
                getFieldDecorator={getFieldDecorator}
                emailError={emailError}
                hasErrors={hasErrors}
                paymentFinished={paymentFinished}
                getFieldsError={getFieldsError}
                getFieldValue={getFieldValue}
                setPrinterRecord={setPrinterRecord}
            />
        ) : (
            <PaymentModes
                oneBranchInfo={oneBranchInfo}
                dispatch={dispatch}
                kickCashDrow={kickCashDrow}
                data={data}
                paymentFinished={paymentFinished}
                inputValue={inputValue}
                form={form}
                cashOutValue={cashOutValue}
                setCashOutValue={(value) => setCashOutValue(value)}
                visibleAllPayments={visibleAllPayments}
                setInputValue={(value) => setInputValue(value)}
                currentBranchId={currentBranchId}
                paymentModesList={paymentModesList}
                getFieldDecorator={(m, n) => getFieldDecorator(m, n)}
                handleInputChange={handleInputChange}
                onPaymentMethodComfirm={onPaymentMethodComfirm}
            />
        );
    };

    console.log('PaymentMainPage,data', data);

    const paymentModal = <Modal
        closable={false}
        width="103%"
        style={{ top: 0, left: 0 }}
        bodyStyle={{ padding: '0px' }}
        visible={visibleAllPayments}
        footer={null}
    >
        <PageHeader
            style={{ border: '1px solid rgb(235, 237, 240)' }}
            onBack={paymentFinished ? undefined : closeAllPaymentsModal}
            title={
                paymentFinished ? (
                    'Checkout Completed'
                ) : (
                    <a style={{ fontSize: 30 }} onClick={closeAllPaymentsModal}>Back</a>
                )
            }
        />

        <GridContent>
            <Row gutter={24}>
                <Col lg={12} md={24} style={{ padding: '30px 30px' }}>
                    <OrderDetails
                        fromPage='Payment'
                        data={data}
                        handleSaveOrder={() => { }}
                        handleDeleteOrder={() => { }}
                        handleResumeOrder={() => { }}
                        editAndDelete={() => { }}
                        footerContent={paymentFooterContent}
                    />
                </Col>

                <Col lg={12} md={24}>
                    {paymentStatus()}
                </Col>
            </Row>
        </GridContent>
    </Modal>

    console.log('PaymentModal,isPaymentClicked', isPaymentClicked);
    
    const maskSty = {
        position: 'absolute',
        top:0,
        left:-1000,
        height: '3000%', 
        width: '3000%', 
        backgroundColor: 'black', 
        opacity: 0.7, 
        zIndex: 2000
    }

    return (
        <section>{isPaymentClicked ? <div >
            <div style={maskSty}> </div>
            {paymentModal}
        </div> :
            <>{paymentModal}</>
        }</section>
    )
}
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { ModalState } from './model';
import PrintReceiptBrowser from './PrintReceipt'
import html2canvas from 'html2canvas';
import { message } from 'antd';

const ReceiptPrinting = ({
  dispatch,
  isPrinterSuccess,
  record = {},
  id,
  token,
  branchId,
  orderId,
  invoiceId,
}) => {

  const [currentInvoice, setCurrentInvoice] = useState({})
  const [oneBranchInfo, setOneBranchInfo] = useState({})
  const [currentOrderDetail, setCurrentOrder] = useState({})

  console.log('ReceiptPrinting,isPrinterSuccess', isPrinterSuccess);

  useEffect(() => {
    console.log('record110', record);
    console.log('useEffect,dispatch', dispatch);


    if (branchId && orderId && invoiceId ) {
      // alert('收到全部的数据')
      dispatch({
        type: 'receiptPrinting/fetchOneBranch',
        payload: {
          branchId: branchId,
          token: token,
        },
        callback: (res) => {
          console.log('fetchOneBranch,res', res);
          setOneBranchInfo(res)
        },
      });

      dispatch({
        type: 'receiptPrinting/fetchOneOrder',
        payload: {
          branchId: branchId,
          orderId: orderId,
          token: token,
        },
        callback: (res) => {
          console.log('fetchOneOrder,res', res);
          setCurrentOrder(res)
        },
      });

      dispatch({
        type: 'receiptPrinting/fetchOneInvoice',
        payload: {
          invoiceId: invoiceId,
          orderId: orderId,
          branchId: branchId,
          token: token,
        },
        callback: (res) => {
          console.log('fetchOneInvoic,res', res);
          setCurrentInvoice(res)
        },
      });
    }
  }, [branchId, orderId, invoiceId])


  return (
    <PrintReceiptBrowser
      currentInvoice={currentInvoice}
      oneBranchInfo={oneBranchInfo}
      currentOrderDetail={currentOrderDetail}
    />
  );
}


export default connect(
  ({
    receiptPrinting: { allReceiptInfo },
    InvoicesFinishedData,
  }: {
    receiptPrinting: ModalState;
    InvoicesFinishedData: any;
  }) => ({
    InvoicesFinishedData,
    allReceiptInfo,
  }),
)(ReceiptPrinting);

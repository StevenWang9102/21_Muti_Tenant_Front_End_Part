import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { ModalState } from './model';
import PrintReceipt1 from './components/PrintReceipt'
import { useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas';

const ReceiptPrinting = ({
  dispatch,
  match
}) => {

  const [currentInvoice, setCurrentInvoice] = useState({})
  const [oneBranchInfo, setOneBranchInfo] = useState({})
  const [currentOrderDetail, setCurrentOrder] = useState({})

  console.log('ReceiptPrinting,useLocation', useLocation());
  console.log('ReceiptPrinting,match', match);

  const query = useLocation().query
  const branchId = query.branchId
  const orderId = query.orderId
  const invoiceId = query.invoiceId
  const token = query.token

  console.log('ReceiptPrinting,branchId', branchId);
  console.log('ReceiptPrinting,orderId', orderId);
  console.log('ReceiptPrinting,invoiceId', invoiceId);

  useEffect(() => {
    // ------------------------ 设置当前 Branch Info ------------------------
    dispatch({
      type: 'receiptPrinting1/fetchOneBranch',
      payload: {
        branchId: branchId,
        token: token,
      },
      callback: (res) => {
        console.log('fetchOneBranch,res', res);
        setOneBranchInfo(res)
      },
    });

    // ------------------------ 设置当前 Order ------------------------
    dispatch({
      type: 'receiptPrinting1/fetchOneOrder',
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

    // ------------------------ 设置当前Invoice ------------------------
    dispatch({
      type: 'receiptPrinting1/fetchOneInvoice',
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
  }, [])

  return (
    <div id="myprint">
      <PrintReceipt1
        currentInvoice={currentInvoice}
        oneBranchInfo={oneBranchInfo}
        currentOrderDetail={currentOrderDetail}
      />
    </div>
  );
}


export default connect(
  ({
    receiptPrinting1: { allReceiptInfo },
    InvoicesFinishedData,
  }: {
    receiptPrinting1: ModalState;
    InvoicesFinishedData: any;
  }) => ({
    InvoicesFinishedData,
    allReceiptInfo,
  }),
)(ReceiptPrinting);

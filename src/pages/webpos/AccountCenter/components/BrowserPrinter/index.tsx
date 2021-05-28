import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { ModalState } from './model';
import PrinterBody from './PrintReceipt'

const ReceiptServerPrinter = ({
  allInformation,
}) => {

  const oneBranchInfo = allInformation.oneBranchInfo || {}
  const currentOrderDetail = allInformation.currentOrder || {}
  const currentInvoice = allInformation.currentInvoice || {}

  return (
    <PrinterBody
      oneBranchInfo={oneBranchInfo}
      currentOrderDetail={currentOrderDetail}
      currentInvoice={currentInvoice}
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
)(ReceiptServerPrinter);

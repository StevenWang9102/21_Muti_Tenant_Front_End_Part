import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { ModalState } from './model';
import PrinterBody from './PrintReceipt'

const BrowserPrinter = ({
  allInformation,
  oneBranchInfoForPrinter,
}) => {

  // const oneBranchInfo = allInformation.oneBranchInfo || {}
  const currentInvoice = allInformation.currentInvoice || {}
  const currentOrderDetail = allInformation.currentOrder || {}

  return (
    <PrinterBody
      oneBranchInfo={oneBranchInfoForPrinter}
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
)(BrowserPrinter);

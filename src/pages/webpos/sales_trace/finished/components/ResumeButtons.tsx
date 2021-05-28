import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import UndoIcon from '@material-ui/icons/Undo';
import PrintIcon from '@material-ui/icons/Print';
import ReactToPrint from 'react-to-print';
import PrintReceipt from './PrintReceipt';
import PrintReceiptBrowser from './BrowserPrinter'
import { getToken } from '@/utils/authority';
import html2canvas from 'html2canvas';
// import { history } from 'umi';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(0.5),
    },
  }),
);

// ------------------------------- ResumeButtons ------------------------------------------------
const ResumeButtons = ({
  record = null,
  invoiceData,
  setRecord,
  handleRefundOrder,
  setVisible,
  isPrinterSuccess,
  multiOrderDetails
}) => {
  
  const classes = useStyles();
  console.log('ResumeButtons,isPrinterSuccess', isPrinterSuccess);

  var myRef = PrintReceipt // 初始化 

  const paymentHistory = invoiceData.currentInvoice && invoiceData.currentInvoice.payments
  console.log('ResumeButtons, paymentHistory', paymentHistory);
  console.log('ResumeButtons, multiOrderDetails', multiOrderDetails);
  console.log('ResumeButtons,isPrinterSuccess', isPrinterSuccess);


  const scrollToTop = ()=>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera        
  }

  return (
    <section>
      
      <Tooltip title="Print" aria-label="Print" style={{ padding: 5 }}>
        <Fab
          size="small"
          color="primary"
          className={classes.margin}
          onClick={(e) => {
            scrollToTop() // 首先回到顶部，否则打印出现空白
            setRecord(record)
            console.log('ResumeButtons,record185', record);
            console.log('ResumeButtons, paymentHistory213', paymentHistory);
          }}
        >
          <PrintIcon 
            style={{ marginTop: 0 }} 
          />

        </Fab>
      </Tooltip>

      <Tooltip title="Refund" aria-label="Refund">
        <Fab
          size="small"
          color="secondary"
          className={classes.margin}
          onClick={(e) => {
            e.stopPropagation();
            handleRefundOrder(record)
          }}
        >
          <UndoIcon />
        </Fab>
      </Tooltip>

    </section>
  );
};

export default ResumeButtons;

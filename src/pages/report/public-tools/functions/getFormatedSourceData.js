import dateFormat from 'dateformat'
import {
  today, yesterday, thisWeekStart, thisWeekEnd, thisMonthStart,
  thisMonthEnd, lastWeekStart, lastWeekEnd, lastMonthStart, lastMonthEnd,
   tomorrow, thisYearStart, thisYearEnd,
  last12MonthStart, last12MonthEnd, lastYearStart, lastYearEnd
} from './dates';


export const getFormatedSourceData = (type, salesData,) => {

  const fomatedMonthlySalesData = {};
  
  if(type==='Only_Month')
  {
    if (salesData) {
      for (let i = 0; i < salesData.length; i++) {
        let element = salesData[i];
  
        fomatedMonthlySalesData[`${element.invoiceMonth}`] = {
          invoiceYear: element.invoiceYear,
          invoiceMonth: element.invoiceMonth,
          totalInclGst: element.totalInclGst,
          profitInclGst: element.profitInclGst,
          invoiceQuantity: element.invoiceQuantity,
        };
      }
    }
  } else {
    if (salesData) {
      for (let i = 0; i < salesData.length; i++) {
        let element = salesData[i];
  
        fomatedMonthlySalesData[`${element.invoiceYear}-${element.invoiceMonth}`] = {
          invoiceYear: element.invoiceYear,
          totalInclGst: element.totalInclGst,
          profitInclGst: element.profitInclGst,
          invoiceQuantity: element.invoiceQuantity,
        };
      }
    }
  }
  
  return fomatedMonthlySalesData
}
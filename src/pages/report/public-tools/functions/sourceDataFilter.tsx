import {
  month,
  year,
  monthsNames,
  monthsNames2,
  weeksDays,
  thisWeekDaysFormated2,
  lastWeekDaysFormated1,
  lastThreeMonthStartMoment,
  lastThreeMonthEndMoment,
  lastWeekDaysFormated2,
  lastWeekDaysFormated,
  thisWeekDaysFormated,
  thisWeekDaysFormated3,
  thisMonthStartMoment,
  thisMonthEndMoment,
  lastMonthStartMoment,
  lastMonthEndMoment,
} from './dates';
import dateFormat from 'dateformat';
import { makeOneXandYSource } from './makeOneXandYSource'
import { compare } from './compare'
import { makeAnyDaySource } from './makeAnyDaySource'
import { getFormatedSourceData } from './getFormatedSourceData'
import moment from 'moment';

interface sourceDataFilterInterface {
  type: string,
  number: number,
  salesData: object,
  startTime: any,
  endTime: any,
  isPayment: boolean,
  fromPage: string
}

export const sourceDataFilter = (
  type, number, salesData, startTime, endTime, isPayment, fromPage)
  : sourceDataFilterInterface => {
  var sourceData = [[], [], []];

  // 转换数据结构：月份作为索引
  const fomatedMonthlySalesData = {};
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

  const fomatedMonthlySalesData1 = {};
  if (salesData) {
    for (let i = 0; i < salesData.length; i++) {
      let element = salesData[i];
      fomatedMonthlySalesData1[element.invoiceDate && element.invoiceDate.slice(0, 10)] = {
        invoiceDate: element.invoiceDate,
        totalInclGst: element.totalInclGst,
        profitInclGst: element.profitInclGst,
        invoiceQuantity: element.invoiceQuantity,
      };
    }
  }

  const filterOfMonthlyReport = () => {
    const startYear = dateFormat(startTime, 'yyyy');
      const startMonth = dateFormat(startTime, 'm');
      const endYear = dateFormat(endTime, 'yyyy');
      const endMonth = dateFormat(endTime, 'm');

      let times = 0;

      if (startYear === endYear) {
        times = Number(endMonth) - Number(startMonth) + 1;
      } else {
        const years = Number(endYear) - Number(startYear);
        const months = Number(endMonth) - Number(startMonth);
        times = 12 * years + months + 1;
      }

      let gap = 0;
      for (let i = 0; i < times; i++) {
        let monthNum =
          Number(startMonth) + i <= 12 ? Number(startMonth) + i : Number(startMonth) + i - 12;
        let yearNum;

        if (Number(startMonth) + i === 13) {
          gap = gap + 1;
        }

        yearNum = Number(startYear) + gap;
        let index = `${yearNum}-${monthNum}`;

        sourceData[0].push({
          x: `${monthsNames[monthNum - 1]}/${yearNum}`,
          y: fomatedMonthlySalesData[index] ? fomatedMonthlySalesData[index].totalInclGst : 0,
        });

        sourceData[1].push({
          x: `${monthsNames[monthNum - 1]}/${yearNum}`,
          y: fomatedMonthlySalesData[index] ? fomatedMonthlySalesData[index].profitInclGst : 0,
        });

        sourceData[2].push({
          x: `${monthsNames[monthNum - 1]}/${yearNum}`,
          y: fomatedMonthlySalesData[index] ? fomatedMonthlySalesData[index].invoiceQuantity : 0,
        });
      }
  }

  const filterCategoryBranchReportData = () => {
    salesData && salesData.forEach((each, index) => {
      sourceData[0].push({
        'label': each.branchName,
        'Sold Amount': each.totalInclGst,
        'Average Price': (each.totalInclGst / each.itemQuantity).toFixed(1),
        'Sold Quantity': each.itemQuantity,
      })

      sourceData[1].push({
        'item': each.branchName,
        'count': each.itemQuantity,
      })
    })
  }

  const filterOfDailyReport = () =>{
    const newSourceData = [];
      // 检索用
      salesData &&
        salesData.forEach((each, index) => {
          newSourceData[each.invoiceDate.slice(0, 10)] = {
            totalInclGst: each.totalInclGst,
            profitInclGst: each.profitInclGst,
            invoiceQuantity: each.invoiceQuantity,
          };
        });
    return newSourceData
  }

  const filterOfCategoryReport = ()=>{
      salesData && salesData.forEach((each, index) => {
        sourceData[0].push({
          x: each.categoryName,
          y: each.itemQuantity
        })
      })
      sourceData[1] = salesData
      sourceData[0].sort(compare('y')) // 排序
  }

  const filterOfItemTop10Report = () =>{
    // alert('filterOfItemTop10Report')

    console.log('filterOfItemTop10Report', salesData);

      salesData && salesData.forEach((each, index) => {
        if(index <10){
          sourceData[0].push({
            x: each.itemName,
            y: each.itemQuantity
          })
  
          sourceData[1].push({
            x: each.itemName,
            y: each.totalInclGst
          })
  
          sourceData[2].push({
            x: each.itemName,
            y: Math.abs(each.profitInclGst)
          })
        }
      })

      sourceData[0].sort(compare('y'))
      sourceData[1].sort(compare('y')) 
      sourceData[2].sort(compare('y'))
      console.log(sourceData);
  }

  const filterOfItemDailyReport = () =>{
    const indexedSource = {};

    salesData &&
      salesData.forEach((each) => {
        const index = `${each.invoiceDate && each.invoiceDate.slice(0, 10)}`

        indexedSource[index] = {
          totalInclGst: each.totalInclGst,
          profitInclGst: each.profitInclGst,
          invoiceQuantity: each.itemQuantity,
        };
      });
    return indexedSource
  }

  const filterItemBranchReportData = () => {
    salesData && salesData.forEach((each, index) => {
      sourceData[0].push({
        'label': each.branchName,
        'Sold Amount': each.totalInclGst,
        'Average Price': each.totalInclGst / each.itemQuantity,
        'Sold Quantity': each.itemQuantity,
      })

      sourceData[1].push({
        'item': each.branchName,
        'count': each.itemQuantity,
      })
    })
  }

  const filterOfItemDailyReport1 = () =>{
    const itemFormatedSource = {};
    salesData &&
      salesData.forEach((each) => {
        const index = each.invoiceDate && each.invoiceDate.slice(0, 10)
        itemFormatedSource[index] = {
          totalInclGst: each.totalInclGst,
          profitInclGst: each.profitInclGst,
          invoiceQuantity: each.invoiceQuantity,
        };
      });
      return itemFormatedSource
  }

  const filterOfLast12Month = () =>{
    let year = new Date().getFullYear();
    year = year - 1; // 获取去年年份

    for (let i = 0; i < 12; i++) {
      let myMonth2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      if (month - i - 2 === 0) {
        year = year + 1;
      }

      let index = `${year}-${myMonth2[i + month]}`; // 检索数据用的序号
      let invoiceExist = fomatedMonthlySalesData[index]; // 获取对月份的数据
      let x = `${monthsNames2[i + month]}/${year}`;

      sourceData[0].push({
        x: x,
        y: invoiceExist ? fomatedMonthlySalesData[index].totalInclGst : 0,
      });

      sourceData[1].push({
        x: x,
        y: invoiceExist ? fomatedMonthlySalesData[index].profitInclGst : 0,
      });

      sourceData[2].push({
        x: x,
        y: invoiceExist ? fomatedMonthlySalesData[index].invoiceQuantity : 0,
      });
    }
  }

  console.log('sourceDataFilter186,type',type);
  console.log('sourceDataFilter186,fromPage',fromPage);
  
  // ----------------------- 包含分支的搜索 -----------------------
  if (type === 'Branch_Date_Search') {

    console.log('fromPage211', fromPage);
    
    if (fromPage === 'DailyReport') {
      sourceData = makeAnyDaySource(startTime, endTime, fomatedMonthlySalesData1)
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else if (fromPage === 'ItemDailyReport') {
      const formatedSource = filterOfItemDailyReport()
      sourceData = makeAnyDaySource(startTime, endTime.add(1, 'days'), formatedSource)
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if ( fromPage === 'MonthlyReport') {
      filterOfMonthlyReport()
    }
    else {
    }
  }

  // -------------------------- 只有日期的搜索 ---------------------------------
  if (type === 'Only_Date_Search') {

    if (fromPage === 'DailyReport') {
      sourceData = makeAnyDaySource(startTime, endTime, fomatedMonthlySalesData1)
    } 
    
    else if (fromPage === 'ItemDailyReport') {
      const formatedSource = filterOfItemDailyReport()
      sourceData = makeAnyDaySource(startTime,  endTime.add(1, 'days'), formatedSource)
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else if (fromPage === 'CategoryBranchReport') {
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      filterItemBranchReportData()
    }

    else if (fromPage === 'MonthlyReport') {
      filterOfMonthlyReport()
    }
    
    else {
      // alert('需要处理Else语句5')
    }
  }

// ----------------------------- Today / Yesterday -----------------------------
  if (type === 'Today' || type === 'Yesterday') {

    if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    } 
    
    else if (fromPage === 'CategoryBranchReport') {
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      filterItemBranchReportData()
    }

    
    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'ItemDailyReport') {
      const todayData = salesData && salesData[0];
      if (todayData) {
        sourceData[0] = {
          totalSales: todayData.totalInclGst,
          profits: Math.abs(todayData.profitInclGst),
          transactions: todayData.itemQuantity,
          averageSize: todayData.profitInclGst / todayData.invoiceQuantity,
          margin: todayData.totalInclGst - todayData.profitInclGst,
        };
      } else {
        sourceData[0]={}
      }
      console.log('ItemDailyReport4151,salesData', salesData && salesData[0]);
      console.log('ItemDailyReport4151,today', salesData && sourceData[0]);
       
    }

    else if (fromPage === 'DailyReport') {
      const todayData = salesData && salesData[0];
      if (todayData) {
        sourceData[0] = {
          totalSales: todayData.totalInclGst,
          profits: todayData.profitInclGst,
          transactions: todayData.invoiceQuantity,
          averageSize: todayData.profitInclGst / todayData.invoiceQuantity,
          margin: todayData.totalInclGst - todayData.profitInclGst,
        };
      }    
    }
    
    else {
      // alert('需要处理Else语句6')
    }
  }



  // ----------------------------- This Week -----------------------------
  if (type === 'This Week') {
    if (fromPage === 'ItemDailyReport') {
      const indexedSource = filterOfItemDailyReport()
      if (salesData) {
        for (let i = 0; i < 7; i++) {
          let index = thisWeekDaysFormated[i];
          let x = thisWeekDaysFormated3[i];
          let y = indexedSource[index]
          sourceData = makeOneXandYSource(sourceData, index, x, y)
        }
      }
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'CategoryBranchReport') {
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      filterItemBranchReportData()
    }

    else if (fromPage === 'DailyReport') {

      const newSourceData = filterOfDailyReport()

      for (let i = 0; i < 7; i++) {
        const index = thisWeekDaysFormated2[i];
        const x = weeksDays[i]
        const y = newSourceData[index]
        sourceData = makeOneXandYSource(sourceData, index, x, y)
      }
    }

    else {
      // alert('需要处理Else语句7')
    }
  }

  // ----------------------------- Last Week -----------------------------
  if (type === 'Last Week') {
    if (fromPage === 'ItemDailyReport') {
      const indexedSource = filterOfItemDailyReport()
      if (salesData) {
        for (let i = 0; i < 7; i++) {
          let index = lastWeekDaysFormated[i];
          let x = lastWeekDaysFormated2[i];
          let y = indexedSource[index]
          sourceData = makeOneXandYSource(sourceData, index, x, y)
        }
      }
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'DailyReport') {
      const newSourceData = [];

      // 检索用
      salesData &&
        salesData.forEach((each, index) => {
          newSourceData[each.invoiceDate.slice(0, 10)] = {
            totalInclGst: each.totalInclGst,
            profitInclGst: each.profitInclGst,
            invoiceQuantity: each.invoiceQuantity,
          };
        });

      for (let i = 0; i < 7; i++) {
        const index = lastWeekDaysFormated1[i];
        const xAxle = weeksDays[i]
        const yAxle = newSourceData[index]
        sourceData = makeOneXandYSource(sourceData, index, xAxle, yAxle)
      }
    }

    else if (fromPage === 'CategoryBranchReport') {
      console.log(salesData);
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      console.log(salesData);
      filterItemBranchReportData()
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else {
      // alert('需要处理Else语句8')

      const newSourceData = [];
      // 检索用
      salesData &&
        salesData.forEach((each, index) => {
          newSourceData[each.invoiceDate.slice(0, 10)] = {
            totalInclGst: each.totalInclGst,
            profitInclGst: each.profitInclGst,
            invoiceQuantity: each.invoiceQuantity,
          };
        });

      for (let i = 0; i < 7; i++) {
        const index = lastWeekDaysFormated1[i];
        const xAxle = weeksDays[i]
        const yAxle = newSourceData[index]
        sourceData = makeOneXandYSource(sourceData, index, xAxle, yAxle)
      }
    }
  }


  // ----------------------------- This Month -----------------------------
  if (type === 'This Month') {
    console.log(salesData);
  
    if (fromPage === 'ItemDailyReport') {
      const itemFormatedSource = filterOfItemDailyReport1()
      sourceData = makeAnyDaySource(thisMonthStartMoment, thisMonthEndMoment, itemFormatedSource)
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else if (fromPage === 'CategoryBranchReport') {
      console.log(salesData);
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      console.log(salesData);
      filterItemBranchReportData()
    }

    else if (fromPage === 'DailyReport') {
      console.log(salesData);
      const itemFormatedSource = filterOfItemDailyReport1()
      console.log(itemFormatedSource);
      sourceData = makeAnyDaySource(thisMonthStartMoment, thisMonthEndMoment, itemFormatedSource)
      console.log(sourceData);
    }

    else {
      // alert('需要处理Else语句1')
    }
  }


  if (type === 'Last Month') {
    const itemFormatedSource = {};

    // 检索用
    salesData &&
      salesData.forEach((each) => {
        const index = `${each.invoiceDate && each.invoiceDate.slice(8, 10)} day`
        itemFormatedSource[index] = {
          totalInclGst: each.totalInclGst,
          profitInclGst: each.profitInclGst,
          invoiceQuantity: each.itemQuantity,
        };
      });

    if (fromPage === 'ItemDailyReport') {
      const formatedSource = filterOfItemDailyReport()
      sourceData = makeAnyDaySource(lastMonthStartMoment, lastMonthEndMoment, formatedSource)
    } 
    
    else if (fromPage === 'DailyReport') {
      const dailyReportFormatedSource = {};

      // 检索用
      salesData &&
        salesData.forEach((each) => {
          const index = `${each.invoiceDate.slice(8, 10)} day`
          dailyReportFormatedSource[index] = {
            totalInclGst: each.totalInclGst,
            profitInclGst: each.profitInclGst,
            invoiceQuantity: each.invoiceQuantity,
          };
        });

        console.log('DailyReport4816,monthsNames',monthsNames);
        console.log('DailyReport4816,month',month);
        
  
      for (let i = 0; i < 30; i++) {
        let day
        let index = i > 9 ? `${i + 1} day` : `0${i + 1} day`;

        if(month == 0) day = `${i < 10 ? "0" : ''}${i + 1}/${monthsNames[11]}`;
        else  day = `${i < 10 ? "0" : ''}${i + 1}/${monthsNames[month-1]}`;

        sourceData[0].push({
          index: index,
          x: day,
          y: dailyReportFormatedSource[index] ? dailyReportFormatedSource[index]['totalInclGst'] : 0,
        });

        sourceData[1].push({
          index: index,
          x: day,
          y: dailyReportFormatedSource[index] ? dailyReportFormatedSource[index]['profitInclGst'] : 0,
        });

        sourceData[2].push({
          index: index,
          x: day,
          y: dailyReportFormatedSource[index] ? dailyReportFormatedSource[index]['invoiceQuantity'] : 0,
        });
      }

      console.log('sourceData161',sourceData[0]);
      
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else if (fromPage === 'CategoryBranchReport') {
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      filterItemBranchReportData()
    }

    else {
      // alert('需要处理Else语句10')
    }
  }

  if (type === 'Last Three Month') {
  
    if (fromPage === 'DailyReport') {
      sourceData = makeAnyDaySource(
        lastThreeMonthStartMoment, lastThreeMonthEndMoment, fomatedMonthlySalesData1)
    }

    else if (fromPage === 'CategoryBranchReport') {
      filterCategoryBranchReportData()
    }

    else if (fromPage === 'ItemBranchReport') {
      filterItemBranchReportData()
    }

    else if (fromPage === 'ItemTop10Report') {
      filterOfItemTop10Report()
    }

    else if (fromPage === 'ItemDailyReport') {
      const formatedSource = filterOfItemDailyReport()
      sourceData = makeAnyDaySource(lastThreeMonthStartMoment, lastThreeMonthEndMoment, formatedSource)
    }

    else if (fromPage === 'CategoryReport') {
      filterOfCategoryReport()
    }

    else{
      // alert('需要处理Else语句3')
    }
  }

  if (type === 'This Year') {

    for (let i = 0; i < 12; i++) {

      let index = `${year}-${i + 1}`
      let x = monthsNames[i]
      let y = fomatedMonthlySalesData[index]

      sourceData = makeOneXandYSource(sourceData, index, x, y)
    }
  }

  if (type === 'Last 12 Month') {
    filterOfLast12Month()
  }

  if (type === 'Compare_Last_Year') {
    if (fromPage === 'MonthlyReport') {

      const formatedSourceOfLastYear = getFormatedSourceData(salesData && salesData[0])
      const formatedSourceOfThisYear = getFormatedSourceData('Only_Month', salesData && salesData[1])

      const oneYearSource = [{}, {}, {}]
      const twoYearSource = [{}, {}, {}]

      oneYearSource[0]['name'] = (year - 1).toString()
      oneYearSource[1]['name'] = (year - 1).toString()
      oneYearSource[2]['name'] = (year - 1).toString()

      twoYearSource[0]['name'] = year.toString()
      twoYearSource[1]['name'] = year.toString()
      twoYearSource[2]['name'] = year.toString()

      for (let i = 1; i <= 12; i++) {
        const monthName = monthsNames[i - 1]

        // 处理去年数据
        if (formatedSourceOfLastYear[i]) {
          oneYearSource[0][monthName] = formatedSourceOfLastYear[i].totalInclGst
          oneYearSource[1][monthName] = Math.abs(formatedSourceOfLastYear[i].profitInclGst)
          oneYearSource[2][monthName] = formatedSourceOfLastYear[i].invoiceQuantity
        }
        else {
          oneYearSource[0][monthName] = 0
          oneYearSource[1][monthName] = 0
          oneYearSource[2][monthName] = 0
        }

        // 处理今年数据
        if (formatedSourceOfThisYear[i]) {
          twoYearSource[0][monthName] = formatedSourceOfThisYear[i].totalInclGst
          twoYearSource[1][monthName] = Math.abs(formatedSourceOfThisYear[i].profitInclGst)
          twoYearSource[2][monthName] = formatedSourceOfThisYear[i].invoiceQuantity
        }
        else {
          twoYearSource[0][monthName] = 0
          twoYearSource[1][monthName] = 0
          twoYearSource[2][monthName] = 0
        }
      }

      console.log(oneYearSource);
      console.log(twoYearSource);
      sourceData = [oneYearSource, twoYearSource]
    }
  }

  if (type === 'Data with All Date') {
    if (number > 5) {
      for (let i = 0; i < number; i++) {

        sourceData[0].push({
          x: (salesData && salesData[i] && salesData[i].paymentModeName) || '',
          y: (salesData && salesData[i] && salesData[i].amountInclGst) || 0,
        });
      }
    } else {
      for (let i = 0; i < 5; i++) {

        if (salesData && salesData[i]) {
          sourceData[0].push({
            x: (salesData && salesData[i] && salesData[i].paymentModeName) || '',
            y: (salesData && salesData[i] && salesData[i].amountInclGst) || 0,
          });
        }
      }
    }
  }

  // 面包靴的情况
  if (type === 'Data with Query') {
    if (number > 5) {
      for (let i = 0; i < number; i++) {
        let element = salesData && salesData[i];
        sourceData[0].push({
          x: (salesData && salesData[i] && salesData[i].paymentModeName) || '',
          y: (salesData && salesData[i] && salesData[i].amountInclGst) || 0,
        });
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let element = salesData && salesData[i];
        if (salesData && salesData[i]) {
          sourceData[0].push({
            x: (salesData && salesData[i] && salesData[i].paymentModeName) || '空',
            y: (salesData && salesData[i] && salesData[i].amountInclGst) || 0,
          });
        } else {
          sourceData[0].push({
            x: '',
            y: 0,
          });
        }
      }
    }
  }

  return sourceData
};

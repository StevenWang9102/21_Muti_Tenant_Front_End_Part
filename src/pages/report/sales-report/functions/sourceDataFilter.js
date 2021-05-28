export const sourceDataFilter = (type, number, salesData, startTime, endTime, isPayment) => {
  // 初始化数据
  const sourceData = [[], [], []];

  let myDate = new Date();
  let year = myDate.getFullYear();
  let month = myDate.getMonth();

  // 特定格式的月: 2020-09
  let currentYearMonth = `${year}-${month + 1}`;
  let lastYearMonth = `${year - 1}-${month + 1}`;

  // 特定格式的时间: 2020/09/01
  let startTimeFormated = startTime && startTime.replace(/\-/g, '/');
  let startTimeMonth = Date.parse(startTimeFormated);

  let endTimeFormated = endTime && endTime.replace(/\-/g, '/');
  let endTimeSeconds = Date.parse(endTimeFormated);

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

  // 全部时间的支付
  if (type === 'Data with All Date') {
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
            x: (salesData && salesData[i] && salesData[i].paymentModeName) || '',
            y: (salesData && salesData[i] && salesData[i].amountInclGst) || 0,
          });
        }
      }
    }
  }

  // Hourly Report
  if (type === 'Hourly Report - No Branch') {
    console.log(salesData);

    const newSourceData = [];

    salesData &&
      salesData.forEach((each, index) => {
        newSourceData[each.invoiceHour] = {
          totalInclGst: each.totalInclGst,
          invoiceQuantity: each.invoiceQuantity,
        };
      });

    console.log(newSourceData);

    for (let i = 1; i <= 24; i++) {
      sourceData[0].push({
        x: i.toString(),
        tag: 'Sales',
        amount: newSourceData[i] ? newSourceData[i].totalInclGst : 0,
      });

      sourceData[0].push({
        x: `${i}`,
        tag: 'Transactions',
        amount: newSourceData[i] ? newSourceData[i].invoiceQuantity : 0,
      });
    }
    console.log(sourceData[0]);
  }


  if (type === 'Branch Data With Query') {
    console.log('salesData7=',salesData);

    if(salesData && salesData.length < 5) {
      for( var i=0; i< 5; i++){
        const temp = salesData[i] || {}
        sourceData[0].push({
          x: temp.branchName || "",
          y: temp.totalInclGst || 0,
        });
        sourceData[1].push({
          x: temp.branchName || "",
          y: temp.profitInclGst|| 0,
        });
        sourceData[2].push({
          x: temp.branchName || "",
          y: temp.invoiceQuantity || 0,
        });
      }
    } else {
      salesData && salesData.forEach((each, index) => {
        sourceData[0].push({
          x: each.branchName,
          y: each.totalInclGst,
        });
        sourceData[1].push({
          x: each.branchName,
          y: each.profitInclGst,
        });
        sourceData[2].push({
          x: each.branchName,
          y: each.invoiceQuantity,
        });
      });
    }


    console.log(sourceData);
  }
  return sourceData;
};

export const pushSouceData = (type, number, salesData, startTime, endTime) => {

  // 初始化数据   
  const sourceData = [[], [], []]

  let myDate = new Date();
  let year = myDate.getFullYear()
  let month = myDate.getMonth()

  // 特定格式的月: 2020-09
  let currentYearMonth = `${year}-${month + 1}`
  let lastYearMonth = `${year - 1}-${month + 1}`

  // 特定格式的时间: 2020/09/01
  let startTimeFormated = startTime && startTime.replace(/\-/g, '/')
  let startTimeMonth = Date.parse(startTimeFormated)

  let endTimeFormated = endTime && endTime.replace(/\-/g, '/')
  let endTimeSeconds = Date.parse(endTimeFormated)


  // 转换数据结构：月份作为索引
  const fomatedMonthlySalesData = {}
  salesData && salesData.forEach((element, index) => {
    fomatedMonthlySalesData[`${element.invoiceYear}-${element.invoiceMonth}`] = {
      invoiceYear: element.invoiceYear,
      totalInclGst: element.totalInclGst,
      profitInclGst: element.profitInclGst,
      invoiceQuantity: element.invoiceQuantity,
    }
  })


  if (type === 'All Date') {

    let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

    if (number > 12) {
      for (let i = 0; i < number; i++) {
        let element = salesData[i]
        let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        let month = myMonth[element.invoiceMonth - 1] + ' ' + element.invoiceYear

        sourceData[0].push({ x: month, y: element.totalInclGst });
        sourceData[1].push({ x: month, y: element.profitInclGst });
        sourceData[2].push({ x: month, y: element.invoiceQuantity });
      }
    } else {
      // 小于12个月的数据，自动补齐
      for (let i = 0; i < 12; i++) {
        let element = salesData[i]
        // let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        // let month = myMonth[element.invoiceMonth - 1] + ' ' + element.invoiceYear
        let index = `${year}-${i + 1}` // 检索数据用的序号
        let invoiceExist = fomatedMonthlySalesData[index] // 获取对月份的数据

        sourceData[0].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].totalInclGst : 0
        });
        sourceData[1].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].profitInclGst : 0
        });
        sourceData[2].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].invoiceQuantity : 0
        });
      }
    }
  }


  if (type === 'This Year') {
    let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

    for (let i = 0; i < number; i++) {
      let invoiceExist = fomatedMonthlySalesData[`${year}-${i + 1}`] // 检索是否存在

      sourceData[0].push({
        x: myMonth[i],
        y: invoiceExist ? fomatedMonthlySalesData[`${year}-${i + 1}`].totalInclGst : 0,
      });

      sourceData[1].push({
        x: myMonth[i],
        y: invoiceExist ? fomatedMonthlySalesData[`${year}-${i + 1}`].profitInclGst : 0,
      });

      sourceData[2].push({
        x: myMonth[i],
        y: invoiceExist ? fomatedMonthlySalesData[`${year}-${i + 1}`].invoiceQuantity : 0,
      });
    }
  }

  // 过去一年
  if (type === 'Last 12 Month') {

    year = year - 1 // 获取去年年份

    for (let i = 0; i < 12; i++) {
      // let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
      let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
        'Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

      let myMonth2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,]

      if (month - i - 2 === 0) { year = year + 1 }

      let index = `${year}-${myMonth2[i + month]}` // 检索数据用的序号
      let invoiceExist = fomatedMonthlySalesData[index] // 获取对月份的数据   

      sourceData[0].push({
        x: `${myMonth[i + month]}, ${year}`,
        y: invoiceExist ? fomatedMonthlySalesData[index].totalInclGst : 0,
      });

      sourceData[1].push({
        x: `${year}-${myMonth[i + month]}`,
        y: invoiceExist ? fomatedMonthlySalesData[index].profitInclGst : 0,
      });

      sourceData[2].push({
        x: `${year}-${myMonth[i + month]}`,
        y: invoiceExist ? fomatedMonthlySalesData[index].invoiceQuantity : 0,
      });
    }
  }

  // 只有时间搜索的情况
  if (type === 'Only_Date_Search') {

    let startTimeFormated = startTime.replace(/\-/g, '/').slice(0, 7)
    let endTimeFormated = endTime.replace(/\-/g, '/').slice(0, 7)

    if (number >= 12) {
      for (let i = 0; i < number; i++) {

        // 整理月份格式
        let month = salesData[i].invoiceMonth < 10 ? `0${salesData[i].invoiceMonth}` : `${salesData[i].invoiceMonth}`
        let invoiceData = `${salesData[i].invoiceYear}/${month}`

        if (invoiceData >= startTimeFormated && invoiceData <= endTimeFormated) {

          sourceData[0].push({
            x: invoiceData,
            y: salesData[i].totalInclGst,
          });

          sourceData[1].push({
            x: invoiceData,
            y: salesData[i].profitInclGst,
          });

          sourceData[2].push({
            x: invoiceData,
            y: salesData[i].invoiceQuantity,
          });
        }
      }
    } else {
      // 小于12个月的时候，加入默认值

      for (let i = 0; i < 12; i++) {
        let index = `${year}-${i + 1}` // 检索数据用的序号
        let invoiceExist = fomatedMonthlySalesData[index] // 获取对月份的数据

        let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

        sourceData[0].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].totalInclGst : 0
        });

        sourceData[1].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].profitInclGst : 0
        });

        sourceData[2].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedMonthlySalesData[index].invoiceQuantity : 0
        });
      }
    }
  }

  // 分支和时间同时选择的情况
  if (type === 'Branch_Date_Search') {

    let fomatedOneBranchData = {}

    salesData && salesData.forEach((element, index) => {
      let invoiceYear = element.invoiceDate && element.invoiceDate.slice(0, 4)
      let invoiceMonth = element.invoiceDate && element.invoiceDate.slice(5, 7)

      fomatedOneBranchData[`${invoiceYear}-${invoiceMonth}`] = {
        invoiceYear: invoiceYear,
        totalInclGst: element.totalInclGst,
        profitInclGst: element.profitInclGst,
        invoiceQuantity: element.invoiceQuantity,
      }
    })

    if (number < 12) {
      for (let i = 0; i < 12; i++) {
        let index = `${year}-${i < 10 ? "0" : ""}${i + 1}` // 检索数据用的序号
        let invoiceExist = fomatedOneBranchData[index] // 获取对月份的数据

        let myMonth = ['Jan', "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

        sourceData[0].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedOneBranchData[index].totalInclGst : 0
        });

        sourceData[1].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedOneBranchData[index].profitInclGst : 0
        });

        sourceData[2].push({
          x: myMonth[i],
          y: invoiceExist ? fomatedOneBranchData[index].invoiceQuantity : 0
        });
      }
      return sourceData
    } else {
      for (let i = 0; i < number; i++) {

        let element = salesData[i]
        let invoiceData = element.invoiceDate.slice(0, 10)
        let invoiceData1 = invoiceData.replace(/\-/g, '/')
        let invoiceData2 = Date.parse(invoiceData1)

        if (invoiceData2 >= startTimeMonth && invoiceData2 <= endTimeSeconds) {

          sourceData[0].push({
            x: invoiceData1,
            y: salesData[i].totalInclGst,
          });

          sourceData[1].push({
            x: invoiceData1,
            y: salesData[i].profitInclGst,
          });

          sourceData[2].push({
            x: invoiceData1,
            y: salesData[i].invoiceQuantity,
          });
        }
      }
      return sourceData
    }
  }
  return sourceData
}
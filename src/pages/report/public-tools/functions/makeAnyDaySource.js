import dateFormat from 'dateformat';
import moment from 'moment';

export const makeAnyDaySource = (startTime, endTime, fomatedMonthlySalesData1) => {
    // alert('makeAnyDaySource')
    // 用途：任意时间起点和终点，对数据进行转化
    const sourceData = [[],[],[]]
    const dayGap = (endTime - startTime) / 1000 / 60 / 60 / 24; // 换算成时间差

    for (var i = 0; i <= dayGap; i++) {
        const index = dateFormat(startTime, 'yyyy-mm-dd') // 检索用的， 但是每次会自增一次
    
        sourceData[0].push({
            x: dateFormat(startTime, 'dd/mmm'),
            y: fomatedMonthlySalesData1[index] ? fomatedMonthlySalesData1[index].totalInclGst : 0
        });

        sourceData[1].push({
            x: dateFormat(startTime, 'dd/mmm'),
            y: fomatedMonthlySalesData1[index] ? fomatedMonthlySalesData1[index].profitInclGst : 0
        });

        sourceData[2].push({
            x: dateFormat(startTime, 'dd/mmm'),
            y: fomatedMonthlySalesData1[index] ? fomatedMonthlySalesData1[index].invoiceQuantity : 0
        });

        startTime.add(1, 'days') // 增加一天
    }

    startTime.subtract(i, 'days') // 清空自增的数据

    return sourceData
}
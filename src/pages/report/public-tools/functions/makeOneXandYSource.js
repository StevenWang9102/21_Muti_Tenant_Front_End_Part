import dateFormat from 'dateformat';
import moment from 'moment';

export const makeOneXandYSource = (sourceData, index, x, y) => {

    // weekDay 是X轴的数据
    // indexedSource 是被检索的数据源
    sourceData[0].push({
        x: x,
        y: y ? y.totalInclGst : 0,
      });

      sourceData[1].push({
        x: x,
        y: y ? y.profitInclGst : 0,
      });

      sourceData[2].push({
        x: x,
        y: y ? y.invoiceQuantity : 0,
      });

    return sourceData
}
import dateFormat from 'dateformat';
import moment from 'moment';
import { xor } from 'lodash';

export const makeOneXandYSource1 = (sourceData, index, x, y) => {

    sourceData[0].push({
      index: index,
      x: x,
      tag: 'Total Sales',
      amount: y ? y['totalInclGst'] : 0,
    });

    sourceData[1].push({
      index: index,
      x: x,
      tag: 'Profits',
      amount: y ? y['profitInclGst'] : 0,
    });

    sourceData[2].push({
      index: index,
      x: x,
      tag: 'Transactions',
      amount: y ? y['invoiceQuantity'] : 0,
    });

    return sourceData
}
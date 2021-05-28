import { Card } from 'antd';
import { FormattedMessage } from 'umi';
import React, { useEffect } from 'react';
import { PieDataType } from '../data.d';
import PieChart from './Charts/Pie';
import UnitDollar from '@/utils/UnitDollar';
import styles from '../style.less';

export const CategorySalesCard = ({
  loading,
  rangePickerValue,
  requestCategoryData,
  categorySalesData,
}) => {

  useEffect(()=>{
    requestCategoryData()
  }, [rangePickerValue])

  console.log('CategorySalesCard,categorySalesData', categorySalesData);
  
  return <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id="dashboard.the-categories-of-sales.title"
        defaultMessage="The Categories of Sales"
      />
    }
    style={{
      height: '100%',
    }}
  >
    <div>

      <PieChart
        // hasLegend
        subTitle={<FormattedMessage id="dashboard.analysis.sales" defaultMessage="Sales" />}
        total={() => <UnitDollar decimalPoint="">{categorySalesData.reduce((pre, now) => now.y + pre, 0)}</UnitDollar>}
        data={categorySalesData}
        valueFormat={value => <UnitDollar decimalPoint="">{value}</UnitDollar>}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
}
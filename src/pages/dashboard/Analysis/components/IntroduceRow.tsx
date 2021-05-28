import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import { FormattedMessage } from 'umi';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import styles from '../style.less';
import UnitDollar from '@/utils/UnitDollar';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: { marginBottom: 24 },
};

export const IntroduceRow = ({
  loading,
  dailyPaymentsData,
}) => {

  console.log('IntroduceRow,dailyPaymentsData',dailyPaymentsData);
  var totalSale = 0
  var totalProfit = 0
  var totalTransactions = 0
  var days = 0

  dailyPaymentsData && dailyPaymentsData.forEach(each=>{
    totalSale = totalSale + each.totalInclGst
    totalProfit = totalProfit + each.profitInclGst
    totalTransactions = totalTransactions + each.invoiceQuantity
    days = days + 1
  })
  
  const style = {
    width: 40, 
    height: 40 
  }

  return <Row gutter={24} >
    {/* ------------------------- 第一行 ------------------------- */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        contentHeight={60}
        loading={loading}

        avatar={<div><img style={style} src={require('./Icon/sales.png')} alt="indicator"/></div>}

        title={<FormattedMessage id="dashboard.analysis.total-sales-incl-gst" defaultMessage="Total Sales (Include GST)" />}
        total={() => <h5><UnitDollar decimalPoint=".00">{Math.abs(totalSale).toFixed(2)}</UnitDollar></h5>}

        footer={
          <Field 
            label={ <FormattedMessage id="dashboard.analysis.day-sales" defaultMessage="Daily Sales" />}
            value={<UnitDollar decimalPoint=".00">{Math.abs(totalSale/days).toFixed(2)}</UnitDollar>}
          />
        }
      >
      </ChartCard>
    </Col>

    {/* ------------------------- 第二行 ------------------------- */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        contentHeight={46}
        title={<FormattedMessage id="dashboard.analysis.total-sales-excl-gst" defaultMessage="Total Sales (Exclude GST)" />}
        avatar={<div><img style={style} src={require('./Icon/sales1.png')} alt="indicator" /></div>}
        total={() => <h5><UnitDollar decimalPoint=".00">{Math.abs(totalProfit).toFixed(2)}</UnitDollar></h5>}
        footer={
          <Field
            label={<FormattedMessage id="dashboard.analysis.day-sales" defaultMessage="Daily Sales"/>}
            value={<UnitDollar decimalPoint=".00">{Math.abs(totalProfit/days).toFixed(2)}</UnitDollar>}
          />
        }
      >
      </ChartCard>
    </Col>

    {/* ------------------------- 第三行 ------------------------- */}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        contentHeight={46}
        title={<FormattedMessage id="dashboard.analysis.transactions" defaultMessage="Transactions" />}
        avatar={<div><img style={style} src={require('./Icon/transaction.png')} alt="indicator"/></div>}
        total={<h5>{totalTransactions}</h5>}
        footer={
          <Field label={<FormattedMessage id="dashboard.analysis.day-transactions" defaultMessage="Daily Transactions" />}
            value={(totalTransactions/days || 0).toFixed(1)}
          />}
      >
      </ChartCard>
    </Col>
  </Row>
}

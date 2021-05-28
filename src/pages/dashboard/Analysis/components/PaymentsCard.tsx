import { Card } from 'antd';
import { FormattedMessage } from 'umi';
import React from 'react';
import { Bar } from './Charts';
import styles from '../style.less';
import { Button } from 'antd';

export const PaymentsCard = ({
  loading,
  dataSource,
  handlePaymentButtonClass,
  onPaymentTypeChanged
}) => {

  const modeButtons = (
    <div className={styles.salesExtraWrap}>
      <div className={styles.salesExtra}>
        <Button className={handlePaymentButtonClass('hour')} onClick={() => onPaymentTypeChanged('hour')} ><FormattedMessage id="dashboard.payments.hour" defaultMessage="Hour" /></Button>
        <Button className={handlePaymentButtonClass('day')} onClick={() => onPaymentTypeChanged('day')} >Day</Button>
        <Button className={handlePaymentButtonClass('week')} onClick={() => onPaymentTypeChanged('week')} >Week</Button>
        <Button className={handlePaymentButtonClass('month')} onClick={() => onPaymentTypeChanged('month')} >Month</Button>
        <Button className={handlePaymentButtonClass('year')} onClick={() => onPaymentTypeChanged('year')} >Year</Button>
      </div>
    </div>
  )

  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="Payments"
      style={{ height: '100%' }}
      extra={modeButtons}
    >
      <div className={styles.salesBar}>
        <Bar
          height={295}
          title='Sales Trend'
          data={dataSource}
        />
      </div>
    </Card>
  );
}


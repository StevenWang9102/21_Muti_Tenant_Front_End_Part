import {
  Select,
  Row,
  Col,
  Modal,
} from 'antd';

import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION,  ALL_BEAUTICIAN, MY_STAFF_NAME, MY_STAFF_NAME_LOWER, MY_STAFF_NAME_UPPER}  from '../../../../public-component/names'
import React, { useEffect, useState } from 'react';
import {
  HeatMapOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const LocationStaffSmall = ({
  data,
  staffName,
  location,
  openLocationModal,
  islocationApplied,
  isStaffApplied
}) => {

  const currentOrder = data.currentOrder || {}

    // 如果当前订单，已经支付过，则不能修改
    let canNotDelete;
    // let isInVoice = false;
    if (data.currentInvoice) {
      const currentInvoice = data.currentInvoice[0] || {};
      // if(currentInvoice !=={}) isInVoice = true
      if (currentInvoice.balanceInclGst < currentInvoice.totalInclGst)
        canNotDelete = true
      else canNotDelete = false
    } else canNotDelete = false


    const islocationAppliedLocal = currentOrder.isLocationApplied !== undefined? currentOrder.isLocationApplied: islocationApplied
    const isBeauticianLocal = currentOrder.isBeauticianApplied !== undefined? currentOrder.isBeauticianApplied: isStaffApplied

    console.log('LocationStaffSmall,currentOrder', currentOrder);
    console.log('LocationStaffSmall,islocationApplied', currentOrder.isLocationApplied);
    console.log('LocationStaffSmall,isBeauticianApplied', currentOrder.isBeauticianApplied);


    return (
      <Row gutter={[20, 16]}>
        {islocationAppliedLocal && <Col span={24}>
          <a
            onClick={e => {
              e.preventDefault();
              !canNotDelete && openLocationModal();
            }}
          >
            <HeatMapOutlined /> Location: {location}
          </a>
        </Col>}


        {isBeauticianLocal && <Col span={24}>
          <a
            onClick={e => {
              e.preventDefault();
              !canNotDelete && openLocationModal();
            }}
          >
            <UserOutlined /> {MY_STAFF_NAME_UPPER}: {staffName}
          </a>
        </Col>}

      </Row>
  )
}
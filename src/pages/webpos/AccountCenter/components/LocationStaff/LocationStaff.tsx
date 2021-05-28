import {
  Select,
  Button,
  message,
  Modal,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Form } from '@ant-design/compatible';

const FormItem = Form.Item;
const { Option } = Select;


export const LocationStaff = ({
  styles, visibleAllLTs, getFieldDecorator, data, isStaffApplied,
  handleOrderLTSubmit, locationsList, usersList, setCurrentStaff,
  LTsModelType, closeOrderLTModal, islocationApplied, setCurrentLocaiton,
  currentOrder, allProps, oneBranchInfo
}) => {

  const [locationValue, setLocationValue] = useState<any>()
  const [staffValue, setStaffValue] = useState<any>()
  const [visible, setVisible] = useState<any>(false)
  const _currentOrder = data?.currentOrder;


  useEffect(() => {
    setVisible(visibleAllLTs)
    if (visibleAllLTs) {
      // 打开的情况下 
      const _currentInvoice = data?.currentInvoice;
      let currentOrder, location, staffName;

      if (allProps.currentInvoice && allProps.currentInvoice.length !== 0) {
        currentOrder = _currentInvoice && _currentInvoice[0] && _currentInvoice[0].order || {}
        location = currentOrder.currentLocationName
        staffName = currentOrder.beauticianName
      } else {
        currentOrder = allProps.currentOrder || {}
        location = currentOrder.currentLocationName
        staffName = currentOrder.beauticianName
      }

      console.log('LocationStaff22, location', location);
      console.log('LocationStaff22, staffName', staffName);

      setLocationValue(location)
      setStaffValue(staffName)

    } else {
      setLocationValue(undefined)
      setStaffValue(undefined)
    }
  }, [visibleAllLTs])


  const onCancelClick = () => {

    const islocationApplied = oneBranchInfo && oneBranchInfo.isLocationApplied
    const isStaffApplied = oneBranchInfo && oneBranchInfo.isBeauticianApplied

    let flag1 = false;
    if (islocationApplied && locationValue !== undefined) { flag1 = true }

    let flag2 = false;
    if (isStaffApplied && staffValue !== undefined) { flag2 = true }

    const flag3 = flag1 && flag2

    console.log('onCancelClick,islocationApplied', islocationApplied);
    console.log('onCancelClick,isStaffApplied', isStaffApplied);
    console.log('onCancelClick,locationValue', locationValue);
    console.log('onCancelClick,staffValue', staffValue);

    console.log('onCancelClick,flag1', flag1);
    console.log('onCancelClick,flag2', flag2);
    console.log('onCancelClick,flag3', flag3);

    if (islocationApplied && locationsList.length == 0) {
      setVisible(false)
    } else if (flag3) {
      setVisible(false)
    } else {
      message.error('Fields is required.')
      setVisible(true)
    }
  }

  const onSaveLocationClick = (e) => {
    const islocationApplied = oneBranchInfo && oneBranchInfo.isLocationApplied
    const isStaffApplied = oneBranchInfo && oneBranchInfo.isBeauticianApplied

    const flag1 = islocationApplied && (!locationValue || locationValue === '')
    const flag2 = isStaffApplied && (!staffValue || staffValue === '')
    const flag3 = flag1 && flag2

    if (flag3) {
      message.error('Both field is required for this branch.')
    }

    else if (flag1) {
      message.error('Location field is required for this branch.')
    }

    else if (flag2) {
      message.error('Staff field is required for this branch.')
    }

    else {
      handleOrderLTSubmit(e)
    }

    if (islocationApplied) {
      if (locationsList.length == 0) {
        message.error('Location is required. You need to add or active locations first.')
      }
    }

  }

  const LTsModalFooter =
    (locationsList && locationsList.length === 0) ? {
      footer: [
        <Button onClick={(e) => {
          onCancelClick()
        }}>
          Cancel
        </Button>,

        <Button type="primary" onClick={(e) => {
          onSaveLocationClick(e)
        }}>
          Save
          </Button>,
      ],
    } : {
        footer: [
          <Button type="primary" onClick={(e) => {
            onSaveLocationClick(e)
          }}>
            Save
          </Button>,
        ],
      }

  const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
  const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'Beautician'

  return (
    <Modal
      title={`Select a location and ${staffName.toLowerCase()}`}
      className={styles.standardListForm}
      width={450}
      closable={false}
      destroyOnClose
      visible={visible}
      {...LTsModalFooter}
    >
      <Form onSubmit={handleOrderLTSubmit} style={{ width: '100%' }}>


        {/* --------------------------------- Location --------------------------------- */}
        {(islocationApplied) && <FormItem label="Location" style={{ width: '100%', margin: 10 }} >
          {getFieldDecorator('locationId', {
            // rules: [{ required: true, message: '' }],
            initialValue: _currentOrder?.locationId,
          })(
            <Select
              onClick={() => {
                if (islocationApplied) {
                  if (locationsList.length == 0) {
                    message.error('You need to add or active locations first.')
                  }
                }
              }}
              onChange={(value) => {
                const locationName = locationsList.filter(each => each.id === value)[0]
                setLocationValue(value)
                setCurrentLocaiton(locationName.name)
              }}
              placeholder="Please select..."
              style={{ marginLeft: '74px', width: 200 }}
            >
              {locationsList?.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>}

        {/* --------------------------------- Staff --------------------------------- */}
        {(isStaffApplied) && <FormItem label= {`${staffName.replace(/^\S/, s => s.toUpperCase())}`} style={{ width: '100%', margin: 10 }}>
          {getFieldDecorator('staffId', {
            // rules: [{ required: true, message: '' }],
            initialValue: _currentOrder?.beauticianId,
          })(
            <Select
              placeholder="Please select..."
              style={{ marginLeft: '100px', width: 200 }}
              onChange={(value) => {
                const name = usersList.filter(each => each.id === value)[0]
                console.log('name.middleName', name.middleName);

                const fullName = name.middleName ? `${name.firstName} ${name.middleName} ${name.lastName}` : `${name.firstName} ${name.lastName}`
                setCurrentStaff(fullName)
                setStaffValue(value)
              }}
            >
              {usersList?.map(({ id, firstName, middleName, lastName }) => (
                <Option key={id} value={id}>
                  {middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>}

      </Form>
    </Modal>
  )
}
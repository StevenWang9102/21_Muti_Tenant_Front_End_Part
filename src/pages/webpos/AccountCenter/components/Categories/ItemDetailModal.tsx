import {
  Button,
  Input,
  Form,
  Modal,
  InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { displayDecimalQuantity, displayDecimal, getPureNumbers, setDecimalNum } from '../../../../public-component/decimail'
const { TextArea } = Input;
// const FormItem = Form.Item;

export const ItemDetailModal = (props) => {

  const { styles,
    done,
    visible,
    handleSubmit,
    handleCancel,
    currentOrderItem,
  } = props

  const [form] = Form.useForm()

  useEffect(() => {
    console.log('HOOK, ItemDetailModal, currentOrderItem88=', currentOrderItem);
    form.setFieldsValue({
      name: currentOrderItem?.itemName,
      description: currentOrderItem?.itemName,
      quantity: currentOrderItem.quantity,
      commitPriceInclGst: currentOrderItem.commitPriceInclGst,
      note: currentOrderItem.note || '',
    });
  }, [currentOrderItem])

  console.log('ItemDetailModal, props=', props);

  return (
    <Modal
      title={done ? null : `Edit Item`}
      bodyStyle={{ padding: '32px 40px 48px' }}
      className={styles.standardListForm}
      width={640}
      destroyOnClose
      visible={visible}
      onCancel={() => handleCancel()}
      footer={
        [
          <Button key="submit" type="primary" onClick={() => {
            const formValue = form.getFieldsValue()
            handleSubmit(formValue)
          }}>
            Update
        </Button>,

          <Button key="back" onClick={(e) => {
            handleCancel()
          }}>
            Cancel
        </Button>,
        ]}
    >

      <Form form={form}>
        <Form.Item
          label="Button Name"
          name='name'
          style={{ marginTop: 15, fontWeight: 600 }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
        >
          <span style={{ fontWeight: 400 }}>{currentOrderItem?.itemName}</span>
        </Form.Item >

        <Form.Item
          label="Description"
          name='description'
          style={{ marginTop: 15, fontWeight: 600 }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}>
          <span style={{ fontWeight: 400 }}>{currentOrderItem?.itemDescription}</span>
        </Form.Item >

        <Form.Item
          label="Quantity"
          name="quantity"
          style={{ marginTop: 15, fontWeight: 600 }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}>
          <InputNumber
            style={{ width: 215 }}
            formatter={(value) => displayDecimalQuantity(value)}
            onChange={(value) => {
              form.setFieldsValue({
                quantity: setDecimalNum(value),
              })
            }}
          />
        </Form.Item >

        <Form.Item
          label="Price"
          name="commitPriceInclGst"
          style={{ marginTop: 15, fontWeight: 600 }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
        >

          <InputNumber
            style={{ width: 215 }}
            formatter={(value) => displayDecimal(value)}
            onChange={(value) => {
              form.setFieldsValue({
                commitPriceInclGst: setDecimalNum(value),
              })
            }}
          />
        </Form.Item >

        <Form.Item
          label="Note"
          name='note'
          style={{ marginTop: 15 }}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
        >
          <TextArea rows={4} />
        </Form.Item >

      </Form>
    </Modal>
  )
}
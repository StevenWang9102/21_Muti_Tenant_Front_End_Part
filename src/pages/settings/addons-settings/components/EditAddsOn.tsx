import React, { useEffect, useState, FC } from 'react'
import { Modal, Form, Input, Button } from 'antd';
import style from '../style.less';
import { CloseSquareTwoTone } from '@ant-design/icons';
import { Select } from 'antd';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };

interface CreateAddsOnInterface {
  visible: boolean;
  onCancelButtonClick: () => void;

}
export const EditAddsOn: FC<CreateAddsOnInterface> = (props) => {

  const { onCancelButtonClick, onEditAddsOnUpdate, currentItemInfo, checkInputName } = props;
  const [currentPayment, setCurrentPayment] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [currentNameArray, setCurrentNameArray] = useState([])
  const [form] = Form.useForm()


  console.log('currentItemInfo=', currentItemInfo);
  
  useEffect(() => {
    const values = {
      name: currentItemInfo && currentItemInfo.title,
    };
    form.setFieldsValue(values)
  }, [currentItemInfo]);

  useEffect(() => {
    console.log('currentPayment=', currentPayment);

    if (currentPayment === 'Payment') {
      setCurrentName("Alipay")
      setCurrentNameArray(payments)
    }
    if (currentPayment === 'Settings') {
      setCurrentNameArray(others)
      setCurrentName("Xero")
    }
  }, [currentPayment]);

  console.log(currentName);


  const types = ['Payment', 'Settings'];
  const payments = ['Alipay', 'Wechat Pay', 'My Pos Mate'];
  const others = ['Xero', 'Receipt Printer'];

  return (
    <Modal
      maskClosable={false}
      closeIcon={<CloseSquareTwoTone/>}
      footer={null}
      title="Edit Adds On"
      confirmLoading={props.loading}
      visible={props.visible}
      onCancel={() => { onCancelButtonClick() }}
    >

      <Form
        {...layout}
        form={form}
        name="basic"
      >

        <Form.Item
          label='Name'
          name="name"
        >
          <Input
            style={{width: 240}}
            onChange={(event)=>checkInputName(event.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit"
            style={{marginLeft: 157}}
            onClick={() => {
              const currentValue = form.getFieldsValue()
              onEditAddsOnUpdate(currentValue)
            }}> Update
            </Button>
        </Form.Item>

      </Form>
    </Modal>
  )
}
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
export const CreateAddsOn: FC<CreateAddsOnInterface> = (props) => {

  const { onCancelButtonClick, onSubmitAddsOnClick } = props;
  const [currentPayment, setCurrentPayment] = useState('')
  const [currentName, setCurrentName] = useState('')
  const [currentNameArray, setCurrentNameArray] = useState([])
  const [form] = Form.useForm()


  useEffect(() => {
    console.log('currentPayment=',currentPayment);
    
    if (currentPayment === 'Payment') 
    {
      setCurrentName("Alipay")
      setCurrentNameArray(payments)
    }
    if (currentPayment === 'Settings') 
    {
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
        closeIcon={<CloseSquareTwoTone />}
        footer={null}
        title="Create New Adds On"
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
            label='Type'
            name="type"
          >
            <Select
              showSearch
              style={{ display: "inlineBlock", width: 240, marginTop: 30, color: "#1890ff", fontWeight: 400, border: "1px solid #1890ff" }}
              value={currentPayment}
              optionFilterProp="children"
              onChange={(key) => {
                setCurrentPayment(key)
              }}
              filterOption={(input, option) =>
                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {types.map(each => (
                <Option key={each}>{each}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Name'
            name="name"
          >
            <Select
              showSearch
              style={{ display: "inlineBlock", width: 240, marginTop: 30, color: "#1890ff", fontWeight: 400, border: "1px solid #1890ff" }}
              // value='测试'
              optionFilterProp="children"
              onChange={(key) => {
                setCurrentName(key)
              }}
              filterOption={(input, option) =>
                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {currentNameArray.map(each => (
                <Option key={each}>{each}</Option>
              ))}
            </Select>          
          </Form.Item>

          <Form.Item
            label="Description"
            name="value"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit"
              className={style.button}
              onClick={() => {
                const currentValue = form.getFieldsValue()
                onSubmitAddsOnClick(currentValue)
              }}> Create
            </Button>
          </Form.Item>

        </Form>
      </Modal>
  )
}
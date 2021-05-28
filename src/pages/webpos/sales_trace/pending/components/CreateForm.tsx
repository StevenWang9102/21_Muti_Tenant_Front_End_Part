import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, InputNumber, Modal, Tabs, Switch, Select, TreeSelect } from 'antd';
import { TableListItem, RolesListItem } from '../data';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import React from 'react';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  rolesData: RolesListItem[];
  modalVisible: boolean;
  handleAdd: (fieldsValue: TableListItem) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { rolesData, modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const callback = (key: String) => {
    console.log(key);
  };
  return (
    <Modal
      destroyOnClose
      title="New"
      width={800}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Basic" key="1">
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="First Name">
            {form.getFieldDecorator('firstName', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a first name of at least one characters!',
                  min: 1,
                },
              ],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Middle Name">
            {form.getFieldDecorator('middleName', {
              rules: [
                {
                  required: false,
                  message: 'Please enter a first middle name of at least one characters!',
                  min: 1,
                },
              ],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Last Name">
            {form.getFieldDecorator('lastName', {
              rules: [
                {
                  required: false,
                  message: 'Please enter a first last name of at least one characters!',
                  min: 1,
                },
              ],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Email">
            {form.getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Phone Number">
            {form.getFieldDecorator('phoneNumber', {
              rules: [{ required: false, message: 'Please enter a phone number!', min: 5 }],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Moniker">
            {form.getFieldDecorator('moniker', {
              rules: [
                {
                  required: false,
                  message: 'Please enter a moniker of at least one characters!',
                  min: 1,
                },
              ],
            })(<Input placeholder="Please typing something..." />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Roles">
            {form.getFieldDecorator('roles', {
              //initialValue: "",
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select mode="multiple" placeholder="Please select a role" style={{ width: '100%' }}>
                {rolesData.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Note">
            {form.getFieldDecorator('note', {
              rules: [{ message: 'Please enter a note of at least five characters!', min: 5 }],
            })(<TextArea placeholder="Please typing something..." />)}
          </FormItem>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);

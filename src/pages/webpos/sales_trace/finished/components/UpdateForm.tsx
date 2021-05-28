import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Modal, Select, TreeSelect, Tabs, InputNumber, Switch } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { TableListItem, RolesListItem } from '../data.d';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  rolesData: RolesListItem[];
}

export interface UpdateFormState {
  formVals: FormValueType;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
    };
  }

  handleNext = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        },
      );
    });
  };

  renderContent = (formVals: FormValueType) => {
    const { form, rolesData } = this.props;
    console.log('renderContent=', this.props);
    return [
      <TabPane tab="Basic" key="1">
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="First Name">
          {form.getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: 'Please enter a name of at least one characters!',
                min: 1,
              },
            ],
            initialValue: formVals.firstName,
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
            initialValue: formVals.middleName,
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
            initialValue: formVals.lastName,
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
            initialValue: formVals.email,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Phone Number">
          {form.getFieldDecorator('phoneNumber', {
            rules: [{ required: false, message: 'Please enter a phone number!', min: 5 }],
            initialValue: formVals.phoneNumber,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Moniker">
          {form.getFieldDecorator('moniker', {
            rules: [
              {
                required: false,
                message: 'Please enter a moniker of at least five characters!',
                min: 5,
              },
            ],
            initialValue: formVals.moniker,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Roles">
          {form.getFieldDecorator('roles', {
            initialValue: formVals.roles,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select mode="multiple" placeholder="Please select a role" style={{ width: '100%' }}>
              {rolesData.map(({ id, name }) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Inactive">
          {form.getFieldDecorator('isInactive', {
            valuePropName: 'checked',
            initialValue: formVals.isInactive,
            rules: [
              {
                required: false,
              },
            ],
          })(<Switch />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Note">
          {form.getFieldDecorator('note', {
            rules: [{ message: 'Please enter a note of at least five characters!', min: 5 }],
            initialValue: formVals.note,
          })(<TextArea placeholder="Please typing something..." />)}
        </FormItem>
      </TabPane>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible, values } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        Cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext()}>
        Done
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;
    const callback = (key: String) => {
      console.log(key);
    };
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Edit"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          {this.renderContent(formVals)}
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);

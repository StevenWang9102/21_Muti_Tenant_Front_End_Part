import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Modal, Select } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from '@ant-design/compatible/es/form';
import { MyPOSMateAttributes } from '../data.d';
import { TableListItem as PaymentModesParams } from '../../../settings/payment_modes/data.d';

const FormItem = Form.Item;
const { Option } = Select;

export interface MPMFormValueType extends Partial<MyPOSMateAttributes> {
}

export interface MPMUpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, type?: string) => void;
  handleUpdate: (values?: MPMFormValueType, type?: string) => void;
  updateModalVisible: boolean;
  values: Partial<MyPOSMateAttributes>;
  paymentModesList: PaymentModesParams[];
}

export interface MPMUpdateFormState {
  formVals: MPMFormValueType;
}

class MPMUpdateForm extends Component<MPMUpdateFormProps, MPMUpdateFormState> {

  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  
  constructor(props: MPMUpdateFormProps) {
    super(props);
    this.state = {
      formVals: {
        merchantAccountId: props.values.merchantAccountId,
        merchantId: props.values.merchantId,
        configId: props.values.configId,
        paymentModeId: props.values.paymentModeId,
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
            handleUpdate(formVals, "MyPOSMate");
        },
      );
    });
  };

  renderContent = (formVals: MPMFormValueType, paymentModesList: PaymentModesParams[]) => {
    const { form } = this.props;
    const selectList = paymentModesList.map(({id, name}) => (
      <Option key={id.toString()} value={id.toString()}>{name}</Option>
    ))
    return [
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Merchant Account Id">
          {form.getFieldDecorator('merchantAccountId', {
            rules: [{ required: true, message: 'Please enter a name of at least five characters!', min: 5 }],
            initialValue: formVals.merchantAccountId,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Merchant Id">
          {form.getFieldDecorator('merchantId', {
            rules: [{ required: true, message: 'Please enter a description of at least five characters!', min: 5 }],
            initialValue: formVals.merchantId,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Config Id">
          {form.getFieldDecorator('configId', {
            rules: [{ required: true, message: 'Please enter a moniker of at least five characters!', min: 3 }],
            initialValue: formVals.configId,
          })(<Input placeholder="Please typing something..." />)}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="Payment Mode">
          {form.getFieldDecorator('paymentModeId', {
            rules: [{ required: true, message: '' }],
            initialValue: formVals.paymentModeId
          })(
            <Select placeholder="Please select..." style={{ width: '100%' }}>
            {selectList}
            </Select>,
          )}
        </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, "MyPOSMate")}>
        Cancel
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext()}>
        Done
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, paymentModesList } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="Edit MyPOSMate Attributes"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible(false, "MyPOSMate")}
        afterClose={() => handleUpdateModalVisible()}
      >
      {this.renderContent(formVals, paymentModesList)}
      </Modal>
    );
  }
}

export default Form.create<MPMUpdateFormProps>()(MPMUpdateForm);

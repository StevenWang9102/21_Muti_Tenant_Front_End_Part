import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Modal, InputNumber, message } from 'antd';
import { TenantApplication } from '../data.d';
import { any } from 'prop-types';

const FormItem = Form.Item;

export interface FormValueType extends Partial<TenantApplication> { }

export interface UpdateFormProps {
  dispatch: (any) => void;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  handleUpdate: (value1: any, value2: any) => void;
  updateModalVisible: boolean;
  values: Partial<TenantApplication>;
  warning: any;
  checkEmail: (any) => void;
  checkIsNumber: (value1: any, value2: any) => void;
  checkShortName: (value1: any, value2: any) => void;
  checkLegalName: (value1: any, value2: any) => void;
  checkIsNotNull: (value1: any, value2: any) => void;
}

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {
    dispatch,
    isApproved,
    handleUpdate: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    checkLegalName,
    values,
    warning,
    checkShortName,
    checkIsNotNull,
    checkIsNumber,
    checkEmail,
  } = props;

  const [form] = Form.useForm();
  const [gstP1, setGSTP1] = useState<string | undefined>()
  const [gstP2, setGSTP2] = useState<string | undefined>()
  const [gstP3, setGSTP3] = useState<string | undefined>()
  console.log('props,isApproved=', isApproved);
  console.log('form=', values);
  console.log('warning=', warning);

  useEffect(() => {
    setGSTP1(values.gstNumber.toString().split('-')[0])
    setGSTP2(values.gstNumber.toString().split('-')[1])
    setGSTP3(values.gstNumber.toString().split('-')[2])
  }, [values])

  useEffect(() => {
    dispatch({
      type: 'tenantApplicationList/resetWarning',
    });
  }, [updateModalVisible])

  const handleSubmit = async () => {
    console.log('handleSubmit,warning', warning);

    const fieldsValue = form.getFieldsValue()

    // form.validateFields()

    const formStatus = Object.values(warning).map(each=> each.status === 'success' || each.status === 'validating')
    // const formValues = Object.values(warning)
    console.log('handleSubmit,warning', warning);
    console.log('handleSubmit,formStatus', formStatus);
    // console.log('handleSubmit,formValues', formValues);
      
      const flag = (formStatus.indexOf(false) === -1) 
      if (flag) {
        handleUpdate(values, { ...fieldsValue, gstNumber: `${gstP1}-${gstP2}-${gstP3}` });
      } else {
        message.error('Please check your input.');
      }
  };

  const fieldLabels = {
    legalName: 'Legal Name',
    tradingName: 'Trading Name',
    shortName: 'Company Name',
    phone: 'Phone',
    email: 'Email',
    gstNumber: 'Gst Number',
    gstRate: 'Gst Rate',
    street: 'Street',
    suburb: 'Suburb',
    city: 'City',
    country: 'Country',
    userFirstName: 'User First Name',
    userMiddleName: 'User Middle Name',
    userLastName: 'User Last Name',
  };

  const fieldNames = {
    legalName: 'legalName',
    tradingName: 'tradingName',
    shortName: 'shortName',
    phone: 'phone',
    email: 'email',
    gstNumber: 'gstNumber',
    gstRate: 'gstRate',
    street: 'street',
    suburb: 'suburb',
    city: 'city',
    country: 'country',
    userFirstName: 'userFirstName',
    userMiddleName: 'userMiddleName',
    userLastName: 'userLastName',
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const renderContent = () => {
    const headerStyle = { padding: 10, marginLeft: 20, fontSize: 18 };
    return (
      <>
        <h1 style={headerStyle}>Company Information</h1>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.shortName}
          name={fieldNames.shortName}
          validateStatus={(warning.shortName && warning.shortName.status) || 'Null'}
          help={warning.shortName && warning.shortName.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkShortName(event.target.value, 'shortName')}
            onBlur={(event) => checkShortName(event.target.value, 'shortName')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.legalName}
          name={fieldNames.legalName}
          validateStatus={(warning.legalName && warning.legalName.status) || 'Null'}
          help={warning.legalName && warning.legalName.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkLegalName(event.target.value, 'legalName')}
            onBlur={(event) => {
              checkLegalName(event.target.value, 'legalName');
            }}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.tradingName}
          name={fieldNames.tradingName}
          validateStatus={(warning.tradingName && warning.tradingName.status) || 'Null'}
          help={warning.tradingName && warning.tradingName.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'tradingName')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'tradingName')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.gstNumber}
          // name={fieldNames.gstNumber}
          validateStatus={(warning.gstNumber && warning.gstNumber.status) || 'Null'}
          help={warning.gstNumber && warning.gstNumber.message}
          rules={[{ required: true }]}
        >
          <Input
            style={{ width: 55, height: 28, marginRight: 7 }}
            value={gstP1}
            disabled={values.isApproved}
            onChange={(event) => {
              checkIsNumber(event.target.value, 'gstNumber')
              setGSTP1(event.target.value)
            }}
            onBlur={(event) => checkIsNumber(event.target.value, 'gstNumber')}
          />
            -
          <Input
            style={{ width: 55, height: 28, marginRight: 7, marginLeft: 7 }}
            value={gstP2}
            disabled={values.isApproved}
            onChange={(event) => {
              checkIsNumber(event.target.value, 'gstNumber')
              setGSTP2(event.target.value)
            }}
            onBlur={(event) => checkIsNumber(event.target.value, 'gstNumber')}
          />
          -
          <Input
            style={{ width: 55, height: 28, marginRight: 7, marginLeft: 7 }}
            value={gstP3}
            disabled={values.isApproved}
            onChange={(event) => {
              checkIsNumber(event.target.value, 'gstNumber')
              setGSTP3(event.target.value)
            }}
            onBlur={(event) => checkIsNumber(event.target.value, 'gstNumber')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.gstRate}
          name={fieldNames.gstRate}
          validateStatus={(warning.gstRate && warning.gstRate.status) || 'Null'}
          help={warning.gstRate && warning.gstRate.message}
          rules={[{ required: true }]}
        >
          <Input
            style={{ width: 100 }}
            suffix="%"
            disabled={values.isApproved}
            onChange={(event) => checkIsNumber(event.target.value, 'gstRate')}
            onBlur={(event) => checkIsNumber(event.target.value, 'gstRate')}
          />
        </FormItem>

        <h1 style={headerStyle}>Contact Information</h1>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.email}
          name={fieldNames.email}
          validateStatus={(warning.email && warning.email.status) || 'Null'}
          help={warning.email && warning.email.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => {
              checkEmail(event.target.value);
            }}
            onBlur={(event) => {
              checkEmail(event.target.value);
            }}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.phone}
          name={fieldNames.phone}
          validateStatus={(warning.phone && warning.phone.status) || 'Null'}
          help={warning.phone && warning.phone.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNumber(event.target.value, 'phone')}
            onBlur={(event) => checkIsNumber(event.target.value, 'phone')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.street}
          name={fieldNames.street}
          validateStatus={(warning.street && warning.street.status) || 'Null'}
          help={warning.street && warning.street.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'street')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'street')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.suburb}
          name={fieldNames.suburb}
          validateStatus={(warning.suburb && warning.suburb.status) || 'Null'}
          help={warning.suburb && warning.suburb.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'suburb')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'suburb')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.city}
          name={fieldNames.city}
          validateStatus={(warning.city && warning.city.status) || 'Null'}
          help={warning.city && warning.city.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'city')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'city')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.country}
          name={fieldNames.country}
          validateStatus={(warning.country && warning.country.status) || 'Null'}
          help={warning.country && warning.country.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'country')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'country')}
          />
        </FormItem>

        <h1 style={headerStyle}>User Information</h1>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.userFirstName}
          name={fieldNames.userFirstName}
          // hasFeedback
          validateStatus={(warning.userFirstName && warning.userFirstName.status) || 'Null'}
          help={warning.userFirstName && warning.userFirstName.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'userFirstName')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'userFirstName')}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.userMiddleName}
          name={fieldNames.userMiddleName}
        >
          <Input
            disabled={values.isApproved}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={fieldLabels.userLastName}
          name={fieldNames.userLastName}
          // hasFeedback
          validateStatus={(warning.userLastName && warning.userLastName.status) || 'Null'}
          help={warning.userLastName && warning.userLastName.message}
          rules={[{ required: true }]}
        >
          <Input
            disabled={values.isApproved}
            onChange={(event) => checkIsNotNull(event.target.value, 'userLastName')}
            onBlur={(event) => checkIsNotNull(event.target.value, 'userLastName')}
          />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <section>
        {values.isApproved ? (
          <div>
            <Button onClick={() => handleUpdateModalVisible(false, values)}>Close</Button>
          </div>
        ) : (
            <div>
              <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
              <Button type="primary" onClick={() => handleSubmit()}>
                Submit
            </Button>
            </div>
          )}
      </section>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form} initialValues={{ ...values }}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;

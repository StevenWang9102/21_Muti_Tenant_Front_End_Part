import { Button, Card, Input, Form, message, InputNumber } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPureNumbers } from '../../public-component/decimail'
import { Tabs } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

interface TenantApplicationFormProps {
  tenantApplicationForm: any;
  submitting: boolean;
  dispatch: Dispatch;
}

const TenantApplicationForm: FC<TenantApplicationFormProps> = (props) => {
  const { submitting, tenantApplicationForm } = props;
  const [gstP1, setGSTP1] = useState<string | undefined>()
  const [gstP2, setGSTP2] = useState<string | undefined>()
  const [gstP3, setGSTP3] = useState<string | undefined>()
  const [tabActiveKey, setActiceKey] = useState<string>('1')
  const { dispatch } = props;

  const [form] = Form.useForm();
  const warning = tenantApplicationForm.warningMessage || {}; // 默认

  console.log('Props =', props);
  console.log('Props,warning=', warning);

  useEffect(() => {
    dispatch({
      type: 'tenantApplicationForm/resetWarning',
    });
  }, []);

  const fieldLabels = {
    legalName: 'Legal Name',
    tradingName: 'Trading Name',
    shortName: 'Company Name',
    Phone: 'Phone',
    Email: 'Company Email',
    GstNumber: 'Gst Number',
    GstRate: 'Gst Rate',
    Street: 'Street',
    Suburb: 'Suburb',
    City: 'City',
    Country: 'Country',
    UserFirstName: 'User First Name',
    UserMiddleName: 'User Middle Name',
    UserLastName: 'User Last Name',
  };

  const fieldNames = {
    legalName: 'legalName',
    tradingName: 'tradingName',
    shortName: 'shortName',
    Phone: 'Phone',
    Email: 'Email',
    GstNumber: 'GstNumber',
    GstRate: 'GstRate',
    Street: 'Street',
    Suburb: 'Suburb',
    City: 'City',
    Country: 'Country',
    UserFirstName: 'UserFirstName',
    UserMiddleName: 'UserMiddleName',
    UserLastName: 'UserLastName',
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

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const validationOfBlankInput = (values, inputName) => {
    if (values[inputName] === undefined || values[inputName] === '') {
      dispatch({
        type: 'tenantApplicationForm/submitValidation',
        payload: {
          name: inputName,
        },
      });
    }
  };

  const onSubmitForm = (values: { [key: string]: any }) => {
    console.log('onSubmitForm,values', values);
    const gstNumber = `${gstP1}${gstP2}${gstP3}`
    // alert(gstNumber)

    if (values.shortName === undefined || values.shortName === '')
      validationOfBlankInput(values, 'shortName');
    if (values.legalName === undefined || values.legalName === '')
      validationOfBlankInput(values, 'legalName');
    if (values.tradingName === undefined || values.tradingName === '')
      validationOfBlankInput(values, 'tradingName');
    if (gstNumber === undefined || gstNumber === '')
      validationOfBlankInput(values, 'gstNumber');
    if (values.GstRate === undefined || values.GstRate === '')
      validationOfBlankInput(values, 'gstRate');
    if (values.Email === undefined || values.Email === '')
      validationOfBlankInput(values, 'email');
    if (values.Phone === undefined || values.Phone === '')
      validationOfBlankInput(values, 'phone');
    if (values.Street === undefined || values.Street === '')
      validationOfBlankInput(values, 'street');
    if (values.Suburb === undefined || values.Suburb === '')
      validationOfBlankInput(values, 'suburb');
    if (values.City === undefined || values.City === '')
      validationOfBlankInput(values, 'city');
    if (values.Country === undefined || values.Country === '')
      validationOfBlankInput(values, 'country');
    if (values.UserFirstName === undefined || values.UserFirstName === '')
      validationOfBlankInput(values, 'firstName');
    if (values.UserLastName === undefined || values.UserLastName === '')
      validationOfBlankInput(values, 'lastName');

    const formStatus = Object.values(warning).map(each => each.status)
    console.log('warning,formStatus', formStatus);


    // 如果任意一个Input都不是空
    // 或者只有middleName是空
    const flag = (Object.values(values).indexOf(undefined) === -1
      && Object.values(values).indexOf('') === -1
      && formStatus.indexOf('error') === -1)
      || (Object.values(values).indexOf(undefined) === 11  // 允许middle name 是空
        || Object.values(values).indexOf('') === 11)

    if (flag) {
      dispatch({
        type: 'tenantApplicationForm/submitCandidates',
        payload: {
          ...values,
          GstNumber: `${gstP1}-${gstP2}-${gstP3}`
        },
      });
    } else {
      message.error('Please check your input.');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const checkIsNumber = (value, name) => {
    dispatch({
      type: 'tenantApplicationForm/checkNumber',
      payload: {
        name: name,
        value: !isNaN(value),
        isNull: value === '',
      },
    });
  };

  const checkEmail = (value) => {
    dispatch({
      type: 'tenantApplicationForm/checkEmail',
      payload: {
        name: 'email',
        value: value,
        isNull: value === '',
      },
    });
  };

  const checkIsNotNull = (value, name) => {
    dispatch({
      type: 'tenantApplicationForm/checkIsNotNull',
      payload: {
        name: name,
        isNull: value === '',
      },
    });
  };

  const checkLegalName = (value, name) => {
    const payload = {
      legalName: value,
    };

    dispatch({
      type: 'tenantApplicationForm/checkLegalName',
      payload: {
        name: name,
        value: payload,
        isNull: value === '',
      },
    });
  };

  const checkShortName = (value, name) => {
    const payload = {
      shortName: value,
    };

    dispatch({
      type: 'tenantApplicationForm/checkShortName',
      payload: {
        name: name,
        value: payload,
        isNull: value === '',
        isSpace: value.includes(' '),
      },
    });
  };

  return (
    <PageHeaderWrapper content="Please fill in the following information truthfully so that we can review the application as soon as possible.">
      <Card
        bordered={false}
        style={{
          width: 800,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '20px 20px 20px 40px',
        }}
      >
        <Form
          hideRequiredMark
          form={form}
          name="basic"
          initialValues={{ public: '1' }}
          onFinish={onSubmitForm}
          onFinishFailed={onFinishFailed}
        >

          <Tabs defaultActiveKey="1" activeKey={tabActiveKey} onTabClick={(key) => setActiceKey(key)}>

            {/* ------------------------- 第一栏 ------------------------- */}
            <TabPane tab="Company Information" key="1" style={{ height: 400 }}>
              <FormItem
                {...formItemLayout}
                style={{marginTop: 20}}
                label={fieldLabels.shortName}
                name={fieldNames.shortName}
                validateStatus={(warning.shortName && warning.shortName.status) || 'Null'}
                help={warning.shortName && warning.shortName.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
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
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
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
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'tradingName')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'tradingName')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.GstNumber}
                validateStatus={(warning.gstNumber && warning.gstNumber.status) || 'Null'}
                help={warning.gstNumber && warning.gstNumber.message}
              >
                <Input
                  style={{ width: 70, height: 28, marginRight: 7 }}
                  formatter={(value) => getPureNumbers(value)}
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onBlur={(event) => { checkIsNumber(event.target.value, 'gstNumber') }}
                  onChange={(event) => {
                    checkIsNumber(event.target.value, 'gstNumber')
                    setGSTP1(event.target.value)
                  }}
                />
            -
            <Input
                  style={{ width: 70, height: 28, marginRight: 7, marginLeft: 7 }}
                  formatter={(value) => getPureNumbers(value)}
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onBlur={(event) => checkIsNumber(event.target.value, 'gstNumber')}
                  onChange={(event) => {
                    console.log('gstNumber2', event.target.value);
                    checkIsNumber(event.target.value, 'gstNumber')
                    setGSTP2(event.target.value)
                  }}
                />
            -
            <Input
                  style={{ width: 70, height: 28, marginRight: 7, marginLeft: 7 }}
                  formatter={(value) => getPureNumbers(value)}
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onBlur={(event) => checkIsNumber(event.target.value, 'gstNumber')}
                  onChange={(event) => {
                    console.log('gstNumber3', event.target.value);
                    checkIsNumber(event.target.value, 'gstNumber')
                    setGSTP3(event.target.value)
                  }}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.GstRate}
                name={fieldNames.GstRate}
                validateStatus={(warning.gstRate && warning.gstRate.status) || 'Null'}
                help={warning.gstRate && warning.gstRate.message}
              >
                <Input
                  suffix="%"
                  style={{ width: 100 }}
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNumber(event.target.value, 'gstRate')}
                  onBlur={(event) => checkIsNumber(event.target.value, 'gstRate')}
                />
              </FormItem>

              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
               <Button type="primary" loading={submitting} onClick={()=>{ setActiceKey('2') }}>
                  Next
                </Button>
              </FormItem>
            </TabPane>

            {/* ------------------------- 第二栏 ------------------------- */}
            <TabPane tab="Contact Information" key="2">
              <FormItem
                {...formItemLayout}
                style={{marginTop: 20}}
                label={fieldLabels.Email}
                name={fieldNames.Email}
                validateStatus={(warning.email && warning.email.status) || 'Null'}
                help={warning.email && warning.email.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
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
                label={fieldLabels.Phone}
                name={fieldNames.Phone}
                validateStatus={(warning.phone && warning.phone.status) || 'Null'}
                help={warning.phone && warning.phone.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNumber(event.target.value, 'phone')}
                  onBlur={(event) => checkIsNumber(event.target.value, 'phone')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.Street}
                name={fieldNames.Street}
                validateStatus={(warning.street && warning.street.status) || 'Null'}
                help={warning.street && warning.street.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'street')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'street')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.Suburb}
                name={fieldNames.Suburb}
                validateStatus={(warning.suburb && warning.suburb.status) || 'Null'}
                help={warning.suburb && warning.suburb.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'suburb')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'suburb')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.City}
                name={fieldNames.City}
                validateStatus={(warning.city && warning.city.status) || 'Null'}
                help={warning.city && warning.city.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'city')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'city')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.Country}
                name={fieldNames.Country}
                validateStatus={(warning.country && warning.country.status) || 'Null'}
                help={warning.country && warning.country.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'country')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'country')}
                />
              </FormItem>

              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button loading={submitting} style={{marginRight: 10}} onClick={()=>setActiceKey('1')}>
                        Back
                    </Button>

               <Button type="primary" loading={submitting} onClick={()=>setActiceKey('3')}>
                      Next
                  </Button>
              </FormItem>

            </TabPane>


            {/* ------------------------- 第三栏 ------------------------- */}
            <TabPane tab="User Information" key="3">
              <FormItem
                {...formItemLayout}
                style={{marginTop: 20}}
                label={fieldLabels.UserFirstName}
                name={fieldNames.UserFirstName}
                validateStatus={(warning.firstName && warning.firstName.status) || 'Null'}
                help={warning.firstName && warning.firstName.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'firstName')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'firstName')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.UserMiddleName}
                name={fieldNames.UserMiddleName}
              // validateStatus={(warning.firstName && warning.firstName.status) || 'Null'}
              // help={warning.firstName && warning.firstName.message}
              >
                <Input
                // onChange={(event) => checkIsNotNull(event.target.value, 'firstName')}
                // onBlur={(event) => checkIsNotNull(event.target.value, 'firstName')}
                />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={fieldLabels.UserLastName}
                name={fieldNames.UserLastName}
                validateStatus={(warning.lastName && warning.lastName.status) || 'Null'}
                help={warning.lastName && warning.lastName.message}
              >
                <Input
                  placeholder={formatMessage({ id: 'tenantsandformbasicform.title.placeholder' })}
                  onChange={(event) => checkIsNotNull(event.target.value, 'lastName')}
                  onBlur={(event) => checkIsNotNull(event.target.value, 'lastName')}
                />
              </FormItem>

              {/* --------------------------------- Submit --------------------------------- */}
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                  <Button loading={submitting} style={{marginRight: 10}} onClick={()=>setActiceKey('2')}>
                      Back
                  </Button>

                 <Button type="primary" htmlType="submit" loading={submitting}>
                      Submit
                  </Button>
              </FormItem>

            </TabPane>
          </Tabs>

        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

const mapStateToProps = ({ tenantApplicationForm }: { tenantApplicationForm: any }) => ({
  tenantApplicationForm,
});

export default connect(mapStateToProps)(TenantApplicationForm);

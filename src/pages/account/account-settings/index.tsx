import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { CurrentUser } from './data.d';
import jsonpatch from 'fast-json-patch';
import styles from './style.less';

const FormItem = Form.Item;

interface AccountSettingsProps {
  currentUser: CurrentUser;
  submitting: boolean;
  dispatch: Dispatch;
}

const AccountSettings: FC<AccountSettingsProps> = (props) => {
  const { submitting, currentUser, dispatch } = props;
  const [form] = Form.useForm();
  //const [showPublicUsers, setShowPublicUsers] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'accountSettings/fetch',
    });
  }, [currentUser]);

  const onFinish = (values: { [key: string]: any }) => {
    console.log("handleUpdate,currentUser=",currentUser);
    console.log("handleUpdate,values=",values);
    
    let document = currentUser;
    let observer = jsonpatch.observe<Object>(document);
    document.email = values.email;
    document.phoneNumber = values.phoneNumber;
    document.firstName = values.firstName;
    document.middleName = values.middleName;
    document.moniker = values.moniker;
    document.note = values.note;

    const updateEnum = jsonpatch.generate(observer);
    console.log("handleUpdate=",updateEnum);
    dispatch({
      type: 'accountSettings/update',
      payload: {
        id: currentUser.id,
        jsonpatchOperation: updateEnum,
        roles: values.roles,
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    console.log('Failed:', changedValues);
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

  return (
    <PageHeaderWrapper content={<FormattedMessage id="accountandaccount_settings.basic.description" />}>
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{ marginTop: 8 }}
          form={form}
          name="basic"
          initialValues={currentUser}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input placeholder="Please typing something..." />
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="accountandaccount_settings.form.submit" />
            </Button>
            <Button style={{ marginLeft: 8 }}>
              <FormattedMessage id="accountandaccount_settings.form.save" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default 
  connect(({ 
    currentUser,
    loading 
  }: { 
    currentUser: CurrentUser,
    loading: { 
      effects: { 
        [key: string]: boolean } 
      } 
  }) => ({
    currentUser: currentUser,
    submitting: loading.effects['accountSettings/update'],
  }))
(AccountSettings);

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, useState, Radio, Select, Tooltip } from 'antd';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface changePasswordProps {
  submitting: boolean;
  dispatch: Dispatch;
}

const changePassword: FC<changePasswordProps> = props => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const [showPublicUsers, setShowPublicUsers] = React.useState(false);
  const [curPassword, setCurPassword] = React.useState<string | null>();
  const [newPassword, setNewPassword] = React.useState<string | null>();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },

    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 10,
      },
      md: {
        span: 9,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const onSubmit = () => {
    const { dispatch } = props;

    if(curPassword && newPassword) {
      dispatch({
        type: 'changePassword/update',
        payload: {
          'CurrentPassword': curPassword,
          'NewPassword': newPassword,
        },
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };

  return (
    <PageHeaderWrapper
      content={<FormattedMessage id="accountandaccount_settings.basic.description" />}
    >
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
          form={form}
          name="basic"
          initialValues={{
            public: '1',
          }}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
            {...formItemLayout}
            name="CurrentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password 
               onChange={(event)=>{
                console.log('Input.Password', event.target.value);
                setCurPassword(event.target.value)
               }}
            />
          </FormItem>


          <FormItem
            {...formItemLayout}
            name="password"
            label="New Password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </FormItem>

          <FormItem
            {...formItemLayout}
            name="confirm"
            label="Comfirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password.",
              },

              ({ getFieldValue }) => ({
                validator(rule, value) {
                  console.log('validator,value', value);
                  console.log('validator,getFieldValue', getFieldValue);
                  console.log('validator,getFieldValue("password")', getFieldValue("password"));
                  if (!value || getFieldValue('password') === value) {
                    setNewPassword(value)
                    return Promise.resolve();
                  } else setNewPassword('')
    
                  return Promise.reject('The two passwords that you entered do not match!');
                },
              }),
            ]}
          >
            <Input.Password />
          </FormItem>

          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button 
              type="primary" 
              onClick={()=>onSubmit()}
              loading={submitting}>
              <FormattedMessage id="accountandaccount_settings.form.submit" />
            </Button>
            {/* <Button
              style={{
                marginLeft: 8,
              }}
            >
              <FormattedMessage id="accountandaccount_settings.form.save" />
            </Button> */}
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['changePassword/update'],
}))(changePassword);

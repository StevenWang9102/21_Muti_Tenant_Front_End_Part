import React, { useState, useEffect } from 'react';
import { Form, Modal, Select, Input, Button, notification, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Option } = Select;
const FormItem = Form.Item;

interface ChooseTenantProps {
  onChooseTenant: (choosedTenantId: any) => void;
  visible: boolean;
  onCancel: () => void;
  tenantList: [any];
}

const ForgotYourPassword = ({
  setVisible,
  visible,
  requestNewPassword,
  resetNewPassword,
  setEmail,
  setHostUserId,
  hostUserId,
}) => {

  const [form] = Form.useForm();
  const [message1, setMessage] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (hostUserId !== 'NOID') {
      notification.open({
        message: 'Please enter the verification code below.',
      });
    }
  }, [hostUserId]);

  // visible
  useEffect(() => {
    if (!visible) {
      setEmail('')
      setHostUserId('NOID');
    }
  }, [visible]);

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  const myFooter = [
    <Button
      key="back"
      onClick={(e) => {
        setVisible(false);
      }}
    >
      Cancel
    </Button>,

    <>
      {hostUserId === 'NOID' ? (
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            // alert(password)
            // const result = verificationOfPassword(password)
            // alert(result)

            // if(result) {
            const value = form.getFieldsValue().email;
            requestNewPassword(value);
            notification.open({
              message: 'We already send verification code to this email account.',
              description: 'Please check your email.',
            });
            // }
          }}
        >
          Send
        </Button>
      ) : (
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              const values = form.getFieldsValue();
              resetNewPassword(values);
            }}
          >
            Reset
          </Button>
        )}
    </>,
  ];

  const verificationOfPassword = (value) => {
    setMessage('')
    let errorMessage = ''
    if (value.length < 6) errorMessage = 'Passwords must be at least 6 characters;'
    else if (!/[a-z]/g.test(value)) {
      errorMessage = `Passwords must have at least one lowercase;`
    } else if (!/[A-Z]/g.test(value)) {
      errorMessage = `Passwords must have at least one uppercase;`
    } else {
      errorMessage = ''
    }

    console.log('verificationOfPassword,测试小写', !/[a-z]/.test(value));
    console.log('verificationOfPassword,测试大写', !/[A-Z]/.test(value));
    // alert(errorMessage)


    errorMessage !== "" && setMessage(errorMessage)
    return errorMessage !== "" ? true : false
  }


  return (
    <Modal
      destroyOnClose
      title="Reset your password"
      visible={visible}
      footer={myFooter}
      onCancel={() => setVisible(false)}
    >
      <Form {...formLayout} form={form}>
        <FormItem
          name="email"
          label="Email"
          rules={[{ required: true, message: 'This field is required.' }]}
        >
          <Input onChange={(e) => setEmail(e.target.value)} />
        </FormItem>

        {hostUserId !== 'NOID' && (
          <FormItem
            label="Verification Code"
            name="code"
            rules={[{ required: true, message: 'This field is required.' }]}
          >
            <Input onChange={(e) => setEmail(e.target.value)} />
          </FormItem>
        )}

        <FormItem
          label="New Password"
          name="password"
          rules={[{ required: true, message: 'This field is required.' }]}
          hasFeedback
          validateStatus={message1 !== '' && 'error'}
          help={message1 || null}
        >
          <Input.Password
            onChange={(e) => {
              setPassword(e.target.value)
              verificationOfPassword(e.target.value)
            }}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </FormItem>

        {/* {hostUserId !== 'NOID' && (
          <FormItem
            label="New Password"
            name="password"
            rules={[{ required: true, message: 'This field is required.' }]}

          >
            <Input.Password
              onChange={(e)=>verificationOfPassword(e.target.value)}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </FormItem>
        )} */}

      </Form>
    </Modal>
  );
};

export default ForgotYourPassword;

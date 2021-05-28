import { Form, Button, Col, Input, Popover, Progress, Row, Select, message } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage, Dispatch } from 'umi';

import { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
let interval: number | undefined;



const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps {
  dispatch: Dispatch;
  userAndregister: StateType;
  submitting: boolean;
}

const Register: FC<RegisterProps> = ({
  submitting,
  dispatch,
  userAndregister,
}) => {
  const [count, setCount]: [number, any] = useState(0);
  const [visible, setVisible]: [boolean, any] = useState(false);
  //const [prefix, setPrefix]: [string, any] = useState('86');
  const [formValueStatus, setFormValueStatus]: [boolean[], any] = useState([true, false, false]);
  const [getCaptchaDisabled, setGetCaptchaDisabled]: [boolean, any] = useState(true);
  const [submitDisabled, setSubmitDisabled]: [boolean, any] = useState(true);
  const [submitLoading, setSubmitLoading]: [boolean, any] = useState(false);
  const [hostUserId, setHostUserId]: [string, any] = useState('');
  const [doublePasswordStatus, setDoublePasswordStatus] = useState<any>();
  const confirmDirty = false;
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("useEffect=", userAndregister)
    if (!userAndregister) {
      return;
    }
    const status = userAndregister.status;
    const type = userAndregister.type;

    //get captcha successfully
    if (status === 'ok' && type === 'getCaptcha') {
      setHostUserId(userAndregister.hostUserId);
    } else if (status === 'error') {
      setCount(0);
      clearInterval(interval);
    }

    //register successfully, log in automatically
    const account = form.getFieldValue('email');
    const password = form.getFieldValue('password');
    if (status === 'ok' && type === 'submit') {
      dispatch({
        type: 'userAndregister/autoLogin',
        payload: { email: account, password: password },
      });
      dispatch({
        type: 'userAndregister/clear',
      });
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
      setHostUserId('');
    }
  }, [userAndregister]);

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const onGetCaptcha = () => {
    if (hostUserId == '') {
      const email = form.getFieldValue('email');
      const password = form.getFieldValue('password');
      dispatch({
        type: 'userAndregister/getCaptcha',
        payload: { email: email, password: password },
      });
    }
    else {
      dispatch({
        type: 'userAndregister/getCaptchaAgain',
        payload: { hostUserId: hostUserId },
      });
    }
    onSetCount(59);
  };

  const onSetCount = (startNumber: number) => {
    let counts = startNumber;
    setCount(counts);
    interval = window.setInterval(() => {
      //console.log(interval);
      counts -= 1;
      setCount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };


  const onInput = () => {
    const arr = formValueStatus.filter(value => value == false);
    console.log(formValueStatus[0], formValueStatus[1], formValueStatus[2]);
    setGetCaptchaDisabled(false);
    setSubmitDisabled(false);
    if (arr.length == 0) {
      setGetCaptchaDisabled(false);
      setSubmitDisabled(false);
    }
  };

  const onFinish = (values: { [key: string]: any }) => {
    setSubmitLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'userAndregister/submit',
        payload: {
          verificationCode: values.captcha,
          hostUserId: hostUserId,
        },
      });
      setSubmitLoading(submitting);
    }, 2000);
  };


  const getPasswordStatus = (value, warning) => {
    const isWarningExist = warning == ''

    console.log('getPasswordStatus,warning', warning);
    console.log('getPasswordStatus,isWarningExist', isWarningExist);
    if (isWarningExist && value && value.length > 9) {
      return 'ok';
    } else if (isWarningExist && value && value.length > 5) {
      return 'pass';
    } else return 'poor';
  };

  const getPasswordStatus11 = (value, warning) => {
    const isWarningExist = warning == ''
    if (isWarningExist) {
      return <div className={styles.error}> Verification failed </div>
    } else if (value) {
      return <div className={styles.error}> Verification failed </div>
    } else if (value.length > 9) {
      return <div className={styles.success}> Strength: high</div>
    } else if (value.length <= 9 && value.length >= 6) {
      return <div className={styles.success}> Strength: medium</div>
    } else {
      return <div className={styles.success}> Strength: low</div>
    }
  };



  const passwordWarningArea = (warning) => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus(value, warning);

    return (
      <div style={{ padding: '4px 0' }}>
        {getPasswordStatus11(value, warning)}

        {value && value.length && (
          <div className={styles[`progress-${passwordStatus}`]}>
            <Progress
              status={passwordProgressMap[passwordStatus]}
              className={styles.progress}
              strokeWidth={6}
              percent={value.length * 10 > 100 ? 100 : value.length * 10}
              showInfo={false}
            />
            {warning}
          </div>
        )}
      </div>
    )
  }

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'userandregister.password.twice' }));
    }
    const newFormValueStatus = [...formValueStatus];
    newFormValueStatus[2] = true;
    setFormValueStatus(newFormValueStatus);
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    if (!value) {
      setVisible(true);
      return promise.reject(formatMessage({ id: 'userandregister.password.required' }));
    } else {
      const resultArray = []
      const resultArray1 = []
      if (value.length < 6) resultArray.push('At least 6 characters')
      if (!/\d/.test(value)) resultArray1.push('Numbers')
      if (!/[a-z]/.test(value)) resultArray1.push('Lowercase letters')
      if (!/[A-Z]/.test(value)) resultArray1.push('Uppercase letters')
      if (!/\W/.test(value)) resultArray1.push('Non-alphanumeric characters')

      const finalResult = [...resultArray, ...resultArray1]
      if (finalResult.length == 0) {
        const temp = [...formValueStatus];
        temp[1] = true;
        setFormValueStatus([...formValueStatus,]);
        return promise.resolve();
      } else {
        const atLeast = resultArray[0] ? `${resultArray[0]}.` : ''
        const warning1 = resultArray1[0] ? `${resultArray1.join(', ')} is required.` : ''
        const warning = `${atLeast} ${warning1}`
        return promise.reject(passwordWarningArea(warning));
      }
    }
  };


  return (
    <div className={styles.main}>
      <h3>
        <FormattedMessage id="userandregister.register.register" />
      </h3>

      <Form form={form} name="UserRegister" onInput={onInput} onFinish={onFinish}>
        <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.email.required' }),
            },
            {
              type: 'email',
              message: formatMessage({ id: 'userandregister.email.wrong-format' }),
            },
          ]}
        >
          <Input size="large" placeholder={formatMessage({ id: 'userandregister.email.placeholder' })} />
        </FormItem>

        <FormItem
          name="password"
          rules={[{ validator: checkPassword }]}
          hasFeedback
        >
          <Input.Password
            placeholder={formatMessage({ id: 'userandregister.password.placeholder' })}
          />
        </FormItem>

        <FormItem
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: formatMessage({ id: 'userandregister.confirm-password.required'})},
            { validator: checkConfirm }
          ]}
        >
          <Input.Password
            placeholder={formatMessage({ id: 'userandregister.confirm-password.placeholder'})}
          />
        </FormItem>

        <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'userandregister.verification-code.required' }),
                },
              ]}
            >
              <Input
                size="large"
                placeholder={formatMessage({ id: 'userandregister.verification-code.placeholder' })}
              />
            </FormItem>

          </Col>
          <Col span={8}>
            <Button
              size="large"
              disabled={!!count || getCaptchaDisabled}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count
                ? `${count} s`
                : formatMessage({ id: 'userandregister.register.get-verification-code' })}
            </Button>
          </Col>
        </Row>

        <FormItem>
          <Button
            size="large"
            disabled={submitDisabled}
            loading={submitLoading}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="userandregister.register.register" />
          </Button>

          <Link className={styles.login} to="/user/login">
            <FormattedMessage id="userandregister.register.sign-in" />
          </Link>
          
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(
  ({
    userAndregister,
    loading,
  }: {
    userAndregister: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
  }),
)(Register);

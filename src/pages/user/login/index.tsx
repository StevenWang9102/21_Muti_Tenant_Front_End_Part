import { Alert, Checkbox, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, FormattedMessage, formatMessage, Dispatch, history } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';
import ChooseTenant from './components/ChooseTenant';
import { handleChooseTenant } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority, setToken } from '@/utils/authority';
import ForgotYourPassword from './components/ForgotYourPassword';
import * as service from './service';
import styles from './style.less';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import { Input, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Tab, UserName, Password, Submit } = LoginForm;

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType, tenantList } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hostUserId, setHostUserId] = useState('NOID');
  const [type, setType] = useState<string>('account');
  const [tenantListState, setTenantListState] = useState<any>([]);
  const [chooseTenantModalVisible, setChooseTenantModalVisible] = useState(false);

  useEffect(() => {
    if (tenantList && Object.keys(tenantList).length) {
      setChooseTenantModalVisible(true);
      setTenantListState(tenantList);
    }
  }, [tenantList]);

  useEffect(() => {
    // 想去页面内添加新内容，就是输入Code的框
    // 还有新密码的框
    // 然后再去发送一个API及可 

  }, [hostUserId]);

  // handle login submit
  const onLoginSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  // handle choose tenant
  const onChooseTenant = async (choosedTenantId: string) => {
    const hide = message.loading('Initializing Data');
    try {
      const chooseTenantResponse = await handleChooseTenant({
        tenantId: choosedTenantId,
      });
      console.log(chooseTenantResponse);
      const resData = chooseTenantResponse['data'];
      setToken(resData.token);
      setAuthority('admin');
      hide();
      history.push('/dashboard/workplace');
      return true;
    } catch (error) {
      hide();
      message.error('Choose failed, please try again');
      return false;
    }
  };


  const requestNewPassword = async (email) => {
    const hostUserId = await service.forgetPasswordRequest(email);
    setHostUserId(hostUserId);
  }; 

  const resetNewPassword = async (value)=>{
    try{
      const payload = {
        ...value, hostUserId
      }
      console.log('resetNewPassword,payload', payload);
      const responese = await service.resetPasswordRequest(payload);

      console.log('resetNewPassword,responese', responese);
      if(responese.response.status === 204) {
        message.success('Reset password successfully !')
        setVisible(false)
        setHostUserId('NOID')
      }
      if(responese.response.status === 400) {
        message.error('Reset password failed!')
      }
    } catch {
      message.error('Reset password fail!')
    }
  }

  return (
    <div className={styles.main}>
      <ForgotYourPassword
        visible={visible}
        hostUserId={hostUserId}
        setVisible={setVisible}
        setHostUserId={setHostUserId}
        setEmail={setEmail}
        requestNewPassword={(m) => requestNewPassword(m)}
        resetNewPassword={(m) => resetNewPassword(m)}
      />
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={onLoginSubmit}>
        
        {/* ---------------------------- 账号密码 ----------------------------*/}
        <Tab key="account" tab={formatMessage({ id: 'user-login.login.tab-login-email' })}>
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage
              content={formatMessage({ id: 'user-login.login.message-invalid-credentials' })}
            />
          )}

          <UserName
            name="email"
            placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'user-login.userName.required' }),
              },
            ]}
          />

          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'user-login.password.required' }),
              },
            ]}
          />

        </Tab>

        {/* -------------------- Remember Me, Fogot Your Password -------------------- */}
        <section>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            <FormattedMessage id="user-login.login.remember-me" />
          </Checkbox>

          <a
            style={{ float: 'right' }}
            onClick={async (e) => { setVisible(true)}}
          >
            <FormattedMessage id="user-login.login.forgot-password" />
          </a>
        </section>

        <Submit loading={submitting}>
          <FormattedMessage id="user-login.login.login" />
        </Submit>

        {/* ---------------------------- Sing Up  ----------------------------*/}
        <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            <FormattedMessage id="user-login.login.signup" />
          </Link>
        </div>
      </LoginForm>

      {tenantListState && Object.keys(tenantListState).length ? (
        <ChooseTenant
          chooseTenantModalVisible={chooseTenantModalVisible}
          tenantList={tenantListState}
          onChooseTenant={async (choosedTenantId) => {
            const success = await onChooseTenant(choosedTenantId);
            if (success) {
              const urlParams = new URL(window.location.href);
              const params = getPageQuery();
              let { redirect } = params as { redirect: string };
              if (redirect) {
                const redirectUrlParams = new URL(redirect);
                if (redirectUrlParams.origin === urlParams.origin) {
                  redirect = redirect.substr(urlParams.origin.length);
                  if (redirect.match(/^\/.*#/)) {
                    redirect = redirect.substr(redirect.indexOf('NOID') + 1);
                  }
                } else {
                  window.location.href = redirect;
                  return;
                }
              }
              reloadAuthorized();
              history.replace(redirect || '/');
              setChooseTenantModalVisible(false);
            }
          }}
          onCancel={() => {
            setChooseTenantModalVisible(false);
            setTenantListState([]);
          }}

        />
      ) : null}
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

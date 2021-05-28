import { Button, Result } from 'antd';
import { FormattedMessage, formatMessage, Link } from 'umi';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

const actions = (
    <Link to="/">
      <Button size="large" type="primary">
        <FormattedMessage id="userandregister-result.register-result.go-to-menuhub" />
      </Button>
    </Link>
);

const RegisterResult: React.FC<RouteChildrenProps> = ({ location }) => (
  <Result
    status="success"
    title={
        <FormattedMessage
          id="userandregister-result.register-result.msg"
          values={{ email: location.state ? location.state.account : 'support@eznz.com' }}
        />
    }
    //subTitle={formatMessage({ id: 'userandregister-result.register-result.activation-email' })}
    extra={actions}
  />
);

export default RegisterResult;

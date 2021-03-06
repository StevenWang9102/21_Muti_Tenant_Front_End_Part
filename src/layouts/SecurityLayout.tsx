import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { verifyTokenExpiration, getToken } from '@/utils/authority';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    //console.log("SecurityLayout, componentDidMount=", getToken());
    if (dispatch && getToken()) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    const isLogin = getToken() ? verifyTokenExpiration(): false;

    const queryString = stringify({
      redirect: window.location.href,
    });

    console.log('window.location.pathname',window.location.pathname);
    
    if(!window.location.pathname.includes('print')){
      // 打印页面不符合这部分逻辑
      if ((!isLogin && loading) || !isReady) {
        return <PageLoading />;
      }
      if (!isLogin && window.location.pathname !== '/user/login' ) {
        return <Redirect to={`/user/login?${queryString}`} />;
      }
    }
   
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);

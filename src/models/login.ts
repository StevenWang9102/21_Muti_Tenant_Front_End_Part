import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { routerRedux } from 'dva/router';
import { handleAccountLogin, fetchAllTenants } from '@/services/login';
import { setAuthority, setToken, removeToken, IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  tenantList?: any[];
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    setTenantList: Reducer<StateType>;
    clear: Reducer<StateType>;
  };
}


const initState = {
  status: undefined,
  type: '',
  currentAuthority: undefined,
  tenantList: [],
};

const Model: LoginModelType = {
  namespace: 'login',

  state: initState,

  effects: {
    *login({ payload }, { call, put }) {
      const loginResponse = yield call(handleAccountLogin, payload);
      const res = loginResponse['response'];
      console.log("login response = ", loginResponse);
      console.log("login response = ", res);

      yield put({
        type: 'changeLoginStatus',
        payload: res,
      });

      // Login successfully
      if (res.status === 200 && res.statusText === 'OK') {
        const resData = loginResponse['data'];
        //const decoded = resData.token !== null ? jwt.decode(resData.token) : null;
        //const role = decoded !== null? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: null;
        setToken(resData.token);
        setAuthority('admin');

/*         if(resData.tenants != null) {
          if (Array.isArray(resData.tenants)) {
            if(resData.tenants.length > 0) {
              yield put({
                type: 'setTenantList',
                payload: resData.tenants,
              });
              return;
            }
          }
        } */
        if(IsSuperAdmin()) {
          const fetchAllTenantsResponse = yield call(fetchAllTenants);
          yield put({
            type: 'setTenantList',
            payload: fetchAllTenantsResponse,
          });
        }
        else if(resData.tenants && Object.keys(resData.tenants).length) {
          yield put({
            type: 'setTenantList',
            payload: resData.tenants,
          });
        }
        else {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          reloadAuthorized();
          history.replace(redirect || '/');
        }
      } else {
        message.error('Login failed. Please check your email and password !')
      }
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put({
          type: 'clear',
        });
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      console.log("changeLoginStatus", payload)
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    setTenantList(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      console.log("setTenantList", payload)
      return {
        ...state,
        tenantList: payload,
      };
    },
    clear() {
      removeToken();
      return initState;
    },
  },
};

export default Model;

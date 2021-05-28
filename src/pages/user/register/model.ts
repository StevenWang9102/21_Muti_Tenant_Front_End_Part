import { Effect, Reducer } from 'umi';
import { getCaptcha ,getCaptchaAgain, registerHandle, LoginHandle } from './service';
import { requestStatus } from '@/utils/utils';
import { notification } from 'antd';
import { setAuthority, setToken } from '@/utils/authority';
import jwt from 'jsonwebtoken'

export interface StateType {
  status?: 'ok' | 'error';
  type?: 'getCaptcha' | 'getCaptchaAgain' | 'submit' | 'autoLogin';
  currentAuthority?: 'user' | 'guest' | 'admin';
  hostUserId?: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCaptcha: Effect;
    getCaptchaAgain: Effect;
    submit: Effect;
    autoLogin: Effect;
  };
  reducers: {
    getCaptchaSuccess: Reducer<StateType>;
    getCaptchaAgainSuccess: Reducer<StateType>;
    submitSuccess: Reducer<StateType>;
    autoLoginSuccess: Reducer<StateType>;
    clear: Reducer<StateType>;
  };
}

const initialState = {
  status: undefined,
  type: undefined,
  currentAuthority: undefined,
  hostUserId: '',
}

const Model: ModelType = {
  namespace: 'userAndregister',
  state: initialState,
  effects: {
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload);
      yield put({
        type: 'getCaptchaSuccess',
        payload: response,
      });
    },
    *getCaptchaAgain({ payload }, { call, put }) {
      const response = yield call(getCaptchaAgain, payload);
      yield put({
        type: 'getCaptchaAgainSuccess',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(registerHandle, payload);
      yield put({
        type: 'submitSuccess',
        payload: response,
      });
    },
    *autoLogin({ payload }, { call, put }) {
      const response = yield call(LoginHandle, payload);
      yield put({
        type: 'autoLoginSuccess',
        payload: response,
      });
    },
  },

  reducers: {
    getCaptchaSuccess(state, { payload }) {
      console.log(payload);
      const status = requestStatus(payload.response.status);
      const type = 'getCaptcha';
      if(status == 'ok') {
        const hostUserId = payload.data.hostUserId;
        return {
          ...state,
          status: status,
          type: type,
          hostUserId: hostUserId,
        };
      } else {
        const errorText = payload.data[Object.keys(payload.data)[0]];
        notification.error({
          message: `Request Error`,
          description: errorText,
        });
        return {
          ...initialState,
          status: status,
          type: type,
        };
      }
    },

    getCaptchaAgainSuccess(state, { payload }) {
      console.log(payload);
      const status = requestStatus(payload.response.status);
      const type = 'getCaptchaAgain';
      if(status == 'ok') {
        return {
          ...state,
          status: status,
          type: type,
        };
      }
      else {
        const errorText = payload.data[Object.keys(payload.data)[0]];
        notification.error({
          message: `Request Error`,
          description: errorText,
        });
        return {
          ...initialState,
          status: status,
          type: type,
        };
      }
    },
    submitSuccess(state, { payload }) {
      console.log(payload);
      const status = requestStatus(payload.response.status);
      const type = 'submit';
      if(status == 'ok') {
        return {
          status: status,
          type: type,
          currentAuthority: 'admin',
        };
      }
      else {
        const errorText = payload.data[Object.keys(payload.data)[0]];
        notification.error({
          message: `Request Error`,
          description: errorText,
        });
        return {
          ...initialState,
          status: status,
          type: type,
        };
      }
    },
    autoLoginSuccess(state, { payload }) {
      console.log(payload);
      const status = requestStatus(payload.response.status);
      if(status == 'ok') {
        const resData = payload.data;
        const decoded = resData.token !== null ? jwt.decode(resData.token) : null;
        const role = decoded !== null? decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: null;
        setToken(resData.token);
        setAuthority(role[0].toLowerCase());
        return {
          status: status,
          type: 'autoLogin',
        };
      }
      else {
        const errorText = payload.data[Object.keys(payload.data)[0]];
        notification.error({
          message: `Request Error`,
          description: errorText,
        });
        return {
          ...state,
          status: status,
        };
      }
    },
    clear() {
      return initialState;
    },
  },
};

export default Model;

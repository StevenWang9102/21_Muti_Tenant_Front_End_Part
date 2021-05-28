import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { fetchCurrentUser, updateCurrentUserIsInactiveStatus, SendEmailUpdateVerificationCode, updateCurrentUserEmail } from './service';
import { CurrentUser } from './data.d';

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface ModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    fetch: Effect;
    update: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}
const Model: ModelType = {
  namespace: 'accountSettings',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    
    *update({ payload }, { call, put }) {
      yield call(updateCurrentUserIsInactiveStatus, payload);
      const response = yield call(fetchCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      message.success('Saved Successfully');
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default Model;

import { message } from 'antd';
import { Effect, Reducer } from 'umi';
import { AdvancedProfileData } from './data.d';
import * as service from './service';

export interface ModelType {
  namespace: string;
  state: AdvancedProfileData;
  effects: {
    fetchOneCandidateTA: Effect;
    approveCandidateSA: Effect;
    denyCandidateSA: Effect;
  };
  reducers: {
    show: Reducer<AdvancedProfileData>;
  };
}

const Model: ModelType = {
  namespace: 'tenantsAndtenantProfile',

  state: {
    tenantProfile: {},
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
  },

  effects: {
    *fetchOneCandidateTA({ payload }, { call, put }) {
      const hide = message.loading("Loading...")
      const response = yield call(service.fetchOneCandidateTA, payload);
      yield put({
        type: 'show',
        payload: response,
      });
      hide()
    },

    *approveCandidateSA({ payload }, { call, put }) {
      const response1 = yield call(service.approveCandidateSA, payload);
      if(response1.response && response1.response.ok){
        yield put({ type: 'show', payload: response1, });
        yield put({ type: 'approveSuccess', payload: response1, });
      }
    },

    *denyCandidateSA({ payload }, { call, put }) {
      const response = yield call(service.denyCandidateSA, payload);
      yield put({ type: 'denySuccess' });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        tenantProfile: payload,
      };
    },

    approveSuccess(state, { payload }) {
      return {
        ...state,
        approveSuccess: true,
      };
    },

    denySuccess(state, { payload }) {
      return {
        ...state,
        denySuccess: true,
      };
    },

    ResetStatus(state, { payload }) {
      return {
        ...state,
        denySuccess: false,
        approveSuccess: false,
      };
    },
  },
};

export default Model;

import { Effect, Reducer, history } from 'umi';
import * as service from './service';
import { TenantApplicationForm } from './data.d';
import { requestStatus } from '@/utils/utils';
import { message, notification } from 'antd'
import { select } from 'redux-saga/effects';

export interface ModalState {
  formData?: Partial<TenantApplicationForm>;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    submitCandidates: Effect;
    checkPhoneNumberFunction: Effect;
  };
  reducers: {
    submitCandidatesSuccess: Reducer<ModalState>;
  };
}

const initialState = {
  formData: {},
  warningMessage: {},
}
const Model: ModelType = {
  namespace: 'tenantApplicationList',
  state: initialState,

  effects: {
    *submitCandidates({ payload }, { call, put }) {
      const response = yield call(service.submitCandidates, payload);
      yield put({
        type: 'submitCandidatesSuccess',
        payload: response,
      });
      const status = requestStatus(response.response.status);

      if (status == 'ok') {
        const tenantApplicationFormId = response.data.id;
        history.push({
          pathname: '/tenants/tenant-profile',
          state: {
            tenantApplicationFormId,
          },
        });
      } else {
        if (response.data && response.data.shortName) message.error("The branch name already exists. Please use another one.")
      }
    },

    *checkNumber({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.tenantApplicationList.warningMessage || {};
      newPayload[payload.name] = { status: 'validating', message: null };
      yield put({ type: 'warningMessage', payload: newPayload });

      if (payload.value) {
        newPayload[payload.name] = { status: 'success', message: null, };
      } else {
        newPayload[payload.name] = { status: 'error', message: 'Please input only numbers.' };
      }

      if (payload.isNull) {
        newPayload[payload.name] = { status: 'error', message: 'This field is required.' };
      }

      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *checkIsNotNull({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.tenantApplicationList.warningMessage || {};
      newPayload[payload.name] = { status: 'validating', message: null };
      yield put({ type: 'warningMessage', payload: newPayload });

      if (payload.isNull) {
        newPayload[payload.name] = { status: 'error', message: 'This field is required.' };
      } else {
        newPayload[payload.name] = { status: 'success', message: null };
      }
      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *checkEmail({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.tenantApplicationList.warningMessage || {};
      newPayload[payload.name] = { status: 'validating', message: null };
      yield put({ type: 'warningMessage', payload: newPayload });

      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const flag = regExp.test(String(payload.value).toLowerCase());

      if (flag) {
        newPayload[payload.name] = { status: 'success', message: null };
        yield put({ type: 'warningMessage', payload: newPayload });
      } else {
        newPayload[payload.name] = { status: 'error', message: 'This is not a valid email.' };
        yield put({ type: 'warningMessage', payload: newPayload });
      }

      if (payload.isNull) {
        newPayload[payload.name] = { status: 'error', message: 'Email address is require.' };
      }

      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *checkLegalName({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.tenantApplicationList.warningMessage || {};
      newPayload[payload.name] = { status: 'validating', message: null };
      yield put({ type: 'warningMessage', payload: newPayload });

      const success = yield call(service.checkLegalName, payload);
      if (payload.isNull) {
        newPayload[payload.name] = { status: 'error', message: 'This field is required.' };
      } else {
        if (success.response && success.response.ok) {
          newPayload[payload.name] = { status: 'success', message: null };
        } else {
          newPayload[payload.name] = { status: 'error', message: 'This legal name has already exist.' };
        }
      }
      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *checkShortName({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.tenantApplicationList.warningMessage || {};
      newPayload[payload.name] = { status: 'validating', message: null };
      yield put({ type: 'warningMessage', payload: newPayload });

      const success = yield call(service.checkShortName, payload.value);
      if (payload.isNull) {
        newPayload[payload.name] = { status: 'error', message: 'This field is required.' };
      } else {
        if (success.response && success.response.ok) {
          newPayload[payload.name] = { status: 'success', message: null };
        } else {
          newPayload[payload.name] = { status: 'error', message: 'This branch name has already exist.' };
        }
      }
      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *resetWarning({ payload }, { call, put }) {
      yield put({ type: 'warningMessage', payload: null });
    },
  },

  reducers: {
    submitCandidatesSuccess(state, action) {
      if (typeof state === 'undefined') {
        return initialState
      }
      return {
        ...initialState,
        status: status,
      };
    },

    warningMessage(state, { payload }) {
      return {
        ...state,
        warningMessage: payload,
      };
    },
  },
};

export default Model;

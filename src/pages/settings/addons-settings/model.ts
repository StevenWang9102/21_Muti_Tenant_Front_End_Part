import { Effect, Reducer } from 'umi';
import {  message } from 'antd';
import { AddonsData } from './data.d';
import * as service from './service';
import sort from 'fast-sort';

export interface ModelType {
  namespace: string;
  state: AddonsData;
  effects: {
    fetchMyPOSMateAttributes: Effect;
    fetchPaymentModesList: Effect;
    fetchReceiptPrinterAttributes: Effect;
    addAddons: Effect;
    removeAddons: Effect;
    updateAddons: Effect;
  };
  reducers: {
    getAllBranchSuccess: Reducer<AddonsData>;
    fetchSuccess: Reducer<AddonsData>;
    addSuccess: Reducer<AddonsData>;
    removeSuccess: Reducer<AddonsData>;
    updateSuccess: Reducer<AddonsData>;
    clear: Reducer<AddonsData>;
  };
}

const initState = {
  myPOSMateAttributes: [],
  paymentModesList: [],
  receiptPrinterAttributes: [],
  oneBranchData: []
}

const Model: ModelType = {
  namespace: 'addsOnSetting',

  state: initState,

  effects: {
    *loadAllBranch({ payload }, { call, put }) {
      try {
        const response = yield call(service.getBranchNames, 'settings/branches');
      
        if(response.response && response.response.ok){
          yield put({ type: 'getAllBranchSuccess', payload: response, });
        } else {
        }
      }
      catch{
        message.error(" Load Branch Information Failed !")
      }
    },

    *requestBranchAddsOn({ payload }, { call, put }) {
      const response = yield call(service.fetchAddons, payload);
      yield put({
        type: 'fetchSuccess',
        payload: response,
      });
    },

    *fetchMyPOSMateAttributes({ payload }, { call, put }) {
      const myPOSMateAttributes = yield call(service.fetchAddons, payload);
      yield put({
        type: 'fetchSuccess',
        payload: {
          myPOSMateAttributes: myPOSMateAttributes,
        },
      });
    },

    *fetchPaymentModesList(_, { call, put }) {
      const paymentModesList = yield call(service.fetchPaymentModes);
      yield put({
        type: 'fetchSuccess',
        payload: {
          paymentModesList: paymentModesList,
        },
      });
    },

    *fetchReceiptPrinterAttributes({ payload }, { call, put }) {
      const receiptPrinterAttributes = yield call(service.fetchAddons, payload);
      yield put({
        type: 'fetchSuccess',
        payload: {
          receiptPrinterAttributes: receiptPrinterAttributes,
        },
      });
    },

    *addAddons({ payload }, { call, put }) {
      const response = yield call(service.addAddons, payload);
      
      if(response && response.id){
        // message.success("New Adds On Created!")
      } else {
        // message.error("This AddsOn has already exist !")
      }
      
      const fetchSuccess = yield call(service.fetchAddons, payload);
      console.log(fetchSuccess);
      yield put({ 
        type: 'addSuccess',
        payload: fetchSuccess
      });

    },

    *deleteAddons({ payload }, { call, put }) {
      yield call(service.deleteAddons, payload);
      yield put({ type: 'requestBranchAddsOn', payload: payload, });
    },

    *updateAddons({ payload, callback }, { call, put }) {
      yield call(service.updateAddons, payload);      
      yield put({ type: 'requestBranchAddsOn', payload: payload, });
    },

    // checkInputName
    *checkInputName({ payload, callback }, { call, put }) {
      yield call(service.updatingCheckTypeAndName, payload);      
      // yield put({ type: 'requestBranchAddsOn', payload: payload, });
    },
  },

  reducers: {
    getAllBranchSuccess(state, {payload}) {
      var allBranchInformation = payload.data.filter(each=>each.isInactive == false)
      sort(allBranchInformation).asc(each => each.shortName.toLowerCase())

      return {
        ...state,
        allBranchNames: allBranchInformation,
      };
    },

    fetchSuccess(state, payload) {
      console.log(payload);
      
      return {
        ...state,
        oneBranchData: payload.payload
      };
    },

    addSuccess(state, {payload}) {
      return {
        ...state,
        oneBranchData: payload,
      };
    },
    removeSuccess(state, payload) {
      return {
        ...state,
        ...payload.payload,
      };
    },
    updateSuccess(state, payload) {
      return {
        ...state,
        ...payload.payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;

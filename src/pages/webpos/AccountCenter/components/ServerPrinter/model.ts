
import { Effect, Reducer } from 'umi';
import {message } from 'antd';
// import { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data';
import { fetchOneInvoice, fetchOneBranch, fetchOneOrder, postDataToPrinter} from './service';

export interface ModalState {
  currentUser?: any;
  projectNotice: any[];
  activities: any[];
  radarData: any[];
  allBranches: Array<any>;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  reducers: {
    save: Reducer<ModalState>;
    clear: Reducer<ModalState>;
  };
  effects: {
    init: Effect;
    fetchUserCurrent: Effect;
    fetchProjectNotice: Effect;
    fetchActivitiesList: Effect;
    fetchChart: Effect;
  };
}

const Model: ModelType = {
  namespace: 'receiptPrinting212121',
  state: {
    allReceiptInfo: {},
    currentUser: undefined,
    projectNotice: [],
    activities: [],
    radarData: [],
    // allCandidates: [],
    allBranches: []
  },
  effects: {

    *fetchOneInvoice({ payload, callback }, { call, put }) {
      const res = yield call(fetchOneInvoice, payload);
      if (callback) callback(res);
    },

    // postDataToPrinter
    *postDataToPrinter({ payload, callback }, { call, put }) {
      yield call(postDataToPrinter, payload);
      // if (callback) callback(res);
    },

    *fetchOneBranch({ payload, callback }, { call, put }) {
      // alert('modal fetchOneBranch')
      try{
        const res = yield call(fetchOneBranch, payload);
        console.log('fetchOneBranch', res);
        if (callback) callback(res);
      } catch {
      }
    },
    
    *fetchOneOrder({ payload, callback }, { call, put }) {
      try{
       const res = yield call(fetchOneOrder, payload);
        if (callback) callback(res);
      } catch {
        message.error('fetch order error.')
      }
    },

  },

  // --------------------------------------------------
  reducers: {
    setCurrentInvoice(state, { payload }) {
      
      return {
        ...state,
        allReceiptInfo: payload || {},
      };
    },

  },
};

export default Model;

import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import * as service from './service';
import sort from 'fast-sort';
import moment from 'moment';

import { TableListData, InvoiceParams } from './data.d';

export interface StateType {
  data: Partial<TableListData>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchInvoices: Effect;
    fetchOneInvoice: Effect;
    fetchUsers: Effect;
    searchInvoices: Effect;
    resumeOrder: Effect;
  };
  reducers: {
    fetchInvoicesSuccess: Reducer<StateType>;
    fetchOneInvoiceSuccess: Reducer<StateType>;
    fetchUsersSuccess: Reducer<StateType>;
    searchInvoicesSuccess: Reducer<StateType>;
  };
}

const initialState = {
  data: {},
};

const Model: ModelType = {
  namespace: 'InvoicesPendingData',

  state: {
    ...initialState,
  },

  effects: {

    *fetchInvoices({ payload }, { call, put }) {
      const invoicesList = yield call(service.fetchInvoices, payload);
      const formate = 'YYYY-MM-DD'
      // if(payload.search){
      //   const temp = invoicesList.data
      //   console.log('search98, payload', payload);
      //   console.log('search98, invoicesList', temp);
      //   const search = payload.search
      //   let startDate = search.status && search.status[0]
      //   let endDate = search.status && search.status[1]
      //   startDate = moment(startDate).format(formate)
      //   endDate = moment(endDate).format(formate)

      //   console.log('search98, startDate 标准', startDate);
      //   console.log('search98, endDate 标准', endDate);

      //   const newInvoiceList = []
      //   temp.forEach(element => {
      //     let time =  moment(element.startDateTime).format(formate)      
      //     console.log('search98, Each数据时间', time);
    
      //     let flag = ((time >= startDate) && (time <= endDate))? true: false
      //     if( flag ) newInvoiceList.push(element)
      //   });
      //   console.log('search98, 全数据', temp);
      //   console.log('search98, 筛选后的', newInvoiceList);

      //   yield put({
      //     type: `fetchInvoicesSuccess1`,
      //     payload: {data: newInvoiceList},
      //   });
      // } else {
        yield put({
          type: `fetchInvoicesSuccess`,
          payload: invoicesList,
        });
      // }
    },

    *fetchOneInvoice({ payload, callback }, { call, put }) {
      const response = yield call(service.fetchOneInvoice, payload);
      yield put({
        type: `fetchOneInvoiceSuccess`,
        payload: {
          currentInvoice: response,
        },
      });
      if (callback) callback(response);
    },


    *fetchOneInvoiceByInvoiceId({ payload, callback }, { call, put }) {
      const response = yield call(service.fetchOneInvoiceByInvoiceId, payload);
      yield put({
        type: `fetchOneInvoiceSuccess`,
        payload: {
          currentInvoice: response,
        },
      });
      if (callback) callback(response[0]);
    },

    *fetchUsers({ payload }, { call, put }) {
      const usersList = yield call(service.fetchUsers, payload);
      yield put({
        type: `fetchUsersSuccess`,
        payload: usersList.filter(each=>each.isInactive == false),
      });
    },
    
    *searchInvoices({ payload }, { call, put }) {
      const invoiceslist = yield call(service.searchInvoices, payload);
      yield put({
        type: `${'searchInvoices'}Success`,
        payload: invoiceslist,
      });
    },
    *resumeOrder({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/webpos/pos',
          search: stringify({
            redirect: window.location.href,
            key: payload,
          }),
        }),
      );
    },
  },

  reducers: {

    fetchInvoicesSuccess(state, action) {
      console.log('fetchInvoicesSuccess,state=', state);
      console.log('fetchInvoicesSuccess,action=', action);

      if (typeof state === 'undefined') {
        return initialState;
      }

      const invoicesList: InvoiceParams[] = action.payload.data
      const pagination =  action.payload.response.headers.get('x-pagination')
      const totalCount = JSON.parse(pagination).TotalCount
      console.log('totalCount44', totalCount);
        

      return {
        ...state,
        data: {
          ...state.data,
          invoicesList: invoicesList,
          totalCount: totalCount,
        },
      };
    },

    fetchInvoicesSuccess1(state, action) {
      console.log('fetchInvoicesSuccess1,state=', state);
      console.log('fetchInvoicesSuccess1,action=', action);
      const invoicesList: InvoiceParams[] = action.payload.data

      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          invoicesList: invoicesList,
        },
      };
    },

    fetchOneInvoiceSuccess(state, action) {
      console.log('fetchOneInvoiceSuccess,state=', state);
      console.log('fetchOneInvoiceSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentInvoice: action.payload.currentInvoice,
        },
      };
    },

    fetchOneOrderSuccess(state, action) {
      console.log('fetchOneOrderSuccess,state=', state);
      console.log('fetchOneOrderSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload.currentOrder,
          currentOrderItems: action.payload.currentOrder.orderItems,
        },
      };
    },

    fetchUsersSuccess(state, action) {
      console.log('fetchUsersSuccess,state=', state);
      console.log('fetchUsersSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const usersList = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          usersList: usersList,
        },
      };
    },

    searchInvoicesSuccess(state, action) {
      console.log('searchInvoicesSuccess,state=', state);
      console.log('searchInvoicesSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const invoicesList: InvoiceParams[] = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          invoicesList: invoicesList,
        },
      };
    },
  },
};

export default Model;

import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import * as service from './service';
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
  namespace: 'InvoicesFinishedData',

  state: {
    ...initialState,
  },

  effects: {
    *fetchInvoices({ payload }, { call, put }) {

      var invoicesList = yield call(service.fetchInvoices, payload);

      console.log('invoicesList491', invoicesList);

      
      yield put({
        type: `fetchInvoicesSuccess`,
        payload: invoicesList,
      });
    },

    *fetchOneInvoice({ payload, callback }, { call, put }) {
      const fetchOneInvoice = yield call(service.fetchOneInvoice, payload);
      yield put({
        type: `${'fetchOneInvoice'}Success`,
        payload: {
          currentInvoice: fetchOneInvoice,
        },
      });
      if (callback) callback(fetchOneInvoice);
    },

    *fetchOrderInvoice({ payload, callback }, { call, put }) {
      const fetchOneInvoice = yield call(service.fetchOrderInvoice, payload);
      yield put({
        type: `fetchOneInvoiceSuccess`,
        payload: {
          currentInvoice: fetchOneInvoice,
        },
      });
    },

    *fetchOrders({ payload, callback }, { call, put }) {
      try{
        const fetchOrders = yield call(service.fetchOrders, payload);
        yield put({
          type: `fetchOrdersSuccess`,
          payload: {
            allOrders: fetchOrders,
          },
        });
      } catch {
      }
    },

    *fetchOneOrder({ payload, callback }, { call, put }) {
      try{
        const fetchOneOrder = yield call(service.fetchOneOrder, payload);
        yield put({
          type: `fetchOneOrderSuccess`,
          payload: {
            currentOrder: fetchOneOrder,
          },
        });
        if (callback) callback(fetchOneOrder);
      } catch {
      }
    },

    *fetchOneOrderMuti({ payload, callback }, { call, put }) {
      try{
        const fetchOneOrder = yield call(service.fetchOneOrder, payload);
        if (callback) callback(fetchOneOrder);
      } catch {
      }
    },
    
    *searchInvoices({ payload }, { call, put }) {
      const invoiceslist = yield call(service.searchInvoices, payload);
      yield put({
        type: `${'searchInvoices'}Success`,
        payload: invoiceslist,
      });
    },

    *fetchOneBranch({ payload }, { call, put }) {
      try{
        const branchInfo = yield call(service.fetchOneBranch, payload);
        
        yield put({
          type: `fetchOneBranchSuccess`,
          payload: branchInfo,
        });
      } catch {
      }
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
      if (typeof state === 'undefined') {
        return initialState;
      }

      const invoicesList: InvoiceParams[] = action.payload.data
        .filter((item: { [x: string]: boolean }) => item['isPaid'] === true)
      const pagination = action.payload.response.headers.get('x-pagination')
      const totalCount = JSON.parse(pagination).TotalCount
      // const orderIds = invoicesList.map(each=>each.orderId)

      console.log('fetchInvoicesSuccess,invoicesList', invoicesList);
      console.log('totalCount', totalCount);

      return {
        ...state,
        data: {
          ...state.data,
          invoicesList: invoicesList,
          totalCount: totalCount,
        },
      };
    },

    fetchOrdersSuccess(state, action) {
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          allOrders: action.payload.allOrders,
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

    fetchOneBranchSuccess(state, action) {
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          oneBranchInfo: action.payload
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
        },
      };
    },
  },
};

export default Model;

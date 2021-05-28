import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import * as service from './service';
import sort from 'fast-sort';
import moment from 'moment';
import { TableListData, OrderParams } from './data.d';
import { message } from 'antd';

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
    fetchOrders: Effect;
    fetchOneOrder: Effect;
    fetchUsers: Effect;
    searchOrders: Effect;
    resumeOrder: Effect;
  };
  reducers: {
    fetchOrdersSuccess: Reducer<StateType>;
    fetchOneOrderSuccess: Reducer<StateType>;
    fetchUsersSuccess: Reducer<StateType>;
    searchOrdersSuccess: Reducer<StateType>;
  };
}

const initialState = {
  data: {},
};

const Model: ModelType = {
  namespace: 'ordersData',

  state: {
    ...initialState,
  },

  effects: {

    *fetchOrders({ payload }, { call, put }) {
      try{
        var orderslist = yield call(service.fetchOrders, payload);
        yield put({
          type: `fetchOrdersSuccess`,
          payload: orderslist,
        });
      
      } catch{
        message.error("Get order failed !")
      }

    },

    *fetchOneOrder({ payload, callback }, { call, put }) {

      const fetchOneOrder = yield call(service.fetchOneOrder, payload);
      yield put({
        type: `fetchOneOrderSuccess`,
        payload: {
          currentOrder: fetchOneOrder,
        },
      });
      if (callback) callback(fetchOneOrder);
    },

    *fetchUsers({ payload }, { call, put }) {
      const usersList = yield call(service.fetchUsers, payload);
      yield put({
        type: `${'fetchUsers'}Success`,
        payload: usersList.filter(each=>each.isInactive == false),
      });
    },

    // fetchLocations
    *fetchLocations({ payload }, { call, put }) {
      const locations = yield call(service.fetchLocations, payload);
      console.log('fetchLocations14151',locations);
      
      yield put({
        type: `${'fetchLocations'}Success`,
        payload: locations.data,
      });
    },

    *searchOrders({ payload }, { call, put }) {
      try{
        const orderslist = yield call(service.searchOrders, payload);
        yield put({
          type: `searchOrdersSuccess`,
          payload: orderslist,
        });
      } catch{
        message.error('searchOrders request Error')
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
    fetchOrdersSuccess(state, action) {
      console.log('fetchOrdersSuccess,state=', state);
      console.log('fetchOrdersSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      console.log('fetchOrdersSuccess,action.payload', action.payload);
      
      const ordersList: OrderParams[] = action.payload.data
      const pagination =  action.payload.response.headers.get('x-pagination')
      const totalCount = JSON.parse(pagination).TotalCount
      console.log('fetchOrdersSuccess,ordersList2=', ordersList);
        
      return {
        ...state,
        data: {
          ...state.data,
          ordersList: ordersList,
          totalCount: totalCount,
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

    fetchUsersSuccess(state, action) {
      console.log('fetchUsersSuccess,state=', state);
      console.log('fetchUsersSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const usersList = action.payload;
      sort(usersList).asc(user => user.firstName.toLowerCase())

      return {
        ...state,
        data: {
          ...state.data,
          usersList: usersList,
        },
      };
    },

    fetchLocationsSuccess(state, action) {
      console.log('fetchLocationsSuccess,state=', state);
      console.log('fetchLocationsSuccess,action=', action);

      if (typeof state === 'undefined') {
        return initialState;
      }
      var location = action.payload;
      sort(location).asc(each => each.name)

      return {
        ...state,
        data: {
          ...state.data,
          locationsList: location,
        },
      };
    },

    searchOrdersSuccess(state, action) {
      console.log('searchOrdersSuccess,state=', state);
      console.log('searchOrdersSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const ordersList: OrderParams[] = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          ordersList: ordersList,
        },
      };
    },
  },
};

export default Model;

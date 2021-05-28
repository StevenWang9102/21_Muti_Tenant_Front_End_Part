import { Effect, Reducer } from 'umi';
import * as service from './service';
import { message, notification } from 'antd';
import { TableListData, TableListItem, } from './data.d';
import { IsSuperAdmin } from '@/utils/authority';
import { SmileOutlined } from '@ant-design/icons';


export interface StateType {
  data: TableListData;
}

export interface ModelType {
  namespace: string;
  state: StateType;

  effects: {
    fetch: Effect;
    fetchOne: Effect;
    search: Effect;
    add: Effect;
    delete: Effect;
    update: Effect;
  };

  reducers: {
    fetchItemsListSuccess: Reducer<StateType>;
    fetchOneItemSuccess: Reducer<StateType>;
    searchSuccess: Reducer<StateType>;
    addSuccess: Reducer<StateType>;
    deleteSuccess: Reducer<StateType>;
    updateSuccess: Reducer<StateType>;
  };
}

const initialState = {
  data: {
    list: [],
    oneItem: {},
    pagination: {},
  },
}

const Model: ModelType = {
  namespace: 'paymentModesData',
  state: {
    ...initialState,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      try{
        if(IsSuperAdmin()){
          notification.open({
            message: 'Unauthorized Page',
            description:
              'You are on an Unauthorized Page. Developers are still working on authorization management.',
            className: 'custom-class',
            style: {
              width: 600,
            },
          });
        } else {
          const response = yield call(service.fetchPaymentModes, payload);
          if(callback) callback(response)

          yield put({
            type: 'fetchItemsListSuccess',
            payload: response,
          });
        }
      } catch {
      }
    },

    *fetchOne({ payload, callback }, { call, put }) {
      const response = yield call(service.fetchOnePaymentMode, payload);
      yield put({
        type: 'fetchOneItemSuccess',
        payload: response,
      });
      if (callback) callback();
    },

    *search({ payload }, { call, put }) {
      const response = yield call(service.searchPaymentModes, payload);
      yield put({
        type: 'searchSuccess',
        payload: response,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(service.addPaymentMode, payload);
      yield put({  type: 'addSuccess',  payload: response, });
      yield put({ type: 'fetch',  payload: response, });
      if (callback) callback(response);
    },

    
    *uploadImage({ payload, callback }, { call, put }) {
      const response = yield call(service.addImage, payload);
      yield put({  type: 'fetch' });
      if (callback) callback(response);
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(service.deletePaymentMode, payload);
      
      if(response.response && response.response.ok){
        yield put({ type: 'deleteSuccess', payload: response, });
      } 
      
      if(response.response && !response.response.ok) {
        notification.open({
          message: 'Delete Fail',
          description:
            'You can not delete this payment mode, because some orders are based on it.',
          // className: 'custom-class',
          style: { width: 600 }
        });
      }
      yield put({
        type: 'fetch',
        payload: response,
      });
      if (callback) callback();

    },
    
    *update({ payload, callback }, { call, put }) {
      const response = yield call(service.updatePaymentMode, payload);
      yield put({ type: 'updateSuccess',  payload: response, });
      yield put({ type: 'fetch', payload: response, });
      message.success('Success !')
      if (callback) callback();
    },
  },

  reducers: {
    fetchItemsListSuccess(state, action) {
      console.log("fetchItemsListSuccess,state=",state);
      console.log("fetchItemsListSuccess,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      const itemsList: TableListItem[] = action.payload;
      return {
        ...state,
        data: {
          list: itemsList,
          oneItem: {},
          pagination: {},
        },
      };
    },
    fetchOneItemSuccess(state, action) {
      console.log("fetchOneItemSuccess,state=",state);
      console.log("fetchOneItemSuccess,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      const itemsList: TableListItem[] = state.data.list;
      const currentItem: TableListItem = action.payload;
      return {
        ...state,
        data: {
          list: itemsList,
          oneItem: currentItem,
          pagination: {},
        },
      };
    },
    searchSuccess(state, action){
      console.log("searchSuccess,state=",state);
      console.log("searchSuccess,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      const itemsList: TableListItem[] = action.payload;
      return {
        ...state,
        data: {
          list: itemsList,
          oneItem: {},
          pagination: {},
      }};
    },
    addSuccess(state, action) {
      console.log("addSuccess,state=",state);
      console.log("addSuccess,action=",action);
      const currentItem: TableListItem = {...action.payload};
      if (typeof state === 'undefined') {
        return initialState
      }
      console.log("addUserSuccess,currentItem=",currentItem);
      let newList: TableListItem[] = state.data.list;
      newList.push(currentItem)
      console.log("addUserSuccess,newList=",newList);
      return {
        ...state,
        data: {
          list: newList,
          oneItem: {},
          pagination: {},
        },
      };
    },
    updateSuccess(state, action){
      console.log("updateSuccess,state=",state);
      console.log("updateSuccess,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      let newList = state.data.list.map(list => list);
      return {
        ...state,
        data: {
          list: newList,
          oneItem: {},
          pagination: {},
      }};
    },
    deleteSuccess(state, action){
      console.log("deleteSuccess,state=",state);
      console.log("deleteSuccess,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      let newList = state.data.list.map(list => list);
      return {
        ...state,
        data: {
          list: newList,
          oneItem: {},
          pagination: {},
      }};
    },
  },
};

export default Model;

import { Effect, Reducer } from 'umi';
import { UserManagementInterface } from './data';
// import { select } from "redux-saga/effects";

import {
  getAllItemReportFunction,
  getItemWithQueryFunction, getAllItemNameFunction,
  getSpecifiedBranchAndDayData,
  getSpecifiedItemDailyFunction, getOneBranchItemDataFunction,
  getAllCategoryReportFunction, getSpecifiedBranchCategoryFunction,
  getAllCategoriesNamesFunction, getCategoryReportWithCategoryIdFunction,
  getItemBranchReportWithIdFunction
} from './service';
import { message } from 'antd';


export interface ModelType {
  namespace: string;
  state: UserManagementInterface;

  effects: {
    getAllUserInformation?: Effect;
    getAllDailySales?: Effect;
    getAllItemReport?: Effect;
    getAllItemNames?: Effect;
  };

  reducers: {
    setVisible: Reducer<UserManagementInterface>;
    getOneBranchInfoSuccess:Reducer<UserManagementInterface>;
    setVisibleOfNewUserModal: Reducer<UserManagementInterface>;
    getAllUsersSuccess: Reducer<UserManagementInterface>;
    getSingleUserSuccess: Reducer<UserManagementInterface>;
    getSpecifiedBranchSuccess: Reducer<UserManagementInterface>;
    checkBranchName: Reducer<UserManagementInterface>;
    getAllBranchSuccess: Reducer<UserManagementInterface>;
    getAllRolesSuccess: Reducer<UserManagementInterface>;
    warningMessageL: Reducer<UserManagementInterface>;
  };
}

const Model: ModelType = {
  namespace: 'CategoryReport',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    oneBranchSalesData:[],
    allItemNames:[],
    itemReportWithQuery: undefined,
    monthlySalesData:[],
    visible: false,
    visibleOfNewUser: false,
  },

  effects: {
    *getAllItemReport({ payload }, { call, put }) {
      const hide = message.loading('loading7');
      try {
        let url;
        const response = yield call(getAllItemReportFunction, url);        
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllItemSuccess', payload: response, });
          hide()
        } 
      }
      catch{
        message.error(" Load Item Failed1 !")
      }
    },

    *getAllCategoriesNames({ payload }, { call, put }) {
      try {
        let url;
        const response = yield call(getAllCategoriesNamesFunction, url);
        if (response.response && response.response.ok) {
          yield put({ type: 'getCategoryNamesSuccess', payload: response, });
        } else {
          message.error(" Load Category Names Failed !")
        }
      }
      catch{
        message.error(" Load Item Name Failed1 !")
      }
    },

    *getAllItemNames({ payload }, { call, put }) {
    
      try {
        let url;
        const response = yield call(getAllItemNameFunction, url);
        const status = response.response.status;
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllItemNameSuccess', payload: response, });
        } else {
          if(status ===500) yield put({ type: 'getAllItemNames', payload, });
        }
      }
      catch{
        message.error(" Load Item Name Failed2 !")
      }
    },

    
    *getSpecifiedDayData({ payload }, { call, put }) {
      try {
        let query = payload;
        const response = yield call(getItemWithQueryFunction, query);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getItemWithQuerySuccess',
            payload: response,
          });
        } 
      }
      catch{
        message.error(" Load Item Failed2 !")
      }
    },

    
    *getSpecifiedItemDailyData({ payload }, { call, put }) {
      try {
        const response = yield call(getSpecifiedItemDailyFunction, payload);
        const status = response.response.status;
        if (response.response && response.response.ok) {
          yield put({ type: 'getSpecifiedItemDailySuccess',  payload: response, });
        } else {
          if(status ===500) yield put({ type: 'getSpecifiedItemDailyData',  payload, });
        }
      }
      catch{
        message.error(" Load Item Failed3 !")
      }
    },

    *getSpecifiedBranchAndDayData({ payload }, { call, put }) {
      try {
        const response = yield call(getSpecifiedBranchAndDayData, payload);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getItemWithQuerySuccess',
            payload: response,
          });
        } else {
        }
      }
      catch{
        message.error(" Load Item Failed4 !")
      }
    },

    *getOneBranchItemData({ payload }, { call, put }) {
      try {
        const response = yield call(getOneBranchItemDataFunction, payload);
        if (response.response && response.response.ok) {     
          yield put({
            type: 'getItemWithQuerySuccess',
            payload: response,
          });
        }
      }
      catch{
        message.error(" Load Branch Report Failed !")
      }
    },

  
    *getSpecifiedBranchCategoryReport({ payload }, { call, put }) {
      const hide = message.loading('Loading...');
      try {
        const response = yield call(getSpecifiedBranchCategoryFunction, payload);
        if (response.response && response.response.ok) {
          hide()
          yield put({
            type: 'getBranchCategorySuccess',
            payload: response,
          });
        } 
      }
      catch{
        message.error(" Load Branch Report Failed !")
      }
    },

    *getCategoryReportWithCategoryId({ payload }, { call, put }) {
      const hide = message.loading('Loading...');
      try {
        const response = yield call(getCategoryReportWithCategoryIdFunction, payload);        
        if (response.response && response.response.ok) {
          hide()          
          yield put({
            type: 'getCategoryReportWithCategoryIdSuccess',
            payload: response,
          });
        }
      }
      catch{
        message.error(" Load Category Data Failed !")
      }
    },

    *getItemBranchReportWithId({ payload }, { call, put }) {
      try {
        const response = yield call(getItemBranchReportWithIdFunction, payload);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getItemBranchReportWithIdSuccess',
            payload: response,
          });
        }
      }
      catch{
        message.error(" Load Item Branch Report Failed !")
      }
    },

    *getAllCategoryReportData({ payload }, { call, put }) {
      try {
        const response = yield call(getAllCategoryReportFunction, payload);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getCategoryReportSuccess',
            payload: response,
          });
        }
      }
      catch{
        message.error(" Load Category Report Failed !")
      }
    },
  },

  // ------------------------------ Reducer ------------------------------
  reducers: {

    getSingleUserSuccess(state, { payload }) {
      return {
        ...state,
        oneUserInformation: payload,
      };
    },

    setVisible(state, { payload }) {
      return {
        ...state,
        visible: payload,
      };
    },

    setVisibleOfNewUserModal(state, { payload }) {
      return {
        ...state,
        visibleOfNewUser: payload,
      };
    },

    getAllBranchSalesSuccess(state, { payload }) {
      return {
        ...state,
        allBranchReport: payload,
      };
    },

    getCategoryNamesSuccess(state, { payload }) {
      return {
        ...state,
        allCategoryNames: payload.data,
      };
    },

    getAllDailySalesSuccess (state, { payload }) {
      return {
        ...state,
        allDailyReport: payload,
      };
    },

    getSpecifiedItemDailySuccess(state, { payload }) {
      return {
        ...state,
        itemDailyData: payload.data,
      };
    },

    getAllItemSuccess(state, { payload }) {
      return {
        ...state,
        allItemReport: payload.data,
      };
    },

    getAllItemNameSuccess(state, { payload }) {
      return {
        ...state,
        allItemNames: payload.data,
      };
    },

    getItemWithQuerySuccess(state, { payload }) {
      return {
        ...state,
        allItemReport: payload.data,
      };
    },

    getAllMonthSalesSuccess(state, { payload }) {
      return {
        ...state,
        monthlySalesData: payload,
      };
    },

    getCategoryReportSuccess(state, { payload }) {
      return {
        ...state,
        categoryDataWithoutBranch: payload.data,
      };
    },

    getCategoryReportWithCategoryIdSuccess(state, { payload }) {
      return {
        ...state,
        categoryBranchDataWithCategoryId: payload.data,
      };
    },

    getItemBranchReportWithIdSuccess(state, { payload }) {
      return {
        ...state,
        itemBranchReportWithQuery: payload.data,
      };
    },
    
    getBranchCategorySuccess(state, { payload }) {
      return {
        ...state,
        categoryDataWithBranch: payload.data,
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

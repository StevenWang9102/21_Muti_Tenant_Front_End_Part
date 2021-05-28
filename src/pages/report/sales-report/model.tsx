import { Effect, Reducer } from 'umi';
import { UserManagementInterface } from './data.d';
// import { select } from "redux-saga/effects";
import { IsSuperAdmin } from '@/utils/authority';
import { message, notification } from 'antd';

import {
  getAllUserFunction,
  getAllBranchFunction,
  getDailyReportWithQuery,
  getAllDailySales,
  getOneBranchSales,
  getAllMonthSalesFunction,
  getSpecifiedBranchMonthlyData,
  getAllHourlySales,
  getDateRangeDataFunction,
  getSaleHourlyReportWithQuery,
  getAllBranchSales,
  getSpecifiedBranchHourlyReport,
  getSpecifiedMonthlyDataFunction,
  getSaleReportWithBranchId
} from './service';

export interface ModelType {
  namespace: string;
  state: UserManagementInterface;

  effects: {
    getAllUserInformation?: Effect;
    getAllDailySales?: Effect;
    getAllBranchNameGlobal?: Effect;
  };

  reducers: {
    setVisible: Reducer<UserManagementInterface>;
    getOneBranchInfoSuccess: Reducer<UserManagementInterface>;
    setVisibleOfNewUserModal: Reducer<UserManagementInterface>;
    getAllUsersSuccess: Reducer<UserManagementInterface>;
    getSingleUserSuccess: Reducer<UserManagementInterface>;
    getSpecifiedBranchSuccess: Reducer<UserManagementInterface>;
    checkBranchName: Reducer<UserManagementInterface>;
    getAllBranchNamesSuccess: Reducer<UserManagementInterface>;
    getAllRolesSuccess: Reducer<UserManagementInterface>;
    warningMessageL: Reducer<UserManagementInterface>;
  };
}

const Model: ModelType = {
  
  namespace: 'SalesReport',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    oneBranchSalesData: [],
    monthlySalesData: [],
    visible: false,
    visibleOfNewUser: false,
  },

  effects: {
    *getAllBranchNameGlobal({ payload }, { call, put }) {
      try {
        if(IsSuperAdmin ()){
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
          let url, id;
          if (payload && payload.value) url = `?keyword=${payload.value}`;
          if (payload && payload.id) id = payload.id;
  
          const response = yield call(getAllBranchFunction, url, id);
          const status = response.response.status;     

          if(response.response && response.response.ok){
            yield put({
              type: 'getAllBranchNamesSuccess',
              payload: response,
            });
          } else {
            if(status===500) yield put({  type: 'getAllBranchNameGlobal', payload: payload });
          }
        }
      } catch {
      }
    },

    *getAllUserInformation({ payload }, { call, put }) {
      try {
        let url;
        if (payload.value) url = `?keyword=${payload.value}`;
        else url = null;
        const response = yield call(getAllUserFunction, url);
        yield put({ type: 'getAllUsersSuccess', payload: response,});
      } catch {
        message.error(' Load Users Failed !');
      }
    },

    *getAllBranchSales({ payload }, { call, put }) {
      try {
        if(IsSuperAdmin ()){
          notification.open({
            message: 'Unauthorized Page2',
            description:
              'You are on an Unauthorized Page. Developers are still working on authorization management.',
            className: 'custom-class',
            style: {
              width: 600,
            },
          });
        } else{
          const response = yield call(getAllBranchSales, payload);
          if (response.response && response.response.ok) {
            yield put({ type: 'getAllBranchSalesSuccess', payload: response });
          } 
        }  
      } catch {
        message.error(' Load Sales Data Failed !');
      }
    },


    *getSalesReportWithQuery({ payload }, { call, put }) {
      if(IsSuperAdmin ()){
      } else {
        try {
          const response = yield call(getDateRangeDataFunction, payload);
          if (response.response && response.response.ok) {
            yield put({ type: 'getDateRangeDataSuccess', payload: response.data });
          } 
        } catch {
          message.error(' Load Branch Sales Failed !');
        }
      }
    },

    *getSpecifiedDayData({ payload }, { call, put }) {
      try {
        let query = payload;
        const response = yield call(getSaleHourlyReportWithQuery, query);

        if (response.response && response.response.ok) {
          yield put({
            type: 'getSaleReportWithQuerySuccess',
            payload: response.data,
          });
        } 
      } catch {
      }
    },

    *getSpecifiedBranchAndDayData({ payload }, { call, put }) {
      const hide = message.loading('loading2');
      try {
        let query = payload;
        const response = yield call(getSaleReportWithBranchId, query);

        if (response.response && response.response.ok) {
          hide();
          message.success(' Load Sales Report  Success !');
          yield put({
            type: 'getSaleReportWithBranchIdSuccess',
            payload: response.data,
          });
        } 
      } catch {
        message.error(' Load Sales Report Failed !');
      }
    },

    *getSpecifiedDailyData({ payload }, { call, put }) {
      try {
        let query = payload;
        const response = yield call(getDailyReportWithQuery, query);

        if (response.response && response.response.ok) {
          yield put({
            type: 'getDailyReportWithQuerySuccess',
            payload: response.data,
          });
        } else {
        }
      } catch {
      }
    },

    *getAllHourlySales({ payload }, { call, put }) {
      try {
        const response = yield call(getAllHourlySales, payload);
        console.log(response);
      } catch {
        message.error(' Load Hourly Sales Failed !');
      }
    },

    *getAllDailySales({ payload }, { call, put }) {
      try {
        const response = yield call(getAllDailySales, payload);
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllDailySalesSuccess', payload: response });
        } 
      } catch {
        message.error(' Load Failed !');
      }
    },

    *getSpecifiedBranchHourlyReport({ payload }, { call, put }) {
      const hide = message.loading('Loading...');
      try {
        const response = yield call(getSpecifiedBranchHourlyReport, payload);
        if (response.response && response.response.ok) {
          hide();
          yield put({
            type: 'getSaleReportWithQuerySuccess',
            payload: response.data,
          });
        } 
      } catch {
      }
    },

    *getSpecifiedMonthlyData({ payload }, { call, put }) {
      try {
        const response = yield call(getSpecifiedMonthlyDataFunction, payload);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getMonthlyDataWithQuerySuccess',
            payload: response.data,
          });
        } 
      } catch {
        message.error(' Load Monthly Report Failed !');
      }
    },

    *getComparedMonthlyData({ payload }, { call, put }) {
      const hide = message.loading('Loading');
      try {
        const timeRange1 = [payload.timeRange[0], payload.timeRange[1]]
        const timeRange2 = [payload.timeRange[2], payload.timeRange[3]]
        const branchId = payload.branchId
        const response1 = yield call(getSpecifiedMonthlyDataFunction, timeRange1, branchId);
        const response2 = yield call(getSpecifiedMonthlyDataFunction, timeRange2, branchId);
        if (response1.response && response1.response.ok 
          && response2.response && response2.response.ok) {
          hide();
          yield put({
            type: 'getComnpareLastYearSuccess',
            payload: [response1.data, response2.data],
          });
        } 
      } catch {
        message.error(' Load Monthly Data Failed !');
      }
    },

    *getOneBranchSales({ payload }, { call, put }) {
      try {
        const response = yield call(getOneBranchSales, payload);
        if (response.response && response.response.ok) {
          yield put({ type: 'getOneBranchInfoSuccess', payload: response.data });
        } 
      } catch {
        message.error(' Load This Branch Data Failed !');
      }
    },

    *getSpecifiedBranchMonthlyData({ payload }, { call, put }) {
      try {
        const response = yield call(getSpecifiedBranchMonthlyData, payload);
        if (response.response && response.response.ok) {
          yield put({ type: 'getSpecifiedBranchMonthlySuccess', payload: response.data });
        } 
      } catch {
        message.error(' Load Monthly Data Failed !');
      }
    },

    *getAllMonthSales({ payload }, { call, put }) {
      try {
        const response = yield call(getAllMonthSalesFunction, payload);
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllMonthSalesSuccess', payload: response.data });
        } 
      } catch {
        message.error(' Load MonthLy Data Failed !');
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
        allBranchReport: payload.data,
      };
    },

    getAllDailySalesSuccess(state, { payload }) {
      return {
        ...state,
        allDailyReport: payload,
      };
    },

    getDailyReportWithQuerySuccess(state, { payload }) {
      return {
        ...state,
        dailyReportWithQuery: payload,
      };
    },

    getSaleReportWithBranchIdSuccess(state, { payload }) {
      return {
        ...state,
        dailyDataWithBranchId: payload,
      };
    },

    getAllBranchNamesSuccess(state, payload) {
      return {
        ...state,
        allBranchNames: payload.payload.data,
      };
    },

    getOneBranchInfoSuccess(state, { payload }) {
      return {
        ...state,
        oneBranchSalesData: payload,
      };
    },

    getSaleReportWithQuerySuccess(state, { payload }) {
      return {
        ...state,
        salesReportWithQueryData: payload,
      };
    },

    getDateRangeDataSuccess(state, { payload }) {
      return {
        ...state,
        branchReportWithQueryData: payload,
      };
    },

    getAllMonthSalesSuccess(state, { payload }) {
      return {
        ...state,
        monthlySalesData: payload,
      };
    },

    getSpecifiedBranchMonthlySuccess(state, { payload }) {
      return {
        ...state,
        monthlyBranchData: payload,
      };
    },

    getMonthlyDataWithQuerySuccess(state, { payload }) {
      return {
        ...state,
        monthlyDataWithQuery: payload,
      };
    },

    getComnpareLastYearSuccess(state, { payload }) {
      return {
        ...state,
        comnpareLastYearData: payload,
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

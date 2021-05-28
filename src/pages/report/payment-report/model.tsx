import { Effect, Reducer } from 'umi';
import { UserManagementInterface } from './data.d';

import {
  getAllPaymentFunction,
  getAllPaymentQueryFunction,
  getSpecifiedBranchAndDayData,
} from './service';
import { message } from 'antd';


export interface ModelType {
  namespace: string;
  state: UserManagementInterface;

  effects: {
    getAllUserInformation?: Effect;
    getAllDailySales?: Effect;
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
  namespace: 'PaymentReport',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    oneBranchSalesData:[],
    monthlySalesData:[],
    visible: false,
    visibleOfNewUser: false,
  },

  effects: {
    *getAllPayment({ payload }, { call, put }) {
      try {
        const response = yield call(getAllPaymentFunction);
        const status = response.response.status;     
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllPaymentSuccess', payload: response, });
        } else {
          if(status===500) yield put({ type: 'getAllPayment', payload });
        }
      }
      catch{
        message.error(" Load Payment Report Failed !")
      }
    },

    
    *getSpecifiedDayData({ payload }, { call, put }) {
      try {
        let query = payload;
        const response = yield call(getAllPaymentQueryFunction, query);
      
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllPaymentWithQuerySuccess', payload: response, });
        } else {
        }
      }
      catch{
        message.error(" Load Payment Data Failed !")
      }
    },

    *getSpecifiedBranchAndDayData({ payload }, { call, put }) {
      try {
        const response = yield call(getSpecifiedBranchAndDayData, payload);
        if (response.response && response.response.ok) {
          yield put({
            type: 'getAllPaymentWithQuerySuccess',
            payload: response,
          });
        } 
      }
      catch{
        message.error(" Load Branch Report Failed !")
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

    getAllDailySalesSuccess (state, { payload }) {
      return {
        ...state,
        allDailyReport: payload,
      };
    },

    getAllPaymentSuccess(state, payload) {
      return {
        ...state,
        allPaymentMethod: payload.payload.data,
      };
    },

    getAllPaymentWithQuerySuccess(state, { payload }) {
      return {
        ...state,
        paymentWithQuery: payload.data,
      };
    },

    getAllMonthSalesSuccess(state, { payload }) {
      return {
        ...state,
        monthlySalesData: payload,
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

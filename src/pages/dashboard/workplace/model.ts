import { Effect, Reducer } from 'umi';
import {message } from 'antd';
import { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data.d';
import { fakeChartData, 
  queryActivities, 
  queryCurrent, 
  getAllBranchFunction, 
  queryProjectNotice, 
  fetchTenantsList,
  fetchPaymentModes,
  getAllUsers,
  fetchItems,
  fetchRoles,
  fetchCategories,
 } from './service';

export interface ModalState {
  currentUser?: CurrentUser;
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  radarData: RadarDataType[];
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
  namespace: 'dashboardAndworkplace',
  state: {
    currentUser: undefined,
    projectNotice: [],
    activities: [],
    radarData: [],
    // allCandidates: [],
    allBranches: []
  },
  effects: {

    *init(_, { put }) {
      try{
        yield put({ type: 'fetchUserCurrent' });
        yield put({ type: 'fetchProjectNotice' });
        yield put({ type: 'fetchActivitiesList' });
        yield put({ type: 'fetchChart' });
      } catch {
        message.error('Initialise failed')
      }
    },

    *fetchBranch({ payload }, { call, put }) {
      try {
 
        const response = yield call(getAllBranchFunction);
        console.log('fetchBranch,response',response );
        
        yield put({
          type: 'getAllBranchSuccess',
          payload: response.data,
        });
      } catch {
      }
    },

    *fetchProgreStatus({ payload }, { call, put }) {
      try {
        const response1 = yield call(fetchPaymentModes);
        const response2 = yield call(getAllUsers);
        const response3 = yield call(fetchItems);
        const response4 = yield call(fetchRoles);
        const response5 = yield call(fetchCategories);
        // http://beautiesapi.gcloud.co.nz/api/items/categories
        console.log('fetchPayment,response4',response5 );
        
        yield put({
          type: 'fetchPaymentModesSuccess',
          payload: response1,
        });

        yield put({
          type: 'fetchUsersSuccess',
          payload: response2.data,
        });

        yield put({
          type: 'fetchItemsSuccess',
          payload: response3,
        });

        yield put({
          type: 'fetchRoleSuccess',
          payload: response4,
        });

        yield put({
          type: 'fetchCategorySuccess',
          payload: response5.data,
        });

      } catch {
        // message.error('Fetch status error.')
      }
    },

    
    *fetchAllCandidates({ payload }, { call, put }) {
      try{
        const response = yield call(fetchTenantsList, payload);
        yield put({
          type: 'fetchAllCandidatesSuccess',
          payload: {
            allCandidates: response,
          },
        });
      } catch {
      }
    },

    *fetchUserCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        payload: {
          currentUser: response,
        },
      });
    },

    *fetchProjectNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'save',
        payload: {
          projectNotice: Array.isArray(response) ? response : [],
        },
      });
    },

    *fetchActivitiesList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'save',
        payload: {
          activities: Array.isArray(response) ? response : [],
        },
      });
    },

    *fetchChart(_, { call, put }) {
      const { radarData } = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          radarData,
        },
      });
    },
  },

  // --------------------------------------------------
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {
        currentUser: undefined,
        projectNotice: [],
        activities: [],
        radarData: [],
      };
    },

    fetchAllCandidatesSuccess(state, { payload }) {
      return {
        ...state,
        allCandidates: payload,
      };
    },
    
    getAllBranchSuccess(state, { payload }) {
      console.log('getAllBranchSuccess,payload',payload);
      console.log('getAllBranchSuccess,state',state);
      
      return {
        ...state,
        allBranches: payload || [],
      };
    },

    fetchPaymentModesSuccess(state, { payload }) {
      console.log('fetchPaymentModesSuccess,payload',payload);
      
      return {
        ...state,
        allPayments: payload || [],
      };
    },

    fetchUsersSuccess(state, { payload }) {
      console.log('fetchUsersSuccess,payload',payload);
      
      return {
        ...state,
        allUsers: payload || [],
      };
    },

    fetchItemsSuccess(state, { payload }) {
      console.log('fetchUsersSuccess,payload',payload);
      
      return {
        ...state,
        allItems: payload || [],
      };
    },

    fetchRoleSuccess(state, { payload }) {
      console.log('fetchRoleSuccess,payload',payload);
      
      return {
        ...state,
        allRoles: payload.data || [],
      };
    },

    fetchCategorySuccess(state, { payload }) {
      console.log('fetchRoleSuccess,payload',payload);
      
      return {
        ...state,
        allCategories: payload || [],
      };
    },
  },
};

export default Model;

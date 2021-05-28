import { Effect, Reducer } from 'umi';
import { select } from 'redux-saga/effects';
import { BranchSettingInterface } from './data';
import {
  fetAllReservation,
  requestBranchLoacation,
  fetchAllUser,
  createReservation,
  fetchOneReservation,
  updateReservation,
  updateBranchInfo,
  deleteReservation,
  fetchAllBranch,
  requestBranchUsers,
  ferchReservationWithQuery,
} from './service';
import { message } from 'antd';

export interface ModelType {
  namespace: string;
  state: BranchSettingInterface;

  effects: {
    fetAllReservation?: Effect;
    fetchAllBranch?: Effect;
    fetchOneReservation?: Effect;
    fetchAllUser?: Effect;
    createReservation?: Effect;
    updateReservation?: Effect;
    deleteReservation?: Effect;
  };

  reducers: {
    getAllBranchSuccess: Reducer<BranchSettingInterface>;
    getSpecifiedBranchSuccess: Reducer<BranchSettingInterface>;
    checkBranchName: Reducer<BranchSettingInterface>;
    setVisibleOfEdit: Reducer<BranchSettingInterface>;
  };
}

const initState = {
  allBranchInfo: [],
  oneBranchInfo: [],
  visibleOfEdit: false,
  warningMessage: {},
};

const Model: ModelType = {
  namespace: 'reservation',
  state: initState,

  effects: {

    *fetAllReservation({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(fetAllReservation, payload);
        if(callback) callback(res)
      } catch {
      }
    },

    *ferchReservationWithQuery({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(ferchReservationWithQuery, payload);
        if(callback) callback(res.data)
      } catch {
      }
    },

    *fetchAllBranch({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(fetchAllBranch, payload);
        if(callback) callback(res)
      } catch {
      }
    },

    // updateBranchInfo @@@@@@@@@@@@@@@@@@@@@@@@
    *updateBranchInfo({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(updateBranchInfo, payload);
        if(callback) callback(res)
      } catch {
      }
    },

    // *changeBranchInformation({ payload }, { call, put }) {
    //   try {
    //     var returnActive = yield call(changeBranchNames, payload, payload.value, payload.path);

    //     if (returnActive.response && returnActive.response.ok) {
    //       if (payload.message === 3) {
    //         yield put({ type: 'getOneBranchInfo', payload: payload });
    //       }
    //     } 
    //   } catch {
    //     message.error(` Update Setting Failed !`);
    //   }
    // },
    
    *requestBranchUsers({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(requestBranchUsers, payload);
        console.log('requestBranchUsers,res',res);
        if(callback) callback(res)
      } catch {
        message.error('Fetch error.')
      }
    },

    *requestBranchLoacation({ payload, callback}, { call, put }) {
      try {    
        const res = yield call(requestBranchLoacation, payload);
        console.log('requestBranchLoacation,res',res);
        
        if(callback) callback(res)
      } catch {
        message.error('Fetch error.')
      }
    },

    *fetchOneReservation({ payload, callback}, { call, put }) {
      // alert('fetchOneReservation2')

      const hide = message.loading('Loading...')
      try {    
        const res = yield call(fetchOneReservation, payload);
        console.log('fetchOneReservation,res',res);

        if(res.response && res.response.ok) {
          if(callback) callback(res.data)
        } else {
          message.error('Fetch failed.')
        }
        hide()
      } catch {
        message.error('Fetch error.')
      }
    },

    *fetchAllUser({ payload, callback }, { call, put }) {
      try {
        const res = yield call(fetchAllUser, payload);
        if(callback) callback(res)
      } catch {
      }
    },


    *createReservation({ payload, callback }, { call, put }) {
      try {
        const res = yield call(createReservation, payload);
        console.log('createReservation,res',res);
        
        if(res.response && res.response.ok) {
          // message.success('Create success.')
          if(callback) callback(res)
        } else {
          const reMessage = res.data
          const errorMessage = []
          console.log('reMessage456',reMessage);

          if(reMessage.errors && reMessage.errors.locationId) {
            errorMessage.push('Location field is required.')
          }

          if(reMessage === "start time cannot be later than end time!") {
            errorMessage.push("Start time cannot be later than end time!")
          }
          
          if(reMessage === "beautician is occupied!") {
            errorMessage.push("This beautician is occupied.")
          }

          message.error(`Create failed. ${errorMessage.join(' ')}`)
        }
      } catch {
        message.error('Create error.')
      }
    },

    *updateReservation({ payload, callback }, { call, put }) {
      try {
        const res = yield call(updateReservation, payload);
        console.log('updateReservation,res',res);
        
        if(res.response && res.response.ok) {
          // message.success('Update success.')
          if(callback) callback(res)
        } else {
          const reMessage = res.data[''] && res.data[''][0]
          message.error(`Update failed. ${reMessage}`)
        }
      } catch {
        message.error('Update error.')
      }
    },

    *deleteReservation({ payload, callback }, { call, put }) {
      try {
        console.log('deleteReservation,payload',payload);

        const res = yield call(deleteReservation, payload);
        console.log('deleteReservation,res',res);
        
        if(res.response && res.response.ok){
          message.success(`Delete success.`)
          if(callback) callback(res)
        } else {
          message.error(`Delete failed.`)
        }
      } catch {
        message.error('Delete error.');
      }
    },


    // *changeBranchInformation({ payload }, { call, put }) {
  },

  // ------------------------------ Reducer ------------------------------
  reducers: {
    getAllBranchSuccess(state, { payload }) {
      return {
        ...state,
        allBranchInfo: payload.data,
      };
    },

    getOneBranchSuccess(state, { payload }) {
      return {
        ...state,
        oneBranchInfo: payload.data,
      };
    },

    // getOneBranchSuccess

    getSpecifiedBranchSuccess(state, { payload }) {
      return {
        ...state,
        OneBranchInfo: payload,
      };
    },

    checkBranchName(state, payload) {
      return {
        ...state,
        checkStatus: payload,
      };
    },

    setVisibleOfEdit(state, payload) {
      return {
        ...state,
        visibleOfEdit: payload.payload,
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

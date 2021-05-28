import { Effect, Reducer } from 'umi';
import { LocationInterface } from './data.d';
import {
  getAllLocationInformation,
  checkNameFunction, 
  postNewLocationFunction,
  generalGetMethodFunction,
  changeNameFunction,
  deleteLocation
} from './service';
import { message } from 'antd';
import sort from 'fast-sort';


export interface ModelType {
  namespace: string;
  state: LocationInterface;

  effects: {
    getAllLocationInformation?: Effect;
    getAllBranchName?: Effect;
    changLocationActiveStatus?: Effect;
    setVisible?: Effect;
    getAllRoles?: Effect;
    changeNames?: Effect;
    createLocation?:Effect;
    deleteLocation?: Effect;
    loadAllBranch?: Effect;
  };

  reducers: {
    setVisible?: Reducer<LocationInterface>;
    setVisibleOfSelectBranch?: Reducer<LocationInterface>;
    getAllUsersSuccess?: Reducer<LocationInterface>;
    getSingleUserSuccess?: Reducer<LocationInterface>;
    getSpecifiedBranchSuccess?: Reducer<LocationInterface>;
    getAllBranchSuccess?: Reducer<LocationInterface>;
    getAllRolesSuccess?: Reducer<LocationInterface>;
    getAllLocationsSuccess: Reducer<LocationInterface>;
  };
}

const Model: ModelType = {
  namespace: 'location',
  state: {
    visible: false,
    visibleOfSelectBranch: true,
  },

  effects: {
    *loadAllBranch({ payload }, { call, put }) {
      const hide = message.loading('Loading...');
      try {
        const response = yield call(generalGetMethodFunction, 'settings/branches');
        const status = response.response.status;

        if(response.response && response.response.ok){
          yield put({ type: 'getAllBranchSuccess', payload: response, });
          hide()
        } else {
          if(status===500) yield put({ type: 'loadAllBranch'});
        }
      }
      catch{
        message.error(" Load Branch Information Failed !")
      }
    },
    
    *getAllLocationInformation({ payload }, { call, put }) {
      try {
        const response = yield call(getAllLocationInformation, payload.id);
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllLocationsSuccess', payload: response.data });
        }
      }
      catch{
        message.error(" Load Locations Failed !")
      }
    },

    *changeNames({ payload }, { call, put }) {
      try {
        if (payload.name === "/name") {
          const name = payload.value;
          const url = `${payload.id}/locations/${payload.index}/CheckName`
          const postData = { name: name }
          const checkResponse = yield call(checkNameFunction, postData, url);

          if (checkResponse.response.ok) {
            const response = yield call(changeNameFunction, payload);
            if (response.response && response.response.ok) {
              yield put({ type: 'getAllLocationInformation', payload: { id: payload.id } })
            }
          } else {
            message.error("Fail to pass name check.")
          }
        } else {
          const response = yield call(changeNameFunction, payload);
          if (response.response && response.response.ok) {
            yield put({ type: 'getAllLocationInformation', payload: { id: payload.id } })
          }
        }
        yield put({ type: 'setVisible', payload: false, });

      } catch{
        message.error("Fail to update names.")
      }
    },

    *createLocation({ payload }, { call, put }) {
      const url = `${payload.branchId}/locations/CheckName`
      const postUrl = `${payload.branchId}/locations`
      const postData = { name: payload.name }

      try {
        const checkResponse = yield call(checkNameFunction, postData, url);

        if (checkResponse.response.ok) {
          const response = yield call(postNewLocationFunction, payload, postUrl);
          if (response.response && response.response.ok) {
            yield put({ type: 'getAllLocationInformation', payload: { id: payload.branchId } })
          }
        } else {
          message.error("Fail to pass name check. Try another name.")
        }

        yield put({ type: 'setVisible', payload: false, });

      } catch{
        message.error("Fail to create location.")
      }
    },

    *deleteLocation({ payload }, { call, put }) {
      try {
        const response = yield call(deleteLocation, payload);

        console.log('deleteLocation,response', response);
        console.log('deleteLocation,response.data', response.data['']);
        
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllLocationInformation', payload: { id: payload.id } })
        } else{
          if(response.data && response.data[''][0].includes('there are ordered based')){
            message.error("Fail to delete location. There are orders based on it.")
          } else {
            message.error("Fail to delete location.")
          }
        }
      } catch{
        message.error("Fail to delete location.")
      }
    },

    *changLocationActiveStatus({ payload }, { call, put }) {
      try {
        const changeSuccess = yield call(changeNameFunction, payload);
        if (changeSuccess.response && changeSuccess.response.ok) {
          if (payload.message === "only one success") {
            yield put({ type: 'getAllLocationInformation', payload: { id: payload.id } });
          }
        } 
        else {
          yield put({ type: 'changLocationActiveStatus', payload});
        }
      }
      catch{
        message.error("Change Active Status Failed !")
      }
    },

    *getAllRoles({ payload }, { call, put }) {
      try {
        const response = yield call(generalGetMethodFunction, 'crm/roles');
        yield put({
          type: 'getAllRolesSuccess',
          payload: response,
        });
      }
      catch{
        message.error(" Load Roles Failed !")
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

    setVisibleOfSelectBranch(state, { payload }) {
      return {
        ...state,
        visibleOfSelectBranch: payload,
      };
    },

    

    getAllBranchSuccess(state, payload) {
      console.log('getAllBranchSuccess', payload);
      const allBranch = payload.payload.data.filter(each =>each.isInactive == false)
      sort(allBranch).asc(branch => branch.shortName.toLowerCase())

      return {
        ...state,
        allBranchNames: allBranch,
      };
    },

    getAllRolesSuccess(state, payload) {
      return {
        ...state,
        allRoles: payload.payload.data,
      };
    },

    getAllLocationsSuccess(state, payload) {
      return {
        ...state,
        allLocations: payload.payload,
      };
    },
  },
};

export default Model;

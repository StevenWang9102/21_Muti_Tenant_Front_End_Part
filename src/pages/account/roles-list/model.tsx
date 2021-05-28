import { Effect, Reducer } from 'umi';
import { RoleManagementInterface, LocalPropsInterface } from './data.d';
import {
  checkNameFunction, 
  generalGetMethodFunction, updateRoleNameFunction,
  postNewBranchFunction, deleteRoleFunction, createRoleFunction
} from './service';
import { message } from 'antd';


export interface ModelType {
  namespace: string;
  state: LocalPropsInterface;

  effects: {
    changCodeNumber?: Effect;
    changActiveStatus?: Effect;
    changPhoneNumberAction?: Effect;
    createNewUser?: Effect;
    setVisible?: Effect;
    getAllRoles?: Effect;
    updateRoleName?: Effect;
    deleteRole?: Effect;
    createNewRole?: Effect;
  };

  reducers: {
    getAllUsersSuccess: Reducer<RoleManagementInterface>;
    getSingleUserSuccess: Reducer<RoleManagementInterface>;
    getSpecifiedBranchSuccess: Reducer<RoleManagementInterface>;
    checkBranchName: Reducer<RoleManagementInterface>;
  };
}


const Model: ModelType = {
  namespace: 'roleManagementPro',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    allBranchNames: [],
    allRoles: [],
    visible: false,
    visibleOfNewUser: false,
  },

  effects: {
  
    *createNewUser({ payload }, { call, put }) {
      try {
        const changeSuccess = yield call(postNewBranchFunction, payload);

        if (changeSuccess.response && changeSuccess.response.ok) {
          message.success("Create User Success !")
          yield put({ type: 'getAllUserInformation', payload: "no message" });
          yield put({ type: 'setVisibleOfNewUserModal', payload: false });
        } else {
          // message.error(`Create User Failed! ${changeSuccess.data[''] || ""}`)
        }
      }
      catch{
        message.error("Create User Failed")
      }
    },

    *getAllRoles(_, { call, put }) {
      try {
        const response = yield call(generalGetMethodFunction, 'crm/roles');
        yield put({
          type: 'getAllRolesSuccess',
          payload: response,
        });
      }
      catch{
        message.error(" Get Roles Failed !")
      }
    },

    *updateRoleName({ payload }, { call, put }) {
      
      try {
        const url = "roles/checkName"
        const response = yield call(checkNameFunction, payload, url);
        
        if (response.response && response.response.ok) {
          yield call(updateRoleNameFunction, payload.id, payload.name);
          yield put({ type: 'getAllRoles' });
          yield put({ type: 'setVisible', payload: false, });
          message.success(" Change Role Name Success !")
        } else {
          message.error(` This role name has already exist!`)
        }
      }
      catch{
        message.error(" Change Role Name Failed !")
      }
    },

    *deleteRole({ payload }, { call, put }) {
      try {
        const deleteReturn = yield call(deleteRoleFunction, payload);

        if (deleteReturn.response && deleteReturn.response.ok) {
          yield put({ type: 'getAllRoles' });
          // message.success("Delete This Role Success")
        } else {
          if(`${deleteReturn.data['']}`==='TenantAdmin role cannot be deleted.'){
            message.error("Tenant Admin cannot be deleted.")
          } else {
            message.error("This Role has users based on it. You can not delete it.")
          } 
        }
      }
      catch{
        message.error(" Delete This Role Failed !")
      }
    },

    *createNewRole({ payload }, { call, put }) {
      try {
        const url = "roles/checkName"
        const response = yield call(checkNameFunction, payload, url);

        if (response.response && response.response.ok) {
          const createReturn = yield call(createRoleFunction, payload.Name);
          if (createReturn.data['']) {
            message.error(`This name has already exist.`)
          } else {
            yield put({ type: 'getAllRoles' });
            yield put({ type: 'setVisible', payload: false, });
            message.success("Success")
          }
        } else {
          message.error(` This role name has already exist!`)
        }
      }
      catch{
        message.error(" Create Role Failed !")
      }
    },
  },

  // ------------------------------ Reducer ------------------------------
  reducers: {

    setVisible(state:LocalPropsInterface, { payload }: { payload: boolean }) {
      return {
        ...state,
        visible: payload,
      };
    },

    setVisibleOfNewUserModal(state:LocalPropsInterface, { payload }: { payload: boolean }) {
      return {
        ...state,
        visibleOfNewUser: payload,
      };
    },

    getAllRolesSuccess (state: LocalPropsInterface, { payload } :{ payload: {data: any[]} }) {
      return {
        ...state,
        allRoles: payload.data,
      };
    },
  },
};

export default Model;

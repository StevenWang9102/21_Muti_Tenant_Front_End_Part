import { Effect, Reducer } from 'umi';
import { UserManagementInterface } from './data.d';
import { select } from 'redux-saga/effects';
import sort from 'fast-sort';
import {
  fetchMembers,
  deletCustomer,
  createMember,
  fetchOneMembers,
  updateMember,
  searchMember,
} from './service';
import { message } from 'antd';

export interface ModelType {
  namespace: string;
  state: UserManagementInterface;

  effects: {
    getAllUserInformation?: Effect;
    getSingleUserInformation?: Effect;
    createNewUser?: Effect;
    getAllBranchName?: Effect;
    editUserInformation?: Effect;
    checkEmailFunction: Effect;
    checkNameFunction?: Effect;
    changMonikerName?: Effect;
    changeAllCompanyNames?: Effect;
    changeAllRoles?: Effect;
    changCodeNumber?: Effect;
    changActiveStatus?: Effect;
    changPhoneNumberAction?: Effect;
    setVisible?: Effect;
    getAllRoles?: Effect;
    checkPhoneNumberFunction?: Effect;
  };

  reducers: {
    setVisible: Reducer<UserManagementInterface>;
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
  namespace: 'menbesddrManagements48484',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    filteredAllUserInformation: [],
    visible: false,
    visibleOfNewUser: false,
  },


  effects: {
    *fetchMembers({ payload, callback }, { call, put }) {
      try {
        const res = yield call(fetchMembers);
        if(callback) callback(res)
      } catch {
        message.error(' Load Members Failed !');
      }
    },

    *searchMember({ payload, callback }, { call, put }) {
      try {
        const res = yield call(searchMember, payload);
        console.log('searchMember,res',res);
        if(callback) callback(res.data)
      } catch {
        message.error(' Load Members Failed !');
      }
    },

    *fetchOneMembers({ payload, callback }, { call, put }) {
      try {
        const res = yield call(fetchOneMembers, payload);
        if(callback) callback(res)
      } catch {
        message.error(' Load Members Failed !');
      }
    },

    *createMember({ payload, callback }, { call, put }) {
      const hide = message.loading('Loading...')

      try {
        const res = yield call(createMember, payload);
        console.log('createMember,res', res);
        if(res.id){
          message.success('Success.')
          if(callback) callback(res)
          
        } else {
          // 验证重复性
          const reMessage = []
          
          if(res.data && res.data['']){
            const reError = res.data[''][0]            
            if(reError.includes('phone')) reMessage.push('This phone has already exist.')
            if(reError.includes('email')) reMessage.push('This email has already exist.')
          }


          // 验证正确性
          const reErrors = res.data.errors
          if(res.data.errors){
            if(reErrors.Phone) reMessage.push('This phone number is invalid.')
            if(reErrors.Email) reMessage.push('This email address is invalid.')
            if(reErrors.FirstName) reMessage.push('First name is required.')
            if(reErrors.LastName) reMessage.push('Last name is required.')
          }

          const error = message.error(`Create failed. ${reMessage.join(` `)}`)
          // if(callback) callback(res)

          setTimeout(()=>{
            error()
           }, 3000)
        }
        hide()
      } catch {
        message.error('Create Error !');
        hide()
      }
    },
    
    *updateMember({ payload, callback }, { call, put }) {
      try {
        console.log('updateMember,payload',payload);

        const res = yield call(updateMember, payload);
        console.log('updateMember,res',res);
        
        if(res.response && res.response.ok){
          message.success(`Update success.`)
          if(callback) callback(res)
        } else {
          const resultMessage = []
          if(res.data.Phone) resultMessage.push('This phone number is invalid.') 
          if(res.data.Email) resultMessage.push('This email address is invalid.') 
          if(res.data.FirstName) resultMessage.push('First name field is required.') 
          if(res.data.LastName) resultMessage.push('Last name field is required.') 

         const hide = message.error(`Update failed. ${resultMessage.join(` `)}`)
         setTimeout(()=>{
          hide()
         }, 3000)
        }
      } catch {
        message.error('Update error.');
      }
    },

    *deletCustomer({ payload, callback }, { call, put }) {
      try {
        console.log('deletCustomer,payload',payload);

        const res = yield call(deletCustomer, payload);
        console.log('deletCustomer,res',res);
        
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
  },

  // ------------------------------ Reducer ------------------------------
  reducers: {
    loading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },

    onBranchNameClick(state, { payload }) {

      return {
        ...state,
        filteredAllUserInformation: payload,
      };
    },

    getSingleUserSuccess(state, { payload }) {
      return {
        ...state,
        oneUserInformation: payload,
      };
    },

    getUserBranchSuccess(state, { payload }) {
      return {
        ...state,
        branchUserInfo: payload.data,
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
        visibleOfNewUser: payload.value,
      };
    },

    getAllUsersSuccess(state, { payload }) {
      console.log(payload);
      var allUserInformation = payload.data
      sort(allUserInformation).desc(user => new Date(user.createTime).getTime())

      return {
        ...state,
        allUserInformation: allUserInformation,
        allUserInformation1: allUserInformation,
      };
    },

    reloadAllUserSuccess(state, { payload }) {
      console.log(payload);

      return {
        ...state,
        reloadAllUserSuccess: payload.data,
      };
    },

    getOneUsersSuccess(state, { payload }) {
      return {
        ...state,
        oneUserInformation: payload.data,
      };
    },

    getOneUsersBranchRolesSuccess(state, { payload }) {
      return {
        ...state,
        oneUserBranchRoles: payload.data,
      };
    },

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

    getAllBranchSuccess(state, { payload }) {
      var allBranch = payload.data
      console.log('getAllBranchSuccess, allBranch', allBranch);
      
      sort(allBranch).asc(each =>each.shortName.toLowerCase())

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

    warningMessage(state, { payload }) {
      return {
        ...state,
        warningMessage: payload,
      };
    },
  },
};

export default Model;

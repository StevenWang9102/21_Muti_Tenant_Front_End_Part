import { Effect, Reducer } from 'umi';
import { UserManagementInterface } from './data.d';
import { select } from 'redux-saga/effects';
import sort from 'fast-sort';
import {
  getAllUserFunction,
  getSingleUserFunction,
  editUserFunction,
  editUserBranchRolesFunction,
  checkUserNamesFunction,
  checkCodeFunction,
  changActiveStatusFunction,
  generalGetMethodFunction,
  postNewBranchFunction,
  getUserBranchRoles,
  requestBranchUserInformation,
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
  namespace: 'userManagementPro',
  state: {
    allUserInformation: [],
    oneUserInformation: [],
    filteredAllUserInformation: [],
    visible: false,
    visibleOfNewUser: false,
  },


  effects: {
    *getAllUserInformation({ payload }, { call, put }) {
      try {
        let url;
        if (payload && payload.value) url = `?keyword=${payload.value}`;
        else url = null;
        const response = yield call(getAllUserFunction, url);
        const status = response.response.status;
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllUsersSuccess', payload: response });
        } else {
          if (status === 500) yield put({ type: 'getAllUserInformation', payload: payload })
        }

      } catch {
        message.error(' Load Users Failed !');
      }
    },

    *reloadAllUserInformation({ payload }, { call, put }) {
      try {
        const response = yield call(getAllUserFunction);
        const status = response.response.status;

        if (response.response && response.response.ok) {
          const response = yield call(getAllUserFunction);
          yield put({ type: 'reloadAllUserSuccess', payload: response });
        } else {
          if (status === 500) yield put({ type: 'reloadAllUserInformation', payload: payload })
        }

      } catch {
        message.error(' Load Users Failed !');
      }
    },

    *getAllBranchName({ payload }, { call, put }) {
      try {
        const response = yield call(generalGetMethodFunction, 'settings/branches');
        const status = response.response.status;

        if (response.response && response.response.ok) {
          yield put({ type: 'getAllBranchSuccess', payload: response, });
        } else {
          if (status === 500) yield put({ type: 'getAllBranchName' });
        }
      } catch {
      }
    },

    *getSingleUserInformation({ payload }, { call, put }) {
      const hide = message.loading('Loading...');
      try {
        const response = yield call(getSingleUserFunction, payload);
        const response1 = yield call(getUserBranchRoles, payload);

        if (response.response && response.response.ok &&
          response1.response && response1.response.ok
        ) {
          yield put({ type: 'getOneUsersSuccess', payload: response });
          yield put({ type: 'getOneUsersBranchRolesSuccess', payload: response1 });
          hide();
        }
      } catch {
        message.error('  Load This User Failed!');
      }
    },

    *warningBlank({ payload }, { call, put }) {
      const state = yield select();
      let myPayload = state.userManagementPro.warningMessage || {};


      try {
        myPayload[payload.type] = { status: 'null', message: undefined };
        yield put({ type: 'warningMessage', payload: myPayload });
      } catch { }
    },

    *warningBlankOfEmail({ payload }, { call, put }) {
      const state = yield select();
      let myPayload = state.userManagementPro.warningMessage || {};

      try {
        myPayload[payload.type] = { status: 'error', message: 'Please input an email.' };
        yield put({ type: 'warningMessage', payload: myPayload });
      } catch { }
    },

    *warningBlankOfFirstName({ payload }, { call, put }) {
      const state = yield select();
      let myPayload = state.userManagementPro.warningMessage || {};


      try {
        if (payload.status === 'error')
          myPayload['firstName'] = { status: 'error', message: 'Please input your first name.' };

        if (payload.status === 'success')
          myPayload['firstName'] = { status: 'null', message: undefined };

        yield put({ type: 'warningMessage', payload: myPayload });
      } catch { }
    },

    *warningBlankOfLastName({ payload }, { call, put }) {
      const state = yield select();
      let myPayload = state.userManagementPro.warningMessage || {};

      try {
        if (payload.status === 'error')
          myPayload['lastName'] = { status: 'error', message: 'Please input your last name.' };
        if (payload.status === 'success')
          myPayload['lastName'] = { status: 'null', message: undefined };

        yield put({ type: 'warningMessage', payload: myPayload });
      } catch { }
    },

    *editUserInformation({ payload }, { call, put }) {
      let errorMessage = [];

      try {
        const path = [
          '/firstName',
          '/middleName',
          '/lastName',
          '/moniker',
          '/phoneNumber',
          '/code',
          '/country',
          '/city',
          '/suburb',
          '/street',
          '/dob',
          '/ird',
        ];
        const values = [
          payload.firstName,
          payload.middleName,
          payload.lastName,
          payload.moniker,
          payload.phone,
          payload.code,
          payload.country,
          payload.city,
          payload.suburb,
          payload.street,
          payload.dob,
          payload.ird,
        ];
        const changeNamesSuccess = yield call(editUserFunction, payload.id, path, values);
        yield call(editUserBranchRolesFunction, payload);

        // 如果成功发送成功信息
        if (changeNamesSuccess.response.ok) {
          const response = yield call(getAllUserFunction);
          if (payload.currentBranchId) {
            yield put({ type: 'reloadAllUserSuccess', payload: response });
          } else {
            yield put({ type: 'getAllUserInformation', payload: null })
          }
          yield put({ type: 'setVisibleOfNewUserModal', payload: false });
        }

      } catch {
        message.error(`Update ${errorMessage.join(', ')} Fail!`);
      }
    },

    *changActiveStatus({ payload }, { call, put }) {
      console.log(payload);

      try {
        const url = 'IsInactive';
        if (payload.type === 'Switch_Once') {
          const hide = message.loading("Loading...")
          const changeSuccess = yield call(changActiveStatusFunction, payload.id, url);
          if (changeSuccess.response.ok) {
            if (payload.currentBranchId) {
              const success = yield put({ type: 'reloadAllUserInformation', payload: 'no message' });
              success.response.ok && hide()
            } else {
              const success = yield put({ type: 'getAllUserInformation', payload: 'no message' });
              success.response.ok && hide()
            }
          }
        }

        if (payload.type === 'Switch_All_On' || payload.type === 'Switch_All_Off') {
          if (payload.message === 'first one success') var hide = message.loading("Loading...")

          const changeSuccess = yield call(changActiveStatusFunction, payload.id, url);
          if (changeSuccess.response.ok) {
            yield put({ type: 'getAllUserInformation', payload: 'no message' });
            hide()
          }
        }
      } catch {
      }
    },

    *createNewUser({ payload }, { call, put }) {
      const hide = message.loading('Creating...')
      try {
        const changeSuccess = yield call(postNewBranchFunction, payload);

        if (changeSuccess.response && changeSuccess.response.ok) {
          message.success('Create User Success !');
          yield put({ type: 'getAllUserInformation', payload: 'no message' });
          yield put({ type: 'setVisibleOfNewUserModal', payload: false });
        }
        hide()

      } catch {
        message.error('Create User Failed');
        hide()
      }
    },

    *checkEmailFunction({ payload }, { call, put }) {
      const state = yield select();
      let myPayload = state.userManagementPro.warningMessage || {};

      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const flag = regExp.test(String(payload.currentValue).toLowerCase());

      if (flag) {
        myPayload[payload.type] = { status: 'validating', message: null };
        yield put({ type: 'warningMessage', payload: myPayload });

        if (payload.isNull) {
          myPayload[payload.type] = { status: 'null', message: null };
          yield put({ type: 'warningMessage', payload: myPayload });
        } else {
          const checkSuccess = yield call(checkUserNamesFunction, payload);
          if (checkSuccess.response && checkSuccess.response.ok) {
            myPayload[payload.type] = { status: 'success', message: undefined };
            yield put({ type: 'warningMessage', payload: myPayload });
          } else {
            if (payload.type === 'email') {
              myPayload[payload.type] = {
                status: 'error',
                message: 'This email has already exist.',
              };
              yield put({ type: 'warningMessage', payload: myPayload });
            } else {
              myPayload[payload.type] = {
                status: 'error',
                message: 'This full name has already exist.',
              };
              yield put({ type: 'warningMessage', payload: myPayload });
            }
          }
        }
      } else {
        if (payload.isNull) {
          myPayload[payload.type] = { status: 'null', message: null };
          yield put({ type: 'warningMessage', payload: myPayload });
        } else {
          myPayload[payload.type] = { status: 'error', message: 'This is not a valid email.' };
          yield put({ type: 'warningMessage', payload: myPayload });
        }
      }
    },

    *checkNameFunction({ payload }, { call, put }) {
      const state = yield select();

      let myPayload = state.userManagementPro.warningMessage || {};

      try {
        myPayload[payload.type] = { status: 'validating', message: null };
        yield put({ type: 'warningMessage', payload: myPayload });
        if (payload.isNull) {
          myPayload[payload.type] = { status: 'null', message: null };
          yield put({ type: 'warningMessage', payload: myPayload });
        }
        const checkSuccess = yield call(checkUserNamesFunction, payload);
        if (checkSuccess.response && checkSuccess.response.ok) {
          myPayload['firstName'] = { status: 'success', message: undefined };
          myPayload['middleName'] = { status: 'success', message: undefined };
          myPayload['lastName'] = { status: 'success', message: undefined };
          yield put({ type: 'warningMessage', payload: myPayload });
        } else {
          if (payload.type === 'email') {
            myPayload[payload.type] = { status: 'error', message: 'This email has already exist.' };
            yield put({ type: 'warningMessage', payload: myPayload });
          } else {
            myPayload['firstName'] = {
              status: 'error',
              message: 'This full name has already exist.',
            };
            myPayload['middleName'] = {
              status: 'error',
              message: 'This full name has already exist.',
            };
            myPayload['lastName'] = {
              status: 'error',
              message: 'This full name has already exist.',
            };

            yield put({ type: 'warningMessage', payload: myPayload });
          }
        }
      } catch {
        message.error('Create User Failed');
      }
    },

    *checkCodeFunction({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.userManagementPro.warningMessage || {};

      if (!payload.isNull) {
        const checkSuccess = yield call(checkCodeFunction, payload);
        if (checkSuccess.response && checkSuccess.response.ok) {
          newPayload[payload.type] = { status: 'success', message: undefined };
          yield put({ type: 'warningMessage', payload: newPayload });
        } else {
          newPayload[payload.type] = { status: 'error', message: 'This code has already exist.' };
          yield put({ type: 'warningMessage', payload: newPayload });
        }
      }
    },

    *validationOfSubmit({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.userManagementPro.warningMessage || {};
      newPayload[payload.type] = { status: 'error', message: "This field is required" };
      yield put({ type: 'warningMessage', payload: newPayload });
    },

    *checkPhoneNumberFunction({ payload }, { call, put }) {
      const state = yield select();
      let newPayload = state.userManagementPro.warningMessage || {};

      if (payload.isNull) {
        newPayload[payload.name] = { status: 'null', message: null };
        yield put({ type: 'warningMessage', payload: newPayload });
      } else {
        if (payload.value) {
          newPayload[payload.name] = {
            status: 'success',
            message: null,
          };
          yield put({ type: 'warningMessage', payload: newPayload });
        } else {
          newPayload[payload.name] = {
            status: 'error',
            message: 'Please input only numbers.',
          };
          yield put({ type: 'warningMessage', payload: newPayload });
        }
      }
    },

    *requestBranchUserInformation({ payload }, { call, put }) {
      try {
        const hide = message.loading("Loading...")
        const response = yield call(requestBranchUserInformation, payload);
        if (response.response && response.response.ok) {
          yield put({ type: 'getUserBranchSuccess', payload: response, });
          hide()
        }
      } catch {
      }
    },

    *getAllRoles({ payload }, { call, put }) {
      try {
        const response = yield call(generalGetMethodFunction, 'crm/roles');
        const status = response.response.status;
        if (response.response && response.response.ok) {
          yield put({ type: 'getAllRolesSuccess', payload: response });
        } else {
          if (status === 500) yield put({ type: 'getAllRoles' });
        }
      } catch {
        message.error(' Load Roles Failed !');
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

import { Effect, Reducer } from 'umi';
import {  fetchCurrent } from '@/services/menu';
import { MenuDataItem } from '@ant-design/pro-layout';

export interface MenuModelState {
  currentMenu: MenuDataItem[];
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentMenu: Reducer<MenuModelState>;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',

  state: {
    currentMenu: [],
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(fetchCurrent, payload);
      yield put({
        type: 'saveCurrentMenu',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentMenu(state, action) {
      return {
        ...state,
        currentMenu: action.payload ||[],
      };
    },
  },
};

export default MenuModel;
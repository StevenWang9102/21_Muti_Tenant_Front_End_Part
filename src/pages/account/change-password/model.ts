import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { removeToken } from '@/utils/authority';
import { updateCurrentUserPassword } from './service';
import { message, Modal } from 'antd';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    update: Effect;
  };
  reducers: {
    save: Reducer<any>;
  };
}
const Model: ModelType = {
  namespace: 'changePassword',

  state: {},

  effects: {
    *update({ payload }, { call, put }) {
      try{
        const response = yield call(updateCurrentUserPassword, payload);
        console.log('response48', response);
        
        if(response && response.response && response.response.ok ){
          message.success('Update password success.')
        }

        if(response && response.data && response.data[''][0] == "Incorrect password." ){
          message.error('Your current password is incorrect.')
        }

      } catch {
        message.error('Update Failed.')
      }

  },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload || {},
      };
    },
  },
};

export default Model;

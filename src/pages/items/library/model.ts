import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fetchImageLibrary, deleteImage } from './service';
import { message, notification } from 'antd';
import { CategoriesTreeData, CategoriesTreeItem } from './data.d';

export interface StateType {
  data: CategoriesTreeData;
  OneCategory: Partial<CategoriesTreeItem>;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchOne: Effect;
    add: Effect;
    delete: Effect;
    update: Effect;
  };
  reducers: {
    fetchSuccess: Reducer<StateType>;
    fetchOneSuccess: Reducer<StateType>;
    addSuccess: Reducer<StateType>;
    deleteSuccess: Reducer<StateType>;
    updateSuccess: Reducer<StateType>;
  };
}
const initialState = {
  data: {
    list: [],
  },
  OneCategory: {},
}

const Model: ModelType = {
  namespace: 'ItemLibrary',

  state: {
    allImages: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const hide = message.loading('Loading')
      try{
        const response = yield call(fetchImageLibrary, payload);
        console.log('response111', response);
        
        yield put({
          type: 'fetchSuccess',
          payload: response,
        });
        
        hide()
      } catch {
        hide()
        message.error('Get image library failed.')
      }
    },

    *deleteImage({ payload, callback}, { call, put }) {
      try{
        const response = yield call(deleteImage, payload);
        console.log('response111', response);
        if(callback) callback(response)
      } catch {
        message.error('Delete failed.')
      }
    },
  },

  reducers: {
    fetchSuccess(state, action) {
      console.log("fetchSuccess1,state=",state);
      console.log("fetchSuccess2,action=",action);

      return {
        ...state,
        allImages: action.payload
      };
    },

  },
};

export default Model;

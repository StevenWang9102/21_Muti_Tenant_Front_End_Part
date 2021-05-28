import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fetchCategories, fetchOneCategory, addCategory, validateCategoryNameWithId, addImage, updateCategory, deleteCategory } from './service';
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
  namespace: 'CategoriesTreeData',

  state: {
    data: {
      list: [],
    },
    OneCategory : {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      try{
        const response = yield call(fetchCategories, payload);
        console.log('response111', response);
        
        yield put({
          type: 'fetchSuccess',
          payload: response,
        });

        if(callback) callback(response)
      } catch {
        message.error('Fetch categories error.')
      }
    },


    *validateCategoryName({ payload, callback }, { call, put }) {
      try{
        yield call(validateCategoryNameWithId, payload);        
      } catch {
        message.error('Update failed! This category name has already exist.')
      }
    },

    *fetchOne({ payload, callback }, { call, put }) {
      const hide = message.loading("Loading...")
      const response = yield call(fetchOneCategory, payload);
      yield put({
        type: 'fetchOneSuccess',
        payload: response,
      });
      hide()
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      // const hide = message.loading('Loading...')
      try{
        const response = yield call(addCategory, payload);
        yield put({
          type: 'addSuccess',
          payload: response,
        });
        if (callback) callback(response);
        // hide()
      } catch {
        message.error('Add Category Failed!')
        // hide()
      }
    },
    
    *delete({ payload, callback }, { call, put }) {
      try{
        const success = yield call(deleteCategory, payload);
        console.log(success);
    
        if (callback){ callback(success)} 
        yield put({ type: 'fetch'});
      } catch{
          message.error('You can not delete this category, because it has related items.')
      }
    },

    *update({ payload, callback }, { call, put }) {
      const hide = message.success('Success !')
      const updateRes = yield call(updateCategory, payload),
            fetchRes = yield call(fetchCategories, payload);
      yield put({
        type: 'updateSuccess',
        payload: updateRes,
      });

      yield put({
        type: 'fetchSuccess',
        payload: fetchRes,
      });
      if (callback) callback(updateRes);
      hide()
    },

    
    *uploadImage({ payload, callback }, { call, put }) {
      const response = yield call(addImage, payload);
      yield put({  type: 'fetch' });
      if (callback) callback(response);
    },
  },

  reducers: {
    fetchSuccess(state, action) {
      console.log("fetchSuccess1,state=",state);
      console.log("fetchSuccess2,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      const categoriesList: CategoriesTreeItem[] = action.payload;

      return {
        ...state,
        data: {
          list: categoriesList,
        },
        OneCategory: {},
      };
    },

    fetchOneSuccess(state, action){
      console.log("fetchOneSuccess1,state=",state);
      console.log("fetchOneSuccess2,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      let newList = state.data.list.map(list => list);
      const currentItem: CategoriesTreeItem = {...action.payload};
      return {
        ...state,
        data: {
          list: newList,
        },
        OneCategory : currentItem,
      };
    },

    addSuccess(state, action) {
      console.log("addSuccess1,state=",state);
      console.log("addSuccess2,action=",action);
      const currentItem: CategoriesTreeItem = {...action.payload};
      if (typeof state === 'undefined') {
        return initialState
      }
      console.log("addSuccess,currentItem=",currentItem);
      let newList: CategoriesTreeItem[] = state.data.list;
      newList.push(currentItem)
      console.log("addSuccess,newList=",newList);
      return {
        ...state,
        data: {
          list: newList,
        },
        OneCategory: {},
      };
    },

    updateSuccess(state, action){
      console.log("updateSuccess1,state=",state);
      console.log("updateSuccess2,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      let newList = state.data.list.map(list => list);
      return {
        ...state,
        data: {
          list: newList,
        },
        OneCategory: {},
      };
    },
    
    deleteSuccess(state, action){
      console.log("deleteSuccess1,state=",state);
      console.log("deleteSuccess2,action=",action);
      if (typeof state === 'undefined') {
        return initialState
      }
      const newList = state.data.list.filter(list=> list.id != action.payload);

      return {
        ...state,
        data: {
          list: newList,
        },
        OneCategory: {},
      };
    },
  },
};

export default Model;

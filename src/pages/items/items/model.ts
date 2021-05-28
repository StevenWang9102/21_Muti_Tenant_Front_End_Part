import { Effect, Reducer } from 'umi';
import {
  fetchItems,
  fetchCategories,
  searchItems,
  addItem,
  deleteItem,
  updateItem,
  addImage,
  updateBranchItem,
  updateBranchPrice,
  fetchBranchItem,
  updateBranchItemList,
  batchUpload,
  fetchImageLibrary
} from './service';
import sort from 'fast-sort';
import { TableListData, TableListItem } from './data.d';
import { message, notification } from 'antd';

export interface StateType {
  data: TableListData;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchItems: Effect;
    fetchImageLibrary: Effect;
    search: Effect;
    add: Effect;
    delete: Effect;
    update: Effect;
  };
  reducers: {
    fetchItemsListSuccess: Reducer<StateType>;
    fetchCategoriesListSuccess: Reducer<StateType>;
    searchSuccess: Reducer<StateType>;
    addSuccess: Reducer<StateType>;
    deleteSuccess: Reducer<StateType>;
    updateSuccess: Reducer<StateType>;
  };
}
const initialState = {
  data: {
    list: [],
    categoriesList: [],
    pagination: {},
  },
};

const Model: ModelType = {
  namespace: 'itemsData',

  state: {
    data: {
      list: [],
      categoriesList: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try{
        const itemsListRes = yield call(fetchItems, payload)
        sort(itemsListRes.data).desc(item => item.id)
      
        const pagination = itemsListRes.response.headers.get('x-pagination')
        const totalCount = JSON.parse(pagination).TotalCount

        yield put({
          type: 'fetchItemsListSuccess',
          payload: {
            itemsListRes: itemsListRes.data,
            totalItemCount: totalCount,
            params: payload,
          },
        });

        yield put({
          type: 'fetchCategoriesListSuccess',
          payload: [],
        });

        yield put({
          type: 'fetchBranchesListSuccess',
          payload: [],
        });
      } catch {
        message.error('Fetch initial source fail.')
      }
    },

    *fetchCategories({ payload, callback }, { call, put }) {
      try{
        const response = yield call(fetchCategories, payload);
        console.log('response111', response);
        
        yield put({
          type: 'fetchSuccess',
          payload: response,
        });

        if(callback) callback(response)
      } catch {
        message.error('Fetch category error.')
      }
    },

    *fetchItems({ payload }, { call, put }) {
      try{
        const itemsListRes = yield call(fetchItems, payload)
                
        const pagination = itemsListRes.response.headers.get('x-pagination')
        const totalCount = JSON.parse(pagination).TotalCount

        sort(itemsListRes).desc(item => item.id)
        yield put({
          type: 'fetchItemsListSuccess',
          payload: {
            itemsListRes: itemsListRes,
            totalItemCount: totalCount,
            params: payload,
          },
        });

      } catch {
      }
    },

    *uploadImage({ payload, callback }, { call, put }) {
      yield call(addImage, payload);
      yield put({  type: 'fetch' });
    },

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ batchUpload
    *batchUpload({ payload, callback}, { call, put }) {
      const hide = message.loading('Loading...')
      try{
        const res = yield call(batchUpload, payload);
        console.log('batchUpload,response111', res);
        if(callback) callback(res)
        hide()
      } catch {
        hide()
        message.error('Get image library failed.')
      }
    },

    *fetchImageLibrary({ payload, callback}, { call, put }) {
      const hide = message.loading('Loading...')
      try{
        const response = yield call(fetchImageLibrary, payload);
        console.log('response111', response);

        hide()
      } catch {
        hide()
        message.error('Get image library failed.')
      }
    },

    *search({ payload }, { call, put }) {
      const response = yield call(searchItems, payload);

      const pagination = response.response.headers.get('x-pagination')
      const totalCount = JSON.parse(pagination).TotalCount

      yield put({
        type: 'searchSuccess',
        payload: {
          itemsListRes: response,
          totalItemCount: totalCount,
        },
      });
    },



    *fetchBranchItem({ payload }, { call, put }) {
      try{
        const itemsListRes = yield call(fetchBranchItem, payload)
        yield put({
          type: 'fetchBranchItemSuccess',
          payload: itemsListRes,
        });

        yield put({
          type: 'recordCurrentItemId',
          payload: payload.itemId,
        });

      } catch {
        message.error('Fetch fail.')
      }
    },


    *add({ payload, callback }, { call, put }) {
      try{
        const response = yield call(addItem, payload);
        console.log('add,response',response);
        if(response.response && !response.response.ok){
          message.error('Create failed.')
        } else {
          yield put({
            type: 'addSuccess',
            payload: response,
          });
          yield put({  type: 'fetch' });
          if (callback) callback(response);  
        }
      }catch{
        message.error('Create failed.')
      }
    },

    *addLarge({ payload, callback }, { call, put }) {
      // alert('modal,handleAddLarge')
      try{
        const response = yield call(addItem, payload);
        console.log('addLarge,response',response);
        // console.log('addLarge,response.data[0]',response.data[''][0]);
        // console.log('addLarge,response.data[0].includes',response.data[''][0].includes('already exsits in DB'));
        console.log('addLarge,payload',payload);

        if(response.id){
          if (callback) callback({name: payload.name, status: 'success'});  
          yield put({  type: 'fetch' });
        } else {
          if(response.data){
            if(response.data[''][0].includes('already exsits in DB')){
              if (callback) callback({name: payload.name, status: 'failed', reason: 'This name has already exist.'}); 
            } else {
              if (callback) callback({name: payload.name, status: 'failed'}); 
            }
          }
        }
      }catch{
        message.error('Create error.')
      }
    },

 

    *delete({ payload, callback }, { call, put }) {
      try{
        const response = yield call(deleteItem, payload);
        // yield put({  type: 'fetch' });
        if (callback) callback();
        if(response.response.status === 400)
        message.error('Delete Fail. This item is envolved in some orders.');
      } catch {
      }
    },

    *update({ payload, callback }, { call, put }) {
      try {
        const itemsListRes = yield call(updateItem, payload);
        yield put({
          type: 'updateSuccess',
          payload: itemsListRes,
        });
        if(callback) callback()
      } catch {
        message.error('Switch active failed!');
      }
    },

    *updateBranchItem({ payload, callback }, { call, put }) {
      try {
        const itemsListRes = yield call(updateBranchItem, payload);
        yield put({
          type: 'updateSuccess',
          payload: itemsListRes,
        });

        yield put({ type: 'fetch' });
        yield put({ type: 'fetch' });
      } catch {
        message.error('Switch active failed!');
      }
    },
    
    *updateBranchPrice({ payload, callback }, { call, put }) {
      try {
        const itemsListRes = yield call(updateBranchPrice, payload);
      } catch {
        // message.error('Switch active failed!');
      }
    },

    *switchItemStatus({ payload, callback }, { call, put }) {
      try {
        yield call(updateBranchItemList, payload);
        if(!payload.isNoRefresh)
          yield put({ type: 'fetchBranchItem', payload: payload });
      } catch {
        message.error('Switch active failed!');
      }
    },
    
  },

  reducers: {
    requestImagePath(state, action) {
      if (typeof state === 'undefined') {
        return initialState;
      }

      return {
        ...state,
        requesetImagePackage: action.payload,
      };
    },

    fetchItemsListSuccess(state, action) {
      console.log('fetchItemsListSuccess1,state=', state);
      console.log('fetchItemsListSuccess2,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      let itemList: TableListItem[] = action.payload.itemsListRes;
      const params = action.payload.params;
      console.log('fetchItemsListSuccess2,itemList=', itemList);
      const allItemNames = itemList.map(each=>each.name)
      console.log('fetchItemsListSuccess2,allItemNames=', allItemNames);

      if (typeof params !== 'undefined' && params.sorter) {
        const s = params.sorter.split('_');
        itemList = itemList.sort((prev, next) => {
          if (s[1] === 'descend') {
            return typeof prev[s[0]] === 'number'
              ? next[s[0]] - prev[s[0]]
              : next[s[0]].length - prev[s[0]].length;
          } else if (s[1] === 'ascend') {
            return typeof prev[s[0]] === 'number'
              ? prev[s[0]] - next[s[0]]
              : prev[s[0]].length - next[s[0]].length;
          }
          return prev['id'] - next['id'];
        });
      }
      return {
        ...state,
        data: {
          list: itemList,
          totalItemCount: action.payload.totalItemCount,
          allItemNames: allItemNames,
          categoriesList: [],
          pagination: {},
        },
      };
    },

    searchSuccess(state, action) {
      console.log('searchSuccess1,state=', state);
      console.log('searchSuccess2,action=', action);

      // payload: {
      //   itemsListRes: response,
      //   totalItemCount: totalCount,
      // },

      if (typeof state === 'undefined') {
        return initialState;
      }
      const itemsList: TableListItem[] = action.payload.itemsListRes.data;
      const categoriesList = state.data.categoriesList;

      return {
        ...state,
        data: {
          ...state.data,
          list: itemsList,
          totalItemCount: action.payload.totalItemCount,
          categoriesList: categoriesList,
          pagination: {},
        },
      };
    },

    fetchCategoriesListSuccess(state, action) {
      console.log('fetchCategoriesListSuccess1,state=', state);
      console.log('fetchCategoriesListSuccess2,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }

      const itemsList: TableListItem[] = state.data.list;

      return {
        ...state,
        data: {
          ...state.data,
          list: itemsList,
          categoriesList: [],
          pagination: {},
        },
      };
    },

    fetchBranchesListSuccess(state, action) {
      console.log('fetchBranchesListSuccess,state=', state);
      console.log('fetchBranchesListSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const itemsList: TableListItem[] = state.data.list;
      const categoriesList: TableListItem[] = state.data.categoriesList;
      const branchesList = action.payload;
      const activeBranchId = branchesList.filter(each=>each.isInactive == false).map(each=>each.id)
      console.log('fetchBranchesListSuccess,activeBranchId=', activeBranchId);

      return {
        ...state,
        activeBranchId: activeBranchId,
        data: {
          ...state.data,
          list: itemsList,
          categoriesList: categoriesList,
          branchesList: branchesList,
          activeBranchId: activeBranchId,
          pagination: {},
        },
      };
    },

    fetchBranchItemSuccess(state, action) {
      console.log('action=', action);
      return {
        ...state,
        branchItemData: action.payload
      };
    },

    recordCurrentItemId(state, action) {
      console.log('action11=', action);
      return {
        ...state,
        currentItemId: action.payload
      };
    },


    addSuccess(state, action) {
      console.log('addSuccess1,state=', state);
      console.log('addSuccess2,action=', action);
      const currentItem: TableListItem = { ...action.payload };
      if (typeof state === 'undefined') {
        return initialState;
      }
      console.log('addSuccess,currentItem=', currentItem);
      let newList: TableListItem[] = state.data.list;
      newList.push(currentItem);
      console.log('addSuccess,newList=', newList);
      const categoriesList = state.data.categoriesList;
      //const itemTypeList: TableListItem[] = state.data.typeList;
      return {
        ...state,
        data: {
          ...state.data,
          list: newList,
          categoriesList: categoriesList,
          pagination: {},
        },
      };
    },

    updateSuccess(state, action) {
      console.log('updateSuccess1,state=', state);
      console.log('updateSuccess2,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      let newList = action.payload; //state.data.list.map(list => list);
      const categoriesList = state.data.categoriesList;
      //const itemTypeList: TableListItem[] = state.data.typeList;
      return {
        ...state,
        data: {
          ...state.data,
          list: newList,
          categoriesList: categoriesList,
          //typeList: itemTypeList,
          pagination: {},
        },
      };
    },

    deleteSuccess(state, action) {
      console.log('deleteSuccess1,state=', state);
      console.log('deleteSuccess2,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      let newList = state.data.list.map((list) => list);
      const categoriesList = state.data.categoriesList;
      //const itemTypeList: TableListItem[] = state.data.typeList;
      return {
        ...state,
        data: {
          ...state.data,
          list: newList,
          categoriesList: categoriesList,
          pagination: {},
        },
      };
    },
  },
};

export default Model;

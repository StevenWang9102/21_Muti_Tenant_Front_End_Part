import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import * as service from './service';
import { currentPOSData } from './data.d';
import { message, notification } from 'antd';

export interface StateType {
  data: Partial<currentPOSData>;
  isResumeOrder: boolean;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  //subscriptions: { setup: Subscription };
  effects: {
    fetchBasicInfo: Effect;
    fetchAddons: Effect;
    fetchOneOrder: Effect;
    addOrder: Effect;
    updateOrder: Effect;
    deleteOrder: Effect;
    fetchOneOrderItem: Effect;
    addItemsToOrder: Effect;
    updateOrderItem: Effect;
    deleteOrderItem: Effect;
    fetchOneInvoice: Effect;
    fetchOneInvoiceByOrderId: Effect;
    addInvoice: Effect;
    updateInvoice: Effect;
    fetchOnePayment: Effect;
    createPayment: Effect;
    MPMPosPay: Effect;
    MPMRefund: Effect;
    MPMCancelTransaction: Effect;
    MPMGetTransactionDetails: Effect;
  };
  reducers: {
    fetchBasicInfoSuccess: Reducer<StateType>;
    fetchAddonsSuccess: Reducer<StateType>;
    fetchOneOrderSuccess: Reducer<StateType>;
    addOrderSuccess: Reducer<StateType>;
    updateOrderSuccess: Reducer<StateType>;
    deleteOrderSuccess: Reducer<StateType>;
    fetchOneOrderItemSuccess: Reducer<StateType>;
    addOrderItemSuccess: Reducer<StateType>;
    updateOrderItemSuccess: Reducer<StateType>;
    deleteOrderItemSuccess: Reducer<StateType>;
    fetchOneInvoiceSuccess: Reducer<StateType>;
    addInvoiceSuccess: Reducer<StateType>;
    updateInvoiceSuccess: Reducer<StateType>;
    fetchOnePaymentSuccess: Reducer<StateType>;
    addPaymentSuccess: Reducer<StateType>;
    MPMPosPaySuccess: Reducer<StateType>;
    MPMRefundSuccess: Reducer<StateType>;
    MPMCancelTransactionSuccess: Reducer<StateType>;
    MPMGetTransactionDetailsSuccess: Reducer<StateType>;
    saveSale: Reducer<StateType>;
  };
}
const initialState = {
  data: {},
  isResumeOrder: false,
};

const Model: ModelType = {
  namespace: 'currentPOSData',
  state: initialState,

  effects: {

    *fetchBasicInfo({ payload }, { call, put }) {
      try{
        const categoriesList = yield call(service.fetchCategories, payload);
        // const itemsList = yield call(service.fetchItems, payload);
        // const bundlesList = yield call(service.fetchBundles, payload);
        
        yield put({
          type: `fetchBasicInfoSuccess`,
          payload: {
            categoriesList: categoriesList.filter(each=>each.isInactive == false),
            // itemsList: itemsList,
            // bundlesList: bundlesList,
          },
        });
      } catch {
        
      }
    },

    *fetchOneBranch({ payload, callback}, { call, put }) {
      try{
        const branchInfo = yield call(service.fetchOneBranch, payload);
        console.log('cadidates002', branchInfo);
        
        yield put({
          type: `fetchOneBranchSuccess`,
          payload: branchInfo,
        });

        if(callback) callback(branchInfo)
      } catch {
      }
    },

    *switchShopStatus({ payload }, { call, put }) {
      try{
        const branchInfo = yield call(service.changeBranchRoles, payload);        
      } catch {
      }
    },
    
    *fetchLocation({ payload }, { call, put }) {
      try{
        const locationsList = yield call(service.fetchLocations, payload);
        const usersList = yield call(service.fetchUsers, payload);
        
        yield put({
          type: `fetchLocationSuccess`,
          payload: {
            locationsList: locationsList.filter(each=>each.isInactive == false),
            usersList: usersList.filter(each=>each.isInactive == false),
          },
        });
      } catch {
        
      }
    },

    *fetchBranchPaymentModes({ payload }, { call, put }) {
      try{
        const paymentModesList = yield call(service.fetchPaymentModes, payload);
        yield put({
          type: `fetchPaymentModesSuccess`,
          payload: {
            paymentModesList: paymentModesList,
          },
        });
      } catch {
        
      }
    },

    *fetchBasicInfo1({ payload }, { call, put }) {
      try{
        const categoriesList = yield call(service.fetchCategories, payload);
        const itemsList = yield call(service.fetchItems, payload);
        const bundlesList = yield call(service.fetchBundles, payload);
        const paymentModesList = yield call(service.fetchPaymentModes, payload);
        const locationsList = yield call(service.fetchLocations, payload);
        const usersList = yield call(service.fetchUsers, payload);
        // const generalProfile = yield call(service.fetchGeneralProfile, payload);
        
        yield put({
          type: `fetchBasicInfoSuccess`,
          payload: {
            categoriesList: categoriesList,
            itemsList: itemsList,
            bundlesList: bundlesList,
            paymentModesList: paymentModesList,
            locationsList: locationsList,
            usersList: usersList,
            // generalProfile: generalProfile,
          },
        });
      } catch {
        
      }
    },


    *fetchAddons({ payload }, { call, put }) {
      try{
        const MPMAttributes = yield call(service.fetchMPMAttributes, payload);
        yield put({
          type: `${'fetchAddons'}Success`,
          payload: {
            MPMAttributes: MPMAttributes,
          },
        });
      } catch {

      }
    },

    *fetchOneOrder({ payload, callback }, { call, put }) {
      try{
        const fetchOneOrder = yield call(service.fetchOneOrder, payload);
        yield put({
          type: `fetchOneOrderSuccess`,
          payload: {
            currentOrder: fetchOneOrder,
          },
        });
        if (callback) callback(fetchOneOrder);
      } catch {
      }
    },

    
    *requestBranchItem({ payload, callback }, { call, put }) {

      try{
        // const hide = message.loading('Reloading...')
        const res = yield call(service.fetchBranchItems, payload);
        if (callback) callback(res);
      } catch {
      }
    },

    *addOrder({ payload, callback }, { call, put }) {
      // const hide = message.loading('Creating Order...')

      try{
        const response = yield call(service.addOrder, payload);
        // hide()
        yield put({
          type: `addOrderSuccess`,
          payload: response,
        });
        if (callback) callback(response);
      } catch {
        // hide()
        if (callback) callback(false);
        message.error('This branch is inactive now. Change another one or activate.')
      }
    },

    *updateOrder({ payload, callback }, { call, put }) {
      // const hide = message.loading('Loading...')
      try{
        yield call(service.updateOrder, payload);
        const fetchOneOrder = yield call(service.fetchOneOrder, payload);
        yield put({
          type: `updateOrderSuccess`,
          payload: fetchOneOrder,
        });
        if (callback) callback();
      } catch {
        message.error('Update this order failed !')
      }
    },

    *deleteOrder({ payload, callback }, { call, put }) {
      console.log('delete payload', payload);
      
      try{
        const response = yield call(service.deleteOrder, payload);
        yield put({
          type: `deleteOrderSuccess`,
          payload: response,
        });
        if (callback) callback();
      } catch {

      }
    },

    *fetchOneOrderItem({ payload, callback }, { call, put }) {
      try{
        const hide = message.loading('Loading Items...')
        const fetchOneOrderItems = yield call(service.fetchOneOrderItem, payload);
        hide()
  
        yield put({
          type: `fetchOneOrderItemsSuccess`,
          payload: {
            currentOrderOneItem: fetchOneOrderItems,
          },
        });
        if (callback) callback();
      } catch {
      
      }

    },

    *addItemsToOrder({ payload, callback }, { call, put }) {
      try{
        const response = yield call(service.addItemsToOrder, payload);
        yield put({
          type: `addItemsToOrderSuccess`,
          payload: response,
        });
        if (callback) callback();
      } catch{
        
      }
    },

    *updateOrderItem({ payload, callback }, { call, put }) {
      try{
        yield call(service.updateOrderItem, payload);
        // 重新请求Order页面
        yield put({
          type: `fetchOneOrder`,
          payload: payload,
        });

        if(callback) callback()
      }catch {

      }
    },

    *deleteOrderItem({ payload, callback }, { call, put }) {
      try{
        const response = yield call(service.deleteOrderItem, payload);
        yield put({
          type: `deleteOrderItemSuccess`,
          payload: { response, ...payload },
        });

        yield put({
          type: `fetchOneOrder`,
          payload: payload,
        });
      } catch{  

      }
    },


    *fetchOneInvoice({ payload, callback }, { call, put }) {
      try{
        const fetchOneInvoice = yield call(service.fetchOneInvoice, payload);
      yield put({
        type: `fetchOneInvoiceSuccess`,
        payload: {
          currentInvoice: fetchOneInvoice,
        },
      });
      if (callback) callback();
      } catch{

      }
    },

    *fetchInvoicesByOrderId2({ payload, callback }, { call, put }) {
      try{
        const response = yield call(service.fetchOneInvoice2, payload);
        yield put({
          type: `fetchOneInvoiceSuccess`,
          payload: {
            currentInvoice: response[0],
          },
        });
        if (callback) callback(response);
      } catch{
        
      }
    },

    *fetchOneInvoiceByOrderId({ payload, callback }, { call, put }) {
      try{
        const fetchOneInvoiceByOrderId = yield call(service.fetchOneInvoiceByOrderId, payload);
        const fetchOneInvoice = yield call(service.fetchOneInvoice, {
          id: fetchOneInvoiceByOrderId[0].id,
        });
        yield put({
          type: `${'fetchOneInvoice'}Success`,
          payload: {
            currentInvoice: fetchOneInvoice,
          },
        });
        if (callback) callback();
      }catch{

      }
    },

    *addInvoice({ payload, callback }, { call, put }) {
      try{
        const hide = message.loading('Loading...')
        const addInvoice = yield call(service.addInvoice, payload);
        const fetchOneOrder = yield call(service.fetchOneOrder, payload);
  
        yield put({
          type: 'addInvoiceSuccess',
          payload: {
            currentInvoice: addInvoice,
            currentOrder: fetchOneOrder,
          },
        });

        console.log('addInvoice,error=', addInvoice);
        if (callback) callback(addInvoice);
        hide()
      } catch {
        message.error('Payment Fail.')
      }
    },

    *updateInvoice({ payload, callback }, { call, put }) {
      const response = yield call(service.updateInvoice, payload);
      yield put({
        type: `${'updateInvoice'}Success`,
        payload: response,
      });
      if (callback) callback();
    },

    *requestCurrentUser({ payload, callback }, { call, put }) {
      const res = yield call(service.requestCurrentUser, payload);
      if (callback) callback(res);
    },

    *fetchOnePayment({ payload, callback }, { call, put }) {
      const fetchOnePayment = yield call(service.fetchOnePayment, payload);
      yield put({
        type: `${'fetchOnePayment'}Success`,
        payload: {
          currentPayments: fetchOnePayment,
        },
      });
      if (callback) callback();
    },
    
    *createPayment({ payload, callback }, { call, put }) {
      try{
        const hide = message.loading('Loading...')
        yield call(service.createPayment, payload);
      
        const res = yield call(service.fetchOneInvoice, payload);
  
        yield put({
          type: 'addInvoiceSuccess',
          payload: {
            currentInvoice: res,
          },
        });

        if (callback) callback(res);
        hide()
      } catch {
        message.error('Payment failed.')
      }

    },

    //MyPosMate API
    *MPMPosPay({ payload, callback }, { call, put }) {
      const response = yield call(service.MPMPosPay, payload);
      yield put({
        type: `${'MPMPosPay'}Success`,
        payload: response,
      });
      if (callback) callback(response);
    },

    *MPMRefund({ payload, callback }, { call, put }) {
      const response = yield call(service.MPMRefund, payload);
      yield put({
        type: `${'MPMRefund'}Success`,
        payload: response,
      });
      if (callback) callback();
    },

    *MPMCancelTransaction({ payload, callback }, { call, put }) {
      const response = yield call(service.MPMCancelTransaction, payload);
      yield put({
        type: `${'MPMCancelTransaction'}Success`,
        payload: response,
      });
      if (callback) callback();
    },

    *MPMGetTransactionDetails({ payload, callback }, { call, put }) {
      const response = yield call(service.MPMGetTransactionDetails, payload);
      yield put({
        type: `${'MPMGetTransactionDetails'}Success`,
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    clearAllStatus(state, action) {
      
      if (typeof state === 'undefined') {
        return initialState;
      }
      
      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: [],
          currentInvoice: [],
          currentOrderItems: [],
        },
      };
    },

    isResumeOrder(state, action) {
      console.log('isResumeOrder4564,state', state );
      console.log('isResumeOrder4564,action', action);
      
      if (typeof state === 'undefined') {
        return initialState;
      }

      return {
        ...state,
        data: { 
          ...state.data,
          isResumeOrder: action.payload,
        },
        // isResumeOrder: action.payload,
      };
    },

    allItemWithCode(state, action) {
      
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          allItemWithCode: action.payload
        },
      };
    },

    highLightItem(state, action) {
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          highLightItem: action.payload
        },
      };
    },

    fetchOneBranchSuccess(state, action) {
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          oneBranchInfo: action.payload
        },
      };
    },

    fetchBasicInfoSuccess(state, action) {
      console.log('fetchBasicInfoSuccess,state=', state);
      console.log('fetchBasicInfoSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          categoriesList: action.payload.categoriesList,
          itemsList: action.payload.itemsList,
          bundlesList: action.payload.bundlesList,
        },
      };
    },

    fetchPaymentModesSuccess(state, action) {
      console.log('fetchPaymentModesSuccess,state=', state);
      console.log('fetchPaymentModesSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }

      const newModes = []
      action.payload.paymentModesList.map(each=>{
        console.log('fetchPaymentModesSuccess,each', each);
        newModes.push({
          paymentId: each.paymentMode.id,
          name: each.paymentMode.name,
          moniker: each.paymentMode.moniker,
          imagePath: each.paymentMode.picturePath,
          note: each.paymentMode.note,
          active: !each.isInactive,
        })
      })

      console.log('newModes=', newModes);
      
      return {
        ...state,
        data: {
          ...state.data,
          paymentModesList: newModes,
        },
      };
    },

    fetchLocationSuccess(state, action) {
      console.log('fetchLocationSuccess,state=', state);
      console.log('fetchLocationSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          locationsList: action.payload.locationsList,
          usersList: action.payload.usersList,
          // generalProfile: action.payload.generalProfile,
        },
      };
    },

    //Add-ons API
    fetchAddonsSuccess(state, action) {
      console.log('fetchAddonsSuccess,state=', state);
      console.log('fetchAddonsSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          MPMAttributes: action.payload.MPMAttributes,
        },
      };
    },

    fetchOneOrderSuccess(state, action) {
      console.log('fetchOneOrderSuccess,state=', state);
      console.log('fetchOneOrderSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }

      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload.currentOrder,
          currentOrderItems: action.payload.currentOrder.orderItems.reverse(),
        },
      };
    },
    
    addOrderSuccess(state, action) {
      console.log('addOrderSuccess,state=', state);
      console.log('addOrderSuccess,action=', action);
      
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload,
        },
      };
    },

    updateOrderSuccess(state, action) {
      console.log('updateOrderSuccess,state=', state);
      console.log('updateOrderSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload,
        },
      };
    },

    deleteOrderSuccess(state, action) {
      console.log('deleteOrderSuccess,state=', state);
      console.log('deleteOrderSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }

      // alert('deleteOrderSuccess')

      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload,
          currentOrderItems: action.payload,
        },
      };
    },

    //Order Items API
    fetchOneOrderItemSuccess(state, action) {
      console.log('fetchOneOrderItemSuccess,state=', state);
      console.log('fetchOneOrderItemSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentOrderOneItem: action.payload,
        },
      };
    },

    addOrderItemSuccess(state, action) {
      console.log('addOrderItemSuccess,state=', state);
      console.log('addOrderItemSuccess,action=', action);
      const currentItem = { ...action.payload };
      if (typeof state === 'undefined') {
        return initialState;
      }
      // alert('addOrderItemSuccess')

      console.log('addOrderItemSuccess,currentItem=', currentItem);
      let newList = state.data.currentOrderItems;
      typeof newList === 'undefined' ? newList : newList.push(currentItem),
        console.log('addOrderItemSuccess,newList=', newList);
      return {
        ...state,
        data: {
          ...state.data,
          currentOrderItems: newList.reverse(),
        },
      };
    },

    updateOrderItemSuccess(state, action) {
      console.log('updateOrderItemSuccess,state=', state);
      console.log('updateOrderItemSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }

      // alert('updateOrderItemSuccess')

      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: action.payload.currentOrder,
          currentOrderItems: action.payload.currentOrder.orderItems,
        },
      };
    },
    
    deleteOrderItemSuccess(state, action) {
      console.log('deleteOrderItemSuccess,state=', state);
      console.log('deleteOrderItemSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      // alert('deleteOrderItemSuccess')

      let newList = state.data.currentOrderItems?.filter(item => item.id != action.payload.id);
      console.log('deleteOrderItemSuccess,newList=', newList);
      return {
        ...state,
        data: {
          ...state.data,
          currentOrderItems: newList,
        },
      };
    },

    fetchOneInvoiceSuccess(state, action) {
      console.log('fetchOneInvoiceSuccess,state=', state);
      console.log('fetchOneInvoiceSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const currentInvoice = [action.payload.currentInvoice];
      const currentPayments = action.payload.currentInvoice.payments;
      return {
        ...state,
        data: {
          ...state.data,
          currentInvoice: currentInvoice,
          currentPayments: currentPayments,
        },
      };
    },
    addInvoiceSuccess(state, action) {
      console.log('addInvoiceSuccess,state=', state);
      console.log('addInvoiceSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      
      return {
        ...state,
        data: {
          ...state.data,
          currentInvoice: [action.payload.currentInvoice],
          currentOrder: action.payload.currentOrder,
        },
      };
    },
    
    updateInvoiceSuccess(state, action) {
      console.log('updateInvoiceSuccess,state=', state);
      console.log('updateInvoiceSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentInvoice: action.payload,
        },
      };
    },
    //Payments API
    fetchOnePaymentSuccess(state, action) {
      console.log('fetchOnePaymentSuccess,state=', state);
      console.log('fetchOnePaymentSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          currentPayments: action.payload.currentPayments,
        },
      };
    },
    addPaymentSuccess(state, action) {
      console.log('addPaymentSuccess,state=', state);
      console.log('addPaymentSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      const currentInvoice = [action.payload.currentInvoice];
      const currentPayments = action.payload.currentInvoice.payments;
      return {
        ...state,
        data: {
          ...state.data,
          currentInvoice: currentInvoice,
          currentPayments: currentPayments,
        },
      };
    },

    //MyPosMate API
    MPMPosPaySuccess(state, action) {
      console.log('MPMPosPaySuccess,state=', state);
      console.log('MPMPosPaySuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          MPMPosPayResponse: action.payload,
        },
      };
    },
    MPMRefundSuccess(state, action) {
      console.log('MPMRefundSuccess,state=', state);
      console.log('MPMRefundSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          MPMRefundResponse: action.payload,
        },
      };
    },
    MPMCancelTransactionSuccess(state, action) {
      console.log('MPMCancelTransactionSuccess,state=', state);
      console.log('MPMCancelTransactionSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          MPMCancelTransactionResponse: action.payload,
        },
      };
    },

    MPMGetTransactionDetailsSuccess(state, action) {
      console.log('MPMGetTransactionDetailsSuccess,state=', state);
      console.log('MPMGetTransactionDetailsSuccess,action=', action);
      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          MPMGetTransactionDetailsResponse: action.payload,
        },
      };
    },

    saveSale(state) {
      console.log('saveSale,state=', state);
      if (typeof state === 'undefined') {
        return initialState;
      }

      return {
        ...state,
        data: {
          ...state.data,
          currentOrder: {},
          currentOrderItems: [],
          currentOrderOneItem: {},
          currentInvoice: [],
          currentPayments: [],
        },
      };
    },

    setCurrentLocaiton(state, action) {
      console.log('setCurrentLocaiton,action=', action);

      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          location: action.payload,
        },
      };
    },

    setCurrentStaff(state, action) {
      console.log('setCurrentLocaiton,action=', action);

      if (typeof state === 'undefined') {
        return initialState;
      }
      return {
        ...state,
        data: {
          ...state.data,
          staff: action.payload,
        },
      };
    },
  },
};

export default Model;

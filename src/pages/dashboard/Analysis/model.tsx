import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnalysisData, DataParams } from './data.d';
import * as service from './service';
import moment from 'moment';
import { message } from 'antd';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    requestTopItemSales: Effect;
    requestCategoryData: Effect;
  };
  reducers: {
    fetchSuccess: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
  invoiceSummaryData: {},
  dailyPaymentsData: [],
  hourlyPaymentsData: [],
  weeklkPaymentsData: [],
  monthlyPaymentsData: [],
  yearlyPaymentsData: [],
  paymentsByModeData: [],
  categorySalesData: [],
  top10SoldItemsBestSellingData: [],
  top10SoldItemsSlowSellingData: [],
};

const Model: ModelType = {
  namespace: 'dashboard',

  state: initState,

  effects: {
    *fetch({ payload, callback}, { call, put }) {
      try{
        const dataParams: DataParams = {...payload, enddatetime: moment(payload.enddatetime).add("1", "day").format("YYYY-MM-DD")};
        const hourlyPaymentsData = yield call(service.fetchHourlyPayments, dataParams);
        const dailyPaymentsData = yield call(service.fetchDailyPayments, dataParams);
        const monthlyPaymentsData = yield call(service.fetchMonthlyPayments, dataParams);

        yield put({
          type: 'fetchSuccess',
          payload: {
            dailyPaymentsData: dailyPaymentsData,
            hourlyPaymentsData: hourlyPaymentsData,
            monthlyPaymentsData: monthlyPaymentsData,
          },
        });

      } catch {
        message.error('Initial data error.')
      }
    },

    *requestTopItemSales({ payload, callback}, { call, put }) {
      try{
        const dataParams = {
          startDateTime: payload.startDateTime,
          endDatetime: moment(payload.endDatetime).add("1", "day").format("YYYY-MM-DD")
        };
        const res = yield call(service.fetchTop10SoldItems, dataParams)
        yield put({
          type: 'requestTopItemSalesSuccess',
          payload: {
            itemSalesTop10: res,
          },
        });
      } catch {
        message.error('Error.')
      }
    },

  *requestCategoryData({ payload, callback}, { call, put }) {
    try{
      const dataParams = {
        startDateTime: payload.startDateTime,
        endDatetime: moment(payload.endDatetime).add("1", "day").format("YYYY-MM-DD")
      };
      const res = yield call(service.fetchCategorySales, dataParams)
      console.log('requestCategoryData,res',res);
      
      yield put({
        type: 'requestCategoryDataSuccess',
        payload: {
          categorySalesData: res,
        },
      });
    } catch {
      message.error('Error.')
    }
  },

},

  reducers: {
    fetchSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    requestTopItemSalesSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    requestCategoryDataSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    clear() {
      return initState;
    },
  },
};

export default Model;
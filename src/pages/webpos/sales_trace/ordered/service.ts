import request from 'umi-request';
import { OrderParams, SearchTableListParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'
import qs from 'qs';
import moment from 'moment';
import { message } from 'antd';

const ORDERS_API = '/server/api/transactions/orders/';
const USERS_API = '/server/api/crm/users';
const { SETTINGS_BRANCHES_API } = apiList;

const getAuth = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchOrders(payload) {

  console.log('payload798=', payload);

  let params;

  if (payload.search && payload.search.status) {
    let temp={ "isInvoiced": false }
    // 时间搜索
    const formate = 'YYYY-MM-DD'
    let startStandard = payload.search.status[0]
    let endStandard = payload.search.status[1]
    const startDateTime = moment(startStandard).format(formate)
    const endDateTime = moment(endStandard).add("1", "day").format(formate)

    console.log('fetchOrders,payload798,startDateTime=', startDateTime);
    console.log('fetchOrders,payload798,endDateTime=', endDateTime);

    // 生成Parms
    if(payload.search.staff !='') temp['beauticianName'] = payload.search.staff
    if(payload.search.location !='') temp['locationName'] = payload.search.location
    if(payload.pagenumber) temp['pagenumber'] = payload.pagenumber
    if(payload.pagesize) temp['pagesize'] = payload.pagesize
    if(startDateTime) temp['startDateTime'] = startDateTime
    if(endDateTime) temp['endDateTime'] = endDateTime

    console.log('fetchOrders,payload798,temp=', temp);

    params = temp

  } else if (payload.search) {
    // 只有staff 和 beatition的搜索
    let temp={ "isInvoiced": false }
    if(payload.pagenumber) temp['pagenumber'] = payload.pagenumber
    if(payload.pagesize) temp['pagesize'] = payload.pagesize
    if(payload.search.staff !='') temp['beauticianName'] = payload.search.staff
    if(payload.search.location !='') temp['locationName'] = payload.search.location
    params = temp
  } else {
    // 初始化的情况
    let temp={ "isInvoiced": false }
    if(payload.pagenumber) temp['pagenumber'] = payload.pagenumber
    if(payload.pagesize) temp['pagesize'] = payload.pagesize
    params = temp
  }

  console.log('payload798,params', params);
  return request(`/server/api/transactions/branches/${payload.branchId}/orders`, {
    ...getAuth(),
    params: params,
    getResponse: true,

  }).then((response) => {
    console.log('response19=', response);
    return response
  }
  );
}


export async function fetchOneOrder(params: OrderParams) {
  return request(`/server/api/transactions/branches/${params.branchId}/orders/${params.id}`, {
    ...getAuth(),
  });
}

export async function fetchBranchesList(params: any | undefined): Promise<any> {
  return request(`${SETTINGS_BRANCHES_API}`, {
    ...getAuth(),
    // params,
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchUsers() {
  return request(`${USERS_API}`, {
    ...getAuth(),
  });
}

export async function fetchLocations(payload) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}/locations`, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  });
}
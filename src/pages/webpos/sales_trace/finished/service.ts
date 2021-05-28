import request from 'umi-request';
import { InvoiceParams, SearchTableListParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'
import moment from 'moment';

const {  SETTINGS_BRANCHES_API} = apiList;
const INVOICES_API = '/server/api/invoices/';
const USERS_API = '/server/api/users?roleId=3';
const ORDER_BRANCH = '/server/api/transactions/branches'
const ORDERS_API = '/server/api/transactions';

const getAuth = ()=>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchOrders(payload) {
  return request(`/server/api/transactions/branches/${payload.branchId}/orders`, {
    ...getAuth(),
    params: payload.pageNumber, 
    getResponse: true,
  }).then( (response) =>{
    return response
  }
  );
}

export async function fetchInvoices(payload) {

  let params1;
  console.log('fetchInvoices551,payload', payload);
  const formate = 'YYYY-MM-DD'

  if(payload.search && payload.search.status){

    let startStandard = payload.search.status[0]
    let endStandard = payload.search.status[1]
    
    const startDateTime = moment(startStandard).format(formate)
    const endDateTime = moment(endStandard).add('1', 'days').format(formate)
  
    params1 = {
      "isPaid": true,
      "PageNumber": payload.PageNumber,
      'startDateTime': startDateTime,
      'endDateTime': endDateTime
    }
  } else {
    params1 = {
      "isPaid": true,
      "PageNumber": payload.PageNumber,
    }
  }

  return request(`${ORDER_BRANCH}/${payload.branchId}/invoices`, {
    ...getAuth(),
    params: params1, 
    getResponse: true,
  }).then(response=>{
    return response
  });
}

export async function fetchOneInvoice(params: InvoiceParams) {
  return request(`${INVOICES_API}${params.id}`, {
    ...getAuth(),
  });
}

export async function fetchOrderInvoice(params: any) {
  return request(`${ORDER_BRANCH}/${params.branchId}/orders/${params.orderId}/invoices/${params.invoiceId}`, {
    ...getAuth(),
  });
}

export async function fetchUsers() {
  return request(`${USERS_API}`, {
    ...getAuth(),
  });
}

export async function searchInvoices(params: SearchTableListParams) {
  return request(`${INVOICES_API}`, {
    ...getAuth(),
    params,
  });
}

export async function fetchBranchesList(params: any | undefined): Promise<any> {
  return request(`${SETTINGS_BRANCHES_API}`, {
    ...getAuth(),
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchOneOrder(params) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}`, {
    ...getAuth(),
  });
}

export async function fetchOneBranch(params) {
  return request(`/server/api/settings/branches/${params.branchId}`, {
    ...getAuth(),
  })
}
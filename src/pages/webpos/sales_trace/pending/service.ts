import request from 'umi-request';
import { InvoiceParams, SearchTableListParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'
import moment from 'moment';

const {  SETTINGS_BRANCHES_API } = apiList;
const INVOICES_API = '/server/api/invoices/';
const USERS_API = '/server/api/crm/users';
const ORDER_BRANCH = '/server/api/transactions/branches'

const getAuth = ()=>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchInvoices(payload) {
  let params1;
  console.log('fetchInvoices,payload', payload);
  const formate = 'YYYY-MM-DD'

  if(payload.search && payload.search.status){

    let startStandard = payload.search.status[0]
    let endStandard = payload.search.status[1]
    
    const startDateTime = moment(startStandard).format(formate)
    const endDateTime = moment(endStandard).add('1','days').format(formate)
  
    var temp={}
    temp["isPaid"] = false
    if(payload.pagenumber) temp['pagenumber'] = payload.pagenumber
    if(payload.pagesize) temp['pagesize'] = payload.pagesize
    if(startDateTime) temp['startDateTime'] = startDateTime
    if(endDateTime) temp['endDateTime'] = endDateTime
    params1 = temp

  } else {
    var temp={}
    temp["isPaid"] = false
    if(payload.pagenumber) temp['pagenumber'] = payload.pagenumber
    if(payload.pagesize) temp['pagesize'] = payload.pagesize
    params1 = temp
  }

  console.log('service16, pagination', payload);
  console.log('service16, parms', params1);
  
  return request(`${ORDER_BRANCH}/${payload.branchId}/invoices`, {
    ...getAuth(),
    params: params1, 
    getResponse: true,
  }).then(response=>{
    console.log('onPageButtonClick8');
    console.log('response48=', response);
    return response
  });
}

export async function fetchOneInvoice(params: InvoiceParams) {
  return request(`${ORDER_BRANCH}/${params.branchId}/invoices?orderId=${params.orderId}`, {
    ...getAuth(),
  });
}

export async function getOrderItems(params: any) {
  return request(`${ORDER_BRANCH}/45f40303-94a0-46d3-b097-077215d76272/orders/${params.orderId}`, {
    ...getAuth(),
  });
}

export async function fetchOneInvoiceByInvoiceId(params: InvoiceParams) {
  return request(`${ORDER_BRANCH}/45f40303-94a0-46d3-b097-077215d76272/invoices?orderId=${params.orderId}`, {
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
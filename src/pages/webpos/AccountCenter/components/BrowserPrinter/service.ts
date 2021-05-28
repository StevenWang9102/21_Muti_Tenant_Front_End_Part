import request from 'umi-request';
import { getAuthHeader, getToken } from '@/utils/authority';
import jwt from 'jsonwebtoken'
import { apiList } from '@/../config/proxy'
import { message } from 'antd';

const INVOICES_API = '/server/api/transactions/';
const ORDERS_API = '/server/api/transactions';

const getMyAuthHeader = (gposToken) => {
  // const gposToken = getToken();
  console.log('gposToken486',gposToken);
  
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

export async function fetchOneInvoice(params) {
  console.log('fetchOneInvoice,parma', params);
  
  return request(`${INVOICES_API}/branches/${params.branchId}/orders/${params.orderId}/invoices/${params.invoiceId}`, {
    ...getMyAuthHeader(params.token),
  });
}

// postDataToPrinter
export async function postDataToPrinter(payload) {
  console.log('postDataToPrinter,params', payload);
  console.log('postDataToPrinter,params, typeof', typeof payload);
  
  return request(`/server/print/print/64code`, {
    method: 'POST',
    // body: JSON.stringify(payload),
    body: payload,
    timeout: 60000,
  }).catch(()=>{
    message.error('POST ERROR')
  })
}

export async function fetchOneBranch(params) {
  return request(`/server/api/settings/branches/${params.branchId}`, {
    ...getMyAuthHeader(params.token),
  })
}

export async function fetchOneOrder(params) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}`, {
    ...getMyAuthHeader(params.token),
  });
}
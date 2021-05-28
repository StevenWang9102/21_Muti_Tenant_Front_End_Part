import request from 'umi-request';
import {
  OrderParams,
  OrderItemsParams,
  InvoiceParams,
  PaymentsParams,
  MPMPosPayParams,
  MPMRefundParams,
  MPMTransactionParams,
  MPMGetChannelSummaryParams,
} from './data.d';
import qs from 'qs';
import { getAuthHeader, getToken } from '@/utils/authority';
import jwt from 'jsonwebtoken'
import sort from 'fast-sort';
import { apiList } from '@/../config/proxy'
const {  ITEMS_BUNDLES_API, HOST_USERS_API, ITEMS_ITEMS_API, SETTINGS_BRANCHES_API, BRANCH_API, BRANCH_TRANSACTION_API } = apiList;
const ORDER_BRANCH = '/server/api/transactions/branches'


const getAuth=()=>{
  const gposToken = getToken();
  return  gposToken !== null ? getAuthHeader(gposToken) : {};
}

const CATEGORIES_API = '/server/api/items/categories';
const ITEMS_API = '/server/api/items/items';
const BRANCH_ITEMS = '/server/api/items';
const BUNDLES_API = '/server/api/items/bundles/';
const PAYMENT_BRANCH = '/server/api/transactions/branches'
const USERS_API = '/server/api/crm/users';
const GENERAL_PROFILE_API = '/server/api/generalprofile/';
const ORDERS_API = '/server/api/transactions';
const INVOICES_API = '/server/api/invoices/';
const PAYMENTS_API = '/server/api/payments/';
const ADD_ONS_API = '/server/api/addons/';
const MYPOSMATE_API = '/mpm/api/v2/pos/';

// Basic Info API
export async function fetchCategories() {
  return request(`${CATEGORIES_API}`, {
    ...getAuth(),
  });
}

const getHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
  return decoded !== null? decoded['sub']: null;
}


// requestCurrentUser
export async function requestCurrentUser(): Promise<any>{
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}`, {
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

export async function fetchItems() {
  return request(`${ITEMS_API}`, {
    ...getAuth(),
  });
}

export async function fetchBranchItems(parms) {
  return request(`${BRANCH_ITEMS}/branches/${parms.branchId}/items?CategoryId=${parms.categoryId}&pagenumber=${parms.pagenumber}`, {
    ...getAuth(),
    getResponse: true,
  }).then((res)=>{
    return res
  });
}

export async function fetchBundles() {
  return request(`${ITEMS_BUNDLES_API}`, {
    ...getAuth(),
  });
}

export async function fetchPaymentModes(params) {
  return request(`${BRANCH_API}/${params.branchId}/BranchPaymentModes`, {
    ...getAuth(),
  });
}

export async function fetchLocations(params) {
  return request(`${BRANCH_API}/${params.branchId}/locations`, {
    ...getAuth(),
  });
}

export async function fetchUsers(params) {
  return request(`${USERS_API}?branchId=${params.branchId}`, {
    ...getAuth(),
  });
}

export async function fetchGeneralProfile() {
  return request(`${GENERAL_PROFILE_API}`, {
    ...getAuth(),
  });
}

export async function fetchOneOrder(params: OrderParams) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}`, {
    ...getAuth(),
  });
}

export async function addOrder(parmas) {

  return request(`${ORDERS_API}/branches/${parmas.branchId}/orders`, {
    ...getAuth(),
    method: 'POST',
  });
}

export async function updateOrder(params: OrderParams) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteOrder(params: OrderParams) {
  return request(`${BRANCH_TRANSACTION_API}/${params.branchId}/orders/${params.id}`, {
    ...getAuth(),
    method: 'DELETE',
  });
}

export async function fetchOneOrderItem(params: OrderItemsParams) {
  return request(`${ORDERS_API}/${params.orderId}/orderitems/${params.id}`, {
    ...getAuth(),
    params,
  });
}

export async function addItemsToOrder(params: OrderItemsParams) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}/Orderitems`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify(params.body),
  });
}

export async function updateOrderItem(params: OrderItemsParams) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}/orderitems/${params.id}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteOrderItem(params: OrderItemsParams) {
  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}/OrderItems/${params.id}`, {
    ...getAuth(),
    method: 'DELETE',
  });
}

export async function fetchOneBranch(params) {
  return request(`/server/api/settings/branches/${params.branchId}`, {
    ...getAuth(),
  })
}

export async function fetchOneInvoice(params: InvoiceParams) {
  return request(`${PAYMENT_BRANCH}/${params.branchId}/orders/${params.orderId}/invoices/${params.invoiceId}`, {
    ...getAuth(),
    // params,
  });
}

export async function fetchInvoicesByOrderId() {
  return request(`${ORDER_BRANCH}/45f40303-94a0-46d3-b097-077215d76272/invoices`, {
    ...getAuth(),
  });
}

export async function fetchOneInvoice2(params: InvoiceParams) {
  return request(`${ORDER_BRANCH}/${params.branchId}/invoices?orderId=${params.orderId}`, {
    ...getAuth(),
  });
}

export async function fetchOneInvoiceByOrderId(params: InvoiceParams) {
  return request(`${INVOICES_API}`, {
    ...getAuth(),
    params,
  });
}

export async function addInvoice(params: InvoiceParams) {

  return request(`${ORDERS_API}/branches/${params.branchId}/orders/${params.orderId}/invoices`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify(params),
    // getResponse: true,
  })
  // .then(response=>{
  //   console.log('addInvoice,res', response);
  //   return response
  // })
}

export async function updateInvoice(params: InvoiceParams) {
  return request(`${INVOICES_API}${params.id}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  })
}

export async function fetchOnePayment(params: PaymentsParams) {
  return request(`${PAYMENTS_API}${params.id}`, {
    ...getAuth(),
    params,
  });
}

export async function createPayment(params: PaymentsParams) {
  return request(`${PAYMENT_BRANCH}/${params.branchId}/orders/${params.orderId}/invoices/${params.invoiceId}/payments`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify(params.body),
    getResponse: true,
  })
}

//MyPosMate API
export async function fetchMPMAttributes() {
  return request(`${ADD_ONS_API}/MyPOSMate`, {
    ...getAuth(),
  });
}

export async function MPMPosPay(params: MPMPosPayParams) {
  return request(`${MYPOSMATE_API}posPay?${qs.stringify(params)}`);
}

export async function MPMRefund(params: MPMRefundParams) {
  return request(`${MYPOSMATE_API}refund`, {
    params,
  });
}

export async function MPMCancelTransaction(params: MPMTransactionParams) {
  return request(`${MYPOSMATE_API}cancelTransaction`, {
    ...getAuth(),
    params,
  });
}

export async function MPMGetTransactionDetails(params: MPMTransactionParams) {
  return request(`${MYPOSMATE_API}getTransactionDetails?${qs.stringify(params)}`);
}

export async function MPMGetChannelSummary(params: MPMGetChannelSummaryParams) {
  return request(`${MYPOSMATE_API}getChannelSummary`, {
    ...getAuth(),
    params,
  });
}

export async function changeBranchRoles(payload) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}/isShop`, {
    ...getAuth(),
    method: 'PUT',
    getResponse: true,
  })
}

export async function fetchBranchItem(params) {
  return request(`${ITEMS_ITEMS_API}/${params.itemId}/branchitems`, {
    ...getAuth(),
  });
}
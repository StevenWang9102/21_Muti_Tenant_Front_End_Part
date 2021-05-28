import request from '@/utils/request';
import { TableListItem, TableListParams, SearchTableListParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { SETTINGS_PAYMENT_MODES_API } = apiList;

const getMyAuth = () =>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}
export async function fetchPaymentModes() {
  return request(`${SETTINGS_PAYMENT_MODES_API}`, {
    ...getMyAuth(),
  });
}

export async function fetchOnePaymentMode(params: TableListItem) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/${params.id}`, {
    ...getMyAuth(),
  });
}

export async function searchPaymentModes(params: SearchTableListParams) {
  return request(`${SETTINGS_PAYMENT_MODES_API}`, {
    ...getMyAuth(),
    params,
  });
}

export async function addPaymentMode(params: TableListItem) {
  return request(`${SETTINGS_PAYMENT_MODES_API}`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function addingCheckName(params: TableListItem) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/CheckName`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify({name: params.name}),
  });
}

export async function updatePaymentMode(params: TableListParams) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/${params.id}`, {
    ...getMyAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function updatingCheckName(params: TableListParams) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/${params.id}/CheckName`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify({name: params.name}),
  });
}

export async function deletePaymentMode(params: TableListParams) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/${params.id}`, {
    ...getMyAuth(),
    method: 'DELETE',
  });
}

export async function addImage(params: any) {
  return request(`${SETTINGS_PAYMENT_MODES_API}/${params.modeId}`, {
    ...getMyAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.body),
  });
}

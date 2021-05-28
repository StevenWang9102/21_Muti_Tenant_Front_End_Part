import request from '@/utils/request';
import { AddonsParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';

const { SETTINGS_BRANCHES_API, CRM_SERVER } = apiList;
const branchId = 1;

const getMyAuth = () =>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchPaymentModes() {
  return request(`${SETTINGS_BRANCHES_API}/${branchId}/BranchPaymentModes`, {
    ...getMyAuth(),
  });
}

export async function fetchAddons(payload: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}/AddOns`, {
    ...getMyAuth(),
  });
}

export async function addAddons(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${params.branchId}/AddOns`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify(params.values),
  });
}

// checkInputName
export async function checkInputName(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${params.branchId}/AddOns`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify(params.values),
  });
}

export async function addingCheckTypeAndName(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${branchId}/AddOns/CheckTypeAndName`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify({
      type: params.type,
      name: params.name,
    }),
  });
}

export async function updateAddons(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${params.branchId}/AddOns/${params.id}`, {
    ...getMyAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.value),
  });
}

export async function updatingCheckTypeAndName(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${params.branchId}/AddOns/${params.id}/CheckTypeAndName`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify(params.value),
  });
}

/* export async function updateAddons(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${branchId}/AddOns/${params.id}`, {
    ...authHeader,
    method: 'PUT',
    body: JSON.stringify(params),
  });
} */

export async function deleteAddons(params: AddonsParams) {
  return request(`${SETTINGS_BRANCHES_API}/${params.branchId}/AddOns/${params.id}`, {
    ...getMyAuth(),
    method: 'DELETE',
  });
}

export async function getBranchNames(url:string) {
  
  return request(`${CRM_SERVER}/${url}`, {
    ...getMyAuth(),
    method: 'GET',
    getResponse: true,
  })
}
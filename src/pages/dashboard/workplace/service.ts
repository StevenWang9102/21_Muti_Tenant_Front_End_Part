import request from 'umi-request';
import { getAuthHeader, getToken } from '@/utils/authority';
import jwt from 'jsonwebtoken'
import { apiList } from '@/../config/proxy'

const { HOST_USERS_API, SETTINGS_BRANCHES_API, SETTINGS_PAYMENT_MODES_API, 
  CRM_USERS_API, ITEMS_ITEMS_API, CRM_SERVER, ITEMS_CATEGORIES_API } = apiList;

const getMyAuthHeader = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

const getHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;  
  return decoded !== null? decoded['sub']: null;
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


export async function fetchTenantsList(params) {
  const houstUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${houstUserId}/candidates`, {
    ...getMyAuthHeader(),
  }).then(function(response) {
    if(response && response.data === "") return {data: []}
    else return {data: response}
  });
}

export async function getAllBranchFunction() {
 
  return request(SETTINGS_BRANCHES_API, {
    ...getMyAuthHeader(),
    method: 'GET',
    getResponse: true,
  })
}

export async function fetchPaymentModes() {
  return request(`${SETTINGS_PAYMENT_MODES_API}`, {
    ...getMyAuthHeader(),
  });
}

export async function getAllUsers(url: string | null ) {
  return request(CRM_USERS_API, {
    ...getMyAuthHeader(),
    method: 'GET',
    getResponse: true,
  })
}

export async function fetchItems(params) {  
  return request(`${ITEMS_ITEMS_API}`, {
    ...getMyAuthHeader(),
  });
}

export async function fetchRoles() {
  return request(`${CRM_SERVER}/crm/roles`, {
    ...getMyAuthHeader(),
    method: 'GET',
    getResponse: true,
  })
}


export async function fetchCategories() {
  return request(`${ITEMS_CATEGORIES_API}`, {
    ...getMyAuthHeader(),
    method: 'GET',
    getResponse: true,
  })
}
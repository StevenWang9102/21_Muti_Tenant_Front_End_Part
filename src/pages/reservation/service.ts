import request from '@/utils/request';
import { getAuthHeader, getAuthHeaderOfFile, getToken } from '@/utils/authority';
import { payloadInterface } from './data';
import { apiList } from '@/../config/proxy';
import qs from 'qs';

const { SETTINGS_BRANCHES_API, CRM_USERS_API } = apiList;

const getAuth = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

const getAuthHeaderOfFileFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeaderOfFile(token);
  return authHeader
}


export async function fetAllReservation() {
  return request(`/server/api/crm/bookings`, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  })
}

export async function ferchReservationWithQuery(params) {
  
  return request(`/server/api/crm/bookings?${qs.stringify(params)}`, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  })
}


export async function fetchAllBranch() {
  return request(`/server/api/settings/branches`, {
    ...getAuth(),
    method: 'GET',
  })
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ updateBranchInfo
export async function updateBranchInfo(payload) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}`, {
    ...getAuth(),
    method: 'PATCH',
    data: payload.body,
    // getResponse: true,
  })
}

// export async function changeBranchNames(payload: payloadInterface, value:string, path: string) {
//   let requestUrl;
//   payload.branchId? requestUrl = `${SETTINGS_BRANCHES_API}/${payload.branchId}`
//    : requestUrl = `${SETTINGS_BRANCHES_API}`;
   
//   return request(requestUrl, {
//     ...getAuthHeaderFunction(),
//     method: 'PATCH',
//     data: [{
//       op: "replace",
//       path: path,
//       value: value,
//     }],
//     getResponse: true,
//   })
// }

export async function requestBranchUsers(params) {
  return request(`/server/api/crm/users/branch/${params.branchId}`, {
    ...getAuth(),
    method: 'GET',
  })
}

export async function requestBranchLoacation(params) {
  return request(`/server/api/settings/branches/${params.branchId}/locations`, {
    ...getAuth(),
    method: 'GET',
  })
}

export async function fetchOneReservation(params) {
  return request(`/server/api/crm/booking/${params.id}`, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  })
}

export async function fetchAllUser() {
  return request(`${CRM_USERS_API}`, {
    ...getAuth(),
    method: 'GET',
  })
}

export async function createReservation(payload) {
  return request(`/server/api/crm/booking`, {
    ...getAuth(),
    method: 'POST',
    data: payload.body,
    getResponse: true,
  })
}

export async function updateReservation(params) {
  return request(`/server/api/crm/booking/${params.id}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.body),
    getResponse: true,
  });
}

export async function deleteReservation(params) {
  return request(`/server/api/crm/booking/${params.id}`, {
    ...getAuth(),
    method: 'DELETE',
    getResponse: true,
  });
}

export async function getAllBranchFunction(url: string, id: string | undefined) {
  const requestUrl = url? `${SETTINGS_BRANCHES_API}/${url}`:`${SETTINGS_BRANCHES_API}`
  id?`${SETTINGS_BRANCHES_API}/${id}`:`${SETTINGS_BRANCHES_API}`
 
  return request(requestUrl, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  })
}

// getOneBranchInfo
export async function getOneBranchInfo(payload) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}`, {
    ...getAuth(),
    method: 'GET',
    getResponse: true,
  })
}

export async function checkBranchNames(payload: any) {
  const id = payload.id? `/${payload.id}`: ''
  return request(`${SETTINGS_BRANCHES_API}${id}/${payload.url}`, {
    ...getAuth(),
    method: 'POST',
    data: payload.value,
    getResponse: true,
  }).then(function(response) {
    return response
  })
}

export async function changeBranchNames(payload: payloadInterface, value:string, path: string) {
  let requestUrl;
  payload.branchId? requestUrl = `${SETTINGS_BRANCHES_API}/${payload.branchId}`
   : requestUrl = `${SETTINGS_BRANCHES_API}`;
   
  return request(requestUrl, {
    ...getAuth(),
    method: 'PATCH',
    data: [{
      op: "replace",
      path: path,
      value: value,
    }],
    getResponse: true,
  })
}

export async function postImageFunction(payload: {id: string, file: any}) {  
  return request(`${SETTINGS_BRANCHES_API}/${payload.id}/images`, {
    ...getAuthHeaderOfFileFunction(),
    method: 'POST',
    data: payload.file,
    getResponse: true,
  })
}

export async function changeBranchRoles(payload: payloadInterface, path: string) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}/${path}`, {
    ...getAuth(),
    method: 'PUT',
    getResponse: true,
  })
}


export async function postNewBranchFunction(payload: payloadInterface) {
  return request(`${SETTINGS_BRANCHES_API}`, {
    ...getAuth(),
    method: 'POST',
    data: payload,
    getResponse: true,
  })
}

export async function editBranchFunction(payload: payloadInterface) {
  return request(`${SETTINGS_BRANCHES_API}/${payload.branchId}`, {
    ...getAuth(),
    method: 'PATCH',
    data: payload.value,
    getResponse: true,
  })
}
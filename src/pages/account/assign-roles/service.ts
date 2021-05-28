import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { TableListParams } from './data.d';
import { apiList } from '@/../config/proxy'
const { CRM_USERS_API, CRM_ROLES_API, SETTINGS_BRANCHES_API, CRM_USERS_GET_BRANCH_ROLE_API, CRM_USERS_POST_DELETE_BRANCH_ROLE_API } = apiList;

const getMyAuth = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

export async function fetchUserlist(params?: TableListParams): Promise<any> {
  return request(`${CRM_USERS_API}`, {
    ...getMyAuth(),
    params,
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchUserBranchRoleslist(params?: TableListParams): Promise<any> {
  return request(`${CRM_USERS_GET_BRANCH_ROLE_API}`, {
    ...getMyAuth(),
    params,
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchBranchesList(params?: TableListParams): Promise<any> {
  return request(`${SETTINGS_BRANCHES_API}`, {
    ...getMyAuth(),
    params,
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchRolesList(params?: TableListParams): Promise<any> {
  return request(`${CRM_ROLES_API}`, {
    ...getMyAuth(),
    params,
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

export async function fetchUserBranchRoles(params?: TableListParams): Promise<any> {
  return request(`${CRM_USERS_API}/${params.userId}/branchRoles`, {
    ...getMyAuth(),
    params,
  })
}

export async function updateUserBranchRoles(params?: any): Promise<any> {
  return request(`${CRM_USERS_API}/${params.userId}/branchRoles`, {
    ...getMyAuth(),
    method: 'PUT',
    body: JSON.stringify(params.data),
  });
}

export async function assignUsersForOneBranchRole(params?: TableListParams): Promise<any> {
  return request(`${CRM_USERS_POST_DELETE_BRANCH_ROLE_API}/${params.branchId}/roles/${params.roleId}/users`, {
    ...getMyAuth(),
    method: 'POST',
    body: JSON.stringify({ UserIds: params.userIds }),
  });
}

export async function deleteUsersForOneBranchRole(parms, body) {
  console.log('deleteUsersForOneBranchRole,parms', parms); 
  console.log('deleteUsersForOneBranchRole,body', body); 

  return request(`${CRM_USERS_POST_DELETE_BRANCH_ROLE_API}/${parms.branchId[0]}/roles/${parms.roleId[0]}/users`, {
    ...getMyAuth(),
    method: 'DELETE',
    body: JSON.stringify(body),
  });
}

export async function getUserWithQueryFunction(payload: any) {
  let requestUrl = `${CRM_USERS_API}?keyword=${payload.value}`;
  
  return request(requestUrl, {
    ...getMyAuth(),
    method: 'GET',
    params: {},
    getResponse: true,
  }).then(function (response) {
    return response.data;
  })
}

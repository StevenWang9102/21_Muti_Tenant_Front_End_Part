import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { CRM_USERS_API, CRM_SERVER, CRM_MEMBER_API} = apiList;

const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

export async function fetchMembers() {
  return request(CRM_MEMBER_API, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function searchMember(params) {
  return request(`${CRM_MEMBER_API}?keyword=${params.keywords}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function fetchOneMembers(params) {
  return request(`/server/api/crm/customer/${params.id}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
  })
}

export async function updateMember(params) {
  return request(`/server/api/crm/customer/${params.id}`, {
    ...getAuthHeaderFunction(),
    method: 'PATCH',
    body: JSON.stringify(params.body),
    getResponse: true,
  });
}

// deletCustomer
export async function deletCustomer(params) {
  return request(`/server/api/crm/customer/${params.id}`, {
    ...getAuthHeaderFunction(),
    method: 'DELETE',
    getResponse: true,
  });
}


export async function createMember( payload ) {
  return request(`/server/api/crm/customer`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: payload.body,
    // getResponse: true,
  })
}

// =======================================================

export async function getSingleUserFunction(id: string) {
  
  return request(`${CRM_USERS_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function requestBranchUserInformation(id: string) {
  return request(`${CRM_USERS_API}/branch/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
} 

export async function getUserBranchRoles(id: string) {
  
  return request(`${CRM_USERS_API}/${id}/branchRoles`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function checkNameFunction( name: object, url: string ) {
    
  return request(`${CRM_USERS_API}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: name,
    getResponse: true,
  })
}

export async function checkCodeFunction( payload ) {
  let id;
  if(payload.fromPage === 'Create') id = ''
  else id = `/${payload.id}`
  
  return request(`${CRM_USERS_API}${id}/${payload.url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: payload.value,
    getResponse: true,
  })
}

export async function editUserFunction( id:string, path:string, value: any[]) {
  
  const postData = value.map((item, index: number)=>{    
    return {
      "op": "replace",
      "path": path[index],
      "value": value[index],
    }
  })
  
  return request(`${CRM_USERS_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'PATCH',
    data: postData,
    getResponse: true,
  })
}


export async function editUserBranchRolesFunction( payload ) {
  return request(`${CRM_USERS_API}/${payload.id}/branchRoles`, {
    ...getAuthHeaderFunction(),
    method: 'PUT',
    data: payload.branchRoles,
    getResponse: true,
  })
}

export async function changActiveStatusFunction(id:string, path:string) {
  return request(`${CRM_USERS_API}/${id}/${path}`, {
    ...getAuthHeaderFunction(),
    method: 'PUT',
    getResponse: true,
  })
}


export async function generalGetMethodFunction(url:string) {
  return request(`${CRM_SERVER}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function postNewBranchFunction( value ) {
  return request(`${CRM_USERS_API}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: value,
    getResponse: true,
  })
}

export async function checkUserNamesFunction(payload: any) {
  const url = payload.id? `${payload.id}/${payload.url}`: `${payload.url}`
  return request(`${CRM_USERS_API}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: payload.value,
    getResponse: true,
  }).then(function(response) {
    return response
  })
}
import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { CRM_USERS_API, CRM_API, CRM_ROLES_API, CRM_SERVER } = apiList;


const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

export async function getAllUserFunction() {
  
  return request(CRM_USERS_API, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSingleUserFunction(id: string) {
  return request(`${CRM_USERS_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function checkNameFunction( name: object, url: string ) {
    
  return request(`${CRM_API}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: name,
    getResponse: true,
  })
}

export async function changeNamesFunction( id:string, path:string, value: any[]) {
  
  const postData = value.map((e,index: number)=>{    
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


export async function changActiveStatusFunction(id:string, path:string) {
  
  return request(`${CRM_USERS_API}/${id}/${path}`, {
    ...getAuthHeaderFunction(),
    method: 'PUT',
    getResponse: true,
  })
}

export async function updateRoleNameFunction( id: string, data: string ) {
  
  return request(`${CRM_ROLES_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'PUT',
    data: {
      name:data,
    },
    getResponse: true,
  })
}

export async function deleteRoleFunction( id: string ) {
  
  return request(`${CRM_ROLES_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'DELETE',
    getResponse: true,
  })
}

export async function createRoleFunction( name: string ) {
  
  return request(`${CRM_ROLES_API}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: {
      name: name,
    },
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


export async function postNewBranchFunction( value: any ) {
    
  return request(`${CRM_USERS_API}/crm/users`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: value,
    getResponse: true,
  })
}
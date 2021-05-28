import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { SETTINGS_BRANCHES_API, CRM_SERVER} = apiList;

const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

export async function generalGetMethodFunction(url:string) {
  
  return request(`${CRM_SERVER}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllLocationInformation(id: string | null ) {
  const requestUrl = `${SETTINGS_BRANCHES_API}/${id}/locations`
  
  return request(requestUrl, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}


export async function checkNameFunction( name: object, url: string ) {
    
  return request(`${SETTINGS_BRANCHES_API}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: name,
    getResponse: true,
  })
}

export async function changeNameFunction( payload: any) {
  
  return request(`${SETTINGS_BRANCHES_API}/${payload.id}/locations/${payload.index}`, {
    ...getAuthHeaderFunction(),
    method: 'PATCH',
    data: [{
      "op": "replace",
      "path": payload.name,
      "value": payload.value,
    }],
    getResponse: true,
  })
}


export async function postNewLocationFunction( value, postUrl ) {
    
  return request(`${SETTINGS_BRANCHES_API}/${postUrl}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: value,
    getResponse: true,
  })
}


export async function deleteLocation(payload: any) {
  
  return request(`${SETTINGS_BRANCHES_API}/${payload.id}/locations/${payload.key}`, {
    ...getAuthHeaderFunction(),
    method: 'DELETE',
    getResponse: true,
  })
}
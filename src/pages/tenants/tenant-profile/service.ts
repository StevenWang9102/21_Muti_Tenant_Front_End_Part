import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { TenantApplicationProfile } from './data.d';
import { apiList } from '@/../config/proxy'
const { HOST_CANDIDATES_API, HOST_USERS_API } = apiList;

const getMyAuthHeader = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

const getHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
   return decoded !== null? decoded['sub']: null;
}

//Super Admin
export async function fetchCandidatesListSA(params: TenantApplicationProfile) {
  return request(`${HOST_CANDIDATES_API}`, {
    ...getMyAuthHeader(),
    params,
  });
}

export async function approveCandidateSA(params: TenantApplicationProfile) {
  return request(`${HOST_CANDIDATES_API}/${params.id}/approve`, {
    ...getMyAuthHeader(),
    method: 'POST',
    // body: JSON.stringify(params),
    getResponse: true,
  });
}

export async function denyCandidateSA(params: TenantApplicationProfile) {
  return request(`${HOST_CANDIDATES_API}/${params.id}/deny`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}

//Tenant Admin
export async function fetchCandidatesListTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/candidates`, {
    ...getMyAuthHeader(),
    params,
  });
}

export async function fetchOneCandidateTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    params,
  });
}

export async function checkLegalNameTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/candidates/${params.id}/CheckLegalName`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}

export async function checkShortNameTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/candidates/${params.id}//checkShortName`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}

export async function updateCandidateTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  console.log("params.jsonpatchOperation=",params.jsonpatchOperation)
  return request(`${HOST_USERS_API}/${hostUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteCandidateTA(params: TenantApplicationProfile) {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    method: 'DELETE',
  });
}

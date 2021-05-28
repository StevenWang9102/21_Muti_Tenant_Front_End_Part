import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { TenantApplication } from './data.d';
import { apiList } from '@/../config/proxy'
import sort from 'fast-sort';
const { HOST_CANDIDATES_API, HOST_USERS_API } = apiList;

const sortSourceData = (source) => {
  sort(source).desc(each => new Date(each.createdTime).getTime())
}

const getHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
  return decoded !== null? decoded['sub']: null;
}

const getMyAuthHeader = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

//Super Admin
export async function fetchCandidatesListSA(params: TenantApplication) {
  console.log(params);
  const params1 = {
    current: 1,
    pageSize: 20,
    sorter: 'createdTime'
  }
  return request(`${HOST_CANDIDATES_API}`, {
    ...getMyAuthHeader(),
    params1,
  }).then(function(response) {
    return {data: response}
  });
}

//Tenant Admin
export async function fetchCandidatesListTA(params: TenantApplication) {
    const houstUserId = getHostUserId()
    const params1 = {
      current: 1,
      pageSize: 20,
      sorter: 'createdTime'
    }
    return request(`${HOST_USERS_API}/${houstUserId}/candidates`, {
      ...getMyAuthHeader(),
      params1,
    }).then(function(response) {
      sortSourceData(response)
      if(response && response.data === "") return {data: []}
      else return {data: response}
    });
  }

export async function updateCandidateTA(params: TenantApplication) {
  const houstUserId = getHostUserId()

  return request(`${HOST_USERS_API}/${houstUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteCandidateTA(params: TenantApplication) {
  const houstUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${houstUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    method: 'DELETE',
  });
}

export async function checkLegalName(parms) {
  return request(`${HOST_USERS_API}/${parms.hostId}/candidates/${parms.cadidateId}/checkLegalName`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(parms.value),
    getResponse: true,
  });
}


export async function checkShortName(params) {
  return request(`${HOST_CANDIDATES_API}/CheckShortName`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}
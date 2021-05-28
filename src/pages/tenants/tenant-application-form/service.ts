import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { TenantApplicationForm } from './data.d';
import { apiList } from '@/../config/proxy'

const { HOST_CANDIDATES_API } = apiList;

const getMyAuthHeader = () =>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

export async function submitCandidates(params: TenantApplicationForm) {
  console.log(params)
  return request(`${HOST_CANDIDATES_API}`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}

export async function checkLegalName(params) {
  return request(`${HOST_CANDIDATES_API}/CheckLegalName`, {
    ...getMyAuthHeader(),
    method: 'POST',
    body: JSON.stringify(params),
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

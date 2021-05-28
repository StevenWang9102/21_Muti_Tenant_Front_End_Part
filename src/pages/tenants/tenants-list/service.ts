import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { TableListParams } from './data.d';
import { apiList } from '@/../config/proxy'

const { HOST_TENANTS_API } = apiList;

const getMyAuthHeader = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

const getMyHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
  return decoded !== null? decoded['sub']: null;
}
export async function fetchTenantsList(params: TableListParams) {
  return request(`${HOST_TENANTS_API}`, {
    ...getMyAuthHeader(),
    params,
  }).then(function(response) {
    console.log(response)
    return {data: response}
  });
}

export async function fetchOneTenant(params: TableListParams) {
  const HostUserId = getMyHostUserId()
  return request(`${HOST_TENANTS_API}/${HostUserId}/candidates/${params.id}`, {
    ...getMyAuthHeader(),
    params,
  });
}

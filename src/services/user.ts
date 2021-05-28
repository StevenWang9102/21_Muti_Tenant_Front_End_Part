import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'

const { HOST_USERS_API } = apiList;

export async function queryCurrent(): Promise<any>{
  const gposToken = getToken();
  const authHeader = gposToken !== null ? getAuthHeader(gposToken) : null;
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
  const sub = decoded !== null? decoded['sub']: null;
  return request(`${HOST_USERS_API}/${sub}`, {
    ...authHeader,
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

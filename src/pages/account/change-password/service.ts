import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'

const gposToken = getToken();
const authHeader = gposToken !== null ? getAuthHeader(gposToken) : null;
const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
const hostUserId = decoded !== null? decoded['sub']: null;
const { HOST_USERS_API } = apiList;

const getAuth = () =>{
  return gposToken !== null ? getAuthHeader(gposToken) : null; }



export async function updateCurrentUserPassword(params): Promise<any> {
  return request(`${HOST_USERS_API}/${hostUserId}/UpdatePassword`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify(params),
    getResponse: true,
  });
}
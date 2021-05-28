import request from '@/utils/request';
import jwt from 'jsonwebtoken'
import { getAuthHeader, getToken } from '@/utils/authority';
import { HandleCurrentUserParams } from './data.d';
import { apiList } from '@/../config/proxy'

// const gposToken = getToken();
// const authHeader = gposToken !== null ? getAuthHeader(gposToken) : null;
// const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
// const hostUserId = decoded !== null? decoded['sub']: null;
const { HOST_USERS_API } = apiList;

const getAuth = () =>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

const getHostUserId = () =>{
  const gposToken = getToken();
  const decoded = gposToken !== null ? jwt.decode(gposToken) : null;
  return decoded !== null? decoded['sub']: null;
}

export async function fetchCurrentUser(): Promise<any>{
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}`, {
    ...getAuth(),
  });
}

export async function SendEmailUpdateVerificationCode(params: HandleCurrentUserParams): Promise<any> {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/SendEmailUpdateVerificationCode`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify({NewEmail: params.newEmail}),
  });
}

export async function updateCurrentUserEmail(params: HandleCurrentUserParams): Promise<any> {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/email`, {
    ...getAuth(),
    method: 'PUT',
    body: JSON.stringify({NewEmail: params.newEmail, VerificationCode: params.VerificationCode}),
  });
}

export async function updateCurrentUserIsInactiveStatus(params: HandleCurrentUserParams): Promise<any> {
  const hostUserId = getHostUserId()
  return request(`${HOST_USERS_API}/${hostUserId}/IsInactive`, {
    ...getAuth(),
    method: 'PUT',
  });
}

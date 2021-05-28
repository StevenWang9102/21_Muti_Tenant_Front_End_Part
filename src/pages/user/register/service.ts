import request from '@/utils/request';
import { UserRegisterParams } from './data.d';
import { getGeneralHeader } from '@/utils/authority'
import { apiList } from '@/../config/proxy'

const generalHeader = getGeneralHeader();
const { HOST_USERS_API, HOST_AUTHENTICATION_API } = apiList;

export async function getCaptcha(params: UserRegisterParams) {
  return request(`${HOST_USERS_API}`, {
    ...generalHeader,
    method: 'POST',
    data: JSON.stringify(params),
    getResponse: true,
  });
}

export async function getCaptchaAgain(params: UserRegisterParams) {
  return request(`${HOST_USERS_API}/resendEmailVeificationCode`, {
    ...generalHeader,
    method: 'POST',
    data: JSON.stringify(params),
    getResponse: true,
  });
}

export async function registerHandle(params: UserRegisterParams) {
  return request(`${HOST_USERS_API}/verifyemail`, {
    ...generalHeader,
    method: 'POST',
    data: JSON.stringify(params),
    getResponse: true,
  });
}

export async function LoginHandle(params: UserRegisterParams) {
  return request(`${HOST_AUTHENTICATION_API}`, {
    ...generalHeader,
    method: 'POST',
    data: JSON.stringify(params),
    getResponse: true,
  });
}

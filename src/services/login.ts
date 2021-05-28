import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'

const { HOST_AUTHENTICATION_API, HOST_TENANTS_API } = apiList;

export interface LoginParamsType {
  userName?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
  tenantId?: string;
}

export async function handleAccountLogin(params: LoginParamsType) {
  return request(`${HOST_AUTHENTICATION_API}`, {
    method: 'POST',
    data: params,
    getResponse: true,
  })
};

export async function fetchAllTenants() {
  const gposToken = getToken();
  const authHeader = gposToken !== null ? getAuthHeader(gposToken) : null;
  return request(`${HOST_TENANTS_API}`, {
    ...authHeader,
  })
}

export async function handleChooseTenant(params: LoginParamsType) {
  const gposToken = getToken();
  const authHeader = gposToken !== null ? getAuthHeader(gposToken) : null;
  return request(`${HOST_AUTHENTICATION_API}/ChooseTenant`, {
    ...authHeader,
    method: 'POST',
    data: params,
    getResponse: true,
  })
};

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

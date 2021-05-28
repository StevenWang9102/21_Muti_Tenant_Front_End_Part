import { reloadAuthorized } from './Authorized';
import jwt from 'jsonwebtoken'

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

export function setToken(token: string) {
  localStorage.setItem('menuhub-login-token', token);
  return;
}

export function removeToken() {
  localStorage.removeItem('menuhub-login-token');
  return;
}

export function getAuthHeaderOfImage(token : String) { 
  return ({
    headers: {
      'Accept': 'text/plain',
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'image/jpg',
    },
  });
}

export function getAuthHeader(token : String) {
  return ({
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
}

export function getGeneralHeader() {
  return ({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export function getToken() {
  const token = localStorage.getItem('menuhub-login-token');
  return token ? token: null;
}

export function verifyTokenExpiration() {
  const token = localStorage.getItem('menuhub-login-token');
  const decoded = token !== null ? jwt.decode(token) : null;
  const currentTime = Date.now() / 1000;
  return currentTime < (decoded && decoded['exp'])? true: false;
}

export function IsSuperAdmin() {
  const token = localStorage.getItem('menuhub-login-token');
  const decoded = token !== null ? jwt.decode(token) : null;
  const isSuperAdmin = decoded !== null? decoded['SuperAdmin']: null;
  console.log("isSuperAdmin", isSuperAdmin)
  if(isSuperAdmin == "True")
    return true;
  else
    return false;
}

export function IsTenantAdmin() {
  const token = localStorage.getItem('menuhub-login-token');
  const decoded = token !== null ? jwt.decode(token) : null;
  const isSuperAdmin = decoded !== null? decoded['TenantAdmin']: null;
  if(isSuperAdmin == "True")
    return true;
  else
    return false;
}




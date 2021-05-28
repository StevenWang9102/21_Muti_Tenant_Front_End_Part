import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';


const getMyAuthHeader = () => {
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : null;
}

export async function forgetPasswordRequest(params) {
  return request(`/server/api/host/hostusers/SendPasswordResetVerificationCode `, {
    method: 'POST',
    data: {'Email': params},
    getResponse: true,
  }).then(function(response) {
    console.log('resposn', response);
    return response.data.hostUserId
  });
}

export async function resetPasswordRequest(params) {
  console.log('resetNewPassword,params', params);
  
  return request(`/server/api/host/hostusers/${params.hostUserId}/ResetPassword`, {
    method: 'POST',
    data: {
      "Token": params.code,
      "NewPassword": params.password,
    },
    getResponse: true,
  }).then(function(response) {
    console.log('resetPasswordRequest,server,response', response);
    return response
  });
}

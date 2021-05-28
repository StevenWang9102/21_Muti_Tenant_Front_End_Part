import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const {  GET_REPORT } = apiList;

const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

export async function getAllPaymentFunction() {
  return request(`${GET_REPORT}/SalesByPaymentModeReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllPaymentQueryFunction(url: string) {
  let query
  if(url[1]) {
    query=`?startDateTime=${url[0]}&endDateTime=${url[1]}`
  } else {
    query=`?startDateTime=${url[0]}&endDateTime=${url[0]}`
  }
  return request(`${GET_REPORT}/SalesByPaymentModeReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSpecifiedBranchAndDayData(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  let branchId = `branches/${payload.branchId}/SalesByPaymentModeReport`

  return request(`${GET_REPORT}/${branchId}${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}
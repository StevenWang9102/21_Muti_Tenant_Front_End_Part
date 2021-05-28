import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { CRM_USERS_API, SETTINGS_BRANCHES_API, GET_REPORT, GET_BRANCH } = apiList;

const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}

export async function getAllBranchFunction(url: string, id: string | undefined) {
  const requestUrl = url? `${SETTINGS_BRANCHES_API}/${url}`:`${SETTINGS_BRANCHES_API}`
  id?`${SETTINGS_BRANCHES_API}/${id}`:`${SETTINGS_BRANCHES_API}`
 
  return request(requestUrl, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllBranchSales(id: string) {
  return request(`${GET_REPORT}/SalesByBranchReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSaleHourlyReportWithQuery(url: string) {
  let query
  if(url[1]) {
    query=`?startDateTime=${url[0]}&endDateTime=${url[1]}`
  } else {
    query=`?startDateTime=${url[0]}&endDateTime=${url[0]}`
  }
  return request(`${GET_REPORT}/SalesByHourReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getDailyReportWithQuery(url: string) {
  let query=`?startDateTime=${url[0]}&endDateTime=${url[1]}`
  return request(`${GET_REPORT}/SalesByDateReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSpecifiedBranchHourlyReport(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  let branchId = `${payload.branchId}`

  return request(`${GET_REPORT}/branches/${branchId}/SalesByHourReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSpecifiedMonthlyDataFunction(timeRange: any, id: any) {
  const query =`?startDateTime=${timeRange[0]}&endDateTime=${timeRange[1]}`
  let branchId = id? `branches/${id}/`: ""
  
  return request(`${GET_REPORT}/${branchId}SalesByMonthReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSpecifiedBranchMonthlyData(payload) {
  let query=`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`  
  return request(`${GET_BRANCH}/${payload.branchId}/SalesByMonthReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSaleReportWithBranchId(payload) {
  let query=`?startDateTime=${payload.timeRange[0]}& endDateTime=${payload.timeRange[1]}`
  return request(`${GET_BRANCH}/${payload.branchId}/SalesByDateReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllHourlySales(id: string) {
  return request(`${GET_REPORT}/SalesByBranchReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getDateRangeDataFunction(url: string) {  
  let query
  if(url[1]) {
    query=`?startDateTime=${url[0]}& endDateTime=${url[1]}`
  } else {
    query=`?startDateTime=${url[0]}& endDateTime=${url[0]}`
  }
  return request(`${GET_REPORT}/SalesByBranchReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllDailySales(id: string) {
  return request(`${GET_REPORT}/SalesByDateReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getOneBranchSales(id: string) {
  return request(`${GET_BRANCH}/${id}/SalesByDateReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}


export async function getAllMonthSalesFunction(id: string) {
  return request(`${GET_REPORT}/SalesByMonthReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}


export async function checkNameFunction( name: object, url: string ) {
  return request(`${CRM_USERS_API}/${url}`, {
    ...getAuthHeaderFunction(),
    method: 'POST',
    data: name,
    getResponse: true,
  })
}

export async function changeNamesFunction( id:string, path:string, value: any[]) {
  const postData = value.map((e,index: number)=>{    
    return {
      "op": "replace",
      "path": path[index],
      "value": value[index],
    }
  })
  
  return request(`${CRM_USERS_API}/${id}`, {
    ...getAuthHeaderFunction(),
    method: 'PATCH',
    data: postData,
    getResponse: true,
  })
}


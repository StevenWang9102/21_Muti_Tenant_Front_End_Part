import request from '@/utils/request';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';
const { ITEMS_API, GET_REPORT_CAGEGORIES, GET_REPORT, GET_REPORT_ITEM, GET_BRANCH,  ITEMS_ITEMS_API } = apiList;

const getAuthHeaderFunction = () =>{
  const token = getToken()!.toString();
  const authHeader = getAuthHeader(token);
  return authHeader
}


export async function getAllItemReportFunction(id: string) {
  return request(`${GET_REPORT}/SalesByItemReport`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllItemNameFunction(id: string) {
  return request(`${ITEMS_ITEMS_API}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllCategoriesNamesFunction(id: string) {
  return request(`${ITEMS_API}/categories`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getItemWithQueryFunction(url: string) {
  
  let query
  if(url[1]) {
    query=`?startDateTime=${url[0]}&endDateTime=${url[1]}`
  } else {
    query=`?startDateTime=${url[0]}&endDateTime=${url[0]}`
  }
  return request(`${GET_REPORT}/SalesByItemReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}


export async function getSpecifiedItemDailyFunction(payload: any) {
  
  let time = payload.timeRange
  let itemId = payload.itemId
  let query=`?startDateTime=${time[0]}&endDateTime=${time[1]}`
 
  return request(`${GET_REPORT}/items/${itemId}/ItemSalesByDateReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getSpecifiedBranchAndDayData(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  return request(`${GET_BRANCH}/${payload.branchId}/items/${payload.itemId}/ItemSalesByDateReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getCategoryReportWithCategoryIdFunction(payload: any) {
  console.log(payload);
  
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  return request(`${GET_REPORT_CAGEGORIES}/${payload.categoryId}/CategorySalesByBranchReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getItemBranchReportWithIdFunction(payload: any) {
  console.log(payload);
  
  let query =`?startDateTime=${payload.timeRange[0]}& endDateTime=${payload.timeRange[1]}`
  return request(`${GET_REPORT_ITEM}/${payload.itemId}/ItemSalesByBranchReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getOneBranchItemDataFunction(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  return request(`${GET_BRANCH}/${payload.branchId}/SalesByItemReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}


export async function getSpecifiedBranchCategoryFunction(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  return request(`${GET_BRANCH}/${payload.branchId}/SalesByCategoryReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

export async function getAllCategoryReportFunction(payload: any) {
  let query =`?startDateTime=${payload.timeRange[0]}&endDateTime=${payload.timeRange[1]}`
  return request(`${GET_REPORT}/SalesByCategoryReport${query}`, {
    ...getAuthHeaderFunction(),
    method: 'GET',
    getResponse: true,
  })
}

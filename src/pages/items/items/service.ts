//import request from 'umi-request';
import request from '@/utils/request';
import { TableListParams, SearchTableListParams } from './data.d';
import { getAuthHeader, getAuthHeaderOfImage,  getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy';

const { ITEMS_ITEMS_API, ITEMS_BATCH_UPLOAD_API, ITEMS_API, ITEMS_CATEGORIES_API, CRM_SERVER} = apiList;

const getAuth = () =>{
  const gposToken = getToken();
  return gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchItems(params) {  
  console.log('fetchItems,params', params);
  
  return request(`${ITEMS_ITEMS_API}`, {
    ...getAuth(),
    params,
    getResponse: true,
  }).then((res)=>{
    return res
  })
}

export async function searchItems(params: SearchTableListParams) {
  return request(`${ITEMS_ITEMS_API}`, {
    ...getAuth(),
    params,
    getResponse: true,
  }).then((res)=>{
    return res
  })
}


export async function fetchAllBranch() {
  return request(`${CRM_SERVER}/settings/branches`, {
    ...getAuth(),
    method: 'GET',
  }).then(res=>{
    return res
  })
}

export async function fetchImageLibrary() {
  return request(`/server/api/items/getfromGallery`, {
    ...getAuth(),
  }).then(res=>{
    console.log('res48161', res);
    return res
  })
}

export async function fetchBranchItem(params: TableListParams) {
  return request(`${ITEMS_ITEMS_API}/${params.itemId}/branchitems`, {
    ...getAuth(),
  });
}

export async function fetchCategories(params) {
  return request(`${ITEMS_CATEGORIES_API}`, {
    ...getAuth(),
    params,
  })
}

export async function addItem(params: TableListParams) {
  return request(`${ITEMS_ITEMS_API}`, {
    ...getAuth(),
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// /api/items/batchUpload @@@@@@@@@@@
export async function batchUpload(params: TableListParams) {
  return request(`${ITEMS_BATCH_UPLOAD_API}`, {
    ...getAuth(),
    method: 'POST',
    body: params.body,
  });
}

export async function addImage(params: TableListParams) {
  return request(`/server/api/items/items/${params.itemId}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.body),
  });
}

export async function updateItem(params: TableListParams) {

  return request(`${ITEMS_ITEMS_API}/${params.id}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function updateBranchItem(params: TableListParams) {
  return request(`${ITEMS_ITEMS_API}/branches/${params.branchId}/item/${params.itemId}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function updateBranchPrice(params: TableListParams) {
  return request(`${ITEMS_API}/branches/${params.branchId}/items/${params.itemId}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function updateBranchItemList(params: TableListParams) {
  return request(`${ITEMS_API}/branches/${params.branchId}/items/${params.itemId}`, {
    ...getAuth(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteItem(params: TableListParams) {
  return request(`${ITEMS_ITEMS_API}/${params.id}`, {
    ...getAuth(),
    method: 'DELETE',
  });
}
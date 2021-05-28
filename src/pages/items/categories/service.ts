import request from 'umi-request';
import { CategoriesTreeParams } from './data.d';
import { getAuthHeader, getToken } from '@/utils/authority';
import { apiList } from '@/../config/proxy'
import { message, notification } from 'antd';

const { ITEMS_CATEGORIES_API } = apiList;

const getMyHeader = () =>{
  const gposToken = getToken();
  return  gposToken !== null ? getAuthHeader(gposToken) : {};
}

export async function fetchCategories(params: CategoriesTreeParams) {
  return request(`${ITEMS_CATEGORIES_API}`, {
    ...getMyHeader(),
    params,
  })
}

export async function fetchOneCategory(params: CategoriesTreeParams) {
  return request(`${ITEMS_CATEGORIES_API}/${params.id}`, {
    ...getMyHeader(),
  });
}

export async function addImage(params) {
  return request(`/server/api/items/categories/${params.itemId}`, {
    ...getMyHeader(),
    method: 'PATCH',
    body: JSON.stringify(params.body),
  });
}

export async function addCategory(params: CategoriesTreeParams) {
  return request(`${ITEMS_CATEGORIES_API}`, {
    ...getMyHeader(),
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function updateCategory(params: CategoriesTreeParams) {

  return request(`${ITEMS_CATEGORIES_API}/${params.id}`, {
    ...getMyHeader(),
    method: 'PATCH',
    body: JSON.stringify(params.jsonpatchOperation),
  });
}

export async function deleteCategory(params: CategoriesTreeParams) {
  return request(`${ITEMS_CATEGORIES_API}/${params.id}`, {
    ...getMyHeader(),
    method: 'DELETE',
    getResponse: true,
  }).then((response)=>{
    console.log(response);
    return response
  });
}

export async function validateCategoryName(payload) {
  try{
    console.log('params8888',payload);
    
    return request(`/server/api/items/categories/CheckName`, {
      ...getMyHeader(),
      method: 'POST',
      body: JSON.stringify(payload),
      getResponse: true,
    }).then(
      res =>{
        console.log(res);
      }
    )
  } catch{
    message.error('This category name has already exist0.')
    console.log('This category name has already exist0.');
  }
}

export async function validateCategoryNameWithId(payload) {
    return request(`/server/api/items/categories/${payload.itemId}/checkName`, {
      ...getMyHeader(),
      method: 'POST',
      body: JSON.stringify(payload.body),
      getResponse: true,
    }).then(
      res =>{ console.log('validateCategoryNameWithId',res)}
    )
}
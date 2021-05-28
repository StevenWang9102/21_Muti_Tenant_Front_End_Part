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

export async function fetchImageLibrary() {
  return request(`/server/api/items/getfromGallery`, {
    ...getMyHeader(),
  }).then(res=>{
    console.log('res48161', res);
    return res
  })
}

// http://localhost:65040/api/
// items/removeFromGallery/2020_0224_c6bd8dd8g00q675ci00icc000c800m8c-5024928.gif
export async function deleteImage(imgname) {

  return request(`/server/api/items/removeFromGallery/${imgname}`, {
    ...getMyHeader(),
    method: 'DELETE',
    // body: JSON.stringify(body),
  });
}

import request from '@/utils/request';

export async function fetchCurrent(params: any): Promise<any> {
  return request(`/api/menus/${params.authority}`);
}
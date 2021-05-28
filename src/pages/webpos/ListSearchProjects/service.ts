import request from '@/utils/request';

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list_lsp', {
    params,
  });
}

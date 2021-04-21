import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
}


export async function login(params: LoginParamsType) {
  return request('/auth', {
    method: 'POST',
    data: params,
  })
}

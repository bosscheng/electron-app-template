import request from '@/utils/request';

const _prefix = '/profile';


export async function getProfile() {
  return request(_prefix);
}

/*
* author: wancheng
* date: 11/5/18
* desc:
*/

import axios from 'axios';
import {Message} from 'element-ui';

const baseUrl = process.env.VUE_APP_BASE_URL || '';
let apiPath = process.env.VUE_APP_BASE_API || ''; // 本地代理才能使用到的
const apiVersion = apiPath + '';

const service = axios.create({
  baseURL: baseUrl + apiVersion, // api的base_url
  timeout: 60 * 1000 // request timeout 60s
});


// request interceptor
service.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.error(error); // for debug
  Promise.reject(error)
});

service.interceptors.response.use(response => {
  const res = response.data || {};
  const headers = response.headers || {};

  return res;
}, error => {
  return Promise.reject(error)
});

export default service;

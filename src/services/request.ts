import axios from 'axios';
import { message as antMessage } from 'antd';
import { getToken, clearToken } from '@/utils/token';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 Token 和 mock 用户租户头
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 注入 mock 用户和租户信息
  config.headers['X-User-Id'] = import.meta.env.VITE_USER_ID || 'admin';
  config.headers['X-Tenant-Id'] = import.meta.env.VITE_TENANT_ID || 'default';
  return config;
});

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => response.data, // 剥一层，直接返回 data
  (error) => {
    if (error.response?.status === 401) {
      clearToken(); // Token 过期 → 清除 → 跳转登录
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期，请重新登录'));
    }
    // 统一错误格式：提取后端返回的 message
    const message = error.response?.data?.message || error.message || '请求失败';
    // 非 2xx 时 Toast 错误信息
    antMessage.error(message);
    return Promise.reject(new Error(message));
  },
);

export default request;

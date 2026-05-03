import request from './request';
import { setToken, setRole, setUser, setTenantInfo } from '@/utils/token';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  role: string;
  user: Record<string, unknown>;
  tenant?: Record<string, unknown>;
}

/** 登录 */
export async function login(params: LoginParams): Promise<LoginResult> {
  const res = await request.post('/api/auth/login', params) as unknown as LoginResult;
  setToken(res.accessToken);
  setRole(res.role);
  setUser(res.user);
  if (res.tenant) {
    setTenantInfo(res.tenant);
  }
  return res;
}

/** 登出 */
export async function logout(): Promise<void> {
  try {
    await request.post('/api/auth/logout');
  } finally {
    // 无论接口是否成功，都清除本地状态
    localStorage.clear();
  }
}

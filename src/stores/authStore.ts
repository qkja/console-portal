import { create } from 'zustand';
import { getToken, getRole, getUser, setToken, setRole, setUser, clearToken } from '@/utils/token';

interface AuthState {
  token: string | null;
  role: string | null;
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;

  /** 从 localStorage 初始化鉴权状态 */
  hydrate: () => void;
  /** 保存登录信息 */
  login: (token: string, role: string, user: Record<string, unknown>) => void;
  /** 登出 */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  user: null,
  isAuthenticated: false,

  hydrate: () => {
    const token = getToken();
    const role = getRole();
    const user = getUser();
    set({
      token,
      role,
      user,
      isAuthenticated: !!token,
    });
  },

  login: (token: string, role: string, user: Record<string, unknown>) => {
    setToken(token);
    setRole(role);
    setUser(user);
    set({ token, role, user, isAuthenticated: true });
  },

  logout: () => {
    clearToken();
    set({ token: null, role: null, user: null, isAuthenticated: false });
  },
}));

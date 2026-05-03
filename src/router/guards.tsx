import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/utils/constants';
import { PATH_LOGIN, PATH_FORBIDDEN } from './routes';
import type { ReactNode } from 'react';

interface GuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

/**
 * 路由守卫：鉴权 + 角色判断
 */
export function RouteGuard({ children, allowedRoles }: GuardProps) {
  const { token, role } = useAuthStore();
  const location = useLocation();

  // 无 Token → 重定向到登录页
  if (!token) {
    return <Navigate to={PATH_LOGIN} state={{ from: location }} replace />;
  }

  // 角色不匹配 → 403 页面
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={PATH_FORBIDDEN} replace />;
  }

  return <>{children}</>;
}

/** 超级管理员路由守卫 */
export function AdminGuard({ children }: { children: ReactNode }) {
  return <RouteGuard allowedRoles={[ROLES.SUPER_ADMIN]}>{children}</RouteGuard>;
}

/** 租户管理员路由守卫 */
export function TenantGuard({ children }: { children: ReactNode }) {
  return <RouteGuard allowedRoles={[ROLES.TENANT_ADMIN]}>{children}</RouteGuard>;
}

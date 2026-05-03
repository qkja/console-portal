import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { TenantLayout } from '@/layouts/TenantLayout';
import { AdminGuard, TenantGuard } from './guards';
import {
  PATH_LOGIN,
  PATH_FORBIDDEN,
  PATH_ADMIN_ROOT,
  PATH_ADMIN_TENANTS,
  PATH_TENANT_ROOT,
  PATH_TENANT_USERS,
  PATH_ADMIN_LOGIN,
  PATH_TENANT_LOGIN,
} from './routes';

// 懒加载页面
const LoginPage = () => import('@/pages/admin/login').then((m) => ({ Component: m.default }));
const TenantLoginPage = () => import('@/pages/tenant/login').then((m) => ({ Component: m.default }));
const TenantListPage = () => import('@/pages/admin/tenants/List').then((m) => ({ Component: m.default }));
const TenantDetailPage = () => import('@/pages/admin/tenants/Detail').then((m) => ({ Component: m.default }));
const UserListPage = () => import('@/pages/tenant/users/List').then((m) => ({ Component: m.default }));
const ForbiddenPage = () => import('./ForbiddenPage').then((m) => ({ Component: m.default }));
const NotFoundPage = () => import('./NotFoundPage').then((m) => ({ Component: m.default }));

export const router = createBrowserRouter([
  // 根路由：根据角色重定向
  {
    path: '/',
    element: <RootRedirect />,
  },
  // 登录页
  {
    path: PATH_LOGIN,
    lazy: LoginPage,
  },
  {
    path: PATH_ADMIN_LOGIN,
    lazy: TenantLoginPage,
  },
  {
    path: PATH_TENANT_LOGIN,
    lazy: TenantLoginPage,
  },
  // 超级管理员后台
  {
    path: PATH_ADMIN_ROOT,
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Navigate to="tenants" replace /> },
      { path: 'tenants', lazy: TenantListPage },
      { path: 'tenants/:id', lazy: TenantDetailPage },
    ],
  },
  // 租户管理员后台
  {
    path: PATH_TENANT_ROOT,
    element: (
      <TenantGuard>
        <TenantLayout />
      </TenantGuard>
    ),
    children: [
      { index: true, element: <Navigate to="users" replace /> },
      { path: 'users', lazy: UserListPage },
    ],
  },
  // 错误页
  { path: PATH_FORBIDDEN, lazy: ForbiddenPage },
  { path: '*', lazy: NotFoundPage },
]);

/** 根路由重定向组件 */
function RootRedirect() {
  const token = localStorage.getItem('console_portal_token');
  const role = localStorage.getItem('console_portal_role');
  if (token && role === 'super_admin') {
    return <Navigate to={PATH_ADMIN_TENANTS} replace />;
  }
  if (token && role === 'tenant_admin') {
    return <Navigate to={PATH_TENANT_USERS} replace />;
  }
  return <Navigate to={PATH_LOGIN} replace />;
}

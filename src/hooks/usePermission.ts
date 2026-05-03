import { useAuth } from './useAuth';
import { ROLES } from '@/utils/constants';

/**
 * 检查按钮级别权限
 * @param allowedRoles 允许操作的角色列表
 */
export function usePermission(allowedRoles: string[]) {
  const { role } = useAuth();

  const hasPermission = role ? allowedRoles.includes(role) : false;

  return {
    hasPermission,
    /** 是否超级管理员级别 */
    isSuperAdmin: role === ROLES.SUPER_ADMIN,
    /** 是否租户管理员级别 */
    isTenantAdmin: role === ROLES.TENANT_ADMIN,
  };
}

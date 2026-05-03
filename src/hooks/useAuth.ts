import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/utils/constants';

export function useAuth() {
  const { token, role, user, isAuthenticated, hydrate, login, logout } = useAuthStore();

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isTenantAdmin = role === ROLES.TENANT_ADMIN;

  return {
    token,
    role,
    user,
    isAuthenticated,
    isSuperAdmin,
    isTenantAdmin,
    hydrate,
    login,
    logout,
  };
}

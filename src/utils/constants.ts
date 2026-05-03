/** 用户状态枚举 */
export const USER_STATUS = {
  active: 'active',
  locked: 'locked',
  inactive: 'inactive',
} as const;

export const USER_STATUS_LABELS: Record<string, string> = {
  active: '正常',
  locked: '锁定',
  inactive: '未激活',
};

export const USER_STATUS_COLORS: Record<string, string> = {
  active: 'success',
  locked: 'error',
  inactive: 'warning',
};

/** 授权状态枚举 */
export const AUTH_STATUS = {
  enabled: 'enabled',
  partial: 'partial',
  disabled: 'disabled',
} as const;

export const AUTH_STATUS_LABELS: Record<string, string> = {
  enabled: '已开通',
  partial: '部分开通',
  disabled: '未开通',
};

export const AUTH_STATUS_COLORS: Record<string, string> = {
  enabled: 'success',
  partial: 'warning',
  disabled: 'default',
};

/** 角色枚举 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
} as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

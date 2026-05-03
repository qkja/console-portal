/** 授权状态 */
export type AuthStatus = 'enabled' | 'partial' | 'disabled';

/** 租户信息 */
export interface TenantInfo {
  id: number;
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  description?: string;
  authStatus: AuthStatus;
  createdAt: string;
}

/** 授权项 */
export interface AuthorizationItem {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  enabledAt?: string;
}

/** 创建租户参数 */
export interface CreateTenantParams {
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  description?: string;
  authorizationIds: number[];
}

/** 更新租户参数 */
export interface UpdateTenantParams {
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  description?: string;
}

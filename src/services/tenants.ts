import request from './request';
import type { TenantInfo, CreateTenantParams, AuthorizationItem } from '@/types/tenant';
import type { PaginationParams, PaginatedResponse } from '@/types/api';

/** 查询租户列表 */
export async function getTenantList(params: PaginationParams): Promise<PaginatedResponse<TenantInfo>> {
  return request.get('/api/tenants', { params }) as unknown as PaginatedResponse<TenantInfo>;
}

/** 创建租户 */
export async function createTenant(params: CreateTenantParams): Promise<TenantInfo> {
  return request.post('/api/tenants', params) as unknown as TenantInfo;
}

/** 查询租户详情 */
export async function getTenantDetail(id: number): Promise<TenantInfo> {
  return request.get(`/api/tenants/${id}`) as unknown as TenantInfo;
}

/** 更新租户 */
export async function updateTenant(id: number, params: Partial<CreateTenantParams>): Promise<TenantInfo> {
  return request.put(`/api/tenants/${id}`, params) as unknown as TenantInfo;
}

/** 删除租户 */
export async function deleteTenant(id: number): Promise<void> {
  return request.delete(`/api/tenants/${id}`) as unknown as void;
}

/** 查询租户授权列表 */
export async function getTenantAuthorizations(id: number): Promise<AuthorizationItem[]> {
  return request.get(`/api/tenants/${id}/authorizations`) as unknown as AuthorizationItem[];
}

/** 更新租户授权 */
export async function updateTenantAuthorizations(id: number, authorizationIds: number[]): Promise<void> {
  return request.put(`/api/tenants/${id}/authorizations`, { authorizationIds }) as unknown as void;
}

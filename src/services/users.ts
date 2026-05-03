import request from './request';
import type { UserInfo, CreateUserParams, UpdateUserParams } from '@/types/user';
import type { PaginationParams, PaginatedResponse } from '@/types/api';

/** 查询用户列表 */
export async function getUserList(tenantId: number, params: PaginationParams): Promise<PaginatedResponse<UserInfo>> {
  return request.get(`/api/tenants/${tenantId}/users`, { params }) as unknown as PaginatedResponse<UserInfo>;
}

/** 创建用户 */
export async function createUser(tenantId: number, params: CreateUserParams): Promise<UserInfo> {
  return request.post(`/api/tenants/${tenantId}/users`, params) as unknown as UserInfo;
}

/** 查询用户详情 */
export async function getUserDetail(tenantId: number, userId: number): Promise<UserInfo> {
  return request.get(`/api/tenants/${tenantId}/users/${userId}`) as unknown as UserInfo;
}

/** 更新用户 */
export async function updateUser(tenantId: number, userId: number, params: UpdateUserParams): Promise<UserInfo> {
  return request.put(`/api/tenants/${tenantId}/users/${userId}`, params) as unknown as UserInfo;
}

/** 删除用户 */
export async function deleteUser(tenantId: number, userId: number): Promise<void> {
  return request.delete(`/api/tenants/${tenantId}/users/${userId}`) as unknown as void;
}

/** 锁定/解锁用户 */
export async function toggleUserStatus(tenantId: number, userId: number, status: 'active' | 'locked'): Promise<void> {
  return request.patch(`/api/tenants/${tenantId}/users/${userId}/status`, { status }) as unknown as void;
}

/** 重置用户密码 */
export async function resetUserPassword(tenantId: number, userId: number): Promise<{ newPassword: string }> {
  return request.post(`/api/tenants/${tenantId}/users/${userId}/reset-password`) as unknown as { newPassword: string };
}

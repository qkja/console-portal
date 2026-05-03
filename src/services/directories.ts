import request from './request';
import type { DirectoryInfo, OrgNode, UserGroup } from '@/types/directory';

/** 查询目录列表 */
export async function getDirectoryList(tenantId: number): Promise<DirectoryInfo[]> {
  return request.get(`/api/tenants/${tenantId}/directories`) as unknown as DirectoryInfo[];
}

/** 查询组织架构树 */
export async function getOrgTree(tenantId: number, dirId: number): Promise<OrgNode[]> {
  return request.get(`/api/tenants/${tenantId}/directories/${dirId}/orgs`) as unknown as OrgNode[];
}

/** 查询用户组列表 */
export async function getUserGroupList(tenantId: number, dirId: number, orgId: number): Promise<UserGroup[]> {
  return request.get(`/api/tenants/${tenantId}/directories/${dirId}/orgs/${orgId}/groups`) as unknown as UserGroup[];
}

import request from './request';
import type { TenantInfo, AuthorizationItem } from '@/types/tenant';

// ============================================================
// 后端响应结构
// ============================================================
interface BackendResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

interface BackendTenant {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  status: number;          // 0=已授权, 1=未授权
  authExpireAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface BackendPaginatedData {
  list: BackendTenant[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================
// 字段映射：后端 → 前端
// ============================================================
/**
 * 将后端租户数据映射为前端 TenantInfo 格式
 */
function mapTenant(bt: BackendTenant): TenantInfo {
  return {
    id: Number(bt.id) || 0,
    name: bt.name || '',
    code: '',
    contactName: bt.contactName || '',
    contactPhone: bt.contactPhone || '',
    contactEmail: undefined,
    description: undefined,
    // status: 0=已授权, 1=未授权 → 前端 authStatus: enabled/disabled
    authStatus: bt.status === 0 ? 'enabled' : 'disabled',
    createdAt: bt.createdAt || '',
  };
}

/**
 * 后端有授权字段就映射，没有就用默认值「已开通」（编号 009）
 */
function mapAuthStatus(status: number | undefined | null): TenantInfo['authStatus'] {
  if (status === undefined || status === null) {
    return 'enabled'; // 默认显示「已开通」
  }
  return status === 0 ? 'enabled' : 'disabled';
}

// ============================================================
// API 方法
// ============================================================
const BASE = '/open/api/v1/tenants';

/** 003 — 查询租户列表（分页 + 搜索 + 状态筛选） */
export async function listTenants(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
}): Promise<{ items: TenantInfo[]; total: number; page: number; pageSize: number }> {
  const res = (await request.get(BASE, {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      keyword: params.keyword || undefined,
      status: params.status !== undefined && params.status !== -1 ? params.status : undefined,
    },
  })) as BackendResponse<BackendPaginatedData>;

  if (res.code !== 0) {
    throw new Error(res.message || '查询租户列表失败');
  }

  const data = res.data;
  return {
    items: (data.list || []).map(mapTenant),
    total: data.total || 0,
    page: data.page || 1,
    pageSize: data.pageSize || 10,
  };
}

/** 004 — 创建租户 */
export async function createTenant(data: {
  name: string;
  contactName: string;
  contactPhone: string;
}): Promise<{ id: string }> {
  const res = (await request.post(BASE, {
    name: data.name,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
  })) as BackendResponse<{ id: string }>;

  if (res.code !== 0) {
    throw new Error(res.message || '创建租户失败');
  }
  return res.data;
}

/** 005 — 更新租户 */
export async function updateTenant(
  id: string | number,
  data: {
    name?: string;
    contactName?: string;
    contactPhone?: string;
    authExpireAt?: string;
  },
): Promise<void> {
  const res = (await request.put(`${BASE}/${id}`, data)) as BackendResponse<unknown>;

  if (res.code !== 0) {
    throw new Error(res.message || '更新租户失败');
  }
}

/** 006 — 删除租户 */
export async function deleteTenant(id: string | number): Promise<void> {
  const res = (await request.delete(`${BASE}/${id}`)) as BackendResponse<unknown>;

  if (res.code !== 0) {
    throw new Error(res.message || '删除租户失败');
  }
}

/** 007 — 查询租户详情 */
export async function getTenant(id: string | number): Promise<TenantInfo> {
  const res = (await request.get(`${BASE}/${id}`)) as BackendResponse<BackendTenant>;

  if (res.code !== 0) {
    throw new Error(res.message || '查询租户详情失败');
  }

  const bt = res.data;
  if (!bt) {
    throw new Error('租户不存在');
  }

  return {
    id: Number(bt.id) || Number(id),
    name: bt.name || '',
    code: '',
    contactName: bt.contactName || '',
    contactPhone: bt.contactPhone || '',
    contactEmail: undefined,
    description: undefined,
    authStatus: mapAuthStatus(bt.status),
    createdAt: bt.createdAt || '',
  };
}

/** 查询租户详情（含授权信息）— 因后端只返回基础信息，授权默认显示已开通 */
export async function getTenantDetail(id: string | number): Promise<{
  tenant: TenantInfo;
  auths: AuthorizationItem[];
}> {
  const tenant = await getTenant(id);

  // 后端可能不返回授权字段，默认显示为「已开通」（编号 009）
  const defaultAuths: AuthorizationItem[] = [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: true, enabledAt: undefined },
    { id: 2, name: '报表授权', description: '数据报表', enabled: true, enabledAt: undefined },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: true, enabledAt: undefined },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: true, enabledAt: undefined },
  ];

  return { tenant, auths: defaultAuths };
}

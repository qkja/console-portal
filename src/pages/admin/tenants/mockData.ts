import type { TenantInfo, AuthorizationItem } from '@/types/tenant';
import type { PaginationParams } from '@/types/api';

/** 模拟授权项定义 */
export const MOCK_AUTH_ITEMS: AuthorizationItem[] = [
  { id: 1, name: '用户管理授权', description: '用户模块', enabled: false },
  { id: 2, name: '报表授权', description: '数据报表', enabled: false },
  { id: 3, name: 'API 授权', description: 'API 接入', enabled: false },
  { id: 4, name: '日志审计授权', description: '操作审计', enabled: false },
];

/** 模拟租户数据 */
const MOCK_TENANTS: TenantInfo[] = [
  {
    id: 1,
    name: '示例科技有限公司',
    code: 'tech_corp',
    contactName: '张三',
    contactPhone: '13812345678',
    contactEmail: 'zhangsan@example.com',
    description: '专注于企业SaaS服务',
    authStatus: 'enabled',
    createdAt: '2026-05-01 10:30:00',
  },
  {
    id: 2,
    name: '新锐信息技术公司',
    code: 'xinrui',
    contactName: '李四',
    contactPhone: '13987654321',
    contactEmail: 'lisi@xinrui.com',
    description: '信息技术服务提供商',
    authStatus: 'partial',
    createdAt: '2026-05-02 14:00:00',
  },
  {
    id: 3,
    name: '云端数据有限公司',
    code: 'cloud_data',
    contactName: '王五',
    contactPhone: '13611112222',
    contactEmail: 'wangwu@clouddata.cn',
    description: '大数据分析平台',
    authStatus: 'disabled',
    createdAt: '2026-05-03 09:15:00',
  },
  {
    id: 4,
    name: '智联科技集团',
    code: 'zhilian',
    contactName: '赵六',
    contactPhone: '13733334444',
    contactEmail: 'zhaoliu@zhilian.com',
    authStatus: 'enabled',
    createdAt: '2026-04-28 16:45:00',
  },
  {
    id: 5,
    name: '晨光信息技术有限公司',
    code: 'chenguang',
    contactName: '孙七',
    contactPhone: '13555556666',
    contactEmail: 'sunqi@chenguang.cn',
    description: '信息技术研发与服务',
    authStatus: 'partial',
    createdAt: '2026-04-25 11:20:00',
  },
];

/** 模拟租户授权数据（key=tenantId） */
export const MOCK_TENANT_AUTHS: Record<number, AuthorizationItem[]> = {
  1: [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: true, enabledAt: '2026-05-01 10:30:00' },
    { id: 2, name: '报表授权', description: '数据报表', enabled: true, enabledAt: '2026-05-01 10:30:00' },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: false },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: true, enabledAt: '2026-05-01 10:30:00' },
  ],
  2: [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: true, enabledAt: '2026-05-02 14:00:00' },
    { id: 2, name: '报表授权', description: '数据报表', enabled: false },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: true, enabledAt: '2026-05-02 14:00:00' },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: false },
  ],
  3: [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: false },
    { id: 2, name: '报表授权', description: '数据报表', enabled: false },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: false },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: false },
  ],
  4: [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: true, enabledAt: '2026-04-28 16:45:00' },
    { id: 2, name: '报表授权', description: '数据报表', enabled: true, enabledAt: '2026-04-28 16:45:00' },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: true, enabledAt: '2026-04-28 16:45:00' },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: true, enabledAt: '2026-04-28 16:45:00' },
  ],
  5: [
    { id: 1, name: '用户管理授权', description: '用户模块', enabled: true, enabledAt: '2026-04-25 11:20:00' },
    { id: 2, name: '报表授权', description: '数据报表', enabled: true, enabledAt: '2026-04-25 11:20:00' },
    { id: 3, name: 'API 授权', description: 'API 接入', enabled: false },
    { id: 4, name: '日志审计授权', description: '操作审计', enabled: false },
  ],
};

/** 计算授权状态 */
export function computeAuthStatus(auths: AuthorizationItem[]): TenantInfo['authStatus'] {
  const enabledList = auths.filter((a) => a.enabled);
  if (enabledList.length === 0) return 'disabled';
  if (enabledList.length === auths.length) return 'enabled';
  return 'partial';
}

let nextId = 100;
let tenantsData = [...MOCK_TENANTS];
const authsData: Record<number, AuthorizationItem[]> = {};
Object.entries(MOCK_TENANT_AUTHS).forEach(([k, v]) => {
  authsData[Number(k)] = v.map((item) => ({ ...item }));
});

/** 模拟延迟 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 模拟查询租户列表 */
export async function mockGetTenantList(params: PaginationParams): Promise<{
  items: TenantInfo[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await delay();
  let filtered = [...tenantsData];
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
    );
  }
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((t) => t.authStatus === params.status);
  }
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = filtered.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, page, pageSize };
}

/** 模拟创建租户 */
export async function mockCreateTenant(params: {
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  description?: string;
  authorizationIds: number[];
}): Promise<TenantInfo> {
  await delay(500);
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const id = nextId++;
  const newTenant: TenantInfo = {
    id,
    name: params.name,
    code: params.code,
    contactName: params.contactName,
    contactPhone: params.contactPhone,
    contactEmail: params.contactEmail,
    description: params.description,
    authStatus: 'enabled',
    createdAt: nowStr,
  };
  const newAuths: AuthorizationItem[] = MOCK_AUTH_ITEMS.map((a) => ({
    ...a,
    enabled: params.authorizationIds.includes(a.id),
    enabledAt: params.authorizationIds.includes(a.id) ? nowStr : undefined,
  }));
  tenantsData.unshift(newTenant);
  authsData[id] = newAuths;
  return newTenant;
}

/** 模拟查询租户详情 */
export async function mockGetTenantDetail(id: number): Promise<TenantInfo | undefined> {
  await delay();
  return tenantsData.find((t) => t.id === id);
}

/** 模拟更新租户 */
export async function mockUpdateTenant(
  id: number,
  params: { contactName?: string; contactPhone?: string; contactEmail?: string },
): Promise<void> {
  await delay(300);
  const idx = tenantsData.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error('租户不存在');
  tenantsData[idx] = { ...tenantsData[idx], ...params };
}

/** 模拟更新租户授权 */
export async function mockUpdateAuthorizations(
  id: number,
  authorizationIds: number[],
): Promise<void> {
  await delay(300);
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (authsData[id]) {
    authsData[id] = authsData[id].map((a) => ({
      ...a,
      enabled: authorizationIds.includes(a.id),
      enabledAt: authorizationIds.includes(a.id) ? a.enabledAt || nowStr : undefined,
    }));
  } else {
    authsData[id] = MOCK_AUTH_ITEMS.map((a) => ({
      ...a,
      enabled: authorizationIds.includes(a.id),
      enabledAt: authorizationIds.includes(a.id) ? nowStr : undefined,
    }));
  }
  // Update tenant authStatus
  const idx = tenantsData.findIndex((t) => t.id === id);
  if (idx !== -1) {
    tenantsData[idx].authStatus = computeAuthStatus(authsData[id]);
  }
}

/** 模拟删除租户 */
export async function mockDeleteTenant(id: number): Promise<void> {
  await delay(400);
  tenantsData = tenantsData.filter((t) => t.id !== id);
  delete authsData[id];
}

/** 模拟查询租户授权列表 */
export async function mockGetAuthorizations(id: number): Promise<AuthorizationItem[]> {
  await delay();
  return authsData[id] ? authsData[id].map((a) => ({ ...a })) : MOCK_AUTH_ITEMS.map((a) => ({ ...a }));
}

/** 模拟目录概览数据 */
export interface DirectoryOverview {
  name: string;
  userCount: number;
  isDefault: boolean;
}

export function mockGetDirectoryOverview(tenantId: number): DirectoryOverview[] {
  const counts: Record<number, number> = { 1: 128, 2: 56, 3: 0, 4: 256, 5: 32 };
  return [
    {
      name: '本地目录',
      userCount: counts[tenantId] || 0,
      isDefault: true,
    },
  ];
}

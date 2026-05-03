import type { UserInfo } from '@/types/user';
import type { DirectoryInfo, OrgNode, UserGroup } from '@/types/directory';
import type { PaginationParams } from '@/types/api';

/** 模拟用户数据 */
const MOCK_USERS: UserInfo[] = [
  {
    id: 1,
    username: 'zhangsan',
    realName: '张三',
    phone: '13812345678',
    email: 'zhangsan@example.com',
    organization: '技术部/研发组',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-01 10:00:00',
  },
  {
    id: 2,
    username: 'lisi',
    realName: '李四',
    phone: '13987654321',
    email: 'lisi@example.com',
    organization: '市场部',
    status: 'locked',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-02 14:30:00',
  },
  {
    id: 3,
    username: 'wangwu',
    realName: '王五',
    phone: '13611112222',
    email: 'wangwu@example.com',
    organization: '技术部/研发组',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-03 09:15:00',
  },
  {
    id: 4,
    username: 'zhaoliu',
    realName: '赵六',
    phone: '13733334444',
    email: 'zhaoliu@example.com',
    organization: '技术部/基础架构组',
    status: 'inactive',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-05 16:45:00',
  },
  {
    id: 5,
    username: 'sunqi',
    realName: '孙七',
    phone: '13555556666',
    email: 'sunqi@example.com',
    organization: '人事部',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-08 11:20:00',
  },
  {
    id: 6,
    username: 'zhouba',
    realName: '周八',
    phone: '13477778888',
    email: 'zhouba@example.com',
    organization: '财务部',
    status: 'locked',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-10 08:00:00',
  },
  {
    id: 7,
    username: 'wujiu',
    realName: '吴九',
    phone: '13399990000',
    email: 'wujiu@example.com',
    organization: '技术部/研发组',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-12 15:30:00',
  },
  {
    id: 8,
    username: 'zhengshi',
    realName: '郑十',
    phone: '13211112222',
    email: 'zhengshi@example.com',
    organization: '运营部',
    status: 'inactive',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-15 10:10:00',
  },
  {
    id: 9,
    username: 'chenyi',
    realName: '陈一',
    phone: '13133334444',
    email: 'chenyi@example.com',
    organization: '技术部/研发组',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-18 09:00:00',
  },
  {
    id: 10,
    username: 'liner',
    realName: '林二',
    phone: '13055556666',
    email: 'liner@example.com',
    organization: '销售部',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-20 11:45:00',
  },
  {
    id: 11,
    username: 'huangsan',
    realName: '黄三',
    phone: '15977778888',
    email: 'huangsan@example.com',
    organization: '技术部/基础架构组',
    status: 'locked',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-22 14:00:00',
  },
  {
    id: 12,
    username: 'liusi',
    realName: '刘四',
    phone: '15899990000',
    email: 'liusi@example.com',
    organization: '市场部',
    status: 'active',
    directoryId: 1,
    directoryName: '本地目录',
    createdAt: '2026-04-25 16:30:00',
  },
];

/** 模拟目录数据 */
const MOCK_DIRECTORIES: DirectoryInfo[] = [
  {
    id: 1,
    name: '本地目录',
    description: '默认目录',
    type: 'local',
    userCount: 128,
    createdAt: '2026-04-01 10:00:00',
  },
];

/** 模拟组织架构树 */
const MOCK_ORG_TREE: OrgNode[] = [
  {
    id: 1,
    name: '技术部',
    parentId: null,
    userCount: 50,
    children: [
      { id: 11, name: '研发组', parentId: 1, userCount: 30, children: [] },
      { id: 12, name: '基础架构组', parentId: 1, userCount: 20, children: [] },
    ],
  },
  {
    id: 2,
    name: '市场部',
    parentId: null,
    userCount: 20,
    children: [],
  },
  {
    id: 3,
    name: '销售部',
    parentId: null,
    userCount: 25,
    children: [],
  },
  {
    id: 4,
    name: '人事部',
    parentId: null,
    userCount: 10,
    children: [],
  },
  {
    id: 5,
    name: '财务部',
    parentId: null,
    userCount: 8,
    children: [],
  },
  {
    id: 6,
    name: '运营部',
    parentId: null,
    userCount: 15,
    children: [],
  },
];

/** 模拟用户组 */
const MOCK_USER_GROUPS: Record<number, UserGroup[]> = {
  1: [
    { id: 101, name: '前端组', orgId: 1, userCount: 15 },
    { id: 102, name: '后端组', orgId: 1, userCount: 12 },
    { id: 103, name: '测试组', orgId: 1, userCount: 8 },
  ],
  2: [
    { id: 201, name: '品牌组', orgId: 2, userCount: 5 },
    { id: 202, name: '渠道组', orgId: 2, userCount: 8 },
  ],
  // 其他组织暂无用户组
};

// 可写数据
let usersData = [...MOCK_USERS];
let nextId = 100;

/** 模拟延迟 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 模拟查询目录列表 */
export async function mockGetDirectories(): Promise<DirectoryInfo[]> {
  await delay();
  return [...MOCK_DIRECTORIES];
}

/** 模拟查询组织架构树 */
export async function mockGetOrgTree(directoryId: number): Promise<OrgNode[]> {
  await delay(200);
  return MOCK_ORG_TREE.map((node) => JSON.parse(JSON.stringify(node)));
}

/** 模拟查询用户组 */
export async function mockGetUserGroups(orgId: number): Promise<UserGroup[]> {
  await delay(150);
  return MOCK_USER_GROUPS[orgId] || [];
}

/** 模拟查询用户列表 */
export async function mockGetUserList(params: PaginationParams): Promise<{
  items: UserInfo[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await delay();
  let filtered = [...usersData];
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.username.toLowerCase().includes(q) || u.realName.toLowerCase().includes(q),
    );
  }
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((u) => u.status === params.status);
  }
  const total = filtered.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, page, pageSize };
}

/** 模拟创建用户 */
export async function mockCreateUser(params: {
  username: string;
  realName: string;
  phone: string;
  email: string;
  directoryId: number;
  directoryName: string;
  organization: string;
  orgId?: number;
  groupId?: number;
  password?: string;
}): Promise<UserInfo> {
  await delay(500);
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const id = nextId++;
  const newUser: UserInfo = {
    id,
    username: params.username,
    realName: params.realName,
    phone: params.phone,
    email: params.email,
    organization: params.organization,
    status: 'active',
    directoryId: params.directoryId,
    directoryName: params.directoryName,
    createdAt: nowStr,
  };
  usersData.unshift(newUser);
  return newUser;
}

/** 模拟更新用户 */
export async function mockUpdateUser(
  id: number,
  params: {
    realName: string;
    phone: string;
    email: string;
    organization: string;
    groupId?: number;
  },
): Promise<void> {
  await delay(300);
  const idx = usersData.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('用户不存在');
  usersData[idx] = { ...usersData[idx], ...params };
}

/** 模拟删除用户 */
export async function mockDeleteUser(id: number): Promise<void> {
  await delay(400);
  usersData = usersData.filter((u) => u.id !== id);
}

/** 模拟锁定/解锁用户 */
export async function mockToggleUserStatus(
  id: number,
  newStatus: 'active' | 'locked',
): Promise<void> {
  await delay(200);
  const idx = usersData.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('用户不存在');
  usersData[idx] = { ...usersData[idx], status: newStatus };
}

/** 模拟重置密码 */
export async function mockResetPassword(id: number): Promise<string> {
  await delay(500);
  // 生成随机密码
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

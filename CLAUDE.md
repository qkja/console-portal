# CLAUDE.md — Console Portal 前端技术架构

## 项目概述

多租户管理控制台，包含两个管理界面：
1. **租户用户管理**（`/tenant/users`）— 面向租户管理员，管理本租户内的用户
2. **所有租户管理**（`/admin/tenants`）— 面向超级管理员，管理平台所有租户

## 技术栈

| 层级 | 选型 | 版本 | 选择理由 |
|------|------|:----:|----------|
| 框架 | **React 18 + TypeScript** | ^18.x | 国内后台生态最成熟，Ant Design 原生适配，社区资源和人才丰富 |
| 构建 | **Vite 5** | ^5.x | ESBuild 编译 + Rollup 打包，开发冷启动 < 2s，HMR 即时生效 |
| UI 库 | **Ant Design 5** | ^5.x | 国内管理后台事实标准，Table/Form/Modal 组件开箱即用，完整的中文国际化和主题定制 |
| 状态管理 | **Zustand** | ^4.x | 轻量（~1KB）、无 boilerplate、TypeScript 友好、支持 middleware 持久化和 devtools |
| 路由 | **React Router v6** | ^6.x | 标准 SPA 路由方案，支持嵌套路由、loader/action（数据加载）、路由级 lazy loading |
| 请求 | **axios + @tanstack/react-query** | ^5.x | axios 负责 HTTP 层（拦截器、Token 注入、错误统一处理），react-query 管理服务端状态（缓存、自动重试、乐观更新） |
| 表单 | **Ant Design Form** | — | 与 Ant Design 深度整合，校验规则声明式、无需额外依赖 |
| 国际化 | **react-intl** | ^6.x | 未来扩展多语言支持的基础设施 |
| 代码规范 | **ESLint + Prettier** | — | 统一代码风格，避免低级错误 |
| TypeScript 检查 | **tsc（作为 CI 步骤）** | — | 确保类型安全 |
| 包管理 | **pnpm** | ^8.x | 比 npm/yarn 更快，硬链接复用节省磁盘，严格依赖隔离防止幽灵依赖 |

### 为什么选择这个技术栈

1. **React vs Vue**：虽然 Vue 在国内也有大量用户，但 React 的 TypeScript 类型推导更完整（泛型组件、hook 推导），zustand 的状态管理比 Pinia 更轻量和灵活，且 Ant Design 5 对 React 的原生支持最完善（CSS-in-JS 方案）。
2. **Ant Design 5 vs Element Plus**：Ant Design 5 的 Table 组件在处理复杂表格（多列排序、自定义渲染、行展开）时更强大，Token 级别的主题定制更灵活。且本项目后端 API 风格（Restful + JSON）与 Ant Design Pro 的约定非常匹配。
3. **zustand vs Redux Toolkit / Pinia**：Redux Toolkit 模板代码多，Pinia 只支持 Vue。Zustand 约 1KB，零 boilerplate，TypeScript 全类型推导，且支持 slice 模式管理多个独立 store。
4. **react-query vs 手动管理**：服务端缓存不可避免（列表查询、详情查询），react-query 提供缓存/失效/乐观更新/分页，减少 70% + 的手动状态管理代码。

---

## 🔴 强制规范 — 代码红线

> 以下规范必须严格遵守，违反视为违规。

### R1 — 目录结构规范

项目根目录结构如下（必须遵循）：

```
console-portal/
├── docs/                       # 需求文档
├── src/
│   ├── main.tsx                # 入口
│   ├── App.tsx                 # 根组件（路由配置）
│   ├── vite-env.d.ts
│   │
│   ├── assets/                 # 静态资源
│   │   ├── images/
│   │   └── styles/
│   │       └── global.css      # 全局样式覆盖（尽量少用）
│   │
│   ├── components/             # 全局通用组件
│   │   ├── PageContainer/      # 页面容器（标题 + 面包屑 + 操作栏）
│   │   ├── SearchBar/          # 搜索+筛选条（复用查询与重置逻辑）
│   │   ├── StatusBadge/        # 统一状态标签组件
│   │   ├── ConfirmModal/       # 统一确认弹窗（含输入验证）
│   │   ├── EmptyState/         # 空状态插画
│   │   ├── LoadingSkeleton/    # 骨架屏
│   │   └── index.ts            # barrel 导出
│   │
│   ├── layouts/                # 布局组件
│   │   ├── AdminLayout/        # 超级管理后台布局（侧边栏：租户管理）
│   │   └── TenantLayout/       # 租户管理后台布局（侧边栏：用户管理）
│   │
│   ├── pages/
│   │   ├── admin/              # 🔴 超级管理员页面（路由前缀 /admin）
│   │   │   ├── tenants/        # 所有租户管理
│   │   │   │   ├── List/       # 租户列表页面
│   │   │   │   ├── Detail/     # 租户详情页面
│   │   │   │   └── components/ # 租户页面专用组件（CreateModal、EditAuthModal、DeleteConfirm 等）
│   │   │   └── login/          # 超级管理员登录页
│   │   │
│   │   └── tenant/             # 🔴 租户管理员页面（路由前缀 /tenant）
│   │       ├── users/          # 租户用户管理
│   │       │   ├── List/       # 用户列表页面
│   │       │   └── components/ # 用户页面专用组件（CreateUserModal、EditUserModal、ResetPasswordModal 等）
│   │       └── login/          # 租户管理员登录页
│   │
│   ├── hooks/                  # 自定义 hooks
│   │   ├── useTenantList.ts    # 租户列表查询 hook（封装 react-query）
│   │   ├── useUserList.ts      # 用户列表查询 hook
│   │   ├── useAuth.ts          # 鉴权 hook（获取当前用户信息、角色、是否登录）
│   │   ├── usePermission.ts    # 权限 hook（检查按钮级别权限）
│   │   └── useDirectoryTree.ts # 目录+组织架构树 hook
│   │
│   ├── services/               # API 请求层
│   │   ├── request.ts          # 🔴 统一 axios 实例（见下方 R3）
│   │   ├── tenants.ts          # 租户相关 API
│   │   ├── users.ts            # 用户相关 API
│   │   ├── auth.ts             # 登录/登出/Token 刷新
│   │   └── directories.ts      # 目录+组织架构 API
│   │
│   ├── stores/                 # 前端状态
│   │   ├── authStore.ts        # 鉴权状态（Token、用户信息、角色）
│   │   └── appStore.ts         # 应用级状态（当前选中的租户/目录、侧边栏折叠等）
│   │
│   ├── router/                 # 路由配置
│   │   ├── index.tsx           # 路由总配置（React Router createBrowserRouter）
│   │   ├── guards.ts           # 🔴 路由守卫（鉴权+角色判断）- 见 R2
│   │   └── routes.ts           # 路由声明常量（PATH_ADMIN_TENANTS 等）
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── tenant.ts           # 租户类型（TenantInfo, AuthorizationItem 等）
│   │   ├── user.ts             # 用户类型（UserInfo, UserStatus 等）
│   │   ├── directory.ts        # 目录类型
│   │   └── api.ts              # 通用 API 类型（PaginationParams, PaginatedResponse 等）
│   │
│   └── utils/                  # 工具函数
│       ├── token.ts            # Token 存取（localStorage 封装）
│       ├── format.ts           # 格式化（手机号脱敏、时间格式化）
│       └── constants.ts        # 常量（状态枚举、角色枚举）
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── pnpm-lock.yaml
```

### 🔴 R2 — 鉴权流程（Token → 角色 → 路由 → 页面）

```
前端鉴权闭环：
┌──────────────────────────────────────────────────────┐
│  1. 用户登录                                         │
│     POST /api/auth/login → 返回 { accessToken, role } │
│                                                       │
│  2. 存储 Token + 角色 + 用户信息                      │
│     → localStorage（由 token.ts 统一管理）             │
│     → authStore 同步（zustand）                        │
│                                                       │
│  3. 路由守卫（router/guards.ts）                       │
│     ├─ 无 Token → 重定向到 /login                     │
│     ├─ 有 Token + 角色=super_admin → 允许 admin/*     │
│     ├─ 有 Token + 角色=tenant_admin → 允许 tenant/*   │
│     ├─ 角色不匹配 → 403 页面                          │
│     └─ Token 过期 → 清除 Token → 重定向 /login        │
│                                                       │
│  4. 布局路由（admin/tenant 各一个）                    │
│     ├─ AdminLayout：侧边栏只有“租户管理”               │
│     └─ TenantLayout：侧边栏只有“用户管理”              │
│                                                       │
│  5. 页面级权限（usePermission hook）                   │
│     └─ 控制按钮可见性（如超级管理员才显示“删除租户”）  │
│                                                       │
│  6. axios 拦截器（services/request.ts）                │
│     ├─ request interceptor：注入 Authorization header  │
│     └─ response interceptor：401 → 清除 Token → 跳转  │
└──────────────────────────────────────────────────────┘
```

#### 鉴权规则总结

| 角色 | 可见页面 | 路由前缀 |
|:----:|----------|:--------:|
| `super_admin` | 所有租户管理 + 租户详情 | `/admin/tenants` |
| `tenant_admin` | 租户用户管理 | `/tenant/users` |

### 🔴 R3 — 统一请求封装（services/request.ts）

```typescript
// 伪代码规范——实际实现应遵循此结构

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 Token
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => response.data,      // 剥一层，直接返回 data
  (error) => {
    if (error.response?.status === 401) {
      clearToken();                 // Token 过期 → 清除 → 跳转登录
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期，请重新登录'));
    }
    // 统一错误格式：提取后端返回的 message
    const message = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);
```

#### react-query 使用规范

- 列表查询使用 `useQuery` + `keepPreviousData`（分页时不闪白）
- 增/删/改操作使用 `useMutation` + `queryClient.invalidateQueries` 触发列表刷新
- 乐观更新（如锁定/解锁）使用 `onMutate` 即时更新 UI，回滚用 `onError`
- 查询 key 规范：`['tenants', { page, pageSize, search }]` / `['users', tenantId, { page, search, status }]`

### 🔴 R4 — 组件设计原则

#### 组件分层

```
┌──────────────────────────────────────────┐
│           页面组件（page level）            │
│  pages/admin/tenants/List/index.tsx       │
│  职责：组合业务组件，管理页面状态          │
├──────────────────────────────────────────┤
│         业务组件（feature level）           │
│  pages/admin/tenants/components/          │
│  职责：封装页面内的弹窗/卡片等业务逻辑     │
├──────────────────────────────────────────┤
│         通用组件（shared level）            │
│  components/SearchBar/                    │
│  职责：纯 UI 复用，无业务耦合             │
└──────────────────────────────────────────┘
```

#### 组件设计规则

1. **页面组件只做组合** — 不写大段逻辑，通过 hooks 获取数据、通过业务组件组合视图
2. **业务组件调用 API 需从父级传入 props** — 不直接在业务组件内调用 API hook（便于测试和复用）
3. **每个 Modal 是一个独立组件** — 如 `CreateUserModal.tsx`，暴露 `open`/`onClose`/`onSuccess` props
4. **Table 列定义提取为常量** — 独立的 `columns.ts`，不要写在 render 函数内避免重复创建
5. **状态标签统一用 `StatusBadge`** — 传入 status 值，内部维护颜色映射，不散落在各处
6. **搜索筛选条统一用 `SearchBar`** — 传入 fields 配置数组，自动生成搜索框 + 下拉 + 重置按钮
7. **文件命名** — 组件用 PascalCase，hook 用 camelCase + `use` 前缀，工具函数用 camelCase

### 🔴 R5 — 目录/组件的导入路径规范

```
pages 内的组件：
  import { PageContainer } from '@/components'
  import { useUserList } from '@/hooks/useUserList'

同一 features 内的组件用相对路径：
  import { CreateUserModal } from './components/CreateUserModal'
```

> 配置 `vite.config.ts` 的 `resolve.alias['@'] = path.resolve(__dirname, 'src')`

### 🔴 R6 — 多租户要点

1. **所有 API 路径都包含 tenantId** — 租户用户管理页面的 tenantId 从当前登录用户的租户信息中获取
2. **超级管理员在「所有租户管理」页面操作不同租户** — 每个操作使用该租户的 tenantId
3. **用户搜索/筛选默认使用当前选中目录的 ID** — 目录切换时重新加载用户列表
4. **创建用户时先选择目录，再加载该目录下的组织架构树** — 实现级联选择逻辑
5. **删除租户需要输入租户编码二次确认** — `ConfirmModal` 组件需支持自定义输入验证

---

## 构建部署

### 本地开发

```bash
pnpm install
pnpm dev          # Vite 开发服务器 → http://localhost:5173
```

### 构建

```bash
pnpm build        # → dist/ 目录
```

### 环境变量（.env）

```env
VITE_API_BASE_URL=https://api.example.com    # 后端 API 基础地址
VITE_APP_TITLE=Console Portal                 # 应用标题
```

### CI/CD 流程

```yaml
# GitHub Actions 示意
steps:
  - uses: pnpm/action-setup@v2
  - run: pnpm install
  - run: pnpm run lint          # ESLint 检查
  - run: pnpm run type-check    # tsc --noEmit 类型检查
  - run: pnpm run build         # 构建
  - run: pnpm run test          # 单元测试
  - uses: .../deploy-to-oss     # 部署到 OSS/CDN
```

### 部署架构

```
用户 → CDN（阿里云 OSS + CDN）→ 静态文件（dist/）
                             → API 请求 → openplatformsvr（Go 后端）
```

- 静态资源部署到对象存储（OSS），CDN 加速
- 所有 API 请求代理到后端服务（Vite dev 时通过 proxy 配置，生产由 Nginx/CDN 反向代理）
- SPA 路由使用 `historyApiFallback`（Nginx 配置 `try_files $uri $uri/ /index.html`）

---

## 需求编号与功能对照

| 编号 | 页面 | 功能 | 实现文件 |
|:----:|------|------|----------|
| U01 | 租户用户管理 | 用户列表展示 | `pages/tenant/users/List/index.tsx` |
| U02 | 租户用户管理 | 创建用户 | `pages/tenant/users/components/CreateUserModal.tsx` |
| U03 | 租户用户管理 | 编辑用户 | `pages/tenant/users/components/EditUserModal.tsx` |
| U04 | 租户用户管理 | 删除用户 | `pages/tenant/users/components/DeleteUserConfirm.tsx` |
| U05 | 租户用户管理 | 锁定/解锁用户 | 内联在 List 操作列 |
| U06 | 租户用户管理 | 重置密码 | `pages/tenant/users/components/ResetPasswordModal.tsx` |
| U07 | 租户用户管理 | 用户搜索与状态筛选 | `components/SearchBar` 复用 |
| T01 | 所有租户管理 | 租户列表展示 | `pages/admin/tenants/List/index.tsx` |
| T02 | 所有租户管理 | 创建租户+开通授权 | `pages/admin/tenants/components/CreateTenantModal.tsx` |
| T03 | 所有租户管理 | 编辑租户授权 | `pages/admin/tenants/components/EditAuthModal.tsx` |
| T04 | 所有租户管理 | 删除租户 | `pages/admin/tenants/components/DeleteTenantConfirm.tsx` |
| T05 | 所有租户管理 | 查看租户详情 | `pages/admin/tenants/Detail/index.tsx` |
| T06 | 所有租户管理 | 搜索与授权状态筛选 | `components/SearchBar` 复用 |

---

## 附录

### A. 后端 API 对接清单

| 方法 | 路径 | Service 文件 | 使用页面 |
|:----:|------|:------------:|:--------:|
| GET | `/api/tenants` | `services/tenants.ts` | T01 |
| POST | `/api/tenants` | `services/tenants.ts` | T02 |
| GET | `/api/tenants/{id}` | `services/tenants.ts` | T05 |
| PUT | `/api/tenants/{id}` | `services/tenants.ts` | T03 |
| DELETE | `/api/tenants/{id}` | `services/tenants.ts` | T04 |
| GET | `/api/tenants/{id}/authorizations` | `services/tenants.ts` | T05 |
| PUT | `/api/tenants/{id}/authorizations` | `services/tenants.ts` | T03 |
| GET | `/api/tenants/{tenantId}/users` | `services/users.ts` | U01 |
| POST | `/api/tenants/{tenantId}/users` | `services/users.ts` | U02 |
| GET | `/api/tenants/{tenantId}/users/{userId}` | `services/users.ts` | U03（预填） |
| PUT | `/api/tenants/{tenantId}/users/{userId}` | `services/users.ts` | U03 |
| DELETE | `/api/tenants/{tenantId}/users/{userId}` | `services/users.ts` | U04 |
| PATCH | `/api/tenants/{tenantId}/users/{userId}/status` | `services/users.ts` | U05 |
| POST | `/api/tenants/{tenantId}/users/{userId}/reset-password` | `services/users.ts` | U06 |
| GET | `/api/tenants/{tenantId}/directories` | `services/directories.ts` | U02 |
| GET | `/api/tenants/{tenantId}/directories/{dirId}/orgs` | `services/directories.ts` | U02 |

### B. TypeScript 关键类型

```typescript
// types/tenant.ts
interface TenantInfo {
  id: number;
  name: string;
  code: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  description?: string;
  authStatus: 'enabled' | 'partial' | 'disabled';
  createdAt: string;
}

interface AuthorizationItem {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  enabledAt?: string;
}

// types/user.ts
type UserStatus = 'active' | 'locked' | 'inactive';

interface UserInfo {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  organization: string;     // 格式：目录名/部门名/组名
  status: UserStatus;
  directoryId: number;
  directoryName: string;
  createdAt: string;
}

// types/api.ts
interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### C. 路由规划

```typescript
// 路由结构
const router = createBrowserRouter([
  // 根路由：根据角色重定向
  {
    path: '/',
    element: <RootRedirect />,    // 根据角色跳转到对应 layout
  },
  // 租户管理后台
  {
    path: '/tenant',
    element: <TenantGuard><TenantLayout /></TenantGuard>,
    children: [
      { index: true, element: <Navigate to="users" /> },
      { path: 'users', element: <UserListPage /> },
    ],
  },
  // 超级管理员后台
  {
    path: '/admin',
    element: <AdminGuard><AdminLayout /></AdminGuard>,
    children: [
      { index: true, element: <Navigate to="tenants" /> },
      { path: 'tenants', element: <TenantListPage /> },
      { path: 'tenants/:id', element: <TenantDetailPage /> },
    ],
  },
  // 登录
  { path: '/login', element: <LoginPage /> },
  { path: '/403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```

---

## 🔴 编码交付红线（C9）

**任何代码改动必须遵循以下6步标准流程：**

1. **查需求文档** — 查看 `docs/` 目录下的需求文档，只实现状态表中 `❌ 待实现` 的功能
2. **通读 CLAUDE.md** — 严格遵循本文件的所有规范
3. **代码实现** — 按需求逐条实现
4. **编译验证** — `pnpm run build` 确保编译通过
5. **合规自检** — 对照本文件 🔴 规范逐条检查
6. **提交并推送** — commit message 写明改动内容和原因

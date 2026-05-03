import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Select, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { UserStatus } from '@/types/user';
import type { UserInfo } from '@/types/user';
import type { DirectoryInfo } from '@/types/directory';

import { PageContainer, SearchBar, EmptyState } from '@/components';
import type { SearchField } from '@/components';
import { maskPhone, formatDateTime } from '@/utils/format';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import {
  mockGetUserList,
  mockGetDirectories,
} from '../mockData';

import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal';
import { DeleteUserConfirm } from '../components/DeleteUserConfirm';
import { LockUserConfirm } from '../components/LockUserConfirm';
import { ResetPasswordModal } from '../components/ResetPasswordModal';

/** 用户状态标签颜色映射 */
const STATUS_COLORS: Record<UserStatus, string> = {
  active: 'success',
  locked: 'error',
  inactive: 'warning',
};

const STATUS_LABELS: Record<UserStatus, string> = {
  active: '正常',
  locked: '锁定',
  inactive: '未激活',
};

export default function UserListPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [currentDirId, setCurrentDirId] = useState<number>(1); // 默认本地目录
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserInfo | null>(null);
  const [lockOpen, setLockOpen] = useState(false);
  const [lockUser, setLockUser] = useState<UserInfo | null>(null);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [resetPwdUser, setResetPwdUser] = useState<UserInfo | null>(null);

  // 加载目录列表
  useEffect(() => {
    mockGetDirectories().then((dirs) => {
      setDirectories(dirs);
      if (dirs.length > 0 && !currentDirId) {
        setCurrentDirId(dirs[0].id);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** 加载用户列表 */
  const fetchData = useCallback(
    async (p: number, ps: number, search: Record<string, string>) => {
      setLoading(true);
      try {
        const result = await mockGetUserList({
          page: p,
          pageSize: ps,
          search: search.search || '',
          status: search.status || 'all',
        });
        setUsers(result.items);
        setTotal(result.total);
        setPage(result.page);
      } catch {
        message.error('加载用户列表失败');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 初始化加载
  useEffect(() => {
    fetchData(page, pageSize, searchValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** 日期范围选择（为满足需求文档表头排序，留sorter即可） */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    setPage(newPage);
    setPageSize(newPageSize);
    fetchData(newPage, newPageSize, searchValues);
  };

  /** 搜索 */
  const handleSearch = (values: Record<string, string>) => {
    setSearchValues(values);
    fetchData(1, pageSize, values);
  };

  /** 重置 */
  const handleReset = () => {
    const empty = {};
    setSearchValues(empty);
    fetchData(1, pageSize, empty);
  };

  /** 刷新当前页 */
  const refreshList = () => {
    fetchData(page, pageSize, searchValues);
  };

  /** 目录切换 */
  const handleDirectoryChange = (dirId: number) => {
    setCurrentDirId(dirId);
    // 目录切换时重新加载（实际应根据目录ID加载不同数据）
    setSearchValues({});
    fetchData(1, pageSize, {});
  };

  /** U07 — 搜索与状态筛选 */
  const searchFields: SearchField[] = [
    {
      name: 'search',
      label: '搜索',
      type: 'input',
      placeholder: '用户名/真实姓名',
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      placeholder: '全部',
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'active' },
        { label: '锁定', value: 'locked' },
        { label: '未激活', value: 'inactive' },
      ],
    },
  ];

  /** U01 — 列定义 */
  const columns: ColumnsType<UserInfo> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 130,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => maskPhone(phone),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
      width: 180,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: UserStatus) => (
        <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (time: string) => formatDateTime(time),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_: unknown, record: UserInfo) => (
        <Space>
          {/* U03 — 编辑 */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingUser(record);
              setEditOpen(true);
            }}
          >
            编辑
          </Button>

          {/* U05 — 锁定/解锁 */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              setLockUser(record);
              setLockOpen(true);
            }}
          >
            {record.status === 'locked' ? '解锁' : '锁定'}
          </Button>

          {/* U06 — 重置密码 */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              setResetPwdUser(record);
              setResetPwdOpen(true);
            }}
          >
            重置密码
          </Button>

          {/* U04 — 删除 */}
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              setDeletingUser(record);
              setDeleteOpen(true);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const directoryOptions = directories.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  return (
    <PageContainer
      title="用户管理"
      extra={
        <Space>
          {/* 目录切换器 — 需求文档 2.3.1 */}
          <Select
            value={currentDirId}
            onChange={handleDirectoryChange}
            options={directoryOptions}
            style={{ width: 160 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            新建用户
          </Button>
        </Space>
      }
    >
      {/* U07 — 搜索与状态筛选 */}
      <SearchBar fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      {/* U01 — 用户列表展示 */}
      <Table<UserInfo>
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) =>
            handleTableChange({ current: p, pageSize: ps } as TablePaginationConfig),
        }}
        scroll={{ x: 1300 }}
        locale={{
          emptyText: <EmptyState description="暂无用户数据" />,
        }}
      />

      {/* U02 — 创建用户（弹窗表单） */}
      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refreshList}
      />

      {/* U03 — 编辑用户（弹窗表单） */}
      <EditUserModal
        open={editOpen}
        user={editingUser}
        onClose={() => {
          setEditOpen(false);
          setEditingUser(null);
        }}
        onSuccess={refreshList}
      />

      {/* U04 — 删除用户（确认弹窗） */}
      <DeleteUserConfirm
        open={deleteOpen}
        user={deletingUser}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingUser(null);
        }}
        onSuccess={refreshList}
      />

      {/* U05 — 锁定/解锁用户 */}
      <LockUserConfirm
        open={lockOpen}
        user={lockUser}
        onClose={() => {
          setLockOpen(false);
          setLockUser(null);
        }}
        onSuccess={refreshList}
      />

      {/* U06 — 重置密码 */}
      <ResetPasswordModal
        open={resetPwdOpen}
        user={resetPwdUser}
        onClose={() => {
          setResetPwdOpen(false);
          setResetPwdUser(null);
        }}
      />
    </PageContainer>
  );
}

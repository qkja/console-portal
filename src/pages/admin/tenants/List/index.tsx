import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import { PageContainer, SearchBar, StatusBadge, EmptyState } from '@/components';
import type { SearchField } from '@/components';
import { maskPhone, formatDateTime } from '@/utils/format';
import { AUTH_STATUS_LABELS, AUTH_STATUS_COLORS, DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { listTenants } from '@/services/tenantApi';
import type { TenantInfo } from '@/types/tenant';

import { CreateTenantModal } from '../components/CreateTenantModal';
import { EditAuthModal } from '../components/EditAuthModal';
import { DeleteTenantConfirm } from '../components/DeleteTenantConfirm';
import { useNavigate } from 'react-router-dom';

export default function TenantListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editAuthOpen, setEditAuthOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantInfo | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTenant, setDeletingTenant] = useState<TenantInfo | null>(null);

  /** 加载列表数据 — 调用后端 API */
  const fetchData = useCallback(
    async (p: number, ps: number, search: Record<string, string>) => {
      setLoading(true);
      try {
        // 搜索值映射：前端 authStatus → 后端 status（0=已授权, 1=未授权）
        let statusFilter: number | undefined;
        const authStatus = search.authStatus || 'all';
        if (authStatus === 'enabled') {
          statusFilter = 0;
        } else if (authStatus === 'disabled') {
          statusFilter = 1;
        } else {
          statusFilter = -1; // 全部不过滤
        }

        const result = await listTenants({
          page: p,
          pageSize: ps,
          keyword: search.search || '',
          status: statusFilter,
        });
        setTenants(result.items);
        setTotal(result.total);
        setPage(result.page);
      } catch (err: unknown) {
        // 错误已在 request 拦截器中 Toast，这里不重复提示
        console.error('加载租户列表失败:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 初始化加载 + 分页/搜索变化时加载
  useEffect(() => {
    fetchData(page, pageSize, searchValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  /** 分页变化 */
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    setPage(newPage);
    setPageSize(newPageSize);
    fetchData(newPage, newPageSize, searchValues);
  };

  /** 刷新当前页 */
  const refreshList = () => {
    fetchData(page, pageSize, searchValues);
  };

  const searchFields: SearchField[] = [
    {
      name: 'search',
      label: '搜索',
      type: 'input',
      placeholder: '租户名称',
    },
    {
      name: 'authStatus',
      label: '授权状态',
      type: 'select',
      placeholder: '全部',
      options: [
        { label: '全部', value: 'all' },
        { label: '已开通', value: 'enabled' },
        { label: '未开通', value: 'disabled' },
      ],
    },
  ];

  const columns: ColumnsType<TenantInfo> = [
    {
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130,
      render: (phone: string) => maskPhone(phone),
    },
    {
      title: '授权状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
      width: 110,
      render: (status: string) => (
        <StatusBadge
          status={status}
          labels={AUTH_STATUS_LABELS}
          colors={AUTH_STATUS_COLORS}
        />
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
      width: 260,
      fixed: 'right',
      render: (_: unknown, record: TenantInfo) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingTenant(record);
              setEditAuthOpen(true);
            }}
          >
            编辑授权
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/admin/tenants/${record.id}`)}
          >
            查看详情
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              setDeletingTenant(record);
              setDeleteOpen(true);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="租户管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          新建租户
        </Button>
      }
    >
      {/* T06 — 搜索与授权状态筛选 */}
      <SearchBar fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      {/* T01 — 租户列表展示 */}
      <Table<TenantInfo>
        columns={columns}
        dataSource={tenants}
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
        scroll={{ x: 1000 }}
        locale={{
          emptyText: <EmptyState description="暂无租户数据" />,
        }}
      />

      {/* T02 — 创建租户 */}
      <CreateTenantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refreshList}
      />

      {/* T03 — 编辑授权 */}
      <EditAuthModal
        open={editAuthOpen}
        tenant={editingTenant}
        onClose={() => {
          setEditAuthOpen(false);
          setEditingTenant(null);
        }}
        onSuccess={refreshList}
      />

      {/* T04 — 删除租户 */}
      <DeleteTenantConfirm
        open={deleteOpen}
        tenant={deletingTenant}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingTenant(null);
        }}
        onSuccess={refreshList}
      />
    </PageContainer>
  );
}

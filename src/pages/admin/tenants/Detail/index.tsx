import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Typography,
  Tag,
  Button,
  Space,
  Spin,
  Empty,
  message,
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@/components';
import { maskPhone, formatDateTime, formatDate } from '@/utils/format';
import {
  mockGetTenantDetail,
  mockGetAuthorizations,
  mockGetDirectoryOverview,
} from '../mockData';
import type { TenantInfo, AuthorizationItem } from '@/types/tenant';
import type { DirectoryOverview } from '../mockData';

const { Text } = Typography;

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [auths, setAuths] = useState<AuthorizationItem[]>([]);
  const [directories, setDirectories] = useState<DirectoryOverview[]>([]);

  useEffect(() => {
    if (!id) return;
    const tenantId = Number(id);
    setLoading(true);
    Promise.all([
      mockGetTenantDetail(tenantId),
      mockGetAuthorizations(tenantId),
    ])
      .then(([tenantDetail, authList]) => {
        if (!tenantDetail) {
          message.error('租户不存在');
          navigate('/admin/tenants');
          return;
        }
        setTenant(tenantDetail);
        setAuths(authList);
        setDirectories(mockGetDirectoryOverview(tenantId));
      })
      .catch(() => {
        message.error('加载租户详情失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <PageContainer title="租户详情">
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!tenant) {
    return (
      <PageContainer title="租户详情">
        <Empty description="租户不存在" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/tenants')}
          />
          <span>租户详情</span>
        </Space>
      }
    >
      {/* 基本信息 */}
      <Card
        title={<Text strong>基本信息</Text>}
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="租户名称">{tenant.name}</Descriptions.Item>
          <Descriptions.Item label="租户编码">
            <Text code>{tenant.code}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="联系人">{tenant.contactName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {maskPhone(tenant.contactPhone)}
          </Descriptions.Item>
          <Descriptions.Item label="联系邮箱">
            {tenant.contactEmail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDateTime(tenant.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="租户描述" span={2}>
            {tenant.description || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 授权详情 */}
      <Card
        title={<Text strong>授权详情</Text>}
        extra={
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/tenants?id=${tenant.id}`)}
          >
            编辑授权
          </Button>
        }
        style={{ marginBottom: 16 }}
      >
        {auths.length === 0 ? (
          <Empty description="暂无授权配置" />
        ) : (
          auths.map((auth) => (
            <div
              key={auth.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Space>
                {auth.enabled ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#d9d9d9', fontSize: 18 }} />
                )}
                <div>
                  <Text strong>{auth.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {auth.description}
                  </Text>
                </div>
              </Space>
              <Text
                style={{
                  color: auth.enabled ? '#52c41a' : '#d9d9d9',
                  fontSize: 12,
                }}
              >
                {auth.enabled ? `开通时间：${formatDate(auth.enabledAt!)}` : '未开通'}
              </Text>
            </div>
          ))
        )}
        <div style={{ marginTop: 12 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/tenants?id=${tenant.id}`)}
          >
            编辑授权
          </Button>
        </div>
      </Card>

      {/* 目录概览 */}
      <Card title={<Text strong>目录概览</Text>}>
        {directories.length === 0 ? (
          <Empty description="暂无目录" />
        ) : (
          directories.map((dir, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Space>
                <Text strong>{dir.name}</Text>
                {dir.isDefault && (
                  <Tag color="blue" style={{ marginLeft: 4 }}>
                    默认
                  </Tag>
                )}
              </Space>
              <Text type="secondary">用户数：{dir.userCount}</Text>
            </div>
          ))
        )}
        <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
          （后续可扩展：企微、钉钉、飞书等目录）
        </Text>
      </Card>

      {/* 返回按钮 */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/tenants')}>
          返回租户列表
        </Button>
      </div>
    </PageContainer>
  );
}

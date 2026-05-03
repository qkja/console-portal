import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Typography,
  Button,
  Space,
  Spin,
  Empty,
  message,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@/components';
import { maskPhone, formatDateTime } from '@/utils/format';
import { getTenantDetail } from '@/services/tenantApi';
import type { TenantInfo, AuthorizationItem } from '@/types/tenant';

const { Text } = Typography;

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [auths, setAuths] = useState<AuthorizationItem[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // 调用后端 API 获取租户详情（编号 007）
    getTenantDetail(id)
      .then(({ tenant: tenantDetail, auths: authList }) => {
        if (!tenantDetail) {
          message.error('租户不存在');
          navigate('/admin/tenants');
          return;
        }
        setTenant(tenantDetail);
        setAuths(authList);
      })
      .catch(() => {
        // 错误已在 request 拦截器中 Toast
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
          <Descriptions.Item label="联系人">{tenant.contactName}</Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {maskPhone(tenant.contactPhone || '')}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDateTime(tenant.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 授权详情（编号 009 — 后端不返回授权字段时默认「已开通」） */}
      <Card
        title={<Text strong>授权详情</Text>}
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
                <div>
                  <Text strong>{auth.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {auth.description}
                  </Text>
                </div>
              </Space>
              <Text style={{ color: auth.enabled ? '#52c41a' : '#d9d9d9', fontSize: 12 }}>
                {auth.enabled ? '已开通' : '未开通'}
              </Text>
            </div>
          ))
        )}
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

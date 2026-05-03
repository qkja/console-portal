import { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Typography, Divider, message, Alert } from 'antd';
import { MOCK_AUTH_ITEMS, mockUpdateTenant, mockUpdateAuthorizations, mockGetAuthorizations } from '../mockData';
import type { AuthorizationItem, TenantInfo } from '@/types/tenant';

const { Text } = Typography;

interface EditAuthModalProps {
  open: boolean;
  tenant: TenantInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditAuthModal({ open, tenant, onClose, onSuccess }: EditAuthModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [authItems, setAuthItems] = useState<AuthorizationItem[]>([]);

  useEffect(() => {
    if (open && tenant) {
      // 用 mockGetAuthorizations 获取当前最新授权状态（含运行时变更）
      mockGetAuthorizations(tenant.id).then((tenantAuths) => {
        setAuthItems(tenantAuths);
        form.setFieldsValue({
          contactName: tenant.contactName,
          contactPhone: tenant.contactPhone,
          contactEmail: tenant.contactEmail || '',
          authorizationIds: tenantAuths.filter((a) => a.enabled).map((a) => a.id),
        });
      });
    }
  }, [open, tenant, form]);

  const handleSubmit = async () => {
    if (!tenant) return;
    try {
      const values = await form.validateFields();
      const authIds: number[] = values.authorizationIds || [];
      if (authIds.length === 0) {
        message.warning('至少勾选一项授权');
        return;
      }
      setLoading(true);
      // 更新基础信息
      await mockUpdateTenant(tenant.id, {
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail || undefined,
      });
      // 更新授权
      await mockUpdateAuthorizations(tenant.id, authIds);
      message.success('授权已更新');
      onSuccess();
      onClose();
    } catch {
      // validation error
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="编辑租户授权"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="保存修改"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
      maskClosable={false}
    >
      {tenant && (
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {/* 只读信息 */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginBottom: 16,
              padding: 12,
              background: '#fafafa',
              borderRadius: 6,
            }}
          >
            <div>
              <Text type="secondary">租户名称：</Text>
              <Text strong>{tenant.name}</Text>
            </div>
            <div>
              <Text type="secondary">租户编码：</Text>
              <Text strong>{tenant.code}</Text>
            </div>
          </div>

          {/* 可编辑字段 */}
          <Form.Item
            name="contactName"
            label="联系人"
            rules={[
              { required: true, message: '请输入联系人' },
              { min: 2, max: 20, message: '联系人长度 2~20 个字符' },
            ]}
          >
            <Input placeholder="请输入联系人姓名" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' },
            ]}
          >
            <Input placeholder="请输入11位手机号" maxLength={11} />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder="请输入联系邮箱（选填）" />
          </Form.Item>

          <Divider orientation="left" plain>
            <Text type="secondary">授权配置</Text>
          </Divider>

          <Alert
            message="变更授权会影响该租户下所有用户的系统权限"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="authorizationIds"
            label="授权项"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(new Error('至少勾选一项授权'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              {authItems.map((item: AuthorizationItem) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Checkbox value={item.id} />
                  <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.description}
                    </Text>
                  </div>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

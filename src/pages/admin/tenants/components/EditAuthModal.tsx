import { useState, useEffect } from 'react';
import { Modal, Form, Input, Typography, message } from 'antd';
import { updateTenant } from '@/services/tenantApi';
import type { TenantInfo } from '@/types/tenant';

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

  useEffect(() => {
    if (open && tenant) {
      form.setFieldsValue({
        contactName: tenant.contactName,
        contactPhone: tenant.contactPhone,
        contactEmail: tenant.contactEmail || '',
      });
    }
  }, [open, tenant, form]);

  const handleSubmit = async () => {
    if (!tenant) return;
    try {
      const values = await form.validateFields();
      setLoading(true);
      // 调用后端 API 更新租户信息（编号 005）
      await updateTenant(tenant.id, {
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      });
      message.success('授权已更新');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (!err.message) {
          message.error('编辑授权失败');
        }
      }
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
        </Form>
      )}
    </Modal>
  );
}

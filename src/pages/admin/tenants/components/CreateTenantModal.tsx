import { useState } from 'react';
import { Modal, Form, Input, Checkbox, Typography, Divider, message } from 'antd';
import { MOCK_AUTH_ITEMS, mockCreateTenant } from '../mockData';
import type { AuthorizationItem } from '@/types/tenant';

const { TextArea } = Input;
const { Text } = Typography;

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTenantModal({ open, onClose, onSuccess }: CreateTenantModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const authIds: number[] = values.authorizationIds || [];
      if (authIds.length === 0) {
        message.warning('请至少勾选一项授权');
        return;
      }
      setLoading(true);
      await mockCreateTenant({
        name: values.name,
        code: values.code,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail || undefined,
        description: values.description || undefined,
        authorizationIds: authIds,
      });
      message.success('租户创建成功');
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      // validation error, handled by form
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
      title="新建租户"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="确认创建"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* 基础信息 */}
        <Form.Item
          name="name"
          label="租户名称"
          rules={[
            { required: true, message: '请输入租户名称' },
            { min: 2, max: 50, message: '租户名称长度 2~50 个字符' },
          ]}
        >
          <Input placeholder="请输入租户名称" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="code"
          label="租户编码"
          rules={[
            { required: true, message: '请输入租户编码' },
            { pattern: /^[a-zA-Z0-9_]{3,32}$/, message: '3~32 位字母数字组合' },
          ]}
        >
          <Input placeholder="请输入租户编码（字母数字组合）" maxLength={32} />
        </Form.Item>

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

        <Form.Item
          name="description"
          label="租户描述"
          rules={[{ max: 500, message: '描述不超过 500 个字符' }]}
        >
          <TextArea placeholder="请输入租户描述（选填）" rows={2} maxLength={500} showCount />
        </Form.Item>

        <Divider orientation="left" plain>
          <Text type="secondary">授权配置</Text>
        </Divider>

        {/* 授权配置 */}
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
            {MOCK_AUTH_ITEMS.map((item: AuthorizationItem) => (
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
    </Modal>
  );
}

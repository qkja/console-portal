import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createTenant } from '@/services/tenantApi';

const { TextArea } = Input;

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
      setLoading(true);
      // 调用后端 API 创建租户
      await createTenant({
        name: values.name,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      });
      message.success('租户创建成功');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      // validation error (no catch message), or API error
      if (err instanceof Error) {
        // API 错误已在 request 拦截器中 Toast，这里只做 fallback
        if (!err.message) {
          message.error('创建租户失败');
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
      </Form>
    </Modal>
  );
}

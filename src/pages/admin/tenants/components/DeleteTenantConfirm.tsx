import { useState } from 'react';
import { Modal, Typography, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { mockDeleteTenant } from '../mockData';
import type { TenantInfo } from '@/types/tenant';

const { Text, Paragraph } = Typography;

interface DeleteTenantConfirmProps {
  open: boolean;
  tenant: TenantInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteTenantConfirm({ open, tenant, onClose, onSuccess }: DeleteTenantConfirmProps) {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!tenant) return;
    if (inputCode !== tenant.code) {
      message.error('输入的租户编码不正确');
      return;
    }
    setLoading(true);
    try {
      await mockDeleteTenant(tenant.id);
      message.success('租户已删除');
      setInputCode('');
      onSuccess();
      onClose();
    } catch {
      message.error('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInputCode('');
    onClose();
  };

  const isCodeMatch = inputCode === tenant?.code;

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          确认删除租户
        </span>
      }
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确认删除"
      cancelText="取消"
      confirmLoading={loading}
      okButtonProps={{
        danger: true,
        disabled: !isCodeMatch,
      }}
      width={520}
      maskClosable={false}
    >
      {tenant && (
        <>
          <Paragraph>
            <Text>
              确定要删除租户「<Text strong>{tenant.name}</Text>」及其所有数据吗？
            </Text>
          </Paragraph>

          <div
            style={{
              background: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: 6,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text type="danger" style={{ fontWeight: 500 }}>
              ⚠ 此操作不可撤销！
            </Text>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: '#ff4d4f' }}>
              <li>所有用户及权限</li>
              <li>所有组织架构数据</li>
              <li>所有授权配置</li>
              <li>操作日志记录</li>
            </ul>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              请输入租户编码 <Text code>{tenant.code}</Text> 确认删除：
            </Text>
            <Input
              style={{ marginTop: 8 }}
              placeholder={`请输入 ${tenant.code}`}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onPressEnter={() => {
                if (isCodeMatch) handleConfirm();
              }}
            />
          </div>
        </>
      )}
    </Modal>
  );
}

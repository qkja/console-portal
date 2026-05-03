import { useState } from 'react';
import { Modal, Typography, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteTenant } from '@/services/tenantApi';
import type { TenantInfo } from '@/types/tenant';

const { Text } = Typography;

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
    // 保持原有的二次确认逻辑（输入租户编码）
    if (!tenant.code) {
      // 如果后端没有返回 code，直接用 tenant.name 确认
      if (inputCode !== tenant.name) {
        message.error('输入的租户名称不正确');
        return;
      }
    } else if (inputCode !== tenant.code) {
      message.error('输入的租户编码不正确');
      return;
    }
    setLoading(true);
    try {
      // 调用后端 API 删除租户（编号 006）
      await deleteTenant(tenant.id);
      message.success('租户已删除');
      setInputCode('');
      onSuccess();
      onClose();
    } catch {
      // 错误已在 request 拦截器中 Toast
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInputCode('');
    onClose();
  };

  const codeToMatch = tenant?.code || tenant?.name || '';
  const isCodeMatch = inputCode === codeToMatch;

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
              请输入租户编码 <Text code>{codeToMatch}</Text> 确认删除：
            </Text>
            <Input
              style={{ marginTop: 8 }}
              placeholder={`请输入 ${codeToMatch}`}
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

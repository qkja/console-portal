import { useState } from 'react';
import { Modal, Typography, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { mockResetPassword } from '../mockData';
import type { UserInfo } from '@/types/user';

const { Text, Paragraph } = Typography;

interface ResetPasswordModalProps {
  open: boolean;
  user: UserInfo | null;
  onClose: () => void;
}

export function ResetPasswordModal({ open, user, onClose }: ResetPasswordModalProps) {
  const [step, setStep] = useState<'confirm' | 'result'>('confirm');
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // 重置状态
  const handleClose = () => {
    setStep('confirm');
    setNewPassword('');
    onClose();
  };

  // 确认重置
  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const password = await mockResetPassword(user.id);
      setNewPassword(password);
      setStep('result');
      message.success('密码重置成功');
    } catch {
      message.error('重置密码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Step 1: 二次确认 */}
      <Modal
        title={
          <span>
            <KeyOutlined style={{ color: '#faad14', marginRight: 8 }} />
            重置密码
          </span>
        }
        open={open && step === 'confirm'}
        onOk={handleConfirm}
        onCancel={handleClose}
        okText="确认重置"
        cancelText="取消"
        confirmLoading={loading}
        width={480}
        maskClosable={false}
      >
        <Paragraph style={{ margin: '16px 0' }}>
          <Text>
            将为用户「<Text strong>{user.realName}</Text>」重置密码。重置后请及时通知用户修改密码。
          </Text>
        </Paragraph>
      </Modal>

      {/* Step 2: 显示新密码（一次性展示） */}
      <Modal
        title={
          <span>
            <KeyOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            密码重置成功
          </span>
        }
        open={open && step === 'result'}
        onOk={handleClose}
        onCancel={handleClose}
        okText="我知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
        width={480}
        maskClosable={false}
        closable={false}
      >
        <div style={{ margin: '16px 0', textAlign: 'center' }}>
          <Text type="secondary">新密码</Text>
          <div
            style={{
              margin: '12px auto',
              padding: '16px 24px',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: 6,
              fontSize: 20,
              fontWeight: 600,
              fontFamily: 'monospace',
              letterSpacing: 2,
              color: '#52c41a',
              display: 'inline-block',
            }}
          >
            {newPassword}
          </div>
          <div style={{ marginTop: 8 }}>
            <Text type="warning">
              请及时告知用户并修改密码。此密码仅在此显示一次，关闭后将无法再次查看。
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
}

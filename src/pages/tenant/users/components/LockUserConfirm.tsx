import { useState } from 'react';
import { Modal, Typography, message } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { mockToggleUserStatus } from '../mockData';
import type { UserInfo } from '@/types/user';

const { Text, Paragraph } = Typography;

interface LockUserConfirmProps {
  open: boolean;
  user: UserInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function LockUserConfirm({ open, user, onClose, onSuccess }: LockUserConfirmProps) {
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const isCurrentlyLocked = user.status === 'locked';
  const titleText = isCurrentlyLocked ? '解锁用户' : '锁定用户';
  const confirmText = isCurrentlyLocked ? '确认解锁' : '确认锁定';
  const description = isCurrentlyLocked
    ? `确定要解锁用户「${user.realName}」吗？解锁后用户可正常登录。`
    : `确定要锁定用户「${user.realName}」吗？锁定后用户将无法登录系统。`;
  const icon = isCurrentlyLocked ? (
    <UnlockOutlined style={{ color: '#52c41a', marginRight: 8 }} />
  ) : (
    <LockOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
  );

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newStatus = isCurrentlyLocked ? 'active' : 'locked';
      await mockToggleUserStatus(user.id, newStatus);
      message.success(isCurrentlyLocked ? '已解锁' : '已锁定');
      onSuccess();
      onClose();
    } catch {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title={
        <span>
          {icon}
          {titleText}
        </span>
      }
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText={confirmText}
      cancelText="取消"
      confirmLoading={loading}
      okButtonProps={{ danger: !isCurrentlyLocked }}
      width={480}
      maskClosable={false}
    >
      <Paragraph style={{ margin: '16px 0' }}>
        <Text>{description}</Text>
      </Paragraph>
    </Modal>
  );
}

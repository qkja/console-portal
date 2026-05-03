import { useState } from 'react';
import { Modal, Typography, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { mockDeleteUser } from '../mockData';
import type { UserInfo } from '@/types/user';

const { Text, Paragraph } = Typography;

interface DeleteUserConfirmProps {
  open: boolean;
  user: UserInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteUserConfirm({ open, user, onClose, onSuccess }: DeleteUserConfirmProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await mockDeleteUser(user.id);
      message.success('删除成功');
      onSuccess();
      onClose();
    } catch {
      message.error('删除失败，请重试');
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
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          确认删除用户
        </span>
      }
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确认删除"
      cancelText="取消"
      confirmLoading={loading}
      okButtonProps={{ danger: true }}
      width={480}
      maskClosable={false}
    >
      {user && (
        <Paragraph style={{ margin: '16px 0' }}>
          <Text>
            确定要删除用户「<Text strong>{user.realName}</Text>」吗？此操作不可撤销。
          </Text>
        </Paragraph>
      )}
    </Modal>
  );
}

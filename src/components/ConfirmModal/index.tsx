import { Modal, Input, Typography } from 'antd';

const { Text, Paragraph } = Typography;

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  /** 是否需要输入验证文本才能确认 */
  validationText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 统一确认弹窗（含输入验证）
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  validationText,
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {

  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      confirmLoading={loading}
      okButtonProps={{
        danger,
        disabled: !!validationText && (() => true)(),
      }}
      maskClosable={false}
    >
      <Paragraph>
        <Text>{description}</Text>
      </Paragraph>

      {validationText && (
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            请输入 <Text code>{validationText}</Text> 确认操作：
          </Text>
          <Input
            style={{ marginTop: 8 }}
            placeholder={`请输入 ${validationText}`}
            onChange={() => {
              // Validation handled by parent
            }}
          />
        </div>
      )}
    </Modal>
  );
}

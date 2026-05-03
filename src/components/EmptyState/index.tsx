import { Empty, Typography } from 'antd';

const { Text } = Typography;

interface EmptyStateProps {
  description?: string;
}

/**
 * 空状态插画
 */
export function EmptyState({ description = '暂无数据' }: EmptyStateProps) {
  return (
    <div style={{ padding: '48px 0' }}>
      <Empty description={<Text type="secondary">{description}</Text>} />
    </div>
  );
}

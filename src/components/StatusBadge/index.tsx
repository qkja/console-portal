import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
  labels: Record<string, string>;
  colors: Record<string, string>;
}

/**
 * 统一状态标签组件
 */
export function StatusBadge({ status, labels, colors }: StatusBadgeProps) {
  const color = colors[status] || 'default';
  const label = labels[status] || status;
  return <Tag color={color}>{label}</Tag>;
}

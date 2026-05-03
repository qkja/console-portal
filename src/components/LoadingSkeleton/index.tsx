import { Skeleton } from 'antd';

interface LoadingSkeletonProps {
  rows?: number;
}

/**
 * 骨架屏（表格加载时使用）
 */
export function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <div style={{ padding: 16 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          active
          title={false}
          paragraph={{ rows: 1, width: ['100%'] }}
          style={{ marginBottom: 12 }}
        />
      ))}
    </div>
  );
}

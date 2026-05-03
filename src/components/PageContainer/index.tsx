import type { ReactNode } from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface PageContainerProps {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
}

/**
 * 页面容器（标题 + 面包屑 + 操作栏 + 内容区）
 */
export function PageContainer({ title, extra, children }: PageContainerProps) {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {extra && <div>{extra}</div>}
      </div>
      <Card>{children}</Card>
    </div>
  );
}

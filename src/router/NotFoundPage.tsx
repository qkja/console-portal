import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_LOGIN } from './routes';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => navigate(PATH_LOGIN)}>
          返回登录页
        </Button>
      }
    />
  );
}

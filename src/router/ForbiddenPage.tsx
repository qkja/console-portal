import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH_LOGIN } from './routes';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面。"
      extra={
        <Button type="primary" onClick={() => navigate(PATH_LOGIN)}>
          返回登录页
        </Button>
      }
    />
  );
}

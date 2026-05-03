import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/utils/constants';
import { PATH_TENANT_USERS } from '@/router/routes';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export default function TenantLoginPage() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await login(values);
      setAuth(result.accessToken, result.role, result.user);

      if (result.role === ROLES.TENANT_ADMIN) {
        navigate(PATH_TENANT_USERS, { replace: true });
      } else {
        message.warning('此用户无租户管理权限');
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <TeamOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 8 }} />
          <Title level={3}>租户管理</Title>
          <Text type="secondary">租户管理员登录</Text>
        </div>
        <Form<LoginFormValues>
          onFinish={handleLogin}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

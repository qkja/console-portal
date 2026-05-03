import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, Cascader, message } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import type { DirectoryInfo, OrgNode, UserGroup } from '@/types/directory';
import { mockGetDirectories, mockGetOrgTree, mockGetUserGroups, mockCreateUser } from '../mockData';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** 将组织架构树转换为级联选择器格式 */
function transformOrgTree(nodes: OrgNode[]): DefaultOptionType[] {
  return nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.children.length > 0 ? transformOrgTree(node.children) : undefined,
  }));
}

export function CreateUserModal({ open, onClose, onSuccess }: CreateUserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
  const [orgTree, setOrgTree] = useState<DefaultOptionType[]>(
    [],
  );
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  // 打开时加载目录列表
  useEffect(() => {
    if (open) {
      mockGetDirectories().then(setDirectories);
    }
  }, [open]);

  // 选择目录时加载组织架构树
  const handleDirectoryChange = useCallback(
    async (directoryId: number) => {
      form.setFieldsValue({ orgId: undefined, groupId: undefined });
      setUserGroups([]);
      if (directoryId) {
        const tree = await mockGetOrgTree(directoryId);
        setOrgTree(transformOrgTree(tree));
      } else {
        setOrgTree([]);
      }
    },
    [form],
  );

  // 选择组织时加载用户组
  const handleOrgChange = useCallback(
    async (orgIds: number[]) => {
      form.setFieldsValue({ groupId: undefined });
      if (orgIds && orgIds.length > 0) {
        const lastOrgId = orgIds[orgIds.length - 1];
        const groups = await mockGetUserGroups(lastOrgId);
        setUserGroups(groups);
      } else {
        setUserGroups([]);
      }
    },
    [form],
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 获取目录名
      const dir = directories.find((d) => d.id === values.directoryId);

      // 获取组织路径（构建 organization 字段）
      let organization = '';
      if (values.orgId) {
        // 从级联选择器获取完整路径标签
        const pathLabels = values._orgLabels || [];
        organization = pathLabels.join('/');
      }

      await mockCreateUser({
        username: values.username,
        realName: values.realName,
        phone: values.phone,
        email: values.email,
        directoryId: values.directoryId,
        directoryName: dir?.name || '本地目录',
        organization,
        password: values.password || undefined,
      });

      message.success('创建成功');
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      // validation error, handled by form
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="新建用户"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      width={560}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { pattern: /^[a-zA-Z0-9_]{3,32}$/, message: '3~32 位字母数字下划线组合' },
          ]}
        >
          <Input placeholder="请输入用户名" maxLength={32} />
        </Form.Item>

        <Form.Item
          name="realName"
          label="真实姓名"
          rules={[
            { required: true, message: '请输入真实姓名' },
            { min: 2, max: 20, message: '2~20 个字符' },
          ]}
        >
          <Input placeholder="请输入真实姓名" maxLength={20} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' },
          ]}
        >
          <Input placeholder="请输入11位手机号" maxLength={11} />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="directoryId"
          label="所属目录"
          rules={[{ required: true, message: '请选择所属目录' }]}
        >
          <Select
            placeholder="请选择目录"
            options={directories.map((d) => ({ label: d.name, value: d.id }))}
            onChange={handleDirectoryChange}
          />
        </Form.Item>

        <Form.Item
          name={['_orgIds']}
          label="所属组织"
          rules={[{ required: true, message: '请选择所属组织' }]}
        >
          <Cascader
            placeholder="请选择组织"
            options={orgTree}
            expandTrigger="hover"
            displayRender={(label: string[]) => {
              // Store labels for building organization string
              form.setFieldsValue({ _orgLabels: label });
              return label.join(' / ');
            }}
            onChange={(value: any, selectedOptions: any) => {
              form.setFieldsValue({ orgId: value });
              handleOrgChange(value);
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="groupId" label="所属用户组">
          <Select
            placeholder="请选择用户组（选填）"
            options={userGroups.map((g) => ({ label: g.name, value: g.id }))}
            allowClear
            disabled={userGroups.length === 0}
          />
        </Form.Item>

        <Form.Item name="password" label="初始密码">
          <Input.Password
            placeholder="不填则生成随机密码"
            maxLength={32}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

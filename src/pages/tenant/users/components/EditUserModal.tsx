import { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, Cascader, message } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import type { DirectoryInfo, OrgNode, UserGroup } from '@/types/directory';
import type { UserInfo } from '@/types/user';
import { mockGetDirectories, mockGetOrgTree, mockGetUserGroups, mockUpdateUser } from '../mockData';

interface EditUserModalProps {
  open: boolean;
  user: UserInfo | null;
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

export function EditUserModal({ open, user, onClose, onSuccess }: EditUserModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
  const [orgTree, setOrgTree] = useState<DefaultOptionType[]>(
    [],
  );
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  // 打开时加载目录列表和组织架构树
  useEffect(() => {
    if (open && user) {
      mockGetDirectories().then(setDirectories);
      mockGetOrgTree(user.directoryId).then((tree) => {
        setOrgTree(transformOrgTree(tree));
      });
    }
  }, [open, user]);

  // 预填表单数据
  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        username: user.username,
        realName: user.realName,
        phone: user.phone,
        email: user.email,
        directoryId: user.directoryId,
      });
    }
  }, [open, user, form]);

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
    if (!user) return;
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 获取组织路径
      let organization = '';
      if (values._orgIds) {
        const labels = values._orgLabels || [];
        organization = labels.join('/');
      } else {
        organization = values.organization || user.organization;
      }

      await mockUpdateUser(user.id, {
        realName: values.realName,
        phone: values.phone,
        email: values.email,
        organization,
      });

      message.success('更新成功');
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
      title="编辑用户"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={560}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* 用户名 — 灰化不可编辑 */}
        <Form.Item name="username" label="用户名">
          <Input disabled style={{ color: '#999', cursor: 'not-allowed' }} />
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
          name={['_orgIds']}
          label="所属组织"
          rules={[{ required: true, message: '请选择所属组织' }]}
        >
          <Cascader
            placeholder="请选择组织"
            options={orgTree}
            expandTrigger="hover"
            displayRender={(label: string[]) => {
              form.setFieldsValue({ _orgLabels: label });
              return label.join(' / ');
            }}
            onChange={(value: any) => {
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
      </Form>
    </Modal>
  );
}

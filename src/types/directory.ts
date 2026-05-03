/** 目录信息 */
export interface DirectoryInfo {
  id: number;
  name: string;
  description?: string;
  type: 'local' | 'wecom' | 'dingtalk' | 'feishu';
  userCount: number;
  createdAt: string;
}

/** 组织架构节点 */
export interface OrgNode {
  id: number;
  name: string;
  parentId: number | null;
  children: OrgNode[];
  userCount: number;
}

/** 用户组 */
export interface UserGroup {
  id: number;
  name: string;
  orgId: number;
  userCount: number;
}

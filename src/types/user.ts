/** 用户状态 */
export type UserStatus = 'active' | 'locked' | 'inactive';

/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  organization: string;
  status: UserStatus;
  directoryId: number;
  directoryName: string;
  createdAt: string;
}

/** 创建用户参数 */
export interface CreateUserParams {
  username: string;
  realName: string;
  phone: string;
  email: string;
  directoryId: number;
  orgId?: number;
  groupId?: number;
  password?: string;
}

/** 更新用户参数 */
export interface UpdateUserParams {
  realName: string;
  phone: string;
  email: string;
  orgId?: number;
  groupId?: number;
}

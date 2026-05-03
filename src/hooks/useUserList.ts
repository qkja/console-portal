import { useQuery } from '@tanstack/react-query';
import { getUserList } from '@/services/users';
import type { PaginationParams } from '@/types/api';

/**
 * 用户列表查询 hook（封装 react-query）
 */
export function useUserList(tenantId: number, params: PaginationParams) {
  return useQuery({
    queryKey: ['users', tenantId, params],
    queryFn: () => getUserList(tenantId, params),
    placeholderData: (prev) => prev,
  });
}

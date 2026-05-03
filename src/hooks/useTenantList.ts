import { useQuery } from '@tanstack/react-query';
import { getTenantList } from '@/services/tenants';
import type { PaginationParams } from '@/types/api';

/**
 * 租户列表查询 hook（封装 react-query）
 */
export function useTenantList(params: PaginationParams) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => getTenantList(params),
    placeholderData: (prev) => prev,
  });
}

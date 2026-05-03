import { useQuery } from '@tanstack/react-query';
import { getDirectoryList, getOrgTree } from '@/services/directories';

/**
 * 获取目录列表 hook
 */
export function useDirectoryList(tenantId: number | null) {
  return useQuery({
    queryKey: ['directories', tenantId],
    queryFn: () => getDirectoryList(tenantId!),
    enabled: !!tenantId,
  });
}

/**
 * 获取组织架构树 hook
 */
export function useOrgTree(tenantId: number | null, dirId: number | null) {
  return useQuery({
    queryKey: ['orgs', tenantId, dirId],
    queryFn: () => getOrgTree(tenantId!, dirId!),
    enabled: !!tenantId && !!dirId,
  });
}

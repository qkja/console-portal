/** 分页查询参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 通用 API 响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

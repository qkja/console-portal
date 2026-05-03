import { create } from 'zustand';

interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 当前选中的目录 ID（租户用户管理用） */
  currentDirectoryId: number | null;
  /** 当前选中的租户 ID（超级管理员查看租户详情用） */
  currentTenantId: number | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentDirectoryId: (id: number | null) => void;
  setCurrentTenantId: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentDirectoryId: null,
  currentTenantId: null,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentDirectoryId: (id) => set({ currentDirectoryId: id }),
  setCurrentTenantId: (id) => set({ currentTenantId: id }),
}));

const TOKEN_KEY = 'console_portal_token';
const ROLE_KEY = 'console_portal_role';
const USER_KEY = 'console_portal_user';
const TENANT_INFO_KEY = 'console_portal_tenant';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TENANT_INFO_KEY);
}

export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}

export function setRole(role: string): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function getUser(): Record<string, unknown> | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user: Record<string, unknown>): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getTenantInfo(): Record<string, unknown> | null {
  const raw = localStorage.getItem(TENANT_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setTenantInfo(info: Record<string, unknown>): void {
  localStorage.setItem(TENANT_INFO_KEY, JSON.stringify(info));
}

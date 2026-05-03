/**
 * 手机号脱敏：保留前3位和后4位，中间4位用星号代替
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone || '';
  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}

/**
 * 格式化日期为 YYYY-MM-DD HH:mm
 */
export function formatDateTime(dateStr: string | Date): string {
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(dateStr: string | Date): string {
  const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

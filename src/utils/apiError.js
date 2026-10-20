export function parseApiError(err) {
  const detail = err?.response?.data?.detail ?? err?.message ?? 'Terjadi kesalahan';
  if (Array.isArray(detail)) {
    return detail.map(d => d.msg).join(', ');
  }
  return String(detail);
}
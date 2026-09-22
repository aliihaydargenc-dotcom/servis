export const fmt = {
  number(value, max = 1) {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: max }).format(value);
  },
  time(value) {
    return new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  },
  dateTime(value) {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }
};

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

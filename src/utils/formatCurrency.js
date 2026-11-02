/**
 * Formats a number to Ugandan Shillings (UGX) currency string
 * e.g., 25000 -> "UGX 25,000"
 * @param {number|string} amount 
 * @param {boolean} [showSymbol=true] 
 * @returns {string}
 */
export function formatCurrency(amount, showSymbol = true) {
  const numericAmount = Number(amount) || 0;
  const formatted = Math.round(numericAmount).toLocaleString('en-US');
  return showSymbol ? `UGX ${formatted}` : formatted;
}

/**
 * Format date to standard restaurant format: '12 Nov 2026' or with time '12 Nov 2026, 02:45 PM'
 * @param {string|Date} dateInput 
 * @param {boolean} [includeTime=false] 
 * @returns {string}
 */
export function formatDate(dateInput, includeTime = false) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
  };
  return d.toLocaleDateString('en-GB', options);
}

/**
 * Format relative time (e.g., "5 mins ago", "Just now")
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}


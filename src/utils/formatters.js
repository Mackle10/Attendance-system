/**
 * formatters.js
 * Utility functions for formatting dates, currency, percentages, etc.
 */

// ── Date Formatting ────────────────────────────────────────────────────────

/**
 * Format a date to a readable string.
 * @param {Date|string} date
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string}
 */
export function formatDate(date, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

/**
 * Format a date to time string (e.g. "09:30 AM")
 * @param {Date|string} date
 * @returns {string}
 */
export function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

/**
 * Format date and time together
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(date))
}

/**
 * Get relative time string (e.g. "2 hours ago", "in 3 days")
 * @param {Date|string} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffMs = new Date(date) - new Date()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr  = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHr / 24)

  if (Math.abs(diffSec) < 60)  return rtf.format(diffSec, 'second')
  if (Math.abs(diffMin) < 60)  return rtf.format(diffMin, 'minute')
  if (Math.abs(diffHr)  < 24)  return rtf.format(diffHr,  'hour')
  return rtf.format(diffDay, 'day')
}

// ── Currency ───────────────────────────────────────────────────────────────

/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} currency - ISO 4217 code, e.g. 'USD', 'KES', 'EUR'
 * @param {string} locale
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// ── Numbers & Percentages ──────────────────────────────────────────────────

/**
 * Format a number with commas (e.g. 1234567 → "1,234,567")
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format a decimal as a percentage (e.g. 0.85 → "85%")
 * @param {number} value  - decimal between 0 and 1
 * @param {number} digits - decimal places
 * @returns {string}
 */
export function formatPercent(value, digits = 1) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

// ── Text ───────────────────────────────────────────────────────────────────

/**
 * Capitalise first letter of every word.
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Truncate a string to maxLength with an ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}…`
}

/**
 * Get initials from a full name (e.g. "John Doe" → "JD")
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '??'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

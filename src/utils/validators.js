/**
 * validators.js
 * Reusable form validation helpers.
 * Each function returns { valid: boolean, message: string }.
 */

/**
 * Validate an email address.
 */
export function validateEmail(value) {
  if (!value) return { valid: false, message: 'Email is required' }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value)
    ? { valid: true, message: '' }
    : { valid: false, message: 'Please enter a valid email address' }
}

/**
 * Validate a password (min 8 chars, 1 uppercase, 1 digit).
 */
export function validatePassword(value) {
  if (!value) return { valid: false, message: 'Password is required' }
  if (value.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }
  if (!/[A-Z]/.test(value)) return { valid: false, message: 'Password must contain at least one uppercase letter' }
  if (!/\d/.test(value)) return { valid: false, message: 'Password must contain at least one number' }
  return { valid: true, message: '' }
}

/**
 * Validate that two passwords match.
 */
export function validatePasswordMatch(password, confirm) {
  if (!confirm) return { valid: false, message: 'Please confirm your password' }
  return password === confirm
    ? { valid: true, message: '' }
    : { valid: false, message: 'Passwords do not match' }
}

/**
 * Validate a required text field.
 */
export function validateRequired(value, fieldName = 'This field') {
  return value && value.toString().trim()
    ? { valid: true, message: '' }
    : { valid: false, message: `${fieldName} is required` }
}

/**
 * Validate phone number (E.164 or common formats).
 */
export function validatePhone(value) {
  if (!value) return { valid: false, message: 'Phone number is required' }
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  return re.test(value.replace(/\s/g, ''))
    ? { valid: true, message: '' }
    : { valid: false, message: 'Please enter a valid phone number' }
}

/**
 * Validate a date field.
 */
export function validateDate(value) {
  if (!value) return { valid: false, message: 'Date is required' }
  const date = new Date(value)
  return isNaN(date.getTime())
    ? { valid: false, message: 'Please enter a valid date' }
    : { valid: true, message: '' }
}

/**
 * Validate a numeric value within optional min/max range.
 */
export function validateNumber(value, { min, max, label = 'Value' } = {}) {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: `${label} is required` }
  }
  const num = Number(value)
  if (isNaN(num)) return { valid: false, message: `${label} must be a number` }
  if (min !== undefined && num < min) return { valid: false, message: `${label} must be at least ${min}` }
  if (max !== undefined && num > max) return { valid: false, message: `${label} must be at most ${max}` }
  return { valid: true, message: '' }
}

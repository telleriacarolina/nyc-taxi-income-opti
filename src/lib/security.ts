import { toast } from 'sonner'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
}

export function sanitizeNumericInput(input: string): string {
  if (typeof input !== 'string') return ''
  return input.replace(/[^0-9.]/g, '')
}

export function sanitizeLicenseNumber(input: string): string {
  if (typeof input !== 'string') return ''
  return input.replace(/[^A-Z0-9-]/gi, '').toUpperCase()
}

export function sanitizePhoneNumber(input: string): string {
  if (typeof input !== 'string') return ''
  return input.replace(/[^0-9]/g, '')
}

export function validateEarnings(earnings: number): ValidationResult {
  if (typeof earnings !== 'number') {
    return { isValid: false, error: 'Earnings must be a number' }
  }
  
  if (isNaN(earnings)) {
    return { isValid: false, error: 'Invalid earnings value' }
  }
  
  if (earnings < 0) {
    return { isValid: false, error: 'Earnings cannot be negative' }
  }
  
  if (earnings > 10000) {
    return { isValid: false, error: 'Earnings exceed reasonable daily maximum ($10,000)' }
  }
  
  return { isValid: true }
}

export function validateDistance(distance: number): ValidationResult {
  if (typeof distance !== 'number') {
    return { isValid: false, error: 'Distance must be a number' }
  }
  
  if (isNaN(distance)) {
    return { isValid: false, error: 'Invalid distance value' }
  }
  
  if (distance <= 0) {
    return { isValid: false, error: 'Distance must be greater than zero' }
  }
  
  if (distance > 500) {
    return { isValid: false, error: 'Distance exceeds reasonable maximum (500 miles)' }
  }
  
  return { isValid: true }
}

export function validateDuration(minutes: number): ValidationResult {
  if (typeof minutes !== 'number') {
    return { isValid: false, error: 'Duration must be a number' }
  }
  
  if (isNaN(minutes)) {
    return { isValid: false, error: 'Invalid duration value' }
  }
  
  if (minutes <= 0) {
    return { isValid: false, error: 'Duration must be greater than zero' }
  }
  
  if (minutes > 1440) {
    return { isValid: false, error: 'Duration exceeds 24 hours' }
  }
  
  return { isValid: true }
}

export function validateDate(dateString: string): ValidationResult {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' }
  }
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' }
  }
  
  const minDate = new Date('2020-01-01')
  if (date < minDate) {
    return { isValid: false, error: 'Date is too far in the past' }
  }
  
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10)
  if (date > maxDate) {
    return { isValid: false, error: 'Date is too far in the future' }
  }
  
  return { isValid: true }
}

export function validatePastDate(dateString: string): ValidationResult {
  const basicValidation = validateDate(dateString)
  if (!basicValidation.isValid) return basicValidation
  
  const date = new Date(dateString)
  const now = new Date()
  
  if (date > now) {
    return { isValid: false, error: 'Date cannot be in the future' }
  }
  
  return { isValid: true }
}

export function validateFutureDate(dateString: string): ValidationResult {
  const basicValidation = validateDate(dateString)
  if (!basicValidation.isValid) return basicValidation
  
  const date = new Date(dateString)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  if (date < now) {
    return { isValid: false, error: 'Date must be in the future' }
  }
  
  return { isValid: true }
}

export function validateLicenseNumber(licenseNumber: string): ValidationResult {
  const sanitized = sanitizeLicenseNumber(licenseNumber)
  
  if (!sanitized) {
    return { isValid: false, error: 'License number is required' }
  }
  
  if (sanitized.length < 5) {
    return { isValid: false, error: 'License number too short (minimum 5 characters)' }
  }
  
  if (sanitized.length > 20) {
    return { isValid: false, error: 'License number too long (maximum 20 characters)' }
  }
  
  return { isValid: true }
}

export function validatePhoneNumber(phoneNumber: string): ValidationResult {
  const sanitized = sanitizePhoneNumber(phoneNumber)
  
  if (!sanitized) {
    return { isValid: false, error: 'Phone number is required' }
  }
  
  if (sanitized.length !== 10) {
    return { isValid: false, error: 'Phone number must be 10 digits' }
  }
  
  if (!/^[2-9]\d{9}$/.test(sanitized)) {
    return { isValid: false, error: 'Invalid US phone number format' }
  }
  
  return { isValid: true }
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email too long' }
  }
  
  return { isValid: true }
}

export function validateTextLength(
  text: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'Text'
): ValidationResult {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  if (text.length < minLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${minLength} characters` 
    }
  }
  
  if (text.length > maxLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must not exceed ${maxLength} characters` 
    }
  }
  
  return { isValid: true }
}

export function maskLicenseNumber(number: string): string {
  if (!number || number.length < 4) return '****'
  
  const visibleChars = 4
  const maskedPart = number.slice(0, -visibleChars).replace(/./g, '*')
  const visiblePart = number.slice(-visibleChars)
  
  return `${maskedPart}${visiblePart}`
}

export function maskPhoneNumber(phone: string): string {
  const sanitized = sanitizePhoneNumber(phone)
  
  if (sanitized.length !== 10) return '(***) ***-****'
  
  const areaCode = sanitized.slice(0, 3)
  const lastFour = sanitized.slice(-4)
  
  return `(***) ***-${lastFour}`
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***'
  
  const [localPart, domain] = email.split('@')
  
  if (localPart.length <= 2) {
    return `**@${domain}`
  }
  
  const visibleLocal = localPart.slice(0, 2)
  const maskedLocal = localPart.slice(2).replace(/./g, '*')
  
  return `${visibleLocal}${maskedLocal}@${domain}`
}

export function validateAndShowError(
  validation: ValidationResult,
  onError?: (error: string) => void
): boolean {
  if (!validation.isValid && validation.error) {
    if (onError) {
      onError(validation.error)
    } else {
      toast.error(validation.error)
    }
    return false
  }
  return true
}

export function preventXSS(input: string): string {
  const element = document.createElement('div')
  element.textContent = input
  return element.innerHTML
}

export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function sanitizeURL(url: string): string {
  if (!url) return ''
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  if (!isValidURL(url)) {
    return ''
  }
  
  return url
}

export const MAX_EARNINGS_PER_DAY = 10000
export const MAX_DISTANCE_MILES = 500
export const MAX_DURATION_MINUTES = 1440
export const MAX_TRIPS_PER_SHIFT = 100
export const MIN_YEAR = 2020
export const MAX_FUTURE_YEARS = 10

export const VALIDATION_RULES = {
  licenseNumber: {
    minLength: 5,
    maxLength: 20,
    pattern: /^[A-Z0-9-]+$/i
  },
  phoneNumber: {
    length: 10,
    pattern: /^[2-9]\d{9}$/
  },
  email: {
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  earnings: {
    min: 0,
    max: MAX_EARNINGS_PER_DAY
  },
  distance: {
    min: 0,
    max: MAX_DISTANCE_MILES
  },
  duration: {
    min: 0,
    max: MAX_DURATION_MINUTES
  },
  trips: {
    min: 0,
    max: MAX_TRIPS_PER_SHIFT
  }
} as const

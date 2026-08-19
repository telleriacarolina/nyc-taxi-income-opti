import { describe, it, expect, vi } from 'vitest'
import {
  sanitizeText,
  sanitizeNumericInput,
  sanitizeLicenseNumber,
  sanitizePhoneNumber,
  validateEarnings,
  validateDistance,
  validateDuration,
  validateDate,
  validatePastDate,
  validateFutureDate,
  validateLicenseNumber,
  validatePhoneNumber,
  validateEmail,
  validateTextLength,
  maskLicenseNumber,
  maskPhoneNumber,
  maskEmail,
  validateAndShowError,
  isValidURL,
  sanitizeURL,
  VALIDATION_RULES,
  MAX_EARNINGS_PER_DAY,
  MAX_DISTANCE_MILES,
  MAX_DURATION_MINUTES,
} from './security'

describe('sanitizeText', () => {
  it('removes HTML tags', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('removes angle bracket characters', () => {
    // '< b >' is parsed as an HTML-like tag by the first regex and removed entirely
    expect(sanitizeText('a < b > c')).toBe('a  c')
  })

  it('trims whitespace', () => {
    expect(sanitizeText('  hello world  ')).toBe('hello world')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeText(123 as unknown as string)).toBe('')
  })

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('')
  })

  it('preserves safe text', () => {
    expect(sanitizeText('Hello, World!')).toBe('Hello, World!')
  })
})

describe('sanitizeNumericInput', () => {
  it('removes non-numeric characters except decimal', () => {
    expect(sanitizeNumericInput('$1,234.56')).toBe('1234.56')
  })

  it('preserves digits and dots', () => {
    expect(sanitizeNumericInput('123.45')).toBe('123.45')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeNumericInput(42 as unknown as string)).toBe('')
  })

  it('handles empty string', () => {
    expect(sanitizeNumericInput('')).toBe('')
  })

  it('removes letters', () => {
    expect(sanitizeNumericInput('abc123def')).toBe('123')
  })
})

describe('sanitizeLicenseNumber', () => {
  it('converts to uppercase', () => {
    expect(sanitizeLicenseNumber('abc123')).toBe('ABC123')
  })

  it('removes invalid characters', () => {
    expect(sanitizeLicenseNumber('AB!@#123')).toBe('AB123')
  })

  it('preserves hyphens', () => {
    expect(sanitizeLicenseNumber('AB-123')).toBe('AB-123')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeLicenseNumber(null as unknown as string)).toBe('')
  })

  it('handles empty string', () => {
    expect(sanitizeLicenseNumber('')).toBe('')
  })
})

describe('sanitizePhoneNumber', () => {
  it('removes non-digit characters', () => {
    expect(sanitizePhoneNumber('(212) 555-1234')).toBe('2125551234')
  })

  it('preserves digits', () => {
    expect(sanitizePhoneNumber('2125551234')).toBe('2125551234')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizePhoneNumber(undefined as unknown as string)).toBe('')
  })

  it('removes dashes and dots', () => {
    expect(sanitizePhoneNumber('212-555.1234')).toBe('2125551234')
  })
})

describe('validateEarnings', () => {
  it('accepts valid earnings', () => {
    expect(validateEarnings(250)).toEqual({ isValid: true })
  })

  it('accepts zero earnings', () => {
    expect(validateEarnings(0)).toEqual({ isValid: true })
  })

  it('rejects negative earnings', () => {
    const result = validateEarnings(-1)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/negative/i)
  })

  it('rejects earnings above maximum', () => {
    const result = validateEarnings(10001)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/exceed/i)
  })

  it('accepts the maximum allowed amount', () => {
    expect(validateEarnings(MAX_EARNINGS_PER_DAY)).toEqual({ isValid: true })
  })

  it('rejects NaN', () => {
    const result = validateEarnings(NaN)
    expect(result.isValid).toBe(false)
  })

  it('rejects non-number type', () => {
    const result = validateEarnings('100' as unknown as number)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/number/i)
  })
})

describe('validateDistance', () => {
  it('accepts valid distance', () => {
    expect(validateDistance(10)).toEqual({ isValid: true })
  })

  it('rejects zero distance', () => {
    const result = validateDistance(0)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/greater than zero/i)
  })

  it('rejects negative distance', () => {
    const result = validateDistance(-5)
    expect(result.isValid).toBe(false)
  })

  it('rejects distance above maximum', () => {
    const result = validateDistance(501)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/maximum/i)
  })

  it('accepts the maximum allowed distance', () => {
    expect(validateDistance(MAX_DISTANCE_MILES)).toEqual({ isValid: true })
  })

  it('rejects NaN', () => {
    const result = validateDistance(NaN)
    expect(result.isValid).toBe(false)
  })

  it('rejects non-number type', () => {
    const result = validateDistance('10' as unknown as number)
    expect(result.isValid).toBe(false)
  })
})

describe('validateDuration', () => {
  it('accepts valid duration', () => {
    expect(validateDuration(60)).toEqual({ isValid: true })
  })

  it('rejects zero duration', () => {
    const result = validateDuration(0)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/greater than zero/i)
  })

  it('rejects negative duration', () => {
    const result = validateDuration(-1)
    expect(result.isValid).toBe(false)
  })

  it('rejects duration above 24 hours', () => {
    const result = validateDuration(1441)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/24 hours/i)
  })

  it('accepts the maximum allowed duration', () => {
    expect(validateDuration(MAX_DURATION_MINUTES)).toEqual({ isValid: true })
  })

  it('rejects NaN', () => {
    const result = validateDuration(NaN)
    expect(result.isValid).toBe(false)
  })

  it('rejects non-number type', () => {
    const result = validateDuration('30' as unknown as number)
    expect(result.isValid).toBe(false)
  })
})

describe('validateDate', () => {
  it('accepts a valid date string', () => {
    expect(validateDate('2024-06-15')).toEqual({ isValid: true })
  })

  it('rejects empty string', () => {
    const result = validateDate('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects invalid date format', () => {
    const result = validateDate('not-a-date')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/invalid date/i)
  })

  it('rejects dates before 2020', () => {
    const result = validateDate('2019-12-31')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too far in the past/i)
  })

  it('rejects dates more than 10 years in the future', () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 11)
    const result = validateDate(futureDate.toISOString().split('T')[0])
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too far in the future/i)
  })
})

describe('validatePastDate', () => {
  it('accepts a past date', () => {
    expect(validatePastDate('2023-01-01')).toEqual({ isValid: true })
  })

  it('rejects a future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 10)
    const result = validatePastDate(futureDate.toISOString().split('T')[0])
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/future/i)
  })

  it('propagates base validation errors', () => {
    const result = validatePastDate('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })
})

describe('validateFutureDate', () => {
  it('accepts a future date', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    expect(validateFutureDate(futureDate.toISOString().split('T')[0])).toEqual({ isValid: true })
  })

  it('rejects a past date', () => {
    const result = validateFutureDate('2023-01-01')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/future/i)
  })

  it('propagates base validation errors', () => {
    const result = validateFutureDate('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })
})

describe('validateLicenseNumber', () => {
  it('accepts a valid license number', () => {
    expect(validateLicenseNumber('TLC12345')).toEqual({ isValid: true })
  })

  it('rejects empty input', () => {
    const result = validateLicenseNumber('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects license number that is too short', () => {
    const result = validateLicenseNumber('AB12')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too short/i)
  })

  it('rejects license number that is too long', () => {
    const result = validateLicenseNumber('A'.repeat(21))
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too long/i)
  })

  it('accepts license with hyphens', () => {
    expect(validateLicenseNumber('TLC-12345')).toEqual({ isValid: true })
  })

  it('is case-insensitive (sanitizes before validating)', () => {
    expect(validateLicenseNumber('tlc12345')).toEqual({ isValid: true })
  })
})

describe('validatePhoneNumber', () => {
  it('accepts a valid US phone number', () => {
    expect(validatePhoneNumber('2125551234')).toEqual({ isValid: true })
  })

  it('accepts formatted phone number', () => {
    expect(validatePhoneNumber('(212) 555-1234')).toEqual({ isValid: true })
  })

  it('rejects empty input', () => {
    const result = validatePhoneNumber('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects phone number with wrong digit count', () => {
    const result = validatePhoneNumber('12345')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/10 digits/i)
  })

  it('rejects phone number starting with 0 or 1', () => {
    const result = validatePhoneNumber('1125551234')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/invalid US phone/i)
  })
})

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('driver@example.com')).toEqual({ isValid: true })
  })

  it('rejects empty email', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects email without @', () => {
    const result = validateEmail('notanemail.com')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/invalid email/i)
  })

  it('rejects email without domain', () => {
    const result = validateEmail('user@')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/invalid email/i)
  })

  it('rejects email exceeding max length', () => {
    const longEmail = 'a'.repeat(250) + '@example.com'
    const result = validateEmail(longEmail)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too long/i)
  })

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toEqual({ isValid: true })
  })
})

describe('validateTextLength', () => {
  it('accepts text within bounds', () => {
    expect(validateTextLength('Hello', 2, 10)).toEqual({ isValid: true })
  })

  it('rejects empty text', () => {
    const result = validateTextLength('', 1, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects whitespace-only text', () => {
    const result = validateTextLength('   ', 1, 10)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/required/i)
  })

  it('rejects text shorter than minimum', () => {
    const result = validateTextLength('Hi', 5, 10, 'Name')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/at least 5 characters/i)
  })

  it('rejects text longer than maximum', () => {
    const result = validateTextLength('Hello World', 1, 5, 'Note')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/not exceed 5 characters/i)
  })

  it('uses fieldName in error messages', () => {
    const result = validateTextLength('', 1, 10, 'Username')
    expect(result.error).toMatch(/Username/)
  })
})

describe('maskLicenseNumber', () => {
  it('masks all but last 4 characters', () => {
    expect(maskLicenseNumber('TLC12345')).toBe('****2345')
  })

  it('returns **** for short strings', () => {
    expect(maskLicenseNumber('AB')).toBe('****')
  })

  it('returns **** for empty string', () => {
    expect(maskLicenseNumber('')).toBe('****')
  })

  it('handles exactly 4 characters (nothing to mask)', () => {
    expect(maskLicenseNumber('1234')).toBe('1234')
  })

  it('masks correctly for long license numbers', () => {
    const result = maskLicenseNumber('ABCDEFGH')
    expect(result).toBe('****EFGH')
  })
})

describe('maskPhoneNumber', () => {
  it('masks area code and middle digits for valid 10-digit number', () => {
    const result = maskPhoneNumber('2125551234')
    expect(result).toBe('(***) ***-1234')
  })

  it('returns masked placeholder for invalid phone', () => {
    expect(maskPhoneNumber('12345')).toBe('(***) ***-****')
  })

  it('works with formatted phone input', () => {
    const result = maskPhoneNumber('(212) 555-1234')
    expect(result).toBe('(***) ***-1234')
  })

  it('returns placeholder for empty string', () => {
    expect(maskPhoneNumber('')).toBe('(***) ***-****')
  })
})

describe('maskEmail', () => {
  it('masks local part after first 2 characters', () => {
    expect(maskEmail('driver@example.com')).toBe('dr****@example.com')
  })

  it('returns fallback for email without @', () => {
    expect(maskEmail('notanemail')).toBe('***@***.***')
  })

  it('returns fallback for empty string', () => {
    expect(maskEmail('')).toBe('***@***.***')
  })

  it('masks short local parts (2 chars or fewer)', () => {
    expect(maskEmail('ab@example.com')).toBe('**@example.com')
  })

  it('preserves domain', () => {
    const result = maskEmail('johndoe@gmail.com')
    expect(result).toMatch(/@gmail\.com$/)
  })
})

describe('validateAndShowError', () => {
  it('returns true when validation passes', () => {
    const result = validateAndShowError({ isValid: true })
    expect(result).toBe(true)
  })

  it('returns false when validation fails', () => {
    const result = validateAndShowError({ isValid: false, error: 'Invalid input' })
    expect(result).toBe(false)
  })

  it('calls onError callback with error message', () => {
    const onError = vi.fn()
    validateAndShowError({ isValid: false, error: 'Test error' }, onError)
    expect(onError).toHaveBeenCalledWith('Test error')
  })

  it('does not call onError when valid', () => {
    const onError = vi.fn()
    validateAndShowError({ isValid: true }, onError)
    expect(onError).not.toHaveBeenCalled()
  })
})

describe('isValidURL', () => {
  it('accepts https URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true)
  })

  it('accepts http URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isValidURL('not-a-url')).toBe(false)
  })

  it('rejects javascript: protocol', () => {
    expect(isValidURL('javascript:alert(1)')).toBe(false)
  })

  it('rejects ftp: protocol', () => {
    expect(isValidURL('ftp://example.com')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidURL('')).toBe(false)
  })
})

describe('sanitizeURL', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeURL('')).toBe('')
  })

  it('prepends https:// to URLs without protocol', () => {
    expect(sanitizeURL('example.com')).toBe('https://example.com')
  })

  it('preserves existing https:// prefix', () => {
    expect(sanitizeURL('https://example.com')).toBe('https://example.com')
  })

  it('preserves existing http:// prefix', () => {
    expect(sanitizeURL('http://example.com')).toBe('http://example.com')
  })

  it('returns empty string for invalid URLs', () => {
    expect(sanitizeURL('not a valid url at all!!!')).toBe('')
  })
})

describe('VALIDATION_RULES', () => {
  it('has correct license number constraints', () => {
    expect(VALIDATION_RULES.licenseNumber.minLength).toBe(5)
    expect(VALIDATION_RULES.licenseNumber.maxLength).toBe(20)
  })

  it('has correct phone number constraints', () => {
    expect(VALIDATION_RULES.phoneNumber.length).toBe(10)
  })

  it('has correct email max length', () => {
    expect(VALIDATION_RULES.email.maxLength).toBe(254)
  })

  it('has correct earnings constraints', () => {
    expect(VALIDATION_RULES.earnings.min).toBe(0)
    expect(VALIDATION_RULES.earnings.max).toBe(MAX_EARNINGS_PER_DAY)
  })

  it('has correct distance constraints', () => {
    expect(VALIDATION_RULES.distance.min).toBe(0)
    expect(VALIDATION_RULES.distance.max).toBe(MAX_DISTANCE_MILES)
  })

  it('has correct duration constraints', () => {
    expect(VALIDATION_RULES.duration.min).toBe(0)
    expect(VALIDATION_RULES.duration.max).toBe(MAX_DURATION_MINUTES)
  })
})

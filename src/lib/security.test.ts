import { describe, it, expect, vi, afterEach } from 'vitest'
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
  isValidURL,
  sanitizeURL,
} from './security'

// ---------------------------------------------------------------------------
// sanitizeText
// ---------------------------------------------------------------------------

describe('sanitizeText', () => {
  it('removes HTML tags but leaves their inner text content', () => {
    // The regex strips the tag delimiters; inner text between tags is preserved.
    expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('alert("xss")Hello')
  })

  it('removes sequences that look like tags (< ... >)', () => {
    // "< b >" is treated as a tag-like pattern and stripped.
    expect(sanitizeText('a < b > c')).toBe('a  c')
  })

  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeText(123 as unknown as string)).toBe('')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeText('')).toBe('')
  })
})

// ---------------------------------------------------------------------------
// sanitizeNumericInput
// ---------------------------------------------------------------------------

describe('sanitizeNumericInput', () => {
  it('strips non-numeric characters except the decimal point', () => {
    expect(sanitizeNumericInput('$12.50abc')).toBe('12.50')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeNumericInput(42 as unknown as string)).toBe('')
  })

  it('allows digits and dots', () => {
    expect(sanitizeNumericInput('3.14')).toBe('3.14')
  })
})

// ---------------------------------------------------------------------------
// sanitizeLicenseNumber
// ---------------------------------------------------------------------------

describe('sanitizeLicenseNumber', () => {
  it('removes non-alphanumeric and non-hyphen characters, preserving hyphens', () => {
    // Hyphens are explicitly kept by the regex [^A-Z0-9-].
    expect(sanitizeLicenseNumber('AB!@#12-3')).toBe('AB12-3')
  })

  it('uppercases the result', () => {
    expect(sanitizeLicenseNumber('abc123')).toBe('ABC123')
  })

  it('allows hyphens', () => {
    expect(sanitizeLicenseNumber('TLC-1234')).toBe('TLC-1234')
  })
})

// ---------------------------------------------------------------------------
// sanitizePhoneNumber
// ---------------------------------------------------------------------------

describe('sanitizePhoneNumber', () => {
  it('keeps only digits', () => {
    expect(sanitizePhoneNumber('(212) 555-1234')).toBe('2125551234')
  })

  it('removes letters and symbols', () => {
    expect(sanitizePhoneNumber('abc123def')).toBe('123')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizePhoneNumber(null as unknown as string)).toBe('')
  })
})

// ---------------------------------------------------------------------------
// validateEarnings
// ---------------------------------------------------------------------------

describe('validateEarnings', () => {
  it('accepts zero', () => {
    expect(validateEarnings(0).isValid).toBe(true)
  })

  it('accepts a normal positive value', () => {
    expect(validateEarnings(250).isValid).toBe(true)
  })

  it('rejects NaN', () => {
    expect(validateEarnings(NaN).isValid).toBe(false)
  })

  it('rejects negative values', () => {
    const result = validateEarnings(-5)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/negative/i)
  })

  it('rejects values above $10,000', () => {
    const result = validateEarnings(10001)
    expect(result.isValid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('accepts the boundary value of $10,000', () => {
    expect(validateEarnings(10000).isValid).toBe(true)
  })

  it('rejects non-number input', () => {
    expect(validateEarnings('100' as unknown as number).isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateDistance
// ---------------------------------------------------------------------------

describe('validateDistance', () => {
  it('accepts a valid distance', () => {
    expect(validateDistance(10).isValid).toBe(true)
  })

  it('rejects zero', () => {
    expect(validateDistance(0).isValid).toBe(false)
  })

  it('rejects negative values', () => {
    expect(validateDistance(-1).isValid).toBe(false)
  })

  it('rejects distances over 500 miles', () => {
    const result = validateDistance(501)
    expect(result.isValid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('accepts the boundary of 500 miles', () => {
    expect(validateDistance(500).isValid).toBe(true)
  })

  it('rejects NaN', () => {
    expect(validateDistance(NaN).isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateDuration
// ---------------------------------------------------------------------------

describe('validateDuration', () => {
  it('accepts a valid duration in minutes', () => {
    expect(validateDuration(30).isValid).toBe(true)
  })

  it('rejects zero', () => {
    expect(validateDuration(0).isValid).toBe(false)
  })

  it('rejects values over 1440 (24 hours)', () => {
    const result = validateDuration(1441)
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/24 hours/i)
  })

  it('accepts the boundary of 1440 minutes', () => {
    expect(validateDuration(1440).isValid).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// validateDate
// ---------------------------------------------------------------------------

describe('validateDate', () => {
  it('accepts a valid date string', () => {
    expect(validateDate('2024-06-15').isValid).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(validateDate('').isValid).toBe(false)
  })

  it('rejects an invalid date string', () => {
    expect(validateDate('not-a-date').isValid).toBe(false)
  })

  it('rejects dates before 2020-01-01', () => {
    expect(validateDate('2019-12-31').isValid).toBe(false)
  })

  it('rejects dates more than 10 years in the future', () => {
    expect(validateDate('2040-01-01').isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validatePastDate
// ---------------------------------------------------------------------------

describe('validatePastDate', () => {
  it('accepts a past date', () => {
    expect(validatePastDate('2023-01-01').isValid).toBe(true)
  })

  it('rejects a future date', () => {
    expect(validatePastDate('2030-01-01').isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateFutureDate
// ---------------------------------------------------------------------------

describe('validateFutureDate', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('accepts a future date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))

    expect(validateFutureDate('2030-01-01').isValid).toBe(true)
  })

  it('rejects a past date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
    expect(validateFutureDate('2021-01-01').isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateLicenseNumber
// ---------------------------------------------------------------------------

describe('validateLicenseNumber', () => {
  it('accepts a valid 8-character license number', () => {
    expect(validateLicenseNumber('TLC12345').isValid).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(validateLicenseNumber('').isValid).toBe(false)
  })

  it('rejects a number shorter than 5 characters', () => {
    const result = validateLicenseNumber('AB1')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too short/i)
  })

  it('rejects a number longer than 20 characters', () => {
    const result = validateLicenseNumber('A'.repeat(21))
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/too long/i)
  })
})

// ---------------------------------------------------------------------------
// validatePhoneNumber
// ---------------------------------------------------------------------------

describe('validatePhoneNumber', () => {
  it('accepts a valid US 10-digit phone number', () => {
    expect(validatePhoneNumber('2125551234').isValid).toBe(true)
  })

  it('accepts formatted numbers by sanitising first', () => {
    expect(validatePhoneNumber('(212) 555-1234').isValid).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(validatePhoneNumber('').isValid).toBe(false)
  })

  it('rejects a number with fewer than 10 digits', () => {
    expect(validatePhoneNumber('12345').isValid).toBe(false)
  })

  it('rejects numbers starting with 0 or 1', () => {
    expect(validatePhoneNumber('0125551234').isValid).toBe(false)
    expect(validatePhoneNumber('1125551234').isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateEmail
// ---------------------------------------------------------------------------

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('driver@example.com').isValid).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(validateEmail('').isValid).toBe(false)
  })

  it('rejects an address without @', () => {
    expect(validateEmail('invalidemail').isValid).toBe(false)
  })

  it('rejects an address without a domain', () => {
    expect(validateEmail('user@').isValid).toBe(false)
  })

  it('rejects emails longer than 254 characters', () => {
    const longLocal = 'a'.repeat(250)
    expect(validateEmail(`${longLocal}@example.com`).isValid).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// validateTextLength
// ---------------------------------------------------------------------------

describe('validateTextLength', () => {
  it('accepts text within min/max bounds', () => {
    expect(validateTextLength('hello world', 3, 50).isValid).toBe(true)
  })

  it('rejects empty or whitespace-only input', () => {
    expect(validateTextLength('  ', 1, 100).isValid).toBe(false)
  })

  it('rejects text shorter than minLength', () => {
    const result = validateTextLength('hi', 5, 20, 'Name')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('Name')
  })

  it('rejects text longer than maxLength', () => {
    const result = validateTextLength('a'.repeat(101), 1, 100)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('100')
  })
})

// ---------------------------------------------------------------------------
// maskLicenseNumber
// ---------------------------------------------------------------------------

describe('maskLicenseNumber', () => {
  it('masks all but the last 4 characters', () => {
    expect(maskLicenseNumber('TLC12345')).toBe('****2345')
  })

  it('returns **** for short strings', () => {
    expect(maskLicenseNumber('AB')).toBe('****')
  })

  it('returns **** for an empty string', () => {
    expect(maskLicenseNumber('')).toBe('****')
  })
})

// ---------------------------------------------------------------------------
// maskPhoneNumber
// ---------------------------------------------------------------------------

describe('maskPhoneNumber', () => {
  it('masks everything except the last 4 digits', () => {
    expect(maskPhoneNumber('2125551234')).toBe('(***) ***-1234')
  })

  it('handles formatted phone numbers', () => {
    expect(maskPhoneNumber('(212) 555-1234')).toBe('(***) ***-1234')
  })

  it('returns the default mask for invalid numbers', () => {
    expect(maskPhoneNumber('123')).toBe('(***) ***-****')
  })
})

// ---------------------------------------------------------------------------
// maskEmail
// ---------------------------------------------------------------------------

describe('maskEmail', () => {
  it('masks the local part after the first two characters', () => {
    expect(maskEmail('driver@example.com')).toBe('dr****@example.com')
  })

  it('handles short local parts (1-2 chars)', () => {
    expect(maskEmail('ab@example.com')).toBe('**@example.com')
  })

  it('returns a default mask for invalid emails', () => {
    expect(maskEmail('notanemail')).toBe('***@***.***')
  })

  it('returns a default mask for empty input', () => {
    expect(maskEmail('')).toBe('***@***.***')
  })
})

// ---------------------------------------------------------------------------
// isValidURL
// ---------------------------------------------------------------------------

describe('isValidURL', () => {
  it('accepts http URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true)
  })

  it('accepts https URLs', () => {
    expect(isValidURL('https://example.com/path?q=1')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isValidURL('not-a-url')).toBe(false)
  })

  it('rejects non-http/https protocols', () => {
    expect(isValidURL('ftp://example.com')).toBe(false)
    expect(isValidURL('javascript:alert(1)')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// sanitizeURL
// ---------------------------------------------------------------------------

describe('sanitizeURL', () => {
  it('returns a valid https URL unchanged', () => {
    expect(sanitizeURL('https://example.com')).toBe('https://example.com')
  })

  it('prepends https:// when protocol is missing', () => {
    expect(sanitizeURL('example.com')).toBe('https://example.com')
  })

  it('returns empty string for an empty input', () => {
    expect(sanitizeURL('')).toBe('')
  })

  it('returns empty string when the result is not a valid URL', () => {
    expect(sanitizeURL('not a valid url at all!!')).toBe('')
  })
})

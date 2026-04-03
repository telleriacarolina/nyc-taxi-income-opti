import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDaysRemaining, getDocumentStatus, formatDate, formatDateInput, isValidFutureDate } from './date-utils'

describe('getDaysRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns positive days for a future expiration date', () => {
    const result = getDaysRemaining('2024-07-15')
    expect(result).toBe(30)
  })

  it('returns negative days for an expired date', () => {
    const result = getDaysRemaining('2024-05-15')
    expect(result).toBe(-31)
  })

  it('returns zero for today', () => {
    const result = getDaysRemaining('2024-06-15')
    expect(result).toBe(0)
  })
})

describe('getDocumentStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "expired" for past expiration date', () => {
    expect(getDocumentStatus('2024-05-01')).toBe('expired')
  })

  it('returns "expiring" for date within 30 days', () => {
    expect(getDocumentStatus('2024-07-01')).toBe('expiring')
  })

  it('returns "expiring" for expiration date exactly 30 days away', () => {
    expect(getDocumentStatus('2024-07-15')).toBe('expiring')
  })

  it('returns "current" for date more than 30 days away', () => {
    expect(getDocumentStatus('2024-09-01')).toBe('current')
  })

  it('returns "expired" for expiration date exactly today', () => {
    expect(getDocumentStatus('2024-06-15')).toBe('expiring')
  })
})

describe('formatDate', () => {
  it('formats a date string as "MMM dd, yyyy"', () => {
    expect(formatDate('2024-06-15')).toBe('Jun 15, 2024')
  })

  it('formats January correctly', () => {
    expect(formatDate('2024-01-01')).toBe('Jan 01, 2024')
  })

  it('formats December correctly', () => {
    expect(formatDate('2024-12-31')).toBe('Dec 31, 2024')
  })
})

describe('formatDateInput', () => {
  it('formats a date string as "yyyy-MM-dd"', () => {
    expect(formatDateInput('2024-06-15')).toBe('2024-06-15')
  })

  it('pads month and day with leading zeros', () => {
    expect(formatDateInput('2024-01-05')).toBe('2024-01-05')
  })
})

describe('isValidFutureDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true for a future date', () => {
    expect(isValidFutureDate('2025-01-01')).toBe(true)
  })

  it('returns false for a past date', () => {
    expect(isValidFutureDate('2023-01-01')).toBe(false)
  })

  it('returns false for today', () => {
    expect(isValidFutureDate('2024-06-15')).toBe(false)
  })

  it('returns false for an invalid date string', () => {
    expect(isValidFutureDate('not-a-date')).toBe(false)
  })
})

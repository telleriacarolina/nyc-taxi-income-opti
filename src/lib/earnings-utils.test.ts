import { describe, it, expect } from 'vitest'
import {
  calculateStats,
  getHourlyPatterns,
  getDailyPatterns,
  getPlatformStats,
  formatCurrency,
  formatHours,
  getDailyEarnings,
} from './earnings-utils'
import { Shift } from './earnings-types'

const makeShift = (overrides: Partial<Shift> = {}): Shift => ({
  id: '1',
  date: '2024-03-04',
  startTime: '08:00',
  endTime: '16:00',
  platform: 'uber',
  earnings: 200,
  hours: 8,
  trips: 10,
  ...overrides,
})

describe('calculateStats', () => {
  it('returns zero stats for empty shifts array', () => {
    const stats = calculateStats([])
    expect(stats.totalEarnings).toBe(0)
    expect(stats.totalHours).toBe(0)
    expect(stats.totalTrips).toBe(0)
    expect(stats.totalTips).toBe(0)
    expect(stats.totalExpenses).toBe(0)
    expect(stats.netEarnings).toBe(0)
    expect(stats.averageHourlyRate).toBe(0)
    expect(stats.averageTripEarnings).toBe(0)
    expect(stats.bestHour).toBe('N/A')
    expect(stats.bestDay).toBe('N/A')
    expect(stats.topPlatform).toBe('N/A')
  })

  it('calculates totals correctly for a single shift', () => {
    const shifts = [makeShift({ earnings: 120, hours: 6, trips: 8, tips: 20, expenses: 15 })]
    const stats = calculateStats(shifts)
    expect(stats.totalEarnings).toBe(120)
    expect(stats.totalHours).toBe(6)
    expect(stats.totalTrips).toBe(8)
    expect(stats.totalTips).toBe(20)
    expect(stats.totalExpenses).toBe(15)
    expect(stats.netEarnings).toBe(105)
  })

  it('calculates average hourly rate correctly', () => {
    const shifts = [makeShift({ earnings: 200, hours: 8 })]
    const stats = calculateStats(shifts)
    expect(stats.averageHourlyRate).toBe(25)
  })

  it('calculates average trip earnings correctly', () => {
    const shifts = [makeShift({ earnings: 200, trips: 10 })]
    const stats = calculateStats(shifts)
    expect(stats.averageTripEarnings).toBe(20)
  })

  it('sums multiple shifts', () => {
    const shifts = [
      makeShift({ earnings: 100, hours: 4, trips: 5 }),
      makeShift({ id: '2', earnings: 150, hours: 6, trips: 8 }),
    ]
    const stats = calculateStats(shifts)
    expect(stats.totalEarnings).toBe(250)
    expect(stats.totalHours).toBe(10)
    expect(stats.totalTrips).toBe(13)
  })

  it('handles shifts without optional tips or expenses', () => {
    const shifts = [makeShift()]
    const stats = calculateStats(shifts)
    expect(stats.totalTips).toBe(0)
    expect(stats.totalExpenses).toBe(0)
    expect(stats.netEarnings).toBe(200)
  })

  it('sets topPlatform to the platform with highest earnings', () => {
    const shifts = [
      makeShift({ platform: 'uber', earnings: 100 }),
      makeShift({ id: '2', platform: 'lyft', earnings: 200 }),
    ]
    const stats = calculateStats(shifts)
    expect(stats.topPlatform).toBe('Lyft')
  })
})

describe('getHourlyPatterns', () => {
  it('returns empty array for empty shifts', () => {
    expect(getHourlyPatterns([])).toEqual([])
  })

  it('returns hourly data for a single shift', () => {
    const shifts = [makeShift({ startTime: '09:00', endTime: '11:00', earnings: 60, hours: 2, trips: 4 })]
    const patterns = getHourlyPatterns(shifts)
    expect(patterns.length).toBeGreaterThan(0)
    expect(patterns[0]).toHaveProperty('hour')
    expect(patterns[0]).toHaveProperty('earnings')
    expect(patterns[0]).toHaveProperty('trips')
    expect(patterns[0]).toHaveProperty('averageRate')
  })

  it('sorts patterns by hour ascending', () => {
    const shifts = [makeShift({ startTime: '08:00', endTime: '12:00', earnings: 100, hours: 4, trips: 8 })]
    const patterns = getHourlyPatterns(shifts)
    const hours = patterns.map(p => parseInt(p.hour))
    for (let i = 1; i < hours.length; i++) {
      expect(hours[i]).toBeGreaterThanOrEqual(hours[i - 1])
    }
  })

  it('formats hours as HH:00', () => {
    const shifts = [makeShift({ startTime: '09:00', endTime: '09:00', earnings: 20, hours: 1, trips: 2 })]
    const patterns = getHourlyPatterns(shifts)
    expect(patterns[0].hour).toMatch(/^\d{2}:00$/)
  })
})

describe('getDailyPatterns', () => {
  it('returns empty array for empty shifts', () => {
    expect(getDailyPatterns([])).toEqual([])
  })

  it('groups shifts by day of week', () => {
    // 2024-03-04 is a Monday
    const shifts = [makeShift({ date: '2024-03-04', earnings: 200, hours: 8 })]
    const patterns = getDailyPatterns(shifts)
    expect(patterns.length).toBe(1)
    expect(patterns[0].day).toBe('Monday')
    expect(patterns[0].earnings).toBe(200)
    expect(patterns[0].hours).toBe(8)
  })

  it('aggregates multiple shifts on same day', () => {
    const shifts = [
      makeShift({ date: '2024-03-04', earnings: 100, hours: 4 }),
      makeShift({ id: '2', date: '2024-03-04', earnings: 80, hours: 3 }),
    ]
    const patterns = getDailyPatterns(shifts)
    expect(patterns.length).toBe(1)
    expect(patterns[0].earnings).toBe(180)
    expect(patterns[0].hours).toBe(7)
  })

  it('calculates average rate correctly', () => {
    const shifts = [makeShift({ date: '2024-03-04', earnings: 200, hours: 8 })]
    const patterns = getDailyPatterns(shifts)
    expect(patterns[0].averageRate).toBe(25)
  })

  it('sorts by average rate descending', () => {
    // 2024-03-04 = Monday, 2024-03-05 = Tuesday
    const shifts = [
      makeShift({ date: '2024-03-04', earnings: 100, hours: 8 }), // $12.50/hr
      makeShift({ id: '2', date: '2024-03-05', earnings: 200, hours: 8 }), // $25/hr
    ]
    const patterns = getDailyPatterns(shifts)
    expect(patterns[0].averageRate).toBeGreaterThan(patterns[1].averageRate)
  })
})

describe('getPlatformStats', () => {
  it('returns empty array for empty shifts', () => {
    expect(getPlatformStats([])).toEqual([])
  })

  it('groups shifts by platform', () => {
    const shifts = [
      makeShift({ platform: 'uber', earnings: 100, hours: 4, trips: 5 }),
      makeShift({ id: '2', platform: 'lyft', earnings: 80, hours: 3, trips: 4 }),
    ]
    const stats = getPlatformStats(shifts)
    expect(stats.length).toBe(2)
    const platforms = stats.map(s => s.platform)
    expect(platforms).toContain('Uber')
    expect(platforms).toContain('Lyft')
  })

  it('capitalizes platform names', () => {
    const shifts = [makeShift({ platform: 'uber' })]
    const stats = getPlatformStats(shifts)
    expect(stats[0].platform).toBe('Uber')
  })

  it('aggregates multiple shifts for the same platform', () => {
    const shifts = [
      makeShift({ platform: 'uber', earnings: 100, hours: 4, trips: 5 }),
      makeShift({ id: '2', platform: 'uber', earnings: 120, hours: 5, trips: 6 }),
    ]
    const stats = getPlatformStats(shifts)
    expect(stats.length).toBe(1)
    expect(stats[0].earnings).toBe(220)
    expect(stats[0].hours).toBe(9)
    expect(stats[0].trips).toBe(11)
  })

  it('sorts by total earnings descending', () => {
    const shifts = [
      makeShift({ platform: 'uber', earnings: 100 }),
      makeShift({ id: '2', platform: 'lyft', earnings: 200 }),
    ]
    const stats = getPlatformStats(shifts)
    expect(stats[0].earnings).toBeGreaterThan(stats[1].earnings)
  })

  it('calculates average rate correctly', () => {
    const shifts = [makeShift({ platform: 'uber', earnings: 200, hours: 8 })]
    const stats = getPlatformStats(shifts)
    expect(stats[0].averageRate).toBe(25)
  })
})

describe('formatCurrency', () => {
  it('formats a number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats whole numbers with two decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(10000)).toBe('$10,000.00')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-50)).toContain('50.00')
  })
})

describe('formatHours', () => {
  it('formats whole hours without minutes', () => {
    expect(formatHours(8)).toBe('8h')
  })

  it('formats hours with minutes', () => {
    expect(formatHours(8.5)).toBe('8h 30m')
  })

  it('formats zero hours', () => {
    expect(formatHours(0)).toBe('0h')
  })

  it('formats fractional hours correctly', () => {
    expect(formatHours(1.25)).toBe('1h 15m')
  })

  it('handles minutes rounding', () => {
    expect(formatHours(1.0167)).toBe('1h 1m')
  })
})

describe('getDailyEarnings', () => {
  it('returns empty array for empty shifts', () => {
    expect(getDailyEarnings([])).toEqual([])
  })

  it('groups shifts by date', () => {
    const shifts = [
      makeShift({ date: '2024-03-04', earnings: 100, trips: 5, hours: 4 }),
      makeShift({ id: '2', date: '2024-03-05', earnings: 120, trips: 6, hours: 5 }),
    ]
    const daily = getDailyEarnings(shifts)
    expect(daily.length).toBe(2)
  })

  it('aggregates multiple shifts on the same date', () => {
    const shifts = [
      makeShift({ date: '2024-03-04', earnings: 100, trips: 5, hours: 4 }),
      makeShift({ id: '2', date: '2024-03-04', earnings: 80, trips: 4, hours: 3 }),
    ]
    const daily = getDailyEarnings(shifts)
    expect(daily.length).toBe(1)
    expect(daily[0].earnings).toBe(180)
    expect(daily[0].trips).toBe(9)
    expect(daily[0].hours).toBe(7)
  })

  it('sorts dates in descending order (most recent first)', () => {
    const shifts = [
      makeShift({ date: '2024-03-01', earnings: 100, trips: 5, hours: 4 }),
      makeShift({ id: '2', date: '2024-03-05', earnings: 120, trips: 6, hours: 5 }),
    ]
    const daily = getDailyEarnings(shifts)
    expect(daily[0].date).toBe('2024-03-05')
    expect(daily[1].date).toBe('2024-03-01')
  })
})

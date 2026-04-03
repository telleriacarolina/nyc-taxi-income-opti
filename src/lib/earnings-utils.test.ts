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

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeShift(overrides: Partial<Shift> = {}): Shift {
  return {
    id: '1',
    date: '2024-01-15', // Monday
    startTime: '09:00',
    endTime: '17:00',
    platform: 'uber',
    earnings: 100,
    hours: 8,
    trips: 10,
    tips: 20,
    expenses: 15,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// calculateStats
// ---------------------------------------------------------------------------

describe('calculateStats', () => {
  it('returns zero stats for an empty array', () => {
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
    const shift = makeShift()
    const stats = calculateStats([shift])
    expect(stats.totalEarnings).toBe(100)
    expect(stats.totalHours).toBe(8)
    expect(stats.totalTrips).toBe(10)
    expect(stats.totalTips).toBe(20)
    expect(stats.totalExpenses).toBe(15)
    expect(stats.netEarnings).toBe(85)
  })

  it('calculates averages correctly', () => {
    const shift = makeShift({ earnings: 80, hours: 8, trips: 10 })
    const stats = calculateStats([shift])
    expect(stats.averageHourlyRate).toBe(10) // 80 / 8
    expect(stats.averageTripEarnings).toBe(8) // 80 / 10
  })

  it('handles shifts with no tips or expenses', () => {
    const shift = makeShift({ tips: undefined, expenses: undefined })
    const stats = calculateStats([shift])
    expect(stats.totalTips).toBe(0)
    expect(stats.totalExpenses).toBe(0)
    expect(stats.netEarnings).toBe(100)
  })

  it('aggregates multiple shifts correctly', () => {
    const shifts = [
      makeShift({ id: '1', earnings: 100, hours: 4, trips: 5, tips: 10, expenses: 5 }),
      makeShift({ id: '2', earnings: 200, hours: 8, trips: 15, tips: 30, expenses: 20, platform: 'lyft' }),
    ]
    const stats = calculateStats(shifts)
    expect(stats.totalEarnings).toBe(300)
    expect(stats.totalHours).toBe(12)
    expect(stats.totalTrips).toBe(20)
    expect(stats.totalTips).toBe(40)
    expect(stats.totalExpenses).toBe(25)
    expect(stats.netEarnings).toBe(275)
  })

  it('identifies the top platform by total earnings', () => {
    const shifts = [
      makeShift({ id: '1', platform: 'uber', earnings: 50 }),
      makeShift({ id: '2', platform: 'lyft', earnings: 200 }),
    ]
    const stats = calculateStats(shifts)
    expect(stats.topPlatform).toBe('Lyft')
  })

  it('returns averageHourlyRate of 0 when totalHours is 0', () => {
    const shift = makeShift({ hours: 0 })
    const stats = calculateStats([shift])
    expect(stats.averageHourlyRate).toBe(0)
  })

  it('returns averageTripEarnings of 0 when totalTrips is 0', () => {
    const shift = makeShift({ trips: 0 })
    const stats = calculateStats([shift])
    expect(stats.averageTripEarnings).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// getHourlyPatterns
// ---------------------------------------------------------------------------

describe('getHourlyPatterns', () => {
  it('returns empty array for no shifts', () => {
    expect(getHourlyPatterns([])).toEqual([])
  })

  it('produces patterns for hours spanning start to end time', () => {
    const shift = makeShift({ startTime: '08:00', endTime: '10:00', earnings: 30, hours: 3, trips: 3 })
    const patterns = getHourlyPatterns([shift])
    const hours = patterns.map(p => p.hour)
    expect(hours).toContain('08:00')
    expect(hours).toContain('09:00')
    expect(hours).toContain('10:00')
  })

  it('returns patterns sorted by hour ascending', () => {
    const shift = makeShift({ startTime: '06:00', endTime: '12:00', hours: 7, earnings: 70, trips: 7 })
    const patterns = getHourlyPatterns([shift])
    const hourInts = patterns.map(p => parseInt(p.hour))
    for (let i = 1; i < hourInts.length; i++) {
      expect(hourInts[i]).toBeGreaterThan(hourInts[i - 1])
    }
  })

  it('pads single-digit hours with a leading zero', () => {
    const shift = makeShift({ startTime: '07:00', endTime: '07:00', hours: 1, earnings: 10, trips: 1 })
    const patterns = getHourlyPatterns([shift])
    expect(patterns[0].hour).toBe('07:00')
  })
})

// ---------------------------------------------------------------------------
// getDailyPatterns
// ---------------------------------------------------------------------------

describe('getDailyPatterns', () => {
  it('returns empty array for no shifts', () => {
    expect(getDailyPatterns([])).toEqual([])
  })

  it('groups shifts by day of week', () => {
    const monday = makeShift({ id: '1', date: '2024-01-15', earnings: 80, hours: 8 }) // Monday
    const tuesday = makeShift({ id: '2', date: '2024-01-16', earnings: 100, hours: 8 }) // Tuesday
    const patterns = getDailyPatterns([monday, tuesday])
    const days = patterns.map(p => p.day)
    expect(days).toContain('Monday')
    expect(days).toContain('Tuesday')
  })

  it('accumulates earnings from multiple shifts on the same day', () => {
    const shift1 = makeShift({ id: '1', date: '2024-01-15', earnings: 40, hours: 4 }) // Monday
    const shift2 = makeShift({ id: '2', date: '2024-01-22', earnings: 60, hours: 4 }) // Monday
    const patterns = getDailyPatterns([shift1, shift2])
    const monday = patterns.find(p => p.day === 'Monday')!
    expect(monday.earnings).toBe(100)
    expect(monday.hours).toBe(8)
  })

  it('calculates averageRate as earnings / hours', () => {
    const shift = makeShift({ date: '2024-01-15', earnings: 90, hours: 9 }) // Monday
    const patterns = getDailyPatterns([shift])
    const monday = patterns.find(p => p.day === 'Monday')!
    expect(monday.averageRate).toBeCloseTo(10)
  })

  it('returns averageRate of 0 when hours is 0', () => {
    const shift = makeShift({ date: '2024-01-15', earnings: 100, hours: 0 }) // Monday
    const patterns = getDailyPatterns([shift])
    const monday = patterns.find(p => p.day === 'Monday')!
    expect(monday.averageRate).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// getPlatformStats
// ---------------------------------------------------------------------------

describe('getPlatformStats', () => {
  it('returns empty array for no shifts', () => {
    expect(getPlatformStats([])).toEqual([])
  })

  it('groups and aggregates earnings by platform', () => {
    const shifts = [
      makeShift({ id: '1', platform: 'uber', earnings: 100, hours: 4, trips: 5 }),
      makeShift({ id: '2', platform: 'uber', earnings: 50, hours: 2, trips: 3 }),
      makeShift({ id: '3', platform: 'lyft', earnings: 200, hours: 8, trips: 12 }),
    ]
    const stats = getPlatformStats(shifts)
    const uber = stats.find(s => s.platform === 'Uber')!
    const lyft = stats.find(s => s.platform === 'Lyft')!
    expect(uber.earnings).toBe(150)
    expect(uber.hours).toBe(6)
    expect(uber.trips).toBe(8)
    expect(lyft.earnings).toBe(200)
  })

  it('capitalises platform names', () => {
    const shift = makeShift({ platform: 'via' })
    const stats = getPlatformStats([shift])
    expect(stats[0].platform).toBe('Via')
  })

  it('sorts platforms by total earnings descending', () => {
    const shifts = [
      makeShift({ id: '1', platform: 'lyft', earnings: 50 }),
      makeShift({ id: '2', platform: 'uber', earnings: 300 }),
    ]
    const stats = getPlatformStats(shifts)
    expect(stats[0].platform).toBe('Uber')
    expect(stats[1].platform).toBe('Lyft')
  })

  it('computes averageRate as earnings / hours', () => {
    const shift = makeShift({ platform: 'uber', earnings: 120, hours: 8 })
    const stats = getPlatformStats([shift])
    expect(stats[0].averageRate).toBe(15)
  })

  it('returns averageRate of 0 when hours is 0', () => {
    const shift = makeShift({ platform: 'uber', earnings: 100, hours: 0 })
    const stats = getPlatformStats([shift])
    expect(stats[0].averageRate).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------

describe('formatCurrency', () => {
  it('formats a positive number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats zero as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats negative values', () => {
    expect(formatCurrency(-50)).toBe('-$50.00')
  })

  it('uses two decimal places', () => {
    expect(formatCurrency(5)).toBe('$5.00')
    expect(formatCurrency(5.1)).toBe('$5.10')
  })
})

// ---------------------------------------------------------------------------
// formatHours
// ---------------------------------------------------------------------------

describe('formatHours', () => {
  it('formats whole hours without minutes', () => {
    expect(formatHours(3)).toBe('3h')
  })

  it('includes minutes when non-zero', () => {
    expect(formatHours(2.5)).toBe('2h 30m')
  })

  it('handles zero hours', () => {
    expect(formatHours(0)).toBe('0h')
  })

  it('rounds minutes correctly', () => {
    expect(formatHours(1.75)).toBe('1h 45m')
  })
})

// ---------------------------------------------------------------------------
// getDailyEarnings
// ---------------------------------------------------------------------------

describe('getDailyEarnings', () => {
  it('returns empty array for no shifts', () => {
    expect(getDailyEarnings([])).toEqual([])
  })

  it('groups multiple shifts on the same date', () => {
    const shifts = [
      makeShift({ id: '1', date: '2024-01-15', earnings: 40, trips: 4, hours: 4 }),
      makeShift({ id: '2', date: '2024-01-15', earnings: 60, trips: 6, hours: 4 }),
    ]
    const daily = getDailyEarnings(shifts)
    expect(daily).toHaveLength(1)
    expect(daily[0].earnings).toBe(100)
    expect(daily[0].trips).toBe(10)
    expect(daily[0].hours).toBe(8)
  })

  it('sorts results by date descending (most recent first)', () => {
    const shifts = [
      makeShift({ id: '1', date: '2024-01-10', earnings: 80, trips: 8, hours: 8 }),
      makeShift({ id: '2', date: '2024-01-20', earnings: 100, trips: 10, hours: 8 }),
    ]
    const daily = getDailyEarnings(shifts)
    expect(daily[0].date).toBe('2024-01-20')
    expect(daily[1].date).toBe('2024-01-10')
  })

  it('sets the correct date string on each entry', () => {
    const shift = makeShift({ date: '2024-03-05' })
    const daily = getDailyEarnings([shift])
    expect(daily[0].date).toBe('2024-03-05')
  })
})

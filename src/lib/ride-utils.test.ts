import { describe, it, expect } from 'vitest'
import {
  calculateRideStats,
  getPlatformRideStats,
  formatDistance,
  formatDuration,
  getRideEfficiencyScore,
} from './ride-utils'
import { Ride } from './ride-types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeRide(overrides: Partial<Ride> = {}): Ride {
  return {
    id: '1',
    date: '2024-01-15',
    time: '09:00',
    platform: 'uber',
    pickupLocation: 'Times Square',
    dropoffLocation: 'JFK Airport',
    distance: 20,
    duration: 45,
    grossPay: 40,
    fees: 8,
    netPay: 32,
    vehicleType: 'gas',
    fuelCost: 4,
    rating: 5,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// calculateRideStats
// ---------------------------------------------------------------------------

describe('calculateRideStats', () => {
  it('returns zero stats for an empty array', () => {
    const stats = calculateRideStats([])
    expect(stats.totalRides).toBe(0)
    expect(stats.totalDistance).toBe(0)
    expect(stats.totalDuration).toBe(0)
    expect(stats.totalGrossPay).toBe(0)
    expect(stats.totalFees).toBe(0)
    expect(stats.totalNetPay).toBe(0)
    expect(stats.totalFuelCost).toBe(0)
    expect(stats.totalProfit).toBe(0)
    expect(stats.bestRide).toBeNull()
    expect(stats.worstRide).toBeNull()
  })

  it('calculates totals correctly for a single ride', () => {
    const ride = makeRide()
    const stats = calculateRideStats([ride])
    expect(stats.totalRides).toBe(1)
    expect(stats.totalDistance).toBe(20)
    expect(stats.totalDuration).toBe(45)
    expect(stats.totalGrossPay).toBe(40)
    expect(stats.totalFees).toBe(8)
    expect(stats.totalNetPay).toBe(32)
    expect(stats.totalFuelCost).toBe(4)
    expect(stats.totalProfit).toBe(28) // 32 - 4
  })

  it('aggregates totals across multiple rides', () => {
    const rides = [
      makeRide({ id: '1', distance: 10, duration: 20, grossPay: 20, fees: 4, netPay: 16, fuelCost: 2 }),
      makeRide({ id: '2', distance: 15, duration: 30, grossPay: 30, fees: 6, netPay: 24, fuelCost: 3 }),
    ]
    const stats = calculateRideStats(rides)
    expect(stats.totalRides).toBe(2)
    expect(stats.totalDistance).toBe(25)
    expect(stats.totalDuration).toBe(50)
    expect(stats.totalGrossPay).toBe(50)
    expect(stats.totalFees).toBe(10)
    expect(stats.totalNetPay).toBe(40)
    expect(stats.totalFuelCost).toBe(5)
    expect(stats.totalProfit).toBe(35)
  })

  it('calculates averages correctly', () => {
    const rides = [
      makeRide({ id: '1', distance: 10, duration: 20, grossPay: 20, fees: 4, netPay: 16, fuelCost: 2 }),
      makeRide({ id: '2', distance: 30, duration: 40, grossPay: 60, fees: 12, netPay: 48, fuelCost: 6 }),
    ]
    const stats = calculateRideStats(rides)
    expect(stats.averageDistance).toBe(20) // 40 / 2
    expect(stats.averageNetPay).toBe(32)   // 64 / 2
    expect(stats.averagePayPerMile).toBeCloseTo(64 / 40) // totalNetPay / totalDistance
  })

  it('handles rides with no fuelCost', () => {
    const ride = makeRide({ fuelCost: undefined })
    const stats = calculateRideStats([ride])
    expect(stats.totalFuelCost).toBe(0)
    expect(stats.totalProfit).toBe(32)
  })

  it('returns averagePayPerMile of 0 when totalDistance is 0', () => {
    const ride = makeRide({ distance: 0 })
    const stats = calculateRideStats([ride])
    expect(stats.averagePayPerMile).toBe(0)
  })

  it('returns averagePayPerMinute of 0 when totalDuration is 0', () => {
    const ride = makeRide({ duration: 0 })
    const stats = calculateRideStats([ride])
    expect(stats.averagePayPerMinute).toBe(0)
  })

  it('identifies best and worst rides by profitPerMile', () => {
    const highProfit = makeRide({ id: '1', distance: 5, netPay: 50, fuelCost: 0 })   // 10 $/mi
    const lowProfit = makeRide({ id: '2', distance: 20, netPay: 20, fuelCost: 10 })  // 0.5 $/mi
    const stats = calculateRideStats([highProfit, lowProfit])
    expect(stats.bestRide?.id).toBe('1')
    expect(stats.worstRide?.id).toBe('2')
  })
})

// ---------------------------------------------------------------------------
// getPlatformRideStats
// ---------------------------------------------------------------------------

describe('getPlatformRideStats', () => {
  it('returns empty array for no rides', () => {
    expect(getPlatformRideStats([])).toEqual([])
  })

  it('groups rides by platform and aggregates totals', () => {
    const rides = [
      makeRide({ id: '1', platform: 'uber', distance: 10, duration: 20, grossPay: 20, fees: 4, netPay: 16, fuelCost: 2 }),
      makeRide({ id: '2', platform: 'uber', distance: 10, duration: 20, grossPay: 20, fees: 4, netPay: 16, fuelCost: 2 }),
      makeRide({ id: '3', platform: 'lyft', distance: 15, duration: 30, grossPay: 30, fees: 6, netPay: 24, fuelCost: 3 }),
    ]
    const stats = getPlatformRideStats(rides)
    const uber = stats.find(s => s.platform === 'Uber')!
    const lyft = stats.find(s => s.platform === 'Lyft')!
    expect(uber.rides).toBe(2)
    expect(uber.totalDistance).toBe(20)
    expect(uber.totalNetPay).toBe(32)
    expect(lyft.rides).toBe(1)
  })

  it('capitalises platform names', () => {
    const ride = makeRide({ platform: 'via' })
    const stats = getPlatformRideStats([ride])
    expect(stats[0].platform).toBe('Via')
  })

  it('calculates feePercentage correctly', () => {
    const ride = makeRide({ grossPay: 40, fees: 8 })
    const stats = getPlatformRideStats([ride])
    expect(stats[0].feePercentage).toBeCloseTo(20) // 8/40 * 100
  })

  it('returns feePercentage of 0 when grossPay is 0', () => {
    const ride = makeRide({ grossPay: 0, fees: 0 })
    const stats = getPlatformRideStats([ride])
    expect(stats[0].feePercentage).toBe(0)
  })

  it('computes averageProfitPerMile correctly', () => {
    const ride = makeRide({ distance: 10, netPay: 30, fuelCost: 10 })
    const stats = getPlatformRideStats([ride])
    expect(stats[0].averageProfitPerMile).toBe(2) // (30-10)/10
  })

  it('sorts platforms by averageProfitPerMile descending', () => {
    const rides = [
      makeRide({ id: '1', platform: 'lyft', distance: 10, netPay: 20, fuelCost: 10 }),   // 1 $/mi
      makeRide({ id: '2', platform: 'uber', distance: 5, netPay: 50, fuelCost: 0 }),     // 10 $/mi
    ]
    const stats = getPlatformRideStats(rides)
    expect(stats[0].platform).toBe('Uber')
    expect(stats[1].platform).toBe('Lyft')
  })
})

// ---------------------------------------------------------------------------
// formatDistance
// ---------------------------------------------------------------------------

describe('formatDistance', () => {
  it('formats a distance with one decimal and "mi" suffix', () => {
    expect(formatDistance(5.75)).toBe('5.8 mi')
  })

  it('formats zero distance', () => {
    expect(formatDistance(0)).toBe('0.0 mi')
  })

  it('rounds to one decimal place', () => {
    expect(formatDistance(12.349)).toBe('12.3 mi')
    expect(formatDistance(12.36)).toBe('12.4 mi')
  })
})

// ---------------------------------------------------------------------------
// formatDuration
// ---------------------------------------------------------------------------

describe('formatDuration', () => {
  it('formats durations under an hour as minutes only', () => {
    expect(formatDuration(45)).toBe('45m')
  })

  it('formats durations of exactly one hour', () => {
    expect(formatDuration(60)).toBe('1h 0m')
  })

  it('formats durations longer than one hour', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })

  it('formats zero minutes', () => {
    expect(formatDuration(0)).toBe('0m')
  })

  it('rounds fractional minutes', () => {
    expect(formatDuration(61.6)).toBe('1h 2m')
  })
})

// ---------------------------------------------------------------------------
// getRideEfficiencyScore
// ---------------------------------------------------------------------------

describe('getRideEfficiencyScore', () => {
  it('returns a score between 0 and 5 (inclusive)', () => {
    const ride = makeRide()
    const score = getRideEfficiencyScore(ride)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(5)
  })

  it('returns an integer score', () => {
    const ride = makeRide()
    expect(Number.isInteger(getRideEfficiencyScore(ride))).toBe(true)
  })

  it('returns 0 when distance and duration are both 0', () => {
    const ride = makeRide({ distance: 0, duration: 0 })
    expect(getRideEfficiencyScore(ride)).toBe(0)
  })

  it('returns a higher score for a high pay-per-mile/minute ride', () => {
    const highEfficiency = makeRide({ distance: 2, duration: 5, netPay: 20 })
    const lowEfficiency = makeRide({ distance: 30, duration: 90, netPay: 10 })
    expect(getRideEfficiencyScore(highEfficiency)).toBeGreaterThan(getRideEfficiencyScore(lowEfficiency))
  })

  it('caps normalised pay-per-mile at 1 (max score stays at 5)', () => {
    const extremeRide = makeRide({ distance: 1, duration: 1, netPay: 1000 })
    expect(getRideEfficiencyScore(extremeRide)).toBe(5)
  })
})

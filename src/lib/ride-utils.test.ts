import { describe, it, expect } from 'vitest'
import {
  calculateRideStats,
  getPlatformRideStats,
  formatDistance,
  formatDuration,
  getRideEfficiencyScore,
} from './ride-utils'
import { Ride } from './ride-types'

const makeRide = (overrides: Partial<Ride> = {}): Ride => ({
  id: '1',
  date: '2024-03-04',
  time: '10:00',
  platform: 'uber',
  pickupLocation: 'JFK Airport',
  dropoffLocation: 'Times Square',
  distance: 20,
  duration: 45,
  grossPay: 35,
  fees: 5,
  netPay: 30,
  ...overrides,
})

describe('calculateRideStats', () => {
  it('returns zero stats for empty rides array', () => {
    const stats = calculateRideStats([])
    expect(stats.totalRides).toBe(0)
    expect(stats.totalDistance).toBe(0)
    expect(stats.totalDuration).toBe(0)
    expect(stats.totalGrossPay).toBe(0)
    expect(stats.totalFees).toBe(0)
    expect(stats.totalNetPay).toBe(0)
    expect(stats.totalFuelCost).toBe(0)
    expect(stats.totalProfit).toBe(0)
    expect(stats.averageDistance).toBe(0)
    expect(stats.averageDuration).toBe(0)
    expect(stats.averageNetPay).toBe(0)
    expect(stats.bestRide).toBeNull()
    expect(stats.worstRide).toBeNull()
  })

  it('calculates totals correctly for a single ride', () => {
    const rides = [makeRide({ distance: 10, duration: 20, grossPay: 25, fees: 3, netPay: 22, fuelCost: 2 })]
    const stats = calculateRideStats(rides)
    expect(stats.totalRides).toBe(1)
    expect(stats.totalDistance).toBe(10)
    expect(stats.totalDuration).toBe(20)
    expect(stats.totalGrossPay).toBe(25)
    expect(stats.totalFees).toBe(3)
    expect(stats.totalNetPay).toBe(22)
    expect(stats.totalFuelCost).toBe(2)
    expect(stats.totalProfit).toBe(20)
  })

  it('sums totals for multiple rides', () => {
    const rides = [
      makeRide({ distance: 10, duration: 20, grossPay: 25, fees: 3, netPay: 22 }),
      makeRide({ id: '2', distance: 15, duration: 30, grossPay: 40, fees: 5, netPay: 35 }),
    ]
    const stats = calculateRideStats(rides)
    expect(stats.totalRides).toBe(2)
    expect(stats.totalDistance).toBe(25)
    expect(stats.totalDuration).toBe(50)
    expect(stats.totalGrossPay).toBe(65)
    expect(stats.totalNetPay).toBe(57)
  })

  it('calculates averages correctly', () => {
    const rides = [
      makeRide({ distance: 10, duration: 20, netPay: 20 }),
      makeRide({ id: '2', distance: 20, duration: 40, netPay: 40 }),
    ]
    const stats = calculateRideStats(rides)
    expect(stats.averageDistance).toBe(15)
    expect(stats.averageDuration).toBe(30)
    expect(stats.averageNetPay).toBe(30)
  })

  it('calculates pay per mile and pay per minute', () => {
    const rides = [makeRide({ distance: 10, duration: 20, netPay: 20 })]
    const stats = calculateRideStats(rides)
    expect(stats.averagePayPerMile).toBe(2)
    expect(stats.averagePayPerMinute).toBe(1)
  })

  it('identifies best and worst rides', () => {
    const rides = [
      makeRide({ id: '1', distance: 5, netPay: 50, fuelCost: 0 }),  // $10/mile
      makeRide({ id: '2', distance: 20, netPay: 20, fuelCost: 0 }), // $1/mile
    ]
    const stats = calculateRideStats(rides)
    expect(stats.bestRide?.id).toBe('1')
    expect(stats.worstRide?.id).toBe('2')
  })

  it('handles rides without fuelCost (treats as zero)', () => {
    const rides = [makeRide({ netPay: 30 })]
    const stats = calculateRideStats(rides)
    expect(stats.totalFuelCost).toBe(0)
    expect(stats.totalProfit).toBe(30)
  })
})

describe('getPlatformRideStats', () => {
  it('returns empty array for empty rides', () => {
    expect(getPlatformRideStats([])).toEqual([])
  })

  it('groups rides by platform', () => {
    const rides = [
      makeRide({ platform: 'uber' }),
      makeRide({ id: '2', platform: 'lyft' }),
    ]
    const stats = getPlatformRideStats(rides)
    expect(stats.length).toBe(2)
    const platforms = stats.map(s => s.platform)
    expect(platforms).toContain('Uber')
    expect(platforms).toContain('Lyft')
  })

  it('capitalizes platform names', () => {
    const rides = [makeRide({ platform: 'uber' })]
    const stats = getPlatformRideStats(rides)
    expect(stats[0].platform).toBe('Uber')
  })

  it('aggregates multiple rides for the same platform', () => {
    const rides = [
      makeRide({ platform: 'uber', distance: 10, netPay: 20, grossPay: 25, fees: 5 }),
      makeRide({ id: '2', platform: 'uber', distance: 15, netPay: 30, grossPay: 38, fees: 8 }),
    ]
    const stats = getPlatformRideStats(rides)
    expect(stats.length).toBe(1)
    expect(stats[0].rides).toBe(2)
    expect(stats[0].totalDistance).toBe(25)
    expect(stats[0].totalNetPay).toBe(50)
    expect(stats[0].totalFees).toBe(13)
  })

  it('calculates fee percentage correctly', () => {
    const rides = [makeRide({ grossPay: 40, fees: 8, netPay: 32 })]
    const stats = getPlatformRideStats(rides)
    expect(stats[0].feePercentage).toBe(20)
  })

  it('sorts by average profit per mile descending', () => {
    const rides = [
      makeRide({ platform: 'uber', distance: 20, netPay: 20, fuelCost: 0 }), // $1/mile
      makeRide({ id: '2', platform: 'lyft', distance: 5, netPay: 50, fuelCost: 0 }), // $10/mile
    ]
    const stats = getPlatformRideStats(rides)
    expect(stats[0].platform).toBe('Lyft')
  })

  it('handles zero total distance gracefully', () => {
    const rides = [makeRide({ platform: 'uber', distance: 0, netPay: 20 })]
    const stats = getPlatformRideStats(rides)
    expect(stats[0].averagePayPerMile).toBe(0)
    expect(stats[0].averageProfitPerMile).toBe(0)
  })
})

describe('formatDistance', () => {
  it('formats distance with one decimal place', () => {
    expect(formatDistance(10.5)).toBe('10.5 mi')
  })

  it('formats whole number with one decimal', () => {
    expect(formatDistance(10)).toBe('10.0 mi')
  })

  it('formats zero distance', () => {
    expect(formatDistance(0)).toBe('0.0 mi')
  })

  it('appends mi suffix', () => {
    expect(formatDistance(5.25)).toContain('mi')
  })
})

describe('formatDuration', () => {
  it('formats duration over one hour', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })

  it('formats duration under one hour', () => {
    expect(formatDuration(45)).toBe('45m')
  })

  it('formats exactly one hour', () => {
    expect(formatDuration(60)).toBe('1h 0m')
  })

  it('formats zero minutes', () => {
    expect(formatDuration(0)).toBe('0m')
  })

  it('formats multiple hours', () => {
    expect(formatDuration(150)).toBe('2h 30m')
  })
})

describe('getRideEfficiencyScore', () => {
  it('returns a score between 0 and 5', () => {
    const ride = makeRide({ distance: 10, duration: 30, netPay: 25 })
    const score = getRideEfficiencyScore(ride)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(5)
  })

  it('returns higher score for more profitable rides', () => {
    const goodRide = makeRide({ distance: 5, duration: 10, netPay: 50 })
    const badRide = makeRide({ id: '2', distance: 20, duration: 60, netPay: 5 })
    expect(getRideEfficiencyScore(goodRide)).toBeGreaterThan(getRideEfficiencyScore(badRide))
  })

  it('returns 0 for a ride with zero distance and zero duration', () => {
    const ride = makeRide({ distance: 0, duration: 0, netPay: 0 })
    expect(getRideEfficiencyScore(ride)).toBe(0)
  })

  it('returns integer score', () => {
    const ride = makeRide({ distance: 10, duration: 30, netPay: 25 })
    const score = getRideEfficiencyScore(ride)
    expect(Number.isInteger(score)).toBe(true)
  })

  it('caps score at 5 for very high-paying rides', () => {
    const ride = makeRide({ distance: 1, duration: 1, netPay: 1000 })
    expect(getRideEfficiencyScore(ride)).toBe(5)
  })
})

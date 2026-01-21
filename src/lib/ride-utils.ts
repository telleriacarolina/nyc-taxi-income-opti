import { Ride, RideStats, PlatformRideStats } from './ride-types'

export function calculateRideStats(rides: Ride[]): RideStats {
  if (rides.length === 0) {
    return {
      totalRides: 0,
      totalDistance: 0,
      totalDuration: 0,
      totalGrossPay: 0,
      totalFees: 0,
      totalNetPay: 0,
      totalFuelCost: 0,
      totalProfit: 0,
      averageDistance: 0,
      averageDuration: 0,
      averageNetPay: 0,
      averagePayPerMile: 0,
      averagePayPerMinute: 0,
      averageFuelCost: 0,
      averageFuelCostPerMile: 0,
      averageProfit: 0,
      averageProfitPerMile: 0,
      bestRide: null,
      worstRide: null
    }
  }

  const totalDistance = rides.reduce((sum, r) => sum + r.distance, 0)
  const totalDuration = rides.reduce((sum, r) => sum + r.duration, 0)
  const totalGrossPay = rides.reduce((sum, r) => sum + r.grossPay, 0)
  const totalFees = rides.reduce((sum, r) => sum + r.fees, 0)
  const totalNetPay = rides.reduce((sum, r) => sum + r.netPay, 0)
  const totalFuelCost = rides.reduce((sum, r) => sum + (r.fuelCost || 0), 0)
  const totalProfit = totalNetPay - totalFuelCost

  const ridesWithRates = rides.map(ride => ({
    ...ride,
    payPerMile: ride.distance > 0 ? ride.netPay / ride.distance : 0,
    payPerMinute: ride.duration > 0 ? ride.netPay / ride.duration : 0,
    profitPerMile: ride.distance > 0 ? (ride.netPay - (ride.fuelCost || 0)) / ride.distance : 0
  }))

  const bestRide = ridesWithRates.reduce((best, curr) => 
    curr.profitPerMile > best.profitPerMile ? curr : best
  )

  const worstRide = ridesWithRates.reduce((worst, curr) => 
    curr.profitPerMile < worst.profitPerMile ? curr : worst
  )

  return {
    totalRides: rides.length,
    totalDistance,
    totalDuration,
    totalGrossPay,
    totalFees,
    totalNetPay,
    totalFuelCost,
    totalProfit,
    averageDistance: totalDistance / rides.length,
    averageDuration: totalDuration / rides.length,
    averageNetPay: totalNetPay / rides.length,
    averagePayPerMile: totalDistance > 0 ? totalNetPay / totalDistance : 0,
    averagePayPerMinute: totalDuration > 0 ? totalNetPay / totalDuration : 0,
    averageFuelCost: totalFuelCost / rides.length,
    averageFuelCostPerMile: totalDistance > 0 ? totalFuelCost / totalDistance : 0,
    averageProfit: totalProfit / rides.length,
    averageProfitPerMile: totalDistance > 0 ? totalProfit / totalDistance : 0,
    bestRide,
    worstRide
  }
}

export function getPlatformRideStats(rides: Ride[]): PlatformRideStats[] {
  const platformData: Record<string, {
    rides: number
    totalDistance: number
    totalDuration: number
    totalNetPay: number
    totalGrossPay: number
    totalFees: number
    totalFuelCost: number
  }> = {}

  rides.forEach(ride => {
    if (!platformData[ride.platform]) {
      platformData[ride.platform] = {
        rides: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalNetPay: 0,
        totalGrossPay: 0,
        totalFees: 0,
        totalFuelCost: 0
      }
    }
    platformData[ride.platform].rides += 1
    platformData[ride.platform].totalDistance += ride.distance
    platformData[ride.platform].totalDuration += ride.duration
    platformData[ride.platform].totalNetPay += ride.netPay
    platformData[ride.platform].totalGrossPay += ride.grossPay
    platformData[ride.platform].totalFees += ride.fees
    platformData[ride.platform].totalFuelCost += ride.fuelCost || 0
  })

  return Object.entries(platformData)
    .map(([platform, data]) => {
      const totalProfit = data.totalNetPay - data.totalFuelCost
      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        rides: data.rides,
        totalDistance: data.totalDistance,
        totalNetPay: data.totalNetPay,
        averagePayPerMile: data.totalDistance > 0 ? data.totalNetPay / data.totalDistance : 0,
        averagePayPerMinute: data.totalDuration > 0 ? data.totalNetPay / data.totalDuration : 0,
        totalFees: data.totalFees,
        feePercentage: data.totalGrossPay > 0 ? (data.totalFees / data.totalGrossPay) * 100 : 0,
        totalFuelCost: data.totalFuelCost,
        totalProfit,
        averageProfitPerMile: data.totalDistance > 0 ? totalProfit / data.totalDistance : 0
      }
    })
    .sort((a, b) => b.averageProfitPerMile - a.averageProfitPerMile)
}

export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} mi`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function getRideEfficiencyScore(ride: Ride): number {
  const payPerMile = ride.distance > 0 ? ride.netPay / ride.distance : 0
  const payPerMinute = ride.duration > 0 ? ride.netPay / ride.duration : 0
  
  const normalizedPayPerMile = Math.min(payPerMile / 3, 1)
  const normalizedPayPerMinute = Math.min(payPerMinute / 1, 1)
  
  return Math.round(((normalizedPayPerMile * 0.6) + (normalizedPayPerMinute * 0.4)) * 5)
}

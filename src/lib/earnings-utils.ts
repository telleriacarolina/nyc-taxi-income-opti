import { Shift, EarningsStats, HourlyPattern, DailyPattern, PlatformStats } from './earnings-types'
import { parseISO, format, getHours, getDay } from 'date-fns'

export function calculateStats(shifts: Shift[]): EarningsStats {
  if (shifts.length === 0) {
    return {
      totalEarnings: 0,
      totalHours: 0,
      totalTrips: 0,
      totalTips: 0,
      totalExpenses: 0,
      netEarnings: 0,
      averageHourlyRate: 0,
      averageTripEarnings: 0,
      bestHour: 'N/A',
      bestDay: 'N/A',
      topPlatform: 'N/A'
    }
  }

  const totalEarnings = shifts.reduce((sum, s) => sum + s.earnings, 0)
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0)
  const totalTrips = shifts.reduce((sum, s) => sum + s.trips, 0)
  const totalTips = shifts.reduce((sum, s) => sum + (s.tips || 0), 0)
  const totalExpenses = shifts.reduce((sum, s) => sum + (s.expenses || 0), 0)
  const netEarnings = totalEarnings - totalExpenses

  const hourlyPatterns = getHourlyPatterns(shifts)
  const bestHourPattern = hourlyPatterns.length > 0 
    ? hourlyPatterns.reduce((best, curr) => 
        curr.averageRate > best.averageRate ? curr : best
      , hourlyPatterns[0])
    : null

  const dailyPatterns = getDailyPatterns(shifts)
  const bestDayPattern = dailyPatterns.length > 0
    ? dailyPatterns.reduce((best, curr) => 
        curr.averageRate > best.averageRate ? curr : best
      , dailyPatterns[0])
    : null

  const platformStats = getPlatformStats(shifts)
  const topPlatformStat = platformStats.length > 0
    ? platformStats.reduce((best, curr) => 
        curr.earnings > best.earnings ? curr : best
      , platformStats[0])
    : null

  return {
    totalEarnings,
    totalHours,
    totalTrips,
    totalTips,
    totalExpenses,
    netEarnings,
    averageHourlyRate: totalHours > 0 ? totalEarnings / totalHours : 0,
    averageTripEarnings: totalTrips > 0 ? totalEarnings / totalTrips : 0,
    bestHour: bestHourPattern?.hour || 'N/A',
    bestDay: bestDayPattern?.day || 'N/A',
    topPlatform: topPlatformStat?.platform || 'N/A'
  }
}

export function getHourlyPatterns(shifts: Shift[]): HourlyPattern[] {
  const hourlyData: Record<number, { earnings: number; trips: number; count: number }> = {}

  shifts.forEach(shift => {
    const startHour = parseInt(shift.startTime.split(':')[0])
    const endHour = parseInt(shift.endTime.split(':')[0])
    
    for (let hour = startHour; hour <= endHour; hour++) {
      if (!hourlyData[hour]) {
        hourlyData[hour] = { earnings: 0, trips: 0, count: 0 }
      }
      hourlyData[hour].earnings += shift.earnings / shift.hours
      hourlyData[hour].trips += shift.trips / shift.hours
      hourlyData[hour].count += 1
    }
  })

  return Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      earnings: data.earnings,
      trips: Math.round(data.trips),
      averageRate: data.earnings / data.count
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
}

export function getDailyPatterns(shifts: Shift[]): DailyPattern[] {
  const dailyData: Record<number, { earnings: number; hours: number }> = {}
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  shifts.forEach(shift => {
    const dayOfWeek = getDay(parseISO(shift.date))
    if (!dailyData[dayOfWeek]) {
      dailyData[dayOfWeek] = { earnings: 0, hours: 0 }
    }
    dailyData[dayOfWeek].earnings += shift.earnings
    dailyData[dayOfWeek].hours += shift.hours
  })

  return Object.entries(dailyData)
    .map(([day, data]) => ({
      day: dayNames[parseInt(day)],
      earnings: data.earnings,
      hours: data.hours,
      averageRate: data.hours > 0 ? data.earnings / data.hours : 0
    }))
    .sort((a, b) => b.averageRate - a.averageRate)
}

export function getPlatformStats(shifts: Shift[]): PlatformStats[] {
  const platformData: Record<string, { earnings: number; hours: number; trips: number }> = {}

  shifts.forEach(shift => {
    if (!platformData[shift.platform]) {
      platformData[shift.platform] = { earnings: 0, hours: 0, trips: 0 }
    }
    platformData[shift.platform].earnings += shift.earnings
    platformData[shift.platform].hours += shift.hours
    platformData[shift.platform].trips += shift.trips
  })

  return Object.entries(platformData)
    .map(([platform, data]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      earnings: data.earnings,
      hours: data.hours,
      trips: data.trips,
      averageRate: data.hours > 0 ? data.earnings / data.hours : 0
    }))
    .sort((a, b) => b.earnings - a.earnings)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export interface DailyEarnings {
  date: string
  earnings: number
  trips: number
  hours: number
}

export function getDailyEarnings(shifts: Shift[]): DailyEarnings[] {
  const dailyMap: Record<string, DailyEarnings> = {}

  shifts.forEach(shift => {
    if (!dailyMap[shift.date]) {
      dailyMap[shift.date] = {
        date: shift.date,
        earnings: 0,
        trips: 0,
        hours: 0
      }
    }
    dailyMap[shift.date].earnings += shift.earnings
    dailyMap[shift.date].trips += shift.trips
    dailyMap[shift.date].hours += shift.hours
  })

  return Object.values(dailyMap).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

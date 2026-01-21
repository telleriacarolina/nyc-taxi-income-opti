export interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  platform: 'uber' | 'lyft' | 'via' | 'other'
  earnings: number
  hours: number
  trips: number
  tips?: number
  expenses?: number
  notes?: string
}

export interface EarningsStats {
  totalEarnings: number
  totalHours: number
  totalTrips: number
  totalTips: number
  totalExpenses: number
  netEarnings: number
  averageHourlyRate: number
  averageTripEarnings: number
  bestHour: string
  bestDay: string
  topPlatform: string
}

export interface HourlyPattern {
  hour: string
  earnings: number
  trips: number
  averageRate: number
}

export interface DailyPattern {
  day: string
  earnings: number
  hours: number
  averageRate: number
}

export interface PlatformStats {
  platform: string
  earnings: number
  hours: number
  trips: number
  averageRate: number
}

export interface Ride {
  id: string
  date: string
  time: string
  platform: 'uber' | 'lyft' | 'via' | 'curb' | 'revel' | 'juno' | 'other'
  pickupLocation: string
  dropoffLocation: string
  distance: number
  duration: number
  grossPay: number
  fees: number
  netPay: number
  rating?: number
  notes?: string
}

export interface RideStats {
  totalRides: number
  totalDistance: number
  totalDuration: number
  totalGrossPay: number
  totalFees: number
  totalNetPay: number
  averageDistance: number
  averageDuration: number
  averageNetPay: number
  averagePayPerMile: number
  averagePayPerMinute: number
  bestRide: Ride | null
  worstRide: Ride | null
}

export interface PlatformRideStats {
  platform: string
  rides: number
  totalDistance: number
  totalNetPay: number
  averagePayPerMile: number
  averagePayPerMinute: number
  totalFees: number
  feePercentage: number
}

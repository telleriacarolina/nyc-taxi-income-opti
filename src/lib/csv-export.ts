import { Ride } from './ride-types'
import { format } from 'date-fns'

export function generateRideCSV(rides: Ride[]): string {
  const headers = [
    'Date',
    'Time',
    'Platform',
    'Pickup Location',
    'Dropoff Location',
    'Distance (miles)',
    'Duration (minutes)',
    'Gross Pay',
    'Fees',
    'Net Pay',
    'Vehicle Type',
    'Fuel/Charging Cost',
    'Profit',
    'Pay Per Mile',
    'Fuel Cost Per Mile',
    'Profit Per Mile',
    'Pay Per Minute',
    'Rating',
    'Notes'
  ]

  const rows = rides.map(ride => {
    const payPerMile = ride.distance > 0 ? (ride.netPay / ride.distance).toFixed(2) : '0.00'
    const payPerMinute = ride.duration > 0 ? (ride.netPay / ride.duration).toFixed(2) : '0.00'
    const fuelCost = ride.fuelCost || 0
    const profit = ride.netPay - fuelCost
    const fuelCostPerMile = ride.distance > 0 ? (fuelCost / ride.distance).toFixed(2) : '0.00'
    const profitPerMile = ride.distance > 0 ? (profit / ride.distance).toFixed(2) : '0.00'

    return [
      ride.date,
      ride.time,
      ride.platform.charAt(0).toUpperCase() + ride.platform.slice(1),
      escapeCSVField(ride.pickupLocation),
      escapeCSVField(ride.dropoffLocation),
      ride.distance.toFixed(2),
      ride.duration.toString(),
      ride.grossPay.toFixed(2),
      ride.fees.toFixed(2),
      ride.netPay.toFixed(2),
      ride.vehicleType ? ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1) : '',
      fuelCost.toFixed(2),
      profit.toFixed(2),
      payPerMile,
      fuelCostPerMile,
      profitPerMile,
      payPerMinute,
      ride.rating?.toString() || '',
      escapeCSVField(ride.notes || '')
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  return csvContent
}

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function exportRidesToCSV(rides: Ride[], filterDescription: string = ''): void {
  const sortedRides = [...rides].sort((a, b) => {
    const dateTimeA = new Date(a.date + 'T' + a.time).getTime()
    const dateTimeB = new Date(b.date + 'T' + b.time).getTime()
    return dateTimeA - dateTimeB
  })

  const csvContent = generateRideCSV(sortedRides)
  const timestamp = format(new Date(), 'yyyy-MM-dd')
  const filterSuffix = filterDescription ? `_${filterDescription}` : ''
  const filename = `tlc_rides_${timestamp}${filterSuffix}.csv`
  
  downloadCSV(csvContent, filename)
}

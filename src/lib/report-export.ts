interface ShiftData {
  id: string
  date: string
  startTime: string
  endTime: string
  platform: string
  earnings: number
  trips: number
  expenses?: number
  tips?: number
  startLocation?: string
}

interface StatsData {
  totalEarnings: number
  totalExpenses: number
  netEarnings: number
  totalHours: number
  averageHourlyRate: number
  totalTrips: number
  averageTripEarnings: number
  totalTips: number
}

interface LocationInsight {
  location: string
  timeOfDay: string
  reason: string
  expectedEarnings: string
}

interface SeasonalInsight {
  period: string
  locations: string[]
  strategy: string
}

interface AIInsight {
  type: string
  title: string
  content: string
}

export function exportToCSV(shifts: ShiftData[], stats: StatsData): void {
  const csvRows: string[] = []
  
  csvRows.push('TLC Driver Hub - Earnings Report')
  csvRows.push(`Generated: ${new Date().toLocaleString()}`)
  csvRows.push('')
  
  csvRows.push('SUMMARY STATISTICS')
  csvRows.push(`Total Earnings,$${stats.totalEarnings.toFixed(2)}`)
  csvRows.push(`Total Expenses,$${stats.totalExpenses.toFixed(2)}`)
  csvRows.push(`Net Earnings,$${stats.netEarnings.toFixed(2)}`)
  csvRows.push(`Total Hours,${stats.totalHours.toFixed(1)}`)
  csvRows.push(`Average Hourly Rate,$${stats.averageHourlyRate.toFixed(2)}`)
  csvRows.push(`Total Trips,${stats.totalTrips}`)
  csvRows.push(`Average Per Trip,$${stats.averageTripEarnings.toFixed(2)}`)
  csvRows.push(`Total Tips,$${stats.totalTips.toFixed(2)}`)
  csvRows.push('')
  
  csvRows.push('SHIFT DETAILS')
  csvRows.push('Date,Platform,Start Time,End Time,Start Location,Earnings,Trips,Tips,Expenses,Net')
  
  shifts.forEach(shift => {
    const net = shift.earnings - (shift.expenses || 0)
    csvRows.push(
      `${shift.date},${shift.platform},${shift.startTime},${shift.endTime},"${shift.startLocation || 'N/A'}",${shift.earnings.toFixed(2)},${shift.trips},${(shift.tips || 0).toFixed(2)},${(shift.expenses || 0).toFixed(2)},${net.toFixed(2)}`
    )
  })
  
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `tlc-earnings-report-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportInsightsToPDF(
  shifts: ShiftData[],
  stats: StatsData,
  aiInsight?: AIInsight,
  locationInsights?: LocationInsight[],
  seasonalInsights?: SeasonalInsight[]
): void {
  const content: string[] = []
  
  content.push('TLC DRIVER HUB - INSIGHTS REPORT')
  content.push('='.repeat(80))
  content.push(`Generated: ${new Date().toLocaleString()}`)
  content.push('')
  
  content.push('PERFORMANCE SUMMARY')
  content.push('-'.repeat(80))
  content.push(`Net Earnings: $${stats.netEarnings.toFixed(2)}`)
  content.push(`Total Earnings: $${stats.totalEarnings.toFixed(2)}`)
  content.push(`Total Expenses: $${stats.totalExpenses.toFixed(2)}`)
  content.push(`Total Hours: ${stats.totalHours.toFixed(1)} hours`)
  content.push(`Average Hourly Rate: $${stats.averageHourlyRate.toFixed(2)}/hr`)
  content.push(`Total Trips: ${stats.totalTrips}`)
  content.push(`Average Per Trip: $${stats.averageTripEarnings.toFixed(2)}`)
  content.push(`Total Tips: $${stats.totalTips.toFixed(2)} (${stats.totalEarnings > 0 ? ((stats.totalTips / stats.totalEarnings) * 100).toFixed(1) : 0}%)`)
  content.push('')
  
  if (aiInsight) {
    content.push('PERSONALIZED AI INSIGHT')
    content.push('-'.repeat(80))
    content.push(`Type: ${aiInsight.type.toUpperCase()}`)
    content.push(`Title: ${aiInsight.title}`)
    content.push('')
    content.push(wrapText(aiInsight.content, 80))
    content.push('')
  }
  
  if (locationInsights && locationInsights.length > 0) {
    content.push('OPTIMAL TIMES & LOCATIONS')
    content.push('-'.repeat(80))
    locationInsights.forEach((insight, index) => {
      content.push(`${index + 1}. ${insight.location}`)
      content.push(`   Time: ${insight.timeOfDay}`)
      content.push(`   Expected Earnings: ${insight.expectedEarnings}`)
      content.push(`   Strategy: ${wrapText(insight.reason, 77, '   ')}`)
      content.push('')
    })
  }
  
  if (seasonalInsights && seasonalInsights.length > 0) {
    content.push('SEASONAL STRATEGIES')
    content.push('-'.repeat(80))
    seasonalInsights.forEach((insight, index) => {
      content.push(`${index + 1}. ${insight.period}`)
      content.push(`   Locations: ${insight.locations.join(', ')}`)
      content.push(`   Strategy: ${wrapText(insight.strategy, 77, '   ')}`)
      content.push('')
    })
  }
  
  if (shifts.length > 0) {
    content.push('RECENT SHIFTS')
    content.push('-'.repeat(80))
    
    const sortedShifts = [...shifts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10)
    
    sortedShifts.forEach((shift, index) => {
      const net = shift.earnings - (shift.expenses || 0)
      content.push(`${index + 1}. ${new Date(shift.date).toLocaleDateString()} - ${shift.platform}`)
      content.push(`   Time: ${shift.startTime} - ${shift.endTime}`)
      if (shift.startLocation) {
        content.push(`   Location: ${shift.startLocation}`)
      }
      content.push(`   Earnings: $${shift.earnings.toFixed(2)} | Trips: ${shift.trips} | Tips: $${(shift.tips || 0).toFixed(2)} | Expenses: $${(shift.expenses || 0).toFixed(2)}`)
      content.push(`   Net: $${net.toFixed(2)}`)
      content.push('')
    })
  }
  
  content.push('2025 EARNINGS TARGET')
  content.push('-'.repeat(80))
  content.push('Goal: $300 per day with 7-10 quality rides (~$35/trip)')
  content.push(`Your Average Per Trip: $${stats.averageTripEarnings.toFixed(2)}`)
  content.push(`Target Per Trip: $${(300 / 8.5).toFixed(2)}`)
  content.push(`Status: ${stats.averageTripEarnings >= (300 / 8.5) ? '✓ ON TARGET' : `Need $${((300 / 8.5) - stats.averageTripEarnings).toFixed(2)} more per trip`}`)
  content.push(`Projected Daily at Current Rate: $${(stats.averageTripEarnings * 8.5).toFixed(2)}`)
  content.push('')
  
  content.push('='.repeat(80))
  content.push('Report generated by TLC Driver Hub')
  content.push('Data based on TLC Trip Record Data and NYC DOT traffic patterns')
  
  const textContent = content.join('\n')
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `tlc-insights-report-${new Date().toISOString().split('T')[0]}.txt`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function wrapText(text: string, maxWidth: number, indent: string = ''): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  
  if (currentLine) lines.push(currentLine)
  
  return lines.map((line, index) => index === 0 ? line : `${indent}${line}`).join('\n')
}

export function exportInsightsAsJSON(
  shifts: ShiftData[],
  stats: StatsData,
  aiInsight?: AIInsight,
  locationInsights?: LocationInsight[],
  seasonalInsights?: SeasonalInsight[]
): void {
  const data = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalEarnings: stats.totalEarnings,
      totalExpenses: stats.totalExpenses,
      netEarnings: stats.netEarnings,
      totalHours: stats.totalHours,
      averageHourlyRate: stats.averageHourlyRate,
      totalTrips: stats.totalTrips,
      averageTripEarnings: stats.averageTripEarnings,
      totalTips: stats.totalTips,
      tipPercentage: stats.totalEarnings > 0 ? (stats.totalTips / stats.totalEarnings) * 100 : 0
    },
    target2025: {
      dailyGoal: 300,
      targetTrips: 8.5,
      targetPerTrip: 300 / 8.5,
      currentPerTrip: stats.averageTripEarnings,
      onTarget: stats.averageTripEarnings >= (300 / 8.5),
      projectedDaily: stats.averageTripEarnings * 8.5
    },
    insights: {
      personal: aiInsight || null,
      locations: locationInsights || [],
      seasonal: seasonalInsights || []
    },
    shifts: shifts.map(shift => ({
      date: shift.date,
      platform: shift.platform,
      startTime: shift.startTime,
      endTime: shift.endTime,
      startLocation: shift.startLocation || null,
      earnings: shift.earnings,
      trips: shift.trips,
      tips: shift.tips || 0,
      expenses: shift.expenses || 0,
      net: shift.earnings - (shift.expenses || 0)
    }))
  }
  
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `tlc-insights-report-${new Date().toISOString().split('T')[0]}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

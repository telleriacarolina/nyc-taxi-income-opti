import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shift } from '@/lib/earnings-types'
import { formatCurrency } from '@/lib/earnings-utils'
import { Calendar, TrendUp, ChartBar, ArrowUp, ArrowDown, Equals } from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts'

interface MonthlyData {
  month: string
  monthNum: number
  year: number
  earnings: number
  trips: number
  hours: number
  avgPerHour: number
  avgPerTrip: number
  expenses: number
  netEarnings: number
}

interface YearData {
  year: number
  months: MonthlyData[]
  totalEarnings: number
  totalTrips: number
  totalHours: number
  avgPerHour: number
  netEarnings: number
}

interface QuarterData {
  quarter: string
  quarterNum: number
  year: number
  earnings: number
  trips: number
  hours: number
  avgPerHour: number
  netEarnings: number
}

interface SeasonData {
  season: string
  earnings: number
  trips: number
  hours: number
  avgPerHour: number
  years: number[]
  netEarnings: number
}

export function YearOverYearComparison() {
  const [shifts] = useKV<Shift[]>('driver-shifts', [])
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'seasonal'>('monthly')

  if (!shifts || shifts.length === 0) {
    return null
  }

  const yearlyData: Record<number, YearData> = {}
  const monthlyByYearMonth: Record<string, MonthlyData> = {}

  shifts.forEach(shift => {
    const date = new Date(shift.date)
    const year = date.getFullYear()
    const month = date.getMonth()
    const monthName = date.toLocaleString('en-US', { month: 'short' })
    const key = `${year}-${month}`

    if (!yearlyData[year]) {
      yearlyData[year] = {
        year,
        months: [],
        totalEarnings: 0,
        totalTrips: 0,
        totalHours: 0,
        avgPerHour: 0,
        netEarnings: 0
      }
    }

    if (!monthlyByYearMonth[key]) {
      monthlyByYearMonth[key] = {
        month: monthName,
        monthNum: month,
        year,
        earnings: 0,
        trips: 0,
        hours: 0,
        avgPerHour: 0,
        avgPerTrip: 0,
        expenses: 0,
        netEarnings: 0
      }
    }

    const expenses = shift.expenses || 0
    monthlyByYearMonth[key].earnings += shift.earnings
    monthlyByYearMonth[key].trips += shift.trips
    monthlyByYearMonth[key].hours += shift.hours
    monthlyByYearMonth[key].expenses += expenses
    monthlyByYearMonth[key].netEarnings += (shift.earnings - expenses)

    yearlyData[year].totalEarnings += shift.earnings
    yearlyData[year].totalTrips += shift.trips
    yearlyData[year].totalHours += shift.hours
    yearlyData[year].netEarnings += (shift.earnings - expenses)
  })

  Object.values(monthlyByYearMonth).forEach(monthData => {
    if (monthData.hours > 0) {
      monthData.avgPerHour = monthData.earnings / monthData.hours
      monthData.avgPerTrip = monthData.trips > 0 ? monthData.earnings / monthData.trips : 0
    }
  })

  Object.values(yearlyData).forEach(yearData => {
    if (yearData.totalHours > 0) {
      yearData.avgPerHour = yearData.totalEarnings / yearData.totalHours
    }
    yearData.months = Object.values(monthlyByYearMonth)
      .filter(m => m.year === yearData.year)
      .sort((a, b) => a.monthNum - b.monthNum)
  })

  const years = Object.keys(yearlyData).map(Number).sort((a, b) => b - a)
  
  if (years.length === 0) {
    return null
  }

  const getQuarterlyData = (): QuarterData[] => {
    const quarterlyData: Record<string, QuarterData> = {}
    
    Object.values(monthlyByYearMonth).forEach(monthData => {
      const quarter = Math.floor(monthData.monthNum / 3) + 1
      const key = `${monthData.year}-Q${quarter}`
      
      if (!quarterlyData[key]) {
        quarterlyData[key] = {
          quarter: `Q${quarter}`,
          quarterNum: quarter,
          year: monthData.year,
          earnings: 0,
          trips: 0,
          hours: 0,
          avgPerHour: 0,
          netEarnings: 0
        }
      }
      
      quarterlyData[key].earnings += monthData.earnings
      quarterlyData[key].trips += monthData.trips
      quarterlyData[key].hours += monthData.hours
      quarterlyData[key].netEarnings += monthData.netEarnings
    })
    
    Object.values(quarterlyData).forEach(q => {
      if (q.hours > 0) {
        q.avgPerHour = q.earnings / q.hours
      }
    })
    
    return Object.values(quarterlyData).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return a.quarterNum - b.quarterNum
    })
  }

  const getSeasonalData = (): SeasonData[] => {
    const seasonMap: Record<string, SeasonData> = {
      'Winter': { season: 'Winter (Dec-Feb)', earnings: 0, trips: 0, hours: 0, avgPerHour: 0, years: [], netEarnings: 0 },
      'Spring': { season: 'Spring (Mar-May)', earnings: 0, trips: 0, hours: 0, avgPerHour: 0, years: [], netEarnings: 0 },
      'Summer': { season: 'Summer (Jun-Aug)', earnings: 0, trips: 0, hours: 0, avgPerHour: 0, years: [], netEarnings: 0 },
      'Fall': { season: 'Fall (Sep-Nov)', earnings: 0, trips: 0, hours: 0, avgPerHour: 0, years: [], netEarnings: 0 }
    }
    
    Object.values(monthlyByYearMonth).forEach(monthData => {
      let season: string
      if (monthData.monthNum === 11 || monthData.monthNum <= 1) {
        season = 'Winter'
      } else if (monthData.monthNum >= 2 && monthData.monthNum <= 4) {
        season = 'Spring'
      } else if (monthData.monthNum >= 5 && monthData.monthNum <= 7) {
        season = 'Summer'
      } else {
        season = 'Fall'
      }
      
      seasonMap[season].earnings += monthData.earnings
      seasonMap[season].trips += monthData.trips
      seasonMap[season].hours += monthData.hours
      seasonMap[season].netEarnings += monthData.netEarnings
      if (!seasonMap[season].years.includes(monthData.year)) {
        seasonMap[season].years.push(monthData.year)
      }
    })
    
    Object.values(seasonMap).forEach(s => {
      if (s.hours > 0) {
        s.avgPerHour = s.earnings / s.hours
      }
    })
    
    return Object.values(seasonMap).filter(s => s.earnings > 0)
  }

  const quarterlyData = getQuarterlyData()
  const seasonalData = getSeasonalData()

  const getMonthComparison = (monthNum: number): { current?: MonthlyData; previous?: MonthlyData; change: number; changePercent: number } => {
    if (years.length < 2) return { change: 0, changePercent: 0 }
    
    const currentYear = years[0]
    const previousYear = years[1]
    
    const current = monthlyByYearMonth[`${currentYear}-${monthNum}`]
    const previous = monthlyByYearMonth[`${previousYear}-${monthNum}`]
    
    if (!current || !previous) return { current, previous, change: 0, changePercent: 0 }
    
    const change = current.avgPerHour - previous.avgPerHour
    const changePercent = previous.avgPerHour > 0 ? (change / previous.avgPerHour) * 100 : 0
    
    return { current, previous, change, changePercent }
  }

  const getYearComparison = (): { change: number; changePercent: number } => {
    if (years.length < 2) return { change: 0, changePercent: 0 }
    
    const currentYear = yearlyData[years[0]]
    const previousYear = yearlyData[years[1]]
    
    const change = currentYear.avgPerHour - previousYear.avgPerHour
    const changePercent = previousYear.avgPerHour > 0 ? (change / previousYear.avgPerHour) * 100 : 0
    
    return { change, changePercent }
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const comparisonData = monthNames.map((monthName, idx) => {
    const comparison = getMonthComparison(idx)
    return {
      month: monthName,
      current: comparison.current?.avgPerHour || 0,
      previous: comparison.previous?.avgPerHour || 0,
      currentYear: years[0],
      previousYear: years[1]
    }
  }).filter(d => d.current > 0 || d.previous > 0)

  const yearComparison = getYearComparison()

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp size={16} weight="bold" className="text-success" />
    if (change < 0) return <ArrowDown size={16} weight="bold" className="text-destructive" />
    return <Equals size={16} weight="bold" className="text-muted-foreground" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success'
    if (change < 0) return 'text-destructive'
    return 'text-muted-foreground'
  }

  const bestSeason = seasonalData.length > 0 
    ? seasonalData.reduce((best, curr) => curr.avgPerHour > best.avgPerHour ? curr : best, seasonalData[0])
    : null

  const worstSeason = seasonalData.length > 0
    ? seasonalData.reduce((worst, curr) => curr.avgPerHour < worst.avgPerHour ? curr : worst, seasonalData[0])
    : null

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-primary/20 p-2">
          <Calendar size={20} className="text-primary" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
            Year-over-Year Profitability
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Compare earnings patterns across different times of year
          </p>
        </div>
      </div>

      {years.length >= 2 && (
        <div className="bg-card rounded-lg p-4 border mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">
                Year-over-Year Change
              </div>
              <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
                {years[0]} vs {years[1]}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-[clamp(1.25rem,4vw,1.5rem)] flex items-center gap-1 ${getChangeColor(yearComparison.change)}`}>
                {getTrendIcon(yearComparison.change)}
                {formatCurrency(Math.abs(yearComparison.change))}/hr
              </div>
              <div className={`text-[clamp(0.7rem,2.2vw,0.8rem)] font-semibold ${getChangeColor(yearComparison.change)}`}>
                {yearComparison.changePercent > 0 ? '+' : ''}{yearComparison.changePercent.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/30">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">
                {years[0]} Avg
              </div>
              <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-primary">
                {formatCurrency(yearlyData[years[0]].avgPerHour)}/hr
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-1">
                {yearlyData[years[0]].totalTrips} trips · {yearlyData[years[0]].totalHours.toFixed(0)}h
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">
                {years[1]} Avg
              </div>
              <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
                {formatCurrency(yearlyData[years[1]].avgPerHour)}/hr
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-1">
                {yearlyData[years[1]].totalTrips} trips · {yearlyData[years[1]].totalHours.toFixed(0)}h
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly" className="text-[clamp(0.7rem,2vw,0.8rem)]">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly" className="text-[clamp(0.7rem,2vw,0.8rem)]">Quarterly</TabsTrigger>
          <TabsTrigger value="seasonal" className="text-[clamp(0.7rem,2vw,0.8rem)]">Seasonal</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4 mt-4">
          {years.length >= 2 && comparisonData.length > 0 && (
            <>
              <div className="mb-3">
                <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3">
                  Monthly Comparison: {years[0]} vs {years[1]}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '0.75rem'
                      }}
                      formatter={(value: number, name: string) => {
                        const label = name === 'current' ? years[0] : years[1]
                        return [`$${value.toFixed(2)}/hr`, label]
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '0.75rem' }}
                      formatter={(value) => value === 'current' ? `${years[0]}` : `${years[1]}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      name="current"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))', r: 4 }}
                      name="previous"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold">
                  Month-by-Month Breakdown
                </h3>
                {monthNames.map((monthName, idx) => {
                  const comparison = getMonthComparison(idx)
                  if (!comparison.current && !comparison.previous) return null
                  
                  return (
                    <div key={idx} className="bg-card rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)]">
                          {monthName}
                        </div>
                        {comparison.current && comparison.previous && (
                          <div className={`flex items-center gap-1 font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)] ${getChangeColor(comparison.change)}`}>
                            {getTrendIcon(comparison.change)}
                            {comparison.changePercent > 0 ? '+' : ''}{comparison.changePercent.toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {comparison.current && (
                          <div className="bg-primary/5 rounded p-2 border border-primary/30">
                            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">
                              {years[0]}
                            </div>
                            <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)] text-primary">
                              {formatCurrency(comparison.current.avgPerHour)}/hr
                            </div>
                            <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-muted-foreground">
                              {comparison.current.trips} trips
                            </div>
                          </div>
                        )}
                        {comparison.previous && (
                          <div className="bg-muted/50 rounded p-2 border">
                            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">
                              {years[1]}
                            </div>
                            <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]">
                              {formatCurrency(comparison.previous.avgPerHour)}/hr
                            </div>
                            <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-muted-foreground">
                              {comparison.previous.trips} trips
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {years.length === 1 && (
            <div className="bg-muted/50 rounded-lg p-4 border text-center">
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground">
                Log shifts across multiple years to compare year-over-year trends
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-4 mt-4">
          {quarterlyData.length > 0 && (
            <>
              <div className="mb-3">
                <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3">
                  Quarterly Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quarterlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey={(item) => `${item.quarter} ${item.year}`}
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '0.75rem'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}/hr`, 'Avg Rate']}
                    />
                    <Bar dataKey="avgPerHour" radius={[4, 4, 0, 0]}>
                      {quarterlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.year === years[0] ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid gap-2">
                {quarterlyData.map((quarter, idx) => (
                  <div key={idx} className={`rounded-lg p-3 border ${
                    quarter.year === years[0] ? 'bg-primary/5 border-primary/30' : 'bg-card'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]">
                          {quarter.quarter} {quarter.year}
                        </div>
                        <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                          {quarter.trips} trips · {quarter.hours.toFixed(0)}h worked
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-[clamp(1rem,3vw,1.2rem)] ${
                          quarter.year === years[0] ? 'text-primary' : ''
                        }`}>
                          {formatCurrency(quarter.avgPerHour)}/hr
                        </div>
                        <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                          {formatCurrency(quarter.earnings)} total
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4 mt-4">
          {seasonalData.length > 0 && (
            <>
              {bestSeason && worstSeason && (
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🌟</div>
                      <div>
                        <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)] text-success">
                          Most Profitable
                        </div>
                        <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                          {bestSeason.season}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] text-success">
                      {formatCurrency(bestSeason.avgPerHour)}/hr
                    </div>
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-1">
                      {bestSeason.trips} trips · {formatCurrency(bestSeason.earnings)} total
                    </div>
                  </div>

                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">📊</div>
                      <div>
                        <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)] text-warning">
                          Lower Season
                        </div>
                        <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                          {worstSeason.season}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] text-warning">
                      {formatCurrency(worstSeason.avgPerHour)}/hr
                    </div>
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-1">
                      {worstSeason.trips} trips · {formatCurrency(worstSeason.earnings)} total
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3">
                  Seasonal Performance Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="season"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '0.7rem' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '0.75rem'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}/hr`, 'Avg Rate']}
                    />
                    <Bar dataKey="avgPerHour" radius={[4, 4, 0, 0]}>
                      {seasonalData.map((entry, index) => {
                        let color = 'hsl(var(--primary))'
                        if (entry === bestSeason) color = 'hsl(var(--success))'
                        if (entry === worstSeason) color = 'hsl(var(--warning))'
                        return <Cell key={`cell-${index}`} fill={color} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold">
                  Seasonal Breakdown
                </h3>
                {seasonalData.map((season, idx) => {
                  const isBest = season === bestSeason
                  const isWorst = season === worstSeason
                  
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-lg p-3 border ${
                        isBest ? 'bg-success/10 border-success/30' : 
                        isWorst ? 'bg-warning/10 border-warning/30' : 
                        'bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)] flex items-center gap-2">
                            {season.season}
                            {isBest && <span className="text-xs">🌟</span>}
                          </div>
                          <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                            Data from {season.years.sort().join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-[clamp(1rem,3vw,1.2rem)] ${
                            isBest ? 'text-success' : isWorst ? 'text-warning' : ''
                          }`}>
                            {formatCurrency(season.avgPerHour)}/hr
                          </div>
                          <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                            {season.trips} trips
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-muted-foreground mb-0.5">
                            Total Earnings
                          </div>
                          <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">
                            {formatCurrency(season.earnings)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-muted-foreground mb-0.5">
                            Hours Worked
                          </div>
                          <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">
                            {season.hours.toFixed(0)}h
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-muted-foreground mb-0.5">
                            Net Earnings
                          </div>
                          <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">
                            {formatCurrency(season.netEarnings)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendUp size={18} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <div className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)] mb-1">
                      Seasonal Strategy
                    </div>
                    <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                      {bestSeason && worstSeason && bestSeason !== worstSeason ? (
                        <>
                          {bestSeason.season} shows {formatCurrency(bestSeason.avgPerHour - worstSeason.avgPerHour)}/hr 
                          higher earnings than {worstSeason.season}. Consider working more hours during peak seasons 
                          to maximize annual income.
                        </>
                      ) : (
                        <>Track your earnings across all four seasons to identify the most profitable times of year.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {years.length > 0 && (
        <div className="bg-card rounded-lg p-4 border">
          <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3 flex items-center gap-2">
            <ChartBar size={16} className="text-primary" weight="fill" />
            Historical Summary
          </h3>
          <div className="space-y-2">
            {years.map(year => {
              const data = yearlyData[year]
              return (
                <div key={year} className={`rounded-lg p-3 border ${
                  year === years[0] ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]">
                        {year}
                        {year === years[0] && (
                          <span className="ml-2 text-[clamp(0.6rem,1.8vw,0.7rem)] text-primary font-normal">
                            (Current)
                          </span>
                        )}
                      </div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {data.totalTrips} trips · {data.totalHours.toFixed(0)}h worked
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-[clamp(1rem,3vw,1.2rem)] ${
                        year === years[0] ? 'text-primary' : ''
                      }`}>
                        {formatCurrency(data.avgPerHour)}/hr
                      </div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {formatCurrency(data.totalEarnings)} total
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

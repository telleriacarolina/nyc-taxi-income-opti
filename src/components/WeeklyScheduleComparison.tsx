import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CalendarBlank, 
  TrendUp, 
  TrendDown,
  ChartBar,
  Clock,
  CurrencyDollar,
  Star,
  Trophy,
  Lightning,
  ArrowRight,
  CaretUp,
  CaretDown
} from '@phosphor-icons/react'
import { Shift } from '@/lib/earnings-types'
import { formatCurrency, formatHours } from '@/lib/earnings-utils'

interface WeeklyPattern {
  weekNumber: number
  weekStart: string
  weekEnd: string
  totalEarnings: number
  totalHours: number
  totalTrips: number
  averageHourlyRate: number
  daysWorked: number
  dayBreakdown: {
    dayOfWeek: string
    earnings: number
    hours: number
    trips: number
    hourlyRate: number
  }[]
}

interface DayPerformance {
  dayOfWeek: string
  avgEarnings: number
  avgHours: number
  avgTrips: number
  avgHourlyRate: number
  bestWeek: { earnings: number; date: string }
  worstWeek: { earnings: number; date: string }
  timesWorked: number
}

const DAYS_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const DAY_NAMES: Record<number, string> = {
  0: 'sunday',
  1: 'monday', 
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
}

export function WeeklyScheduleComparison() {
  const [shifts] = useKV<Shift[]>('driver-shifts', [])
  const [selectedPattern, setSelectedPattern] = useState<WeeklyPattern | null>(null)
  const [viewMode, setViewMode] = useState<'weeks' | 'days' | 'best'>('weeks')

  const weeklyPatterns = useMemo(() => {
    if (!shifts || shifts.length === 0) return []

    const shiftsByWeek = new Map<string, Shift[]>()
    
    shifts.forEach(shift => {
      const date = new Date(shift.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      weekStart.setHours(0, 0, 0, 0)
      
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!shiftsByWeek.has(weekKey)) {
        shiftsByWeek.set(weekKey, [])
      }
      shiftsByWeek.get(weekKey)!.push(shift)
    })

    const patterns: WeeklyPattern[] = []
    let weekCounter = 1

    Array.from(shiftsByWeek.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .forEach(([weekKey, weekShifts]) => {
        const weekStart = new Date(weekKey)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        const totalEarnings = weekShifts.reduce((sum, s) => sum + s.earnings, 0)
        const totalHours = weekShifts.reduce((sum, s) => sum + s.hours, 0)
        const totalTrips = weekShifts.reduce((sum, s) => sum + s.trips, 0)

        const dayBreakdown = DAYS_ORDER.map(dayName => {
          const dayShifts = weekShifts.filter(s => {
            const shiftDay = new Date(s.date).getDay()
            return DAY_NAMES[shiftDay] === dayName
          })
          
          const dayEarnings = dayShifts.reduce((sum, s) => sum + s.earnings, 0)
          const dayHours = dayShifts.reduce((sum, s) => sum + s.hours, 0)
          const dayTrips = dayShifts.reduce((sum, s) => sum + s.trips, 0)
          
          return {
            dayOfWeek: dayName,
            earnings: dayEarnings,
            hours: dayHours,
            trips: dayTrips,
            hourlyRate: dayHours > 0 ? dayEarnings / dayHours : 0
          }
        })

        patterns.push({
          weekNumber: weekCounter++,
          weekStart: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weekEnd: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          totalEarnings,
          totalHours,
          totalTrips,
          averageHourlyRate: totalHours > 0 ? totalEarnings / totalHours : 0,
          daysWorked: weekShifts.length,
          dayBreakdown
        })
      })

    return patterns.reverse()
  }, [shifts])

  const dayPerformance = useMemo(() => {
    if (!shifts || shifts.length === 0) return []

    const dayStats = new Map<string, {
      earnings: number[]
      hours: number[]
      trips: number[]
      dates: string[]
    }>()

    DAYS_ORDER.forEach(day => {
      dayStats.set(day, { earnings: [], hours: [], trips: [], dates: [] })
    })

    shifts.forEach(shift => {
      const date = new Date(shift.date)
      const dayName = DAY_NAMES[date.getDay()]
      const stats = dayStats.get(dayName)!
      
      stats.earnings.push(shift.earnings)
      stats.hours.push(shift.hours)
      stats.trips.push(shift.trips)
      stats.dates.push(shift.date)
    })

    const performance: DayPerformance[] = []

    DAYS_ORDER.forEach(dayName => {
      const stats = dayStats.get(dayName)!
      if (stats.earnings.length === 0) return

      const avgEarnings = stats.earnings.reduce((a, b) => a + b, 0) / stats.earnings.length
      const avgHours = stats.hours.reduce((a, b) => a + b, 0) / stats.hours.length
      const avgTrips = stats.trips.reduce((a, b) => a + b, 0) / stats.trips.length
      const avgHourlyRate = avgHours > 0 ? avgEarnings / avgHours : 0

      const bestIdx = stats.earnings.indexOf(Math.max(...stats.earnings))
      const worstIdx = stats.earnings.indexOf(Math.min(...stats.earnings))

      performance.push({
        dayOfWeek: dayName,
        avgEarnings,
        avgHours,
        avgTrips,
        avgHourlyRate,
        bestWeek: {
          earnings: stats.earnings[bestIdx],
          date: stats.dates[bestIdx]
        },
        worstWeek: {
          earnings: stats.earnings[worstIdx],
          date: stats.dates[worstIdx]
        },
        timesWorked: stats.earnings.length
      })
    })

    return performance
  }, [shifts])

  const bestWeekPattern = useMemo(() => {
    if (weeklyPatterns.length === 0) return null
    return weeklyPatterns.reduce((best, current) => 
      current.totalEarnings > best.totalEarnings ? current : best
    , weeklyPatterns[0])
  }, [weeklyPatterns])

  const bestDayPattern = useMemo(() => {
    if (dayPerformance.length === 0) return null
    return dayPerformance.reduce((best, current) => 
      current.avgEarnings > best.avgEarnings ? current : best
    , dayPerformance[0])
  }, [dayPerformance])

  const weekdayVsWeekend = useMemo(() => {
    if (dayPerformance.length === 0) return null

    const weekdays = dayPerformance.filter(d => 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(d.dayOfWeek)
    )
    const weekends = dayPerformance.filter(d => 
      ['saturday', 'sunday'].includes(d.dayOfWeek)
    )

    const weekdayAvg = weekdays.length > 0
      ? weekdays.reduce((sum, d) => sum + d.avgEarnings, 0) / weekdays.length
      : 0
    
    const weekendAvg = weekends.length > 0
      ? weekends.reduce((sum, d) => sum + d.avgEarnings, 0) / weekends.length
      : 0

    return { weekdayAvg, weekendAvg }
  }, [dayPerformance])

  const getDayColor = (dayOfWeek: string) => {
    const performance = dayPerformance.find(d => d.dayOfWeek === dayOfWeek)
    if (!performance || !bestDayPattern) return 'bg-gray-100 text-gray-800'
    
    const ratio = performance.avgEarnings / bestDayPattern.avgEarnings
    if (ratio >= 0.9) return 'bg-green-100 text-green-800 border-green-300'
    if (ratio >= 0.7) return 'bg-blue-100 text-blue-800 border-blue-300'
    if (ratio >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getPerformanceChange = (current: number, previous: number) => {
    if (previous === 0) return null
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    }
  }

  if (!shifts || shifts.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ChartBar size={32} className="text-primary" weight="fill" />
          </div>
          <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] mb-2">
            No Historical Data Yet
          </h3>
          <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground max-w-md mx-auto">
            Start logging your shifts to see weekly pattern analysis and discover which schedules perform best
          </p>
        </CardContent>
      </Card>
    )
  }

  if (weeklyPatterns.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <CalendarBlank size={48} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] mb-2">
            Need More Data
          </h3>
          <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground max-w-md mx-auto">
            Log shifts from multiple weeks to see pattern comparisons
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
              <ChartBar weight="fill" className="text-primary" />
              Weekly Schedule Comparison
            </CardTitle>
            <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
              Analyze historical performance to find your most profitable weekly patterns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'weeks' | 'days' | 'best')}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weeks" className="gap-2">
              <CalendarBlank weight="fill" />
              <span className="text-[clamp(0.7rem,2vw,0.85rem)]">By Week</span>
            </TabsTrigger>
            <TabsTrigger value="days" className="gap-2">
              <ChartBar weight="fill" />
              <span className="text-[clamp(0.7rem,2vw,0.85rem)]">By Day</span>
            </TabsTrigger>
            <TabsTrigger value="best" className="gap-2">
              <Trophy weight="fill" />
              <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Best Patterns</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weeks" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {weeklyPatterns.map((pattern, index) => {
                const previousWeek = index > 0 ? weeklyPatterns[index - 1] : null
                const earningsChange = previousWeek 
                  ? getPerformanceChange(pattern.totalEarnings, previousWeek.totalEarnings)
                  : null

                return (
                  <Card
                    key={pattern.weekNumber}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPattern?.weekNumber === pattern.weekNumber ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPattern(pattern)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)]">
                            Week {pattern.weekNumber}
                          </CardTitle>
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                            {pattern.weekStart} - {pattern.weekEnd}
                          </CardDescription>
                        </div>
                        {pattern === bestWeekPattern && (
                          <Badge className="bg-yellow-500 text-white">
                            <Trophy size={12} weight="fill" />
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                            Total Earnings
                          </p>
                          {earningsChange && (
                            <div className={`flex items-center gap-0.5 text-[clamp(0.6rem,1.8vw,0.65rem)] font-semibold ${
                              earningsChange.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {earningsChange.isPositive ? <CaretUp size={12} weight="fill" /> : <CaretDown size={12} weight="fill" />}
                              {earningsChange.value}%
                            </div>
                          )}
                        </div>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                          {formatCurrency(pattern.totalEarnings)}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Hours</p>
                          <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-blue-600">
                            {pattern.totalHours.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Trips</p>
                          <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-purple-600">
                            {pattern.totalTrips}
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">$/hr</p>
                          <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-orange-600">
                            {formatCurrency(pattern.averageHourlyRate)}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                          Days Worked: {pattern.daysWorked}
                        </p>
                        <div className="flex gap-1">
                          {pattern.dayBreakdown.map((day) => (
                            <div
                              key={day.dayOfWeek}
                              className={`flex-1 h-2 rounded-sm ${
                                day.earnings > 0 
                                  ? getDayColor(day.dayOfWeek).split(' ')[0]
                                  : 'bg-gray-200'
                              }`}
                              title={`${day.dayOfWeek}: ${formatCurrency(day.earnings)}`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {selectedPattern && (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                        <Lightning weight="fill" className="text-purple-600" />
                        Week {selectedPattern.weekNumber} Breakdown
                      </CardTitle>
                      <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                        {selectedPattern.weekStart} - {selectedPattern.weekEnd}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPattern(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    {selectedPattern.dayBreakdown.map((day) => {
                      if (day.earnings === 0) return null
                      
                      return (
                        <Card key={day.dayOfWeek}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] capitalize">
                                  {day.dayOfWeek}
                                </p>
                                <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                                  {formatHours(day.hours)} · {day.trips} trips
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[clamp(1rem,2.8vw,1.2rem)] font-bold text-green-600">
                                  {formatCurrency(day.earnings)}
                                </p>
                                <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                                  {formatCurrency(day.hourlyRate)}/hr
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="days" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dayPerformance.map((day) => (
                <Card key={day.dayOfWeek}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] capitalize">
                          {day.dayOfWeek}
                        </CardTitle>
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Worked {day.timesWorked} times
                        </CardDescription>
                      </div>
                      {day === bestDayPattern && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star size={12} weight="fill" />
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                        Avg Earnings
                      </p>
                      <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                        {formatCurrency(day.avgEarnings)}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Avg Hours</p>
                        <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-blue-600">
                          {day.avgHours.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Avg Trips</p>
                        <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-purple-600">
                          {Math.round(day.avgTrips)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">$/hr</p>
                        <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold text-orange-600">
                          {formatCurrency(day.avgHourlyRate)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t space-y-1">
                      <div className="flex items-center justify-between text-[clamp(0.7rem,2vw,0.75rem)]">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendUp size={12} weight="fill" className="text-green-600" />
                          Best
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(day.bestWeek.earnings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[clamp(0.7rem,2vw,0.75rem)]">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendDown size={12} weight="fill" className="text-red-600" />
                          Worst
                        </span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(day.worstWeek.earnings)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {weekdayVsWeekend && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] flex items-center gap-2">
                    <ChartBar weight="fill" className="text-blue-600" />
                    Weekday vs Weekend Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">
                        Weekdays (Mon-Fri)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-blue-600">
                        {formatCurrency(weekdayVsWeekend.weekdayAvg)}
                      </p>
                      <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                        Average per day
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">
                        Weekends (Sat-Sun)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-purple-600">
                        {formatCurrency(weekdayVsWeekend.weekendAvg)}
                      </p>
                      <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                        Average per day
                      </p>
                      {weekdayVsWeekend.weekendAvg > weekdayVsWeekend.weekdayAvg && (
                        <Badge className="mt-2 bg-purple-600">
                          {(((weekdayVsWeekend.weekendAvg - weekdayVsWeekend.weekdayAvg) / weekdayVsWeekend.weekdayAvg) * 100).toFixed(1)}% higher
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="best" className="space-y-4">
            {bestWeekPattern && (
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300">
                <CardHeader>
                  <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                    <Trophy weight="fill" className="text-yellow-600" />
                    Best Week Ever
                  </CardTitle>
                  <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
                    Week {bestWeekPattern.weekNumber}: {bestWeekPattern.weekStart} - {bestWeekPattern.weekEnd}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Total Earnings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                          {formatCurrency(bestWeekPattern.totalEarnings)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Total Hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                          {bestWeekPattern.totalHours.toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Hourly Rate
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-orange-600">
                          {formatCurrency(bestWeekPattern.averageHourlyRate)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Days Worked
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                          {bestWeekPattern.daysWorked}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2 flex items-center gap-2">
                      <CalendarBlank weight="fill" className="text-yellow-600" />
                      Daily Breakdown
                    </h3>
                    <div className="grid gap-2">
                      {bestWeekPattern.dayBreakdown
                        .filter(day => day.earnings > 0)
                        .map((day) => (
                          <Card key={day.dayOfWeek}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] capitalize">
                                    {day.dayOfWeek}
                                  </p>
                                  <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                                    {formatHours(day.hours)} · {day.trips} trips · {formatCurrency(day.hourlyRate)}/hr
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[clamp(1rem,2.8vw,1.2rem)] font-bold text-green-600">
                                    {formatCurrency(day.earnings)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {bestDayPattern && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
                <CardHeader>
                  <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                    <Star weight="fill" className="text-green-600" />
                    Best Day of the Week
                  </CardTitle>
                  <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] capitalize">
                    {bestDayPattern.dayOfWeek} consistently performs best
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Avg Earnings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                          {formatCurrency(bestDayPattern.avgEarnings)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Avg Hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                          {bestDayPattern.avgHours.toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Hourly Rate
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-orange-600">
                          {formatCurrency(bestDayPattern.avgHourlyRate)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">
                          Times Worked
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                          {bestDayPattern.timesWorked}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">
                        Performance Range
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground flex items-center gap-2">
                          <TrendUp size={16} weight="fill" className="text-green-600" />
                          Best Performance
                        </span>
                        <span className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-green-600">
                          {formatCurrency(bestDayPattern.bestWeek.earnings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground flex items-center gap-2">
                          <TrendDown size={16} weight="fill" className="text-red-600" />
                          Lowest Performance
                        </span>
                        <span className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-red-600">
                          {formatCurrency(bestDayPattern.worstWeek.earnings)}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                            Consistency Score
                          </span>
                          <Badge variant="secondary">
                            {bestDayPattern.worstWeek.earnings > 0 
                              ? Math.round((bestDayPattern.worstWeek.earnings / bestDayPattern.bestWeek.earnings) * 100)
                              : 0}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
              <CardHeader>
                <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                  <Lightning weight="fill" className="text-purple-600" />
                  Optimization Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bestWeekPattern && bestDayPattern && (
                  <>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                      <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                        <TrendUp size={20} weight="fill" className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-1">
                          Focus on {bestDayPattern.dayOfWeek.charAt(0).toUpperCase() + bestDayPattern.dayOfWeek.slice(1)}
                        </p>
                        <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                          This day averages {formatCurrency(bestDayPattern.avgEarnings)} and consistently outperforms other days
                        </p>
                      </div>
                    </div>

                    {weekdayVsWeekend && weekdayVsWeekend.weekendAvg > weekdayVsWeekend.weekdayAvg * 1.2 && (
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                        <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
                          <CalendarBlank size={20} weight="fill" className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-1">
                            Weekend Premium
                          </p>
                          <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                            Weekend earnings are {(((weekdayVsWeekend.weekendAvg - weekdayVsWeekend.weekdayAvg) / weekdayVsWeekend.weekdayAvg) * 100).toFixed(0)}% higher. Consider prioritizing Saturday and Sunday shifts.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                      <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                        <Clock size={20} weight="fill" className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-1">
                          Replicate Your Best Week
                        </p>
                        <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                          Your best week worked {bestWeekPattern.daysWorked} days and earned {formatCurrency(bestWeekPattern.totalEarnings)}. Try matching this pattern.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

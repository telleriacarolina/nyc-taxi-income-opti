import { useState } from 'react'
import { Shift, EarningsStats } from '@/lib/earnings-types'
import { getHourlyPatterns, getDailyPatterns, getPlatformStats, formatCurrency, calculateStats } from '@/lib/earnings-utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Lightbulb, TrendUp, Clock, Calendar, ChartBar, CalendarBlank, X } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface EarningsInsightsProps {
  shifts: Shift[]
  stats: EarningsStats
}

export function EarningsInsights({ shifts, stats }: EarningsInsightsProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })

  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined })
  }

  const filteredShifts = dateRange.from || dateRange.to
    ? shifts.filter(shift => {
        const shiftDate = new Date(shift.date)
        if (dateRange.from && dateRange.to) {
          return shiftDate >= dateRange.from && shiftDate <= dateRange.to
        } else if (dateRange.from) {
          return shiftDate >= dateRange.from
        } else if (dateRange.to) {
          return shiftDate <= dateRange.to
        }
        return true
      })
    : shifts

  const filteredStats = calculateStats(filteredShifts)
  const hourlyPatterns = getHourlyPatterns(filteredShifts)
  const dailyPatterns = getDailyPatterns(filteredShifts)
  const platformStats = getPlatformStats(filteredShifts)

  const topHours = hourlyPatterns
    .sort((a, b) => b.averageRate - a.averageRate)
    .slice(0, 3)

  const topDays = dailyPatterns.slice(0, 3)

  const generateInsights = (): string[] => {
    const insights: string[] = []

    const targetEarnings = 300
    const targetTripsMin = 7
    const targetTripsMax = 10
    const targetPerTrip = targetEarnings / ((targetTripsMin + targetTripsMax) / 2)

    if (filteredStats.totalTrips > 0 && filteredStats.averageTripEarnings > 0) {
      const currentPerTrip = filteredStats.averageTripEarnings
      if (currentPerTrip >= targetPerTrip) {
        insights.push(`Your ${formatCurrency(currentPerTrip)}/trip beats the 2025 target of ${formatCurrency(targetPerTrip)}/trip for $${targetEarnings} on ${targetTripsMin}-${targetTripsMax} rides.`)
      } else {
        const deficit = targetPerTrip - currentPerTrip
        insights.push(`To hit $${targetEarnings} on ${targetTripsMin}-${targetTripsMax} rides in 2025, aim for ${formatCurrency(targetPerTrip)}/trip (${formatCurrency(deficit)} more per ride).`)
      }
    }

    if (topHours.length > 0 && topHours[0].averageRate > filteredStats.averageHourlyRate * 1.2) {
      insights.push(`Your best earning hours are around ${topHours[0].hour}, averaging ${formatCurrency(topHours[0].averageRate)}/hr - 20% above your average.`)
    }

    if (topDays.length > 0 && topDays[0].averageRate > filteredStats.averageHourlyRate * 1.15) {
      insights.push(`${topDays[0].day}s are your most profitable day, earning ${formatCurrency(topDays[0].averageRate)}/hr on average.`)
    }

    if (platformStats.length > 1) {
      const bestPlatform = platformStats[0]
      const avgPlatform = platformStats.reduce((sum, p) => sum + p.averageRate, 0) / platformStats.length
      if (bestPlatform.averageRate > avgPlatform * 1.1) {
        insights.push(`${bestPlatform.platform} yields your highest hourly rate at ${formatCurrency(bestPlatform.averageRate)}/hr.`)
      }
    }

    if (filteredStats.totalTips > 0 && filteredStats.totalEarnings > 0) {
      const tipPercentage = (filteredStats.totalTips / filteredStats.totalEarnings) * 100
      if (tipPercentage > 15) {
        insights.push(`Your tips make up ${Math.round(tipPercentage)}% of earnings - you're providing excellent service!`)
      }
    }

    if (insights.length === 0) {
      insights.push(`2025 Target: Earn $${targetEarnings} daily with ${targetTripsMin}-${targetTripsMax} quality rides at ${formatCurrency(targetPerTrip)}/trip. Log shifts to track progress.`)
    }

    return insights
  }

  const insights = generateInsights()

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-full bg-accent/20 p-2">
          <Lightbulb size={20} className="text-accent" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">Earnings Insights</h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">Data-driven recommendations to optimize your earnings</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 flex-shrink-0",
                (dateRange.from || dateRange.to) && "border-primary bg-primary/5"
              )}
            >
              <CalendarBlank size={16} weight="bold" />
              <span className="hidden sm:inline">
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  "Date Range"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                setDateRange({ from: range?.from, to: range?.to })
              }}
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
            />
            {(dateRange.from || dateRange.to) && (
              <div className="p-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearDateRange}
                  className="w-full gap-1.5 h-8 text-[clamp(0.7rem,2vw,0.8rem)]"
                >
                  <X size={16} weight="bold" />
                  Clear Dates
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {(dateRange.from || dateRange.to) && (
        <div className="mb-3 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary font-medium">
            {dateRange.from && dateRange.to ? (
              <>Showing data from {format(dateRange.from, "MMM d, yyyy")} to {format(dateRange.to, "MMM d, yyyy")}</>
            ) : dateRange.from ? (
              <>Showing data from {format(dateRange.from, "MMM d, yyyy")} onwards</>
            ) : (
              <>Showing data until {format(dateRange.to!, "MMM d, yyyy")}</>
            )}
            {' '}• {filteredShifts.length} {filteredShifts.length === 1 ? 'shift' : 'shifts'}
          </p>
        </div>
      )}

      <div className="space-y-2.5 mb-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2 text-[clamp(0.75rem,2.4vw,0.875rem)]">
            <TrendUp size={16} className="text-success mt-0.5 shrink-0" weight="bold" />
            <p>{insight}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-2.5">
            <Clock size={18} className="text-primary" weight="fill" />
            <h3 className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">Peak Hours</h3>
          </div>
          <div className="space-y-2">
            {topHours.slice(0, 3).map((hour, index) => (
              <div key={index} className="flex justify-between items-center text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <span className="font-mono">{hour.hour}</span>
                <span className="font-semibold text-success">{formatCurrency(hour.averageRate)}/hr</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-2.5">
            <Calendar size={18} className="text-primary" weight="fill" />
            <h3 className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">Best Days</h3>
          </div>
          <div className="space-y-2">
            {topDays.map((day, index) => (
              <div key={index} className="flex justify-between items-center text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <span>{day.day}</span>
                <span className="font-semibold text-success">{formatCurrency(day.averageRate)}/hr</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-2.5">
            <ChartBar size={18} className="text-primary" weight="fill" />
            <h3 className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)]">Platform Performance</h3>
          </div>
          <div className="space-y-2">
            {platformStats.map((platform, index) => (
              <div key={index} className="flex justify-between items-center text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <span>{platform.platform}</span>
                <span className="font-semibold text-success">{formatCurrency(platform.averageRate)}/hr</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

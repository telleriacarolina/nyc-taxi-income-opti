import { Shift, EarningsStats } from '@/lib/earnings-types'
import { getHourlyPatterns, getDailyPatterns, getPlatformStats, formatCurrency } from '@/lib/earnings-utils'
import { Card } from '@/components/ui/card'
import { Lightbulb, TrendUp, Clock, Calendar, ChartBar } from '@phosphor-icons/react'

interface EarningsInsightsProps {
  shifts: Shift[]
  stats: EarningsStats
}

export function EarningsInsights({ shifts, stats }: EarningsInsightsProps) {
  const hourlyPatterns = getHourlyPatterns(shifts)
  const dailyPatterns = getDailyPatterns(shifts)
  const platformStats = getPlatformStats(shifts)

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

    if (stats.totalTrips > 0 && stats.averageTripEarnings > 0) {
      const currentPerTrip = stats.averageTripEarnings
      if (currentPerTrip >= targetPerTrip) {
        insights.push(`Your ${formatCurrency(currentPerTrip)}/trip beats the 2025 target of ${formatCurrency(targetPerTrip)}/trip for $${targetEarnings} on ${targetTripsMin}-${targetTripsMax} rides.`)
      } else {
        const deficit = targetPerTrip - currentPerTrip
        insights.push(`To hit $${targetEarnings} on ${targetTripsMin}-${targetTripsMax} rides in 2025, aim for ${formatCurrency(targetPerTrip)}/trip (${formatCurrency(deficit)} more per ride).`)
      }
    }

    if (topHours.length > 0 && topHours[0].averageRate > stats.averageHourlyRate * 1.2) {
      insights.push(`Your best earning hours are around ${topHours[0].hour}, averaging ${formatCurrency(topHours[0].averageRate)}/hr - 20% above your average.`)
    }

    if (topDays.length > 0 && topDays[0].averageRate > stats.averageHourlyRate * 1.15) {
      insights.push(`${topDays[0].day}s are your most profitable day, earning ${formatCurrency(topDays[0].averageRate)}/hr on average.`)
    }

    if (platformStats.length > 1) {
      const bestPlatform = platformStats[0]
      const avgPlatform = platformStats.reduce((sum, p) => sum + p.averageRate, 0) / platformStats.length
      if (bestPlatform.averageRate > avgPlatform * 1.1) {
        insights.push(`${bestPlatform.platform} yields your highest hourly rate at ${formatCurrency(bestPlatform.averageRate)}/hr.`)
      }
    }

    if (stats.totalTips > 0 && stats.totalEarnings > 0) {
      const tipPercentage = (stats.totalTips / stats.totalEarnings) * 100
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
        <div>
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">Earnings Insights</h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">Data-driven recommendations to optimize your earnings</p>
        </div>
      </div>

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

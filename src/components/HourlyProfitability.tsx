import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Shift } from '@/lib/earnings-types'
import { formatCurrency } from '@/lib/earnings-utils'
import { Clock, TrendUp, CurrencyDollar, Lightning } from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface HourData {
  hour: number
  hourLabel: string
  earnings: number
  trips: number
  hours: number
  avgPerTrip: number
  earningsPerHour: number
}

export function HourlyProfitability() {
  const [shifts] = useKV<Shift[]>('driver-shifts', [])

  const hourlyData: HourData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    hourLabel: formatHourLabel(i),
    earnings: 0,
    trips: 0,
    hours: 0,
    avgPerTrip: 0,
    earningsPerHour: 0
  }))

  if (shifts && shifts.length > 0) {
    shifts.forEach(shift => {
      const startTime = new Date(`${shift.date}T${shift.startTime}`)
      const endTime = new Date(`${shift.date}T${shift.endTime}`)
      
      if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1)
      }

      const shiftDuration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
      const earningsPerHour = shift.earnings / shiftDuration

      let currentTime = new Date(startTime)
      while (currentTime < endTime) {
        const hour = currentTime.getHours()
        const nextHour = new Date(currentTime)
        nextHour.setHours(hour + 1, 0, 0, 0)
        
        const segmentEnd = nextHour > endTime ? endTime : nextHour
        const segmentDuration = (segmentEnd.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
        const segmentEarnings = earningsPerHour * segmentDuration
        const segmentTrips = (shift.trips / shiftDuration) * segmentDuration

        hourlyData[hour].earnings += segmentEarnings
        hourlyData[hour].trips += segmentTrips
        hourlyData[hour].hours += segmentDuration

        currentTime = nextHour
      }
    })

    hourlyData.forEach(data => {
      if (data.hours > 0) {
        data.avgPerTrip = data.trips > 0 ? data.earnings / data.trips : 0
        data.earningsPerHour = data.earnings / data.hours
      }
    })
  }

  const sortedByEarnings = [...hourlyData]
    .filter(d => d.earnings > 0)
    .sort((a, b) => b.earningsPerHour - a.earningsPerHour)

  const topHours = sortedByEarnings.slice(0, 3)
  const peakHour = sortedByEarnings[0]

  const chartData = hourlyData
    .filter(d => d.earnings > 0)
    .map(d => ({
      hour: d.hourLabel,
      earnings: Math.round(d.earningsPerHour * 100) / 100,
      trips: Math.round(d.trips * 10) / 10
    }))

  const getBarColor = (value: number) => {
    if (!peakHour) return 'hsl(var(--primary))'
    const ratio = value / peakHour.earningsPerHour
    if (ratio >= 0.9) return 'hsl(var(--success))'
    if (ratio >= 0.7) return 'hsl(var(--primary))'
    if (ratio >= 0.5) return 'hsl(var(--warning))'
    return 'hsl(var(--muted-foreground))'
  }

  if (!shifts || shifts.length === 0) {
    return null
  }

  if (sortedByEarnings.length === 0) {
    return null
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-warning/20 p-2">
          <Clock size={20} className="text-warning" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
            Hourly Profitability Analysis
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Find your most profitable hours to maximize earnings
          </p>
        </div>
      </div>

      {peakHour && (
        <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">⭐</div>
            <div className="flex-1">
              <div className="font-bold text-[clamp(0.9rem,2.8vw,1.1rem)] text-success mb-0.5">
                Peak Hour: {peakHour.hourLabel}
              </div>
              <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                Your highest earning time slot
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card/50 rounded-lg p-2.5 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Per Hour</div>
              <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-success">
                {formatCurrency(peakHour.earningsPerHour)}
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-2.5 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Total Trips</div>
              <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
                {Math.round(peakHour.trips)}
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-2.5 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Per Trip</div>
              <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
                {formatCurrency(peakHour.avgPerTrip)}
              </div>
            </div>
          </div>
        </div>
      )}

      {topHours.length >= 3 && (
        <div className="mb-4">
          <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3 flex items-center gap-2">
            <Lightning size={16} className="text-warning" weight="fill" />
            Top 3 Most Profitable Hours
          </h3>
          <div className="grid gap-2">
            {topHours.map((hour, index) => (
              <div 
                key={hour.hour}
                className={`rounded-lg p-3 border ${
                  index === 0 
                    ? 'bg-success/10 border-success/30' 
                    : index === 1 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-warning/10 border-warning/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`text-xl ${
                      index === 0 ? 'text-success' : index === 1 ? 'text-primary' : 'text-warning'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <div className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]">
                        {hour.hourLabel}
                      </div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {Math.round(hour.trips)} trips · {hour.hours.toFixed(1)}h worked
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-[clamp(1rem,3vw,1.2rem)] ${
                      index === 0 ? 'text-success' : index === 1 ? 'text-primary' : 'text-warning'
                    }`}>
                      {formatCurrency(hour.earningsPerHour)}/hr
                    </div>
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                      {formatCurrency(hour.earnings)} total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-semibold mb-3">
          Earnings by Hour of Day
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '0.7rem' }}
              interval="preserveStartEnd"
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
                if (name === 'earnings') return [`$${value.toFixed(2)}/hr`, 'Earnings']
                if (name === 'trips') return [value.toFixed(1), 'Trips']
                return [value, name]
              }}
            />
            <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.earnings)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <TrendUp size={18} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <div className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)] mb-1">
              Pro Tip
            </div>
            <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
              Focus your driving during your top 3 hours. Schedule breaks during slower periods to maximize 
              your per-hour earnings and avoid burnout.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(() => {
          const morningShifts = hourlyData.slice(5, 12).filter(d => d.earnings > 0)
          const afternoonShifts = hourlyData.slice(12, 17).filter(d => d.earnings > 0)
          const eveningShifts = hourlyData.slice(17, 22).filter(d => d.earnings > 0)
          const nightShifts = [...hourlyData.slice(22, 24), ...hourlyData.slice(0, 5)].filter(d => d.earnings > 0)

          const morningAvg = morningShifts.length > 0 ? morningShifts.reduce((sum, d) => sum + d.earningsPerHour, 0) / morningShifts.length : 0
          const afternoonAvg = afternoonShifts.length > 0 ? afternoonShifts.reduce((sum, d) => sum + d.earningsPerHour, 0) / afternoonShifts.length : 0
          const eveningAvg = eveningShifts.length > 0 ? eveningShifts.reduce((sum, d) => sum + d.earningsPerHour, 0) / eveningShifts.length : 0
          const nightAvg = nightShifts.length > 0 ? nightShifts.reduce((sum, d) => sum + d.earningsPerHour, 0) / nightShifts.length : 0

          const dayParts = [
            { label: 'Morning', hours: '5-12', avg: morningAvg, icon: '🌅', active: morningShifts.length > 0 },
            { label: 'Afternoon', hours: '12-5', avg: afternoonAvg, icon: '☀️', active: afternoonShifts.length > 0 },
            { label: 'Evening', hours: '5-10', avg: eveningAvg, icon: '🌆', active: eveningShifts.length > 0 },
            { label: 'Night', hours: '10-5', avg: nightAvg, icon: '🌙', active: nightShifts.length > 0 }
          ]

          const maxAvg = Math.max(morningAvg, afternoonAvg, eveningAvg, nightAvg)

          return dayParts.map((part, index) => {
            if (!part.active) return null
            const isTop = part.avg === maxAvg && maxAvg > 0

            return (
              <div 
                key={index}
                className={`rounded-lg p-2.5 border text-center ${
                  isTop ? 'bg-success/10 border-success/30' : 'bg-card'
                }`}
              >
                <div className="text-xl mb-1">{part.icon}</div>
                <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] font-medium mb-0.5">
                  {part.label}
                </div>
                <div className={`text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1.5`}>
                  {part.hours}
                </div>
                <div className={`font-bold text-[clamp(0.9rem,2.8vw,1.1rem)] ${
                  isTop ? 'text-success' : ''
                }`}>
                  {formatCurrency(part.avg)}/hr
                </div>
                {isTop && (
                  <div className="text-[clamp(0.6rem,1.8vw,0.7rem)] text-success mt-1 font-medium">
                    Best Period
                  </div>
                )}
              </div>
            )
          }).filter(Boolean)
        })()}
      </div>
    </Card>
  )
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}

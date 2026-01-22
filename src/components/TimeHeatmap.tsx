import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Clock, TrendUp } from '@phosphor-icons/react'
import { useMemo } from 'react'

interface ShiftData {
  date: string
  startTime: string
  endTime: string
  earnings: number
  platform?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function TimeHeatmap() {
  const [shifts] = useKV<ShiftData[]>('driver-shifts', [])

  const heatmapData = useMemo(() => {
    if (!shifts || shifts.length === 0) return null

    const earningsByDayHour = Array.from({ length: 7 }, () => 
      Array.from({ length: 24 }, () => ({ total: 0, count: 0 }))
    )

    shifts.forEach(shift => {
      const date = new Date(shift.date)
      const dayOfWeek = date.getDay()
      
      const startHour = parseInt(shift.startTime.split(':')[0])
      const endHour = parseInt(shift.endTime.split(':')[0])
      const duration = endHour > startHour ? endHour - startHour : (24 - startHour) + endHour
      
      if (duration <= 0 || duration > 24) return

      const earningsPerHour = shift.earnings / duration

      for (let i = 0; i < duration; i++) {
        const hour = (startHour + i) % 24
        earningsByDayHour[dayOfWeek][hour].total += earningsPerHour
        earningsByDayHour[dayOfWeek][hour].count += 1
      }
    })

    const averages = earningsByDayHour.map(day => 
      day.map(hour => hour.count > 0 ? hour.total / hour.count : 0)
    )

    const allValues = averages.flat().filter(v => v > 0)
    const maxEarnings = Math.max(...allValues, 1)
    const minEarnings = Math.min(...allValues.filter(v => v > 0), 0)

    return { averages, maxEarnings, minEarnings }
  }, [shifts])

  const getColorIntensity = (earnings: number) => {
    if (!heatmapData || earnings === 0) return 'bg-muted/30'
    
    const { maxEarnings, minEarnings } = heatmapData
    const range = maxEarnings - minEarnings
    const normalized = range > 0 ? (earnings - minEarnings) / range : 0

    if (normalized >= 0.8) return 'bg-primary text-primary-foreground'
    if (normalized >= 0.6) return 'bg-primary/80 text-primary-foreground'
    if (normalized >= 0.4) return 'bg-primary/60 text-foreground'
    if (normalized >= 0.2) return 'bg-primary/40 text-foreground'
    if (normalized > 0) return 'bg-primary/20 text-foreground'
    return 'bg-muted/30 text-muted-foreground'
  }

  const formatEarnings = (earnings: number) => {
    return earnings > 0 ? `$${earnings.toFixed(0)}` : '-'
  }

  const bestHours = useMemo(() => {
    if (!heatmapData) return []
    
    const allHours = heatmapData.averages.flatMap((day, dayIdx) =>
      day.map((earnings, hour) => ({
        day: DAYS[dayIdx],
        hour,
        earnings
      }))
    ).filter(h => h.earnings > 0)
    
    return allHours
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5)
  }, [heatmapData])

  if (!shifts || shifts.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} weight="fill" className="text-primary" />
          <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)]">
            Peak Earning Hours
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <Clock size={24} weight="fill" className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-[clamp(0.75rem,2.2vw,0.85rem)]">
            Log shifts to see when you earn the most
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} weight="fill" className="text-primary" />
          <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)]">
            Peak Earning Hours
          </h3>
        </div>
        {heatmapData && (
          <div className="flex items-center gap-2 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
            <span>Max: ${heatmapData.maxEarnings.toFixed(0)}/hr</span>
          </div>
        )}
      </div>

      {heatmapData && (
        <>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-0.5 text-[clamp(0.65rem,1.8vw,0.7rem)]">
                <div className="h-6"></div>
                {HOURS.map(hour => (
                  <div 
                    key={hour} 
                    className="text-center text-muted-foreground font-mono text-[clamp(0.6rem,1.6vw,0.65rem)]"
                  >
                    {hour === 0 ? '12a' : hour < 12 ? `${hour}a` : hour === 12 ? '12p' : `${hour-12}p`}
                  </div>
                ))}

                {DAYS.map((day, dayIdx) => (
                  <div key={day} className="contents">
                    <div className="flex items-center justify-end pr-2 text-muted-foreground font-medium text-[clamp(0.7rem,2vw,0.75rem)]">
                      {day}
                    </div>
                    {HOURS.map(hour => {
                      const earnings = heatmapData.averages[dayIdx][hour]
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`aspect-square rounded-sm flex items-center justify-center font-mono font-medium transition-all hover:scale-110 hover:z-10 hover:shadow-lg cursor-pointer ${getColorIntensity(earnings)}`}
                          title={`${day} ${hour}:00 - $${earnings.toFixed(0)}/hr`}
                        >
                          <span className="text-[clamp(0.55rem,1.5vw,0.6rem)] opacity-0 group-hover:opacity-100">
                            {earnings > 0 ? `$${earnings.toFixed(0)}` : ''}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <TrendUp size={16} weight="fill" className="text-primary" />
              <h4 className="font-semibold text-[clamp(0.8rem,2.3vw,0.9rem)]">
                Top 5 Earning Hours
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {bestHours.map((slot, idx) => (
                <div 
                  key={`${slot.day}-${slot.hour}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-[clamp(0.65rem,1.8vw,0.7rem)] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[clamp(0.75rem,2vw,0.8rem)] line-clamp-1">
                      {slot.day} {slot.hour === 0 ? '12am' : slot.hour < 12 ? `${slot.hour}am` : slot.hour === 12 ? '12pm' : `${slot.hour-12}pm`}
                    </div>
                    <div className="text-[clamp(0.7rem,1.8vw,0.75rem)] text-muted-foreground font-mono">
                      ${slot.earnings.toFixed(0)}/hr
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-[clamp(0.7rem,1.8vw,0.75rem)]">
              <span className="text-muted-foreground">Earnings Intensity</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary/20"></div>
                  <span className="text-muted-foreground">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary/60"></div>
                  <span className="text-muted-foreground">Med</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span className="text-muted-foreground">High</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

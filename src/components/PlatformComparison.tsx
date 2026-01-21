import { useState } from 'react'
import { PlatformStats, Shift } from '@/lib/earnings-types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { formatCurrency, formatHours, getPlatformStats } from '@/lib/earnings-utils'
import { Progress } from '@/components/ui/progress'
import { 
  CurrencyDollar, 
  Clock, 
  Car, 
  TrendUp,
  ChartBar,
  CalendarBlank,
  X
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface PlatformComparisonProps {
  shifts: Shift[]
}

const PLATFORM_COLORS: Record<string, string> = {
  'Uber': '#000000',
  'Lyft': '#FF00BF',
  'Via': '#00D4AA',
  'Curb': '#00B14F',
  'Revel': '#5B7FFF',
  'Juno': '#6C5CE7',
  'Other': '#888888'
}

const PLATFORM_ICONS: Record<string, string> = {
  'Uber': '🚗',
  'Lyft': '🔮',
  'Via': '🚐',
  'Curb': '🚕',
  'Revel': '⚡',
  'Juno': '💜',
  'Other': '🚙'
}

export function PlatformComparison({ shifts }: PlatformComparisonProps) {
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

  const platformStats = getPlatformStats(filteredShifts)

  if (platformStats.length === 0) {
    return null
  }

  const maxEarnings = Math.max(...platformStats.map(p => p.earnings))
  const totalEarnings = platformStats.reduce((sum, p) => sum + p.earnings, 0)
  const totalHours = platformStats.reduce((sum, p) => sum + p.hours, 0)
  const totalTrips = platformStats.reduce((sum, p) => sum + p.trips, 0)

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20">
          <ChartBar size={20} className="text-primary" weight="fill" />
        </div>
        <div className="flex-1">
          <h3 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold line-clamp-1">Platform Performance</h3>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">Compare earnings across different apps</p>
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

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20">
            <CurrencyDollar size={20} className="text-accent" weight="fill" />
          </div>
          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground uppercase tracking-wide">Total Earned</div>
            <div className="text-[clamp(1.125rem,3.5vw,1.375rem)] font-bold">{formatCurrency(totalEarnings)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20">
            <Clock size={20} className="text-success" weight="fill" />
          </div>
          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground uppercase tracking-wide">Total Hours</div>
            <div className="text-[clamp(1.125rem,3.5vw,1.375rem)] font-bold">{formatHours(totalHours)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <Car size={20} className="text-primary" weight="fill" />
          </div>
          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground uppercase tracking-wide">Total Trips</div>
            <div className="text-[clamp(1.125rem,3.5vw,1.375rem)] font-bold">{totalTrips}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {platformStats.map((platform, index) => {
          const percentage = maxEarnings > 0 ? (platform.earnings / maxEarnings) * 100 : 0
          const earningsShare = totalEarnings > 0 ? (platform.earnings / totalEarnings) * 100 : 0

          return (
            <div 
              key={platform.platform} 
              className="p-4 bg-background rounded-lg border hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                    style={{ 
                      backgroundColor: `${PLATFORM_COLORS[platform.platform] || '#888888'}15` 
                    }}
                  >
                    {PLATFORM_ICONS[platform.platform] || '🚙'}
                  </div>
                  <div>
                    <div className="font-semibold text-[clamp(0.9rem,2.8vw,1.05rem)] line-clamp-1">{platform.platform}</div>
                    <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground">
                      {earningsShare.toFixed(1)}% of total earnings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[clamp(1.125rem,3.5vw,1.375rem)] font-bold">{formatCurrency(platform.earnings)}</div>
                  <div className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground">
                    {formatCurrency(platform.averageRate)}/hr
                  </div>
                </div>
              </div>

              <Progress 
                value={percentage} 
                className="h-2 mb-2.5"
              />

              <div className="grid grid-cols-3 gap-2.5 text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="font-semibold font-mono">{formatHours(platform.hours)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Car size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Trips:</span>
                  <span className="font-semibold font-mono">{platform.trips}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendUp size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Per trip:</span>
                  <span className="font-semibold font-mono">
                    {platform.trips > 0 ? formatCurrency(platform.earnings / platform.trips) : '$0.00'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {platformStats.length >= 2 && (
        <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/30">
          <div className="flex items-start gap-3">
            <TrendUp size={18} className="text-accent mt-0.5" weight="fill" />
            <div className="flex-1 text-[clamp(0.75rem,2.4vw,0.875rem)]">
              <div className="font-semibold mb-0.5">Performance Insight</div>
              <div className="text-foreground/80">
                {platformStats[0].platform} is your top earning platform at {formatCurrency(platformStats[0].averageRate)}/hr.
                {platformStats.length > 1 && platformStats[0].averageRate > platformStats[1].averageRate && (
                  <> That's {formatCurrency(platformStats[0].averageRate - platformStats[1].averageRate)}/hr more than {platformStats[1].platform}.</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

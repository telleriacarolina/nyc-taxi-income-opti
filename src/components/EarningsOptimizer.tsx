import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Shift } from '@/lib/earnings-types'
import { calculateStats, formatCurrency, formatHours, getPlatformStats, getDailyEarnings } from '@/lib/earnings-utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChartBar, TrendUp, Clock, CurrencyDollar, Car, Lightbulb, Target, Download } from '@phosphor-icons/react'
import { ShiftDialog } from './ShiftDialog'
import { ShiftCard } from './ShiftCard'
import { EarningsInsights } from './EarningsInsights'
import { PlatformComparison } from './PlatformComparison'
import { Insights } from './Insights'
import { TrafficOverlay } from './TrafficOverlay'
import { TrafficPatternComparison } from './TrafficPatternComparison'
import { LocationHeatmap } from './LocationHeatmap'
import { OptimalPositioningMap } from './OptimalPositioningMap'
import { RoutePlanner } from './RoutePlanner'
import { DailySchedulePlanner } from './DailySchedulePlanner'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { exportToCSV, exportInsightsToPDF, exportInsightsAsJSON } from '@/lib/report-export'
import { toast } from 'sonner'

export function EarningsOptimizer() {
  const [shifts, setShifts] = useKV<Shift[]>('driver-shifts', [])
  const [dailyGoalMin] = useKV<number>('daily-goal-min', 500)
  const [dailyGoalMax] = useKV<number>('daily-goal-max', 1000)
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)

  const stats = calculateStats(shifts || [])
  const platformStats = getPlatformStats(shifts || [])
  const dailyEarnings = getDailyEarnings(shifts || [])
  
  const goalMin = dailyGoalMin ?? 500
  const goalMax = dailyGoalMax ?? 1000

  const handleSaveShift = (shift: Shift) => {
    setShifts((currentShifts) => {
      const existing = (currentShifts || []).find(s => s.id === shift.id)
      if (existing) {
        return (currentShifts || []).map(s => s.id === shift.id ? shift : s)
      } else {
        return [...(currentShifts || []), shift]
      }
    })
    setEditingShift(null)
  }

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift)
    setIsShiftDialogOpen(true)
  }

  const handleDeleteShift = (shiftId: string) => {
    setShifts((currentShifts) => (currentShifts || []).filter(s => s.id !== shiftId))
  }

  const handleAddShift = () => {
    setEditingShift(null)
    setIsShiftDialogOpen(true)
  }

  const sortedShifts = [...(shifts || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const handleQuickExport = (format: 'csv' | 'txt' | 'json') => {
    if (!shifts || shifts.length === 0) {
      toast.error('No data to export')
      return
    }

    try {
      if (format === 'csv') {
        exportToCSV(shifts, stats)
        toast.success('CSV report downloaded')
      } else if (format === 'txt') {
        exportInsightsToPDF(shifts, stats)
        toast.success('Insights report downloaded')
      } else if (format === 'json') {
        exportInsightsAsJSON(shifts, stats)
        toast.success('JSON report downloaded')
      }
    } catch (error) {
      toast.error('Failed to export report')
      console.error('Export error:', error)
    }
  }

  return (
    <>
      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-muted-foreground uppercase tracking-wide text-[clamp(0.65rem,2vw,0.75rem)] truncate">Net</span>
            <CurrencyDollar size={18} className="text-accent flex-shrink-0" weight="fill" />
          </div>
          <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] truncate">{formatCurrency(stats.netEarnings)}</div>
          <div className="text-muted-foreground mt-0.5 text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">
            -{formatCurrency(stats.totalExpenses)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-muted-foreground uppercase tracking-wide text-[clamp(0.65rem,2vw,0.75rem)] truncate">Hourly</span>
            <TrendUp size={18} className="text-success flex-shrink-0" weight="fill" />
          </div>
          <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] truncate">{formatCurrency(stats.averageHourlyRate)}/hr</div>
          <div className="text-muted-foreground mt-0.5 text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">
            {formatHours(stats.totalHours)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-muted-foreground uppercase tracking-wide text-[clamp(0.65rem,2vw,0.75rem)] truncate">Trips</span>
            <Car size={18} className="text-primary flex-shrink-0" weight="fill" />
          </div>
          <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] truncate">{stats.totalTrips}</div>
          <div className="text-muted-foreground mt-0.5 text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">
            {formatCurrency(stats.averageTripEarnings)}/trip
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-muted-foreground uppercase tracking-wide text-[clamp(0.65rem,2vw,0.75rem)] truncate">Tips</span>
            <CurrencyDollar size={18} className="text-warning flex-shrink-0" weight="fill" />
          </div>
          <div className="font-bold text-[clamp(1.25rem,4vw,1.5rem)] truncate">{formatCurrency(stats.totalTips)}</div>
          <div className="text-muted-foreground mt-0.5 text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">
            {stats.totalEarnings > 0 ? Math.round((stats.totalTips / stats.totalEarnings) * 100) : 0}%
          </div>
        </Card>
      </div>

      {dailyEarnings.length > 0 && (
        <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-start gap-3 mb-3">
            <div className="rounded-full bg-primary/20 p-2">
              <Target size={20} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">Daily Goal Tracker</h2>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
                Target: {formatCurrency(goalMin)} - {formatCurrency(goalMax)} per day
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {dailyEarnings.slice(0, 7).map((day) => {
              const minProgress = Math.min((day.earnings / goalMin) * 100, 100)
              const maxProgress = Math.min((day.earnings / goalMax) * 100, 100)
              const isMinMet = day.earnings >= goalMin
              const isMaxMet = day.earnings >= goalMax
              
              return (
                <div key={day.date} className="bg-card rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-[clamp(0.8rem,2.5vw,0.9rem)] line-clamp-1">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {day.trips} trips · {formatHours(day.hours)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-[clamp(1rem,3vw,1.25rem)] ${
                        isMaxMet ? 'text-success' : isMinMet ? 'text-primary' : 'text-foreground'
                      }`}>
                        {formatCurrency(day.earnings)}
                      </div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {isMaxMet ? '🎯 Max goal!' : isMinMet ? '✓ Min goal' : `${formatCurrency(goalMin - day.earnings)} to min`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute h-full transition-all duration-300 ${
                        isMaxMet ? 'bg-success' : isMinMet ? 'bg-primary' : 'bg-warning'
                      }`}
                      style={{ width: `${maxProgress}%` }}
                    />
                    {!isMaxMet && (
                      <div 
                        className="absolute h-full border-r-2 border-primary/50"
                        style={{ left: `${(goalMin / goalMax) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {dailyEarnings.length > 0 && (
            <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Days at Min</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-primary">
                  {dailyEarnings.filter(d => d.earnings >= goalMin).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Days at Max</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-success">
                  {dailyEarnings.filter(d => d.earnings >= goalMax).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1">Avg Daily</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
                  {formatCurrency(dailyEarnings.reduce((sum, d) => sum + d.earnings, 0) / dailyEarnings.length)}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {(shifts || []).length > 0 && (
        <Card className="p-4 mb-4 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
          <div className="flex items-start gap-3 mb-3">
            <div className="rounded-full bg-success/20 p-2">
              <TrendUp size={20} className="text-success" weight="fill" />
            </div>
            <div className="flex-1">
              <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">2025 Earnings Target</h2>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">$300 per day with 7-10 quality rides</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-card rounded-lg p-3 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1 uppercase tracking-wide">Target Per Trip</div>
              <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] text-success">{formatCurrency(300 / 8.5)}</div>
              <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">Based on 8-9 avg rides</div>
            </div>

            <div className="bg-card rounded-lg p-3 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1 uppercase tracking-wide">Your Avg Per Trip</div>
              <div className={`font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] ${stats.averageTripEarnings >= (300 / 8.5) ? 'text-success' : 'text-warning'}`}>
                {formatCurrency(stats.averageTripEarnings)}
              </div>
              <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
                {stats.averageTripEarnings >= (300 / 8.5) ? '✓ On target' : `${formatCurrency((300 / 8.5) - stats.averageTripEarnings)} to go`}
              </div>
            </div>

            <div className="bg-card rounded-lg p-3 border">
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-1 uppercase tracking-wide">Projected Daily</div>
              <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
                {formatCurrency(stats.averageTripEarnings * 8.5)}
              </div>
              <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">At 8-9 trips/day pace</div>
            </div>
          </div>
        </Card>
      )}

      <Insights />

      <OptimalPositioningMap />

      <RoutePlanner />

      <DailySchedulePlanner />

      <TrafficPatternComparison />

      <TrafficOverlay />

      {(shifts || []).filter(s => s.startLocation && s.startLocation.trim() !== '').length > 0 && (
        <LocationHeatmap shifts={shifts || []} />
      )}

      {(shifts || []).length >= 3 && (
        <EarningsInsights shifts={shifts || []} stats={stats} />
      )}

      {platformStats.length > 0 && (
        <PlatformComparison shifts={shifts || []} />
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[clamp(1rem,2.8vw,1.125rem)] line-clamp-1">Shifts</h2>
        <div className="flex items-center gap-2">
          {(shifts || []).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)] gap-1.5"
                >
                  <Download size={16} weight="bold" className="flex-shrink-0" />
                  <span className="truncate">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleQuickExport('csv')} className="gap-2">
                  <Download size={16} weight="fill" />
                  <span>Shift Data (.csv)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleQuickExport('txt')} className="gap-2">
                  <Download size={16} weight="fill" />
                  <span>Full Report (.txt)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleQuickExport('json')} className="gap-2">
                  <Download size={16} weight="fill" />
                  <span>JSON Export (.json)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button 
            onClick={handleAddShift}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
          >
            <Plus size={18} weight="bold" className="mr-1 flex-shrink-0" />
            <span className="truncate">Add</span>
          </Button>
        </div>
      </div>

      {(shifts || []).length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
            <ChartBar size={24} className="text-accent" />
          </div>
          <h3 className="font-semibold mb-1 text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">Track Earnings</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2 leading-snug px-4">
            Log shifts for insights on best times & platforms
          </p>
          <Button 
            onClick={handleAddShift}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
          >
            <Plus size={18} weight="bold" className="mr-1 flex-shrink-0" />
            <span className="truncate">Log Shift</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedShifts.map(shift => (
            <ShiftCard 
              key={shift.id}
              shift={shift}
              onEdit={handleEditShift}
              onDelete={handleDeleteShift}
            />
          ))}
        </div>
      )}

      <ShiftDialog
        open={isShiftDialogOpen}
        onOpenChange={(open) => {
          setIsShiftDialogOpen(open)
          if (!open) setEditingShift(null)
        }}
        shift={editingShift}
        onSave={handleSaveShift}
      />
    </>
  )
}

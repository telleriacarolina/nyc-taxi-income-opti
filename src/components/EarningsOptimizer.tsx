import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Shift } from '@/lib/earnings-types'
import { calculateStats, formatCurrency, formatHours, getPlatformStats } from '@/lib/earnings-utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChartBar, TrendUp, Clock, CurrencyDollar, Car, Lightbulb } from '@phosphor-icons/react'
import { ShiftDialog } from './ShiftDialog'
import { ShiftCard } from './ShiftCard'
import { EarningsInsights } from './EarningsInsights'
import { PlatformComparison } from './PlatformComparison'
import { AIInsights } from './AIInsights'
import { VeteranInsights } from './VeteranInsights'

export function EarningsOptimizer() {
  const [shifts, setShifts] = useKV<Shift[]>('driver-shifts', [])
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)

  const stats = calculateStats(shifts || [])
  const platformStats = getPlatformStats(shifts || [])

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

      <AIInsights />

      <VeteranInsights />

      {(shifts || []).length >= 3 && (
        <EarningsInsights shifts={shifts || []} stats={stats} />
      )}

      {platformStats.length > 0 && (
        <PlatformComparison platformStats={platformStats} />
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[clamp(1rem,2.8vw,1.125rem)] line-clamp-1">Shifts</h2>
        <Button 
          onClick={handleAddShift}
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
        >
          <Plus size={18} weight="bold" className="mr-1 flex-shrink-0" />
          <span className="truncate">Add</span>
        </Button>
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

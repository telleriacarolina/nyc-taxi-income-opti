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
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Net</span>
            <CurrencyDollar size={18} className="text-accent" weight="fill" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(stats.netEarnings)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            -{formatCurrency(stats.totalExpenses)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hourly</span>
            <TrendUp size={18} className="text-success" weight="fill" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageHourlyRate)}/hr</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {formatHours(stats.totalHours)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Trips</span>
            <Car size={18} className="text-primary" weight="fill" />
          </div>
          <div className="text-2xl font-bold">{stats.totalTrips}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {formatCurrency(stats.averageTripEarnings)}/trip
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tips</span>
            <CurrencyDollar size={18} className="text-warning" weight="fill" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalTips)}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {stats.totalEarnings > 0 ? Math.round((stats.totalTips / stats.totalEarnings) * 100) : 0}%
          </div>
        </Card>
      </div>

      {(shifts || []).length >= 3 && (
        <EarningsInsights shifts={shifts || []} stats={stats} />
      )}

      {platformStats.length > 0 && (
        <PlatformComparison platformStats={platformStats} />
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Shifts</h2>
        <Button 
          onClick={handleAddShift}
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={18} weight="bold" className="mr-1" />
          Add
        </Button>
      </div>

      {(shifts || []).length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
            <ChartBar size={24} className="text-accent" />
          </div>
          <h3 className="text-base font-semibold mb-1">Track Earnings</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Log shifts for insights on best times & platforms
          </p>
          <Button 
            onClick={handleAddShift}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={18} weight="bold" className="mr-1" />
            Log Shift
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

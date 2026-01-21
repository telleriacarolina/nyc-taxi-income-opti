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
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Net Earnings</span>
            <CurrencyDollar size={24} className="text-accent" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(stats.netEarnings)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            After {formatCurrency(stats.totalExpenses)} expenses
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Hourly Rate</span>
            <TrendUp size={24} className="text-success" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(stats.averageHourlyRate)}/hr</div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatHours(stats.totalHours)} total
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Trips</span>
            <Car size={24} className="text-primary" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{stats.totalTrips}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatCurrency(stats.averageTripEarnings)} per trip
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Tips</span>
            <CurrencyDollar size={24} className="text-warning" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(stats.totalTips)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.totalEarnings > 0 ? Math.round((stats.totalTips / stats.totalEarnings) * 100) : 0}% of gross
          </div>
        </Card>
      </div>

      {(shifts || []).length >= 3 && (
        <EarningsInsights shifts={shifts || []} stats={stats} />
      )}

      {platformStats.length > 0 && (
        <PlatformComparison platformStats={platformStats} />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your Shifts</h2>
        <Button 
          onClick={handleAddShift}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={20} weight="bold" className="mr-2" />
          Add Shift
        </Button>
      </div>

      {(shifts || []).length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <ChartBar size={32} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start Tracking Your Earnings</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Add your shift data to get personalized insights on the best times and platforms to maximize your earnings
          </p>
          <Button 
            onClick={handleAddShift}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Log Your First Shift
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
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

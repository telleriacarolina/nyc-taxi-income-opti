import { Shift } from '@/lib/earnings-types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatHours } from '@/lib/earnings-utils'
import { formatDate } from '@/lib/date-utils'
import { PencilSimple, Trash, Clock, CurrencyDollar, Car } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ShiftCardProps {
  shift: Shift
  onEdit: (shift: Shift) => void
  onDelete: (shiftId: string) => void
}

const platformColors = {
  uber: 'bg-black text-white',
  lyft: 'bg-[#FF00BF] text-white',
  via: 'bg-[#00D0A0] text-white',
  other: 'bg-muted text-muted-foreground'
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  const hourlyRate = shift.hours > 0 ? shift.earnings / shift.hours : 0
  const netEarnings = shift.earnings - (shift.expenses || 0)

  return (
    <Card className="p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            <div className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide',
              platformColors[shift.platform]
            )}>
              {shift.platform}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg">{formatDate(shift.date)}</h3>
                <span className="text-sm text-muted-foreground font-mono">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
              {shift.notes && (
                <p className="text-sm text-muted-foreground truncate">{shift.notes}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CurrencyDollar size={18} className="text-success shrink-0" weight="fill" />
                <div>
                  <div className="font-semibold">{formatCurrency(netEarnings)}</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(hourlyRate)}/hr</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary shrink-0" weight="fill" />
                <div>
                  <div className="font-semibold">{formatHours(shift.hours)}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Car size={18} className="text-accent shrink-0" weight="fill" />
                <div>
                  <div className="font-semibold">{shift.trips} trips</div>
                  {shift.tips && shift.tips > 0 && (
                    <div className="text-xs text-muted-foreground">{formatCurrency(shift.tips)} tips</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(shift)}
          >
            <PencilSimple size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(shift.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

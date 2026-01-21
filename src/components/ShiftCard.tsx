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
  via: 'bg-[#00D4AA] text-white',
  curb: 'bg-[#00B14F] text-white',
  revel: 'bg-[#5B7FFF] text-white',
  juno: 'bg-[#6C5CE7] text-white',
  other: 'bg-muted text-muted-foreground'
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  const hourlyRate = shift.hours > 0 ? shift.earnings / shift.hours : 0
  const netEarnings = shift.earnings - (shift.expenses || 0)

  return (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0">
            <div className={cn(
              'px-3 py-1.5 rounded-md font-semibold uppercase tracking-wide text-[clamp(0.625rem,1.8vw,0.7rem)]',
              platformColors[shift.platform]
            )}>
              {shift.platform}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.125rem)] line-clamp-1">{formatDate(shift.date)}</h3>
                <span className="text-muted-foreground font-mono text-[clamp(0.65rem,2vw,0.75rem)] truncate">
                  {shift.startTime} - {shift.endTime}
                </span>
              </div>
              {shift.notes && (
                <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">{shift.notes}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 text-[clamp(0.75rem,2.4vw,0.875rem)]">
              <div className="flex items-center gap-2 min-w-0">
                <CurrencyDollar size={18} className="text-success shrink-0" weight="fill" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{formatCurrency(netEarnings)}</div>
                  <div className="text-muted-foreground text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">{formatCurrency(hourlyRate)}/hr</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 min-w-0">
                <Clock size={18} className="text-primary shrink-0" weight="fill" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{formatHours(shift.hours)}</div>
                  <div className="text-muted-foreground text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">Duration</div>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <Car size={18} className="text-accent shrink-0" weight="fill" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{shift.trips} trips</div>
                  {shift.tips && shift.tips > 0 && (
                    <div className="text-muted-foreground text-[clamp(0.625rem,1.8vw,0.7rem)] truncate">{formatCurrency(shift.tips)} tips</div>
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
            className="h-8 w-8 p-0"
          >
            <PencilSimple size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(shift.id)}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

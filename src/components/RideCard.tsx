import { Ride } from '@/lib/ride-types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/earnings-utils'
import { formatDistance, formatDuration, getRideEfficiencyScore } from '@/lib/ride-utils'
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  Path,
  CurrencyDollar,
  Star,
  PencilSimple,
  Trash
} from '@phosphor-icons/react'
import { format } from 'date-fns'

interface RideCardProps {
  ride: Ride
  onEdit: (ride: Ride) => void
  onDelete: (rideId: string) => void
}

const PLATFORM_COLORS: Record<string, string> = {
  uber: '#000000',
  lyft: '#FF00BF',
  via: '#00D4AA',
  curb: '#00B14F',
  revel: '#5B7FFF',
  juno: '#6C5CE7',
  other: '#6B7280'
}

export function RideCard({ ride, onEdit, onDelete }: RideCardProps) {
  const payPerMile = ride.distance > 0 ? ride.netPay / ride.distance : 0
  const payPerMinute = ride.duration > 0 ? ride.netPay / ride.duration : 0
  const feePercentage = ride.grossPay > 0 ? (ride.fees / ride.grossPay) * 100 : 0
  const efficiencyScore = getRideEfficiencyScore(ride)

  return (
    <Card className="p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: PLATFORM_COLORS[ride.platform] }}
          >
            {ride.platform.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg capitalize">{ride.platform}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {format(new Date(ride.date + 'T' + ride.time), 'MMM d, h:mm a')}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              {Array.from({ length: efficiencyScore }).map((_, i) => (
                <Star key={i} size={14} weight="fill" className="text-accent" />
              ))}
              {Array.from({ length: 5 - efficiencyScore }).map((_, i) => (
                <Star key={i} size={14} weight="regular" className="text-muted-foreground" />
              ))}
              <span className="ml-1 text-xs">Efficiency</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(ride)}
            className="h-9 w-9 p-0"
          >
            <PencilSimple size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(ride.id)}
            className="h-9 w-9 p-0 text-destructive hover:text-destructive"
          >
            <Trash size={18} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <MapPin size={20} className="text-success mt-0.5 flex-shrink-0" weight="fill" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{ride.pickupLocation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-7">
          <ArrowRight size={16} className="text-muted-foreground" weight="bold" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={20} className="text-destructive mt-0.5 flex-shrink-0" weight="fill" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{ride.dropoffLocation}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <Path size={20} className="text-primary" weight="bold" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Distance</div>
            <div className="font-semibold font-mono">{formatDistance(ride.distance)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <Clock size={20} className="text-primary" weight="bold" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Duration</div>
            <div className="font-semibold font-mono">{formatDuration(ride.duration)}</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Gross Pay</div>
            <div className="font-semibold font-mono">{formatCurrency(ride.grossPay)}</div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Fees ({feePercentage.toFixed(0)}%)</div>
            <div className="font-semibold font-mono text-destructive">-{formatCurrency(ride.fees)}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Net Pay</div>
            <div className="font-bold text-lg font-mono text-success">{formatCurrency(ride.netPay)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <CurrencyDollar size={16} className="text-accent" weight="bold" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Per Mile</div>
              <div className="font-semibold font-mono text-sm">{formatCurrency(payPerMile)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-accent" weight="bold" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Per Minute</div>
              <div className="font-semibold font-mono text-sm">{formatCurrency(payPerMinute)}</div>
            </div>
          </div>
        </div>

        {ride.rating && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">Your Rating</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: ride.rating }).map((_, i) => (
                <Star key={i} size={16} weight="fill" className="text-accent" />
              ))}
            </div>
          </div>
        )}

        {ride.notes && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">Notes</div>
            <div className="text-sm">{ride.notes}</div>
          </div>
        )}
      </div>
    </Card>
  )
}

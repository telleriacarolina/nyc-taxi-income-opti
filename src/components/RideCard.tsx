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
  Trash,
  GasPump,
  Lightning,
  Leaf
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

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
  const fuelCost = ride.fuelCost || 0
  const profit = ride.netPay - fuelCost
  const profitPerMile = ride.distance > 0 ? profit / ride.distance : 0

  const getVehicleIcon = () => {
    switch (ride.vehicleType) {
      case 'electric':
        return <Lightning size={16} weight="fill" className="text-accent" />
      case 'hybrid':
        return <Leaf size={16} weight="fill" className="text-success" />
      case 'gas':
        return <GasPump size={16} weight="fill" className="text-warning" />
      default:
        return null
    }
  }

  const getVehicleLabel = () => {
    switch (ride.vehicleType) {
      case 'electric':
        return 'Electric'
      case 'hybrid':
        return 'Hybrid'
      case 'gas':
        return 'Gas'
      default:
        return null
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className="p-4 group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-[clamp(0.7rem,2vw,0.8rem)]"
              style={{ backgroundColor: PLATFORM_COLORS[ride.platform] }}
            >
              {ride.platform.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] capitalize line-clamp-1">{ride.platform}</span>
                <Badge variant="outline" className="font-mono text-[clamp(0.625rem,1.8vw,0.7rem)]">
                  {format(new Date(ride.date + 'T' + ride.time), 'MMM d, h:mm a')}
                </Badge>
                {ride.vehicleType && (
                  <Badge variant="secondary" className="text-[clamp(0.625rem,1.8vw,0.7rem)] flex items-center gap-1">
                    {getVehicleIcon()}
                    {getVehicleLabel()}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                {Array.from({ length: efficiencyScore }).map((_, i) => (
                  <Star key={i} size={14} weight="fill" className="text-accent" />
                ))}
                {Array.from({ length: 5 - efficiencyScore }).map((_, i) => (
                  <Star key={i} size={14} weight="regular" className="text-muted-foreground" />
                ))}
                <span className="ml-1 text-[clamp(0.625rem,1.8vw,0.7rem)]">Efficiency</span>
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

      <div className="space-y-2.5 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-success mt-0.5 flex-shrink-0" weight="fill" />
          <div className="flex-1 min-w-0">
            <div className="text-[clamp(0.75rem,2.4vw,0.875rem)] font-medium truncate">{ride.pickupLocation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-6">
          <ArrowRight size={14} className="text-muted-foreground" weight="bold" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-destructive mt-0.5 flex-shrink-0" weight="fill" />
          <div className="flex-1 min-w-0">
            <div className="text-[clamp(0.75rem,2.4vw,0.875rem)] font-medium truncate">{ride.dropoffLocation}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg">
          <Path size={18} className="text-primary" weight="bold" />
          <div className="flex-1">
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground">Distance</div>
            <div className="font-semibold font-mono text-[clamp(0.75rem,2.4vw,0.875rem)]">{formatDistance(ride.distance)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg">
          <Clock size={18} className="text-primary" weight="bold" />
          <div className="flex-1">
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground">Duration</div>
            <div className="font-semibold font-mono text-[clamp(0.75rem,2.4vw,0.875rem)]">{formatDuration(ride.duration)}</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Gross Pay</div>
            <div className="font-semibold font-mono text-[clamp(0.75rem,2.4vw,0.875rem)]">{formatCurrency(ride.grossPay)}</div>
          </div>
          
          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Fees ({feePercentage.toFixed(0)}%)</div>
            <div className="font-semibold font-mono text-destructive text-[clamp(0.75rem,2.4vw,0.875rem)]">-{formatCurrency(ride.fees)}</div>
          </div>

          <div>
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Net Pay</div>
            <div className="font-bold text-[clamp(1rem,3vw,1.125rem)] font-mono text-success">{formatCurrency(ride.netPay)}</div>
          </div>
        </div>

        {fuelCost > 0 && (
          <div className="mt-2.5 pt-2.5 border-t">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">
                  {ride.vehicleType === 'electric' ? 'Charging' : 'Fuel'} Cost
                </div>
                <div className="font-semibold font-mono text-warning text-[clamp(0.75rem,2.4vw,0.875rem)]">-{formatCurrency(fuelCost)}</div>
              </div>
              
              <div>
                <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Cost/Mile</div>
                <div className="font-semibold font-mono text-[clamp(0.625rem,1.8vw,0.7rem)]">
                  {formatCurrency(ride.distance > 0 ? fuelCost / ride.distance : 0)}
                </div>
              </div>

              <div>
                <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Profit</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.125rem)] font-mono text-accent">{formatCurrency(profit)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2.5 pt-2.5 border-t">
          <div className="flex items-center gap-2">
            <CurrencyDollar size={16} className="text-accent" weight="bold" />
            <div className="flex-1">
              <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground">
                {fuelCost > 0 ? 'Profit/Mile' : 'Pay/Mile'}
              </div>
              <div className="font-semibold font-mono text-[clamp(0.75rem,2.4vw,0.875rem)]">
                {formatCurrency(fuelCost > 0 ? profitPerMile : payPerMile)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-accent" weight="bold" />
            <div className="flex-1">
              <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground">Per Minute</div>
              <div className="font-semibold font-mono text-[clamp(0.75rem,2.4vw,0.875rem)]">{formatCurrency(payPerMinute)}</div>
            </div>
          </div>
        </div>

        {ride.rating && (
          <div className="mt-2.5 pt-2.5 border-t">
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Your Rating</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: ride.rating }).map((_, i) => (
                <Star key={i} size={16} weight="fill" className="text-accent" />
              ))}
            </div>
          </div>
        )}

        {ride.notes && (
          <div className="mt-2.5 pt-2.5 border-t">
            <div className="text-[clamp(0.625rem,1.8vw,0.7rem)] text-muted-foreground mb-1">Notes</div>
            <div className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">{ride.notes}</div>
          </div>
        )}
      </div>
    </Card>
    </motion.div>
  )
}

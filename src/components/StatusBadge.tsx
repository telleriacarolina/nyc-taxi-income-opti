import { DocumentStatus } from '@/lib/types'
import { CheckCircle, Warning, WarningCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: DocumentStatus
  daysRemaining: number
  className?: string
}

export function StatusBadge({ status, daysRemaining, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'expired':
        return {
          label: 'Expired',
          icon: WarningCircle,
          className: 'bg-destructive text-destructive-foreground',
          animate: true
        }
      case 'expiring':
        return {
          label: `${daysRemaining} days left`,
          icon: Warning,
          className: 'bg-warning text-warning-foreground',
          animate: false
        }
      case 'current':
        return {
          label: 'Current',
          icon: CheckCircle,
          className: 'bg-success text-success-foreground',
          animate: false
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge 
      className={cn(
        'flex items-center gap-1.5 px-3 py-1 font-medium',
        config.className,
        config.animate && 'animate-pulse-soft',
        className
      )}
    >
      <Icon size={16} weight="fill" />
      <span>{config.label}</span>
    </Badge>
  )
}

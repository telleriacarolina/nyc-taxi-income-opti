import { TLCLicense } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { IdentificationCard, PencilSimple } from '@phosphor-icons/react'
import { getDocumentStatus, getDaysRemaining, formatDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface LicenseCardProps {
  license: TLCLicense | null
  onEdit: () => void
}

export function LicenseCard({ license, onEdit }: LicenseCardProps) {
  if (!license) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <IdentificationCard size={48} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2 text-[clamp(1rem,3vw,1.25rem)] line-clamp-1 px-4">No TLC License Added</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2 leading-snug px-4">
            Add your NYC TLC license information to start tracking your compliance status
          </p>
          <Button onClick={onEdit} className="bg-accent text-accent-foreground hover:bg-accent/90 h-9 px-4 text-[clamp(0.75rem,2.4vw,0.875rem)]">
            <IdentificationCard size={20} className="mr-2 flex-shrink-0" />
            <span className="truncate">Add License Info</span>
          </Button>
        </div>
      </Card>
    )
  }

  const status = getDocumentStatus(license.expirationDate)
  const daysRemaining = getDaysRemaining(license.expirationDate)

  const borderColorClass = {
    expired: 'border-l-destructive',
    expiring: 'border-l-warning',
    current: 'border-l-success'
  }[status]

  return (
    <Card className={cn('p-4 border-l-4 transition-all hover:shadow-md', borderColorClass)}>
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="rounded-lg bg-primary/10 p-3 flex-shrink-0">
            <IdentificationCard size={32} className="text-primary" weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-[clamp(1.25rem,3.5vw,1.5rem)] line-clamp-1">TLC License</h2>
            <p className="text-muted-foreground uppercase tracking-wide font-mono font-medium text-[clamp(0.65rem,2vw,0.75rem)] truncate">
              {license.licenseNumber}
            </p>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm" className="h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)] flex-shrink-0">
          <PencilSimple size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">Edit</span>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground uppercase tracking-wide font-medium text-[clamp(0.65rem,2vw,0.75rem)] truncate">Status</span>
          <StatusBadge status={status} daysRemaining={daysRemaining} />
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground uppercase tracking-wide font-medium text-[clamp(0.65rem,2vw,0.75rem)] truncate">Expiration Date</span>
          <span className="font-mono font-semibold text-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] truncate">{formatDate(license.expirationDate)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground uppercase tracking-wide font-medium text-[clamp(0.65rem,2vw,0.75rem)] truncate">Issue Date</span>
          <span className="font-mono text-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] truncate">{formatDate(license.issueDate)}</span>
        </div>
      </div>
    </Card>
  )
}

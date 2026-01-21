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
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <IdentificationCard size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No TLC License Added</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Add your NYC TLC license information to start tracking your compliance status
          </p>
          <Button onClick={onEdit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <IdentificationCard size={20} className="mr-2" />
            Add License Info
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
    <Card className={cn('p-6 border-l-4 transition-all hover:shadow-md', borderColorClass)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <IdentificationCard size={32} className="text-primary" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">TLC License</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-mono font-medium">
              {license.licenseNumber}
            </p>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <PencilSimple size={16} className="mr-1" />
          Edit
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Status</span>
          <StatusBadge status={status} daysRemaining={daysRemaining} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Expiration Date</span>
          <span className="font-mono font-semibold text-foreground">{formatDate(license.expirationDate)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Issue Date</span>
          <span className="font-mono text-foreground">{formatDate(license.issueDate)}</span>
        </div>
      </div>
    </Card>
  )
}

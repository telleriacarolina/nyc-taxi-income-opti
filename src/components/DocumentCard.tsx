import { Document, DocumentWithStatus } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { FileText, PencilSimple, CalendarBlank } from '@phosphor-icons/react'
import { getDocumentStatus, getDaysRemaining, formatDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface DocumentCardProps {
  document: DocumentWithStatus
  onEdit: (doc: Document) => void
}

export function DocumentCard({ document, onEdit }: DocumentCardProps) {
  const borderColorClass = {
    expired: 'border-l-destructive',
    expiring: 'border-l-warning',
    current: 'border-l-success'
  }[document.status]

  return (
    <Card className={cn('p-4 border-l-4 transition-all hover:shadow-md geometric-grid hexagon-pattern', borderColorClass)}>
      <div className="flex items-start justify-between mb-3 gap-2 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            'rounded-lg p-2.5 flex-shrink-0',
            document.status === 'expired' && 'bg-destructive/10',
            document.status === 'expiring' && 'bg-warning/10',
            document.status === 'current' && 'bg-success/10'
          )}>
            <FileText size={24} className={cn(
              document.status === 'expired' && 'text-destructive',
              document.status === 'expiring' && 'text-warning',
              document.status === 'current' && 'text-success'
            )} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.125rem)] line-clamp-1">{document.name}</h3>
            {document.notes && (
              <p className="text-muted-foreground mt-0.5 text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">{document.notes}</p>
            )}
          </div>
        </div>
        <Button onClick={() => onEdit(document)} variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0">
          <PencilSimple size={16} />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={document.status} daysRemaining={document.daysRemaining} />
          <div className="flex items-center gap-1.5 font-mono font-medium text-[clamp(0.65rem,2vw,0.75rem)] flex-shrink-0">
            <CalendarBlank size={16} className="text-muted-foreground" />
            <span className="truncate">{formatDate(document.expirationDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

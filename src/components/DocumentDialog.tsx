import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Document, DocumentType } from '@/lib/types'
import { formatDateInput } from '@/lib/date-utils'

interface DocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document | null
  onSave: (document: Document) => void
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'dmv-license', label: 'DMV License' },
  { value: 'defensive-driving', label: 'Defensive Driving Certificate' },
  { value: 'drug-test', label: 'Drug Test' },
  { value: 'vehicle-inspection', label: 'Vehicle Inspection' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' }
]

export function DocumentDialog({ open, onOpenChange, document, onSave }: DocumentDialogProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<DocumentType>('other')
  const [expirationDate, setExpirationDate] = useState('')
  const [issuedDate, setIssuedDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (document) {
      setName(document.name)
      setType(document.type)
      setExpirationDate(formatDateInput(document.expirationDate))
      setIssuedDate(document.issuedDate ? formatDateInput(document.issuedDate) : '')
      setNotes(document.notes || '')
    } else {
      setName('')
      setType('other')
      setExpirationDate('')
      setIssuedDate('')
      setNotes('')
    }
  }, [document, open])

  const handleSave = () => {
    if (!name || !expirationDate) return

    onSave({
      id: document?.id || Date.now().toString(),
      name,
      type,
      expirationDate,
      issuedDate: issuedDate || undefined,
      notes: notes || undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {document ? 'Edit Document' : 'Add Document'}
          </DialogTitle>
          <DialogDescription>
            Track required documents and their expiration dates to stay compliant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="doc-name" className="uppercase text-xs tracking-wide font-medium">
              Document Name
            </Label>
            <Input
              id="doc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., DMV License, Insurance Certificate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-type" className="uppercase text-xs tracking-wide font-medium">
              Document Type
            </Label>
            <Select value={type} onValueChange={(val) => setType(val as DocumentType)}>
              <SelectTrigger id="doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((docType) => (
                  <SelectItem key={docType.value} value={docType.value}>
                    {docType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issued-date" className="uppercase text-xs tracking-wide font-medium">
              Issue Date (Optional)
            </Label>
            <Input
              id="issued-date"
              type="date"
              value={issuedDate}
              onChange={(e) => setIssuedDate(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-date" className="uppercase text-xs tracking-wide font-medium">
              Expiration Date
            </Label>
            <Input
              id="exp-date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="uppercase text-xs tracking-wide font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name || !expirationDate}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Save Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

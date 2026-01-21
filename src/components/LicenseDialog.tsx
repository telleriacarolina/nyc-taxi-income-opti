import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TLCLicense } from '@/lib/types'
import { formatDateInput } from '@/lib/date-utils'

interface LicenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: TLCLicense | null
  onSave: (license: TLCLicense) => void
}

export function LicenseDialog({ open, onOpenChange, license, onSave }: LicenseDialogProps) {
  const [licenseNumber, setLicenseNumber] = useState(license?.licenseNumber || '')
  const [expirationDate, setExpirationDate] = useState(
    license?.expirationDate ? formatDateInput(license.expirationDate) : ''
  )
  const [issueDate, setIssueDate] = useState(
    license?.issueDate ? formatDateInput(license.issueDate) : ''
  )

  const handleSave = () => {
    if (!licenseNumber || !expirationDate || !issueDate) return

    onSave({
      licenseNumber,
      expirationDate,
      issueDate
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {license ? 'Edit TLC License' : 'Add TLC License'}
          </DialogTitle>
          <DialogDescription>
            Enter your NYC TLC license information to track your compliance status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="license-number" className="uppercase text-xs tracking-wide font-medium">
              License Number
            </Label>
            <Input
              id="license-number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              placeholder="5XXXXXX"
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-date" className="uppercase text-xs tracking-wide font-medium">
              Issue Date
            </Label>
            <Input
              id="issue-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration-date" className="uppercase text-xs tracking-wide font-medium">
              Expiration Date
            </Label>
            <Input
              id="expiration-date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!licenseNumber || !expirationDate || !issueDate}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Save License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useEffect } from 'react'
import { Shift } from '@/lib/earnings-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface ShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shift: Shift | null
  onSave: (shift: Shift) => void
}

export function ShiftDialog({ open, onOpenChange, shift, onSave }: ShiftDialogProps) {
  const [formData, setFormData] = useState<Partial<Shift>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    platform: 'uber',
    earnings: 0,
    hours: 8,
    trips: 0,
    tips: 0,
    expenses: 0,
    notes: ''
  })

  useEffect(() => {
    if (shift) {
      setFormData(shift)
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        platform: 'uber',
        earnings: 0,
        hours: 8,
        trips: 0,
        tips: 0,
        expenses: 0,
        notes: ''
      })
    }
  }, [shift, open])

  const calculateHours = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)
    
    let hours = endHour - startHour
    const minutes = endMin - startMin
    
    if (hours < 0) hours += 24
    
    return hours + (minutes / 60)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    const hours = calculateHours(formData.startTime, formData.endTime)

    const newShift: Shift = {
      id: shift?.id || uuidv4(),
      date: formData.date!,
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      platform: (formData.platform as Shift['platform']) || 'uber',
      earnings: Number(formData.earnings) || 0,
      hours: hours,
      trips: Number(formData.trips) || 0,
      tips: Number(formData.tips) || 0,
      expenses: Number(formData.expenses) || 0,
      notes: formData.notes || ''
    }

    onSave(newShift)
    onOpenChange(false)
    toast.success(shift ? 'Shift updated!' : 'Shift added!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{shift ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value as Shift['platform'] })}
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uber">Uber</SelectItem>
                  <SelectItem value="lyft">Lyft</SelectItem>
                  <SelectItem value="via">Via</SelectItem>
                  <SelectItem value="curb">Curb</SelectItem>
                  <SelectItem value="revel">Revel</SelectItem>
                  <SelectItem value="juno">Juno</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="earnings">Earnings</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.earnings}
                  onChange={(e) => setFormData({ ...formData, earnings: parseFloat(e.target.value) })}
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trips">Number of Trips</Label>
              <Input
                id="trips"
                type="number"
                min="0"
                value={formData.trips}
                onChange={(e) => setFormData({ ...formData, trips: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tips">Tips</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="tips"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: parseFloat(e.target.value) })}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Expenses</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="expenses"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.expenses}
                  onChange={(e) => setFormData({ ...formData, expenses: parseFloat(e.target.value) })}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this shift..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {shift ? 'Update Shift' : 'Add Shift'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useEffect } from 'react'
import { Ride } from '@/lib/ride-types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface RideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ride: Ride | null
  onSave: (ride: Ride) => void
}

export function RideDialog({ open, onOpenChange, ride, onSave }: RideDialogProps) {
  const [formData, setFormData] = useState<Partial<Ride>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    platform: 'uber',
    pickupLocation: '',
    dropoffLocation: '',
    distance: 0,
    duration: 0,
    grossPay: 0,
    fees: 0,
    netPay: 0,
    rating: undefined,
    notes: ''
  })

  useEffect(() => {
    if (ride) {
      setFormData(ride)
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        platform: 'uber',
        pickupLocation: '',
        dropoffLocation: '',
        distance: 0,
        duration: 0,
        grossPay: 0,
        fees: 0,
        netPay: 0,
        rating: undefined,
        notes: ''
      })
    }
  }, [ride, open])

  useEffect(() => {
    const grossPay = formData.grossPay || 0
    const fees = formData.fees || 0
    setFormData(prev => ({
      ...prev,
      netPay: grossPay - fees
    }))
  }, [formData.grossPay, formData.fees])

  const handleSave = () => {
    if (!formData.pickupLocation || !formData.dropoffLocation) {
      toast.error('Please enter pickup and dropoff locations')
      return
    }

    if ((formData.distance || 0) <= 0) {
      toast.error('Distance must be greater than 0')
      return
    }

    if ((formData.duration || 0) <= 0) {
      toast.error('Duration must be greater than 0')
      return
    }

    if ((formData.grossPay || 0) <= 0) {
      toast.error('Gross pay must be greater than 0')
      return
    }

    const rideData: Ride = {
      id: ride?.id || `ride_${Date.now()}`,
      date: formData.date!,
      time: formData.time!,
      platform: formData.platform as Ride['platform'],
      pickupLocation: formData.pickupLocation!,
      dropoffLocation: formData.dropoffLocation!,
      distance: formData.distance!,
      duration: formData.duration!,
      grossPay: formData.grossPay!,
      fees: formData.fees || 0,
      netPay: formData.netPay!,
      rating: formData.rating,
      notes: formData.notes
    }

    onSave(rideData)
    toast.success(ride ? 'Ride updated' : 'Ride added')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ride ? 'Edit Ride' : 'Add Ride'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData({ ...formData, platform: value as Ride['platform'] })}
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

          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input
              id="pickup"
              placeholder="e.g., Times Square, Manhattan"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff">Dropoff Location</Label>
            <Input
              id="dropoff"
              placeholder="e.g., JFK Airport, Queens"
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (miles)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                placeholder="5.2"
                value={formData.distance || ''}
                onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                step="1"
                min="0"
                placeholder="25"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossPay">Gross Pay</Label>
              <Input
                id="grossPay"
                type="number"
                step="0.01"
                min="0"
                placeholder="25.00"
                value={formData.grossPay || ''}
                onChange={(e) => setFormData({ ...formData, grossPay: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                min="0"
                placeholder="5.50"
                value={formData.fees || ''}
                onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="netPay">Net Pay</Label>
              <Input
                id="netPay"
                type="number"
                step="0.01"
                value={formData.netPay?.toFixed(2) || '0.00'}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating (1-5)</Label>
            <Select
              value={formData.rating?.toString() || 'none'}
              onValueChange={(value) => setFormData({ ...formData, rating: value === 'none' ? undefined : parseInt(value) })}
            >
              <SelectTrigger id="rating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No rating</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                <SelectItem value="2">⭐⭐ Poor</SelectItem>
                <SelectItem value="1">⭐ Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details about this ride..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {ride ? 'Update Ride' : 'Add Ride'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

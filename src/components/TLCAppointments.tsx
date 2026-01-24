import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  CalendarBlank, 
  Clock,
  MapPin,
  FileText,
  Link as LinkIcon,
  Trash,
  PencilSimple,
  ArrowSquareOut,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format, parseISO, isPast, isFuture, differenceInDays } from 'date-fns'

interface TLCAppointment {
  id: string
  type: string
  title: string
  date: string
  time: string
  location: string
  confirmationNumber?: string
  notes?: string
  resourceUrl?: string
  createdAt: string
  isRecurring?: boolean
  recurringInterval?: 'annual' | 'biannual' | 'monthly'
}

const appointmentTypes = [
  { value: 'license-renewal', label: 'License Renewal', icon: '🪪' },
  { value: 'vehicle-inspection', label: 'Vehicle Inspection', icon: '🚗' },
  { value: 'drug-test', label: 'Drug Test', icon: '🧪' },
  { value: 'hearing', label: 'TLC Hearing', icon: '⚖️' },
  { value: 'education', label: 'Driver Education', icon: '📚' },
  { value: 'dmv', label: 'DMV Appointment', icon: '🏛️' },
  { value: 'base-registration', label: 'Base Registration', icon: '📋' },
  { value: 'other', label: 'Other TLC Service', icon: '📌' }
]

export function TLCAppointments() {
  const [appointments, setAppointments] = useKV<TLCAppointment[]>('tlc-appointments', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<TLCAppointment | null>(null)
  
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    date: '',
    time: '',
    location: '',
    confirmationNumber: '',
    notes: '',
    resourceUrl: '',
    isRecurring: false,
    recurringInterval: 'annual' as 'annual' | 'biannual' | 'monthly'
  })

  const handleOpenDialog = (appointment?: TLCAppointment) => {
    if (appointment) {
      setEditingAppointment(appointment)
      setFormData({
        type: appointment.type,
        title: appointment.title,
        date: appointment.date,
        time: appointment.time,
        location: appointment.location,
        confirmationNumber: appointment.confirmationNumber || '',
        notes: appointment.notes || '',
        resourceUrl: appointment.resourceUrl || '',
        isRecurring: appointment.isRecurring || false,
        recurringInterval: appointment.recurringInterval || 'annual'
      })
    } else {
      setEditingAppointment(null)
      setFormData({
        type: '',
        title: '',
        date: '',
        time: '',
        location: '',
        confirmationNumber: '',
        notes: '',
        resourceUrl: '',
        isRecurring: false,
        recurringInterval: 'annual'
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveAppointment = () => {
    if (!formData.type || !formData.title || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    const appointment: TLCAppointment = {
      id: editingAppointment?.id || `apt-${Date.now()}`,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      confirmationNumber: formData.confirmationNumber,
      notes: formData.notes,
      resourceUrl: formData.resourceUrl,
      isRecurring: formData.isRecurring,
      recurringInterval: formData.recurringInterval,
      createdAt: editingAppointment?.createdAt || new Date().toISOString()
    }

    setAppointments(current => {
      const appointments = current || []
      const existing = appointments.find(a => a.id === appointment.id)
      if (existing) {
        toast.success('Appointment updated')
        return appointments.map(a => a.id === appointment.id ? appointment : a)
      } else {
        toast.success('Appointment added')
        return [...appointments, appointment]
      }
    })

    setIsDialogOpen(false)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(current => current?.filter(a => a.id !== id) || [])
    toast.success('Appointment deleted')
  }

  const upcomingAppointments = (appointments || [])
    .filter(apt => isFuture(parseISO(apt.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastAppointments = (appointments || [])
    .filter(apt => isPast(parseISO(apt.date)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getAppointmentStatus = (date: string) => {
    const daysUntil = differenceInDays(parseISO(date), new Date())
    if (daysUntil < 0) return { label: 'Completed', color: 'text-muted-foreground', variant: 'outline' as const }
    if (daysUntil === 0) return { label: 'Today', color: 'text-warning', variant: 'default' as const }
    if (daysUntil <= 7) return { label: `${daysUntil}d away`, color: 'text-warning', variant: 'secondary' as const }
    return { label: `${daysUntil}d away`, color: 'text-muted-foreground', variant: 'outline' as const }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
                TLC Appointments
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                Track licensing, inspections, drug tests, and compliance appointments
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2 flex-shrink-0">
              <Plus size={18} weight="bold" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-primary">
                {upcomingAppointments.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Upcoming
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-success">
                {pastAppointments.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Completed
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
                {(appointments || []).filter(a => a.isRecurring).length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Recurring
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <CalendarBlank size={18} weight="fill" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map(appointment => {
                const status = getAppointmentStatus(appointment.date)
                const typeInfo = appointmentTypes.find(t => t.value === appointment.type)
                
                return (
                  <Card key={appointment.id} className="border-muted">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-2xl flex-shrink-0">{typeInfo?.icon}</span>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start gap-2 flex-wrap">
                                <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                                  {appointment.title}
                                </h3>
                                <Badge variant={status.variant} className={`text-[10px] h-5 ${status.color}`}>
                                  {status.label}
                                </Badge>
                                {appointment.isRecurring && (
                                  <Badge variant="outline" className="text-[10px] h-5">
                                    🔄 {appointment.recurringInterval}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)]">
                                {typeInfo?.label}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)]">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarBlank size={14} weight="fill" className="flex-shrink-0" />
                            <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          {appointment.time && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock size={14} weight="fill" className="flex-shrink-0" />
                              <span>{appointment.time}</span>
                            </div>
                          )}
                          {appointment.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={14} weight="fill" className="flex-shrink-0" />
                              <span className="line-clamp-1">{appointment.location}</span>
                            </div>
                          )}
                          {appointment.confirmationNumber && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText size={14} weight="fill" className="flex-shrink-0" />
                              <span>Confirmation: {appointment.confirmationNumber}</span>
                            </div>
                          )}
                        </div>

                        {appointment.notes && (
                          <div className="rounded-md bg-muted/50 p-2">
                            <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground line-clamp-2 leading-snug">
                              {appointment.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {appointment.resourceUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(appointment.resourceUrl, '_blank')}
                              className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                            >
                              <ArrowSquareOut size={12} weight="bold" />
                              TLC Resource
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(appointment)}
                            className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                          >
                            <PencilSimple size={12} weight="bold" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)] text-destructive hover:text-destructive"
                          >
                            <Trash size={12} weight="bold" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingAppointments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <CalendarBlank size={48} weight="duotone" className="mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-[clamp(0.85rem,2.6vw,1rem)]">
                No upcoming appointments
              </p>
              <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                Add your TLC compliance appointments to stay organized
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus size={18} weight="bold" />
              Add Your First Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Past Appointments
              <Badge variant="outline" className="text-[10px]">
                {pastAppointments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pastAppointments.slice(0, 10).map(appointment => {
                const typeInfo = appointmentTypes.find(t => t.value === appointment.type)
                
                return (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">{typeInfo?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-1">
                          {appointment.title}
                        </p>
                        <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">
                          {format(parseISO(appointment.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <Trash size={14} weight="bold" className="text-destructive" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
              {editingAppointment ? 'Edit Appointment' : 'Add TLC Appointment'}
            </DialogTitle>
            <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
              Track your TLC compliance appointments and deadlines
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Appointment Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger id="type" className="h-10">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Annual Drug Test"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., 33-34 Northern Blvd, LIC"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Confirmation Number
              </Label>
              <Input
                id="confirmation"
                placeholder="Enter confirmation or reference number"
                value={formData.confirmationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmationNumber: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourceUrl" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Related TLC Link
              </Label>
              <Input
                id="resourceUrl"
                placeholder="https://..."
                value={formData.resourceUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, resourceUrl: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or reminders..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="isRecurring" className="text-[clamp(0.75rem,2.4vw,0.85rem)] cursor-pointer">
                  Recurring Appointment
                </Label>
              </div>
              
              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label className="text-[clamp(0.7rem,2.2vw,0.8rem)]">
                    Recurrence Interval
                  </Label>
                  <Select 
                    value={formData.recurringInterval} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, recurringInterval: value }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual (every year)</SelectItem>
                      <SelectItem value="biannual">Biannual (every 6 months)</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAppointment} className="gap-2">
              <CheckCircle size={16} weight="bold" />
              {editingAppointment ? 'Update' : 'Add'} Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Bell,
  BellRinging,
  BellSlash,
  Trash,
  PencilSimple,
  CheckCircle,
  WarningCircle,
  CalendarBlank,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format, parseISO, differenceInDays, addDays, subDays } from 'date-fns'

interface TLCReminder {
  id: string
  type: 'license-expiration' | 'vehicle-expiration' | 'drug-test' | 'appointment' | 'custom'
  title: string
  targetDate: string
  reminderIntervals: number[]
  enabled: boolean
  notificationMethods: ('inApp' | 'sms' | 'push')[]
  createdAt: string
  lastNotified?: string
}

const reminderTypes = [
  { value: 'license-expiration', label: 'License Expiration', icon: '🪪' },
  { value: 'vehicle-expiration', label: 'Vehicle Registration', icon: '🚗' },
  { value: 'drug-test', label: 'Annual Drug Test', icon: '🧪' },
  { value: 'appointment', label: 'TLC Appointment', icon: '📅' },
  { value: 'custom', label: 'Custom Reminder', icon: '🔔' }
]

const intervalOptions = [
  { value: 1, label: '1 day before' },
  { value: 3, label: '3 days before' },
  { value: 7, label: '7 days before' },
  { value: 14, label: '14 days before' },
  { value: 30, label: '30 days before' },
  { value: 60, label: '60 days before' },
  { value: 90, label: '90 days before' }
]

export function TLCReminders() {
  const [reminders, setReminders] = useKV<TLCReminder[]>('tlc-reminders', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<TLCReminder | null>(null)
  
  const [formData, setFormData] = useState({
    type: '' as TLCReminder['type'],
    title: '',
    targetDate: '',
    reminderIntervals: [30, 14, 7, 1] as number[],
    enabled: true,
    notificationMethods: ['inApp'] as ('inApp' | 'sms' | 'push')[]
  })

  const handleOpenDialog = (reminder?: TLCReminder) => {
    if (reminder) {
      setEditingReminder(reminder)
      setFormData({
        type: reminder.type,
        title: reminder.title,
        targetDate: reminder.targetDate,
        reminderIntervals: reminder.reminderIntervals,
        enabled: reminder.enabled,
        notificationMethods: reminder.notificationMethods
      })
    } else {
      setEditingReminder(null)
      setFormData({
        type: 'custom',
        title: '',
        targetDate: '',
        reminderIntervals: [30, 14, 7, 1],
        enabled: true,
        notificationMethods: ['inApp']
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveReminder = () => {
    if (!formData.type || !formData.title || !formData.targetDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.reminderIntervals.length === 0) {
      toast.error('Please select at least one reminder interval')
      return
    }

    const reminder: TLCReminder = {
      id: editingReminder?.id || `rem-${Date.now()}`,
      type: formData.type,
      title: formData.title,
      targetDate: formData.targetDate,
      reminderIntervals: formData.reminderIntervals.sort((a, b) => b - a),
      enabled: formData.enabled,
      notificationMethods: formData.notificationMethods,
      createdAt: editingReminder?.createdAt || new Date().toISOString()
    }

    setReminders(current => {
      const rems = current || []
      const existing = rems.find(r => r.id === reminder.id)
      if (existing) {
        toast.success('Reminder updated')
        return rems.map(r => r.id === reminder.id ? reminder : r)
      } else {
        toast.success('Reminder added')
        return [...rems, reminder]
      }
    })

    setIsDialogOpen(false)
  }

  const handleDeleteReminder = (id: string) => {
    setReminders(current => current?.filter(r => r.id !== id) || [])
    toast.success('Reminder deleted')
  }

  const handleToggleReminder = (id: string) => {
    setReminders(current => 
      (current || []).map(r => 
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    )
  }

  const toggleInterval = (interval: number) => {
    setFormData(prev => ({
      ...prev,
      reminderIntervals: prev.reminderIntervals.includes(interval)
        ? prev.reminderIntervals.filter(i => i !== interval)
        : [...prev.reminderIntervals, interval]
    }))
  }

  const toggleNotificationMethod = (method: 'inApp' | 'sms' | 'push') => {
    setFormData(prev => ({
      ...prev,
      notificationMethods: prev.notificationMethods.includes(method)
        ? prev.notificationMethods.filter(m => m !== method)
        : [...prev.notificationMethods, method]
    }))
  }

  const getNextReminderDate = (reminder: TLCReminder) => {
    const targetDate = parseISO(reminder.targetDate)
    const today = new Date()
    const daysUntil = differenceInDays(targetDate, today)
    
    const nextInterval = reminder.reminderIntervals.find(interval => daysUntil >= interval)
    if (nextInterval) {
      return subDays(targetDate, nextInterval)
    }
    return null
  }

  const getReminderStatus = (reminder: TLCReminder) => {
    const targetDate = parseISO(reminder.targetDate)
    const daysUntil = differenceInDays(targetDate, new Date())
    
    if (daysUntil < 0) return { label: 'Expired', color: 'text-destructive', variant: 'destructive' as const }
    if (daysUntil === 0) return { label: 'Today', color: 'text-warning', variant: 'default' as const }
    if (daysUntil <= 7) return { label: `${daysUntil}d left`, color: 'text-warning', variant: 'secondary' as const }
    if (daysUntil <= 30) return { label: `${daysUntil}d left`, color: 'text-primary', variant: 'outline' as const }
    return { label: `${daysUntil}d left`, color: 'text-muted-foreground', variant: 'outline' as const }
  }

  const activeReminders = (reminders || [])
    .filter(r => r.enabled && differenceInDays(parseISO(r.targetDate), new Date()) >= 0)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())

  const inactiveReminders = (reminders || [])
    .filter(r => !r.enabled || differenceInDays(parseISO(r.targetDate), new Date()) < 0)
    .sort((a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime())

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
                Compliance Reminders
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                Automated alerts for license expirations and compliance deadlines
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
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-success">
                {activeReminders.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Active
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-muted-foreground">
                {inactiveReminders.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Inactive
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-primary">
                {(reminders || []).reduce((sum, r) => sum + r.reminderIntervals.length, 0)}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Total Alerts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Bell size={18} weight="fill" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-semibold text-[clamp(0.8rem,2.5vw,0.95rem)]">
                Notification Methods
              </h3>
              <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-2 leading-snug">
                Configure in-app alerts, SMS messages, and push notifications for each reminder. SMS and push notifications coming soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <BellRinging size={18} weight="fill" className="text-success" />
              Active Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeReminders.map(reminder => {
                const status = getReminderStatus(reminder)
                const typeInfo = reminderTypes.find(t => t.value === reminder.type)
                const nextReminder = getNextReminderDate(reminder)
                
                return (
                  <Card key={reminder.id} className="border-muted">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-2xl flex-shrink-0">{typeInfo?.icon}</span>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start gap-2 flex-wrap">
                                <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                                  {reminder.title}
                                </h3>
                                <Badge variant={status.variant} className={`text-[10px] h-5 ${status.color}`}>
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)]">
                                {typeInfo?.label}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={reminder.enabled}
                            onCheckedChange={() => handleToggleReminder(reminder.id)}
                          />
                        </div>

                        <div className="grid gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)]">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarBlank size={14} weight="fill" className="flex-shrink-0" />
                            <span>Target: {format(parseISO(reminder.targetDate), 'MMMM d, yyyy')}</span>
                          </div>
                          {nextReminder && (
                            <div className="flex items-center gap-2 text-primary">
                              <Clock size={14} weight="fill" className="flex-shrink-0" />
                              <span>Next alert: {format(nextReminder, 'MMMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {reminder.reminderIntervals.map(interval => (
                            <Badge key={interval} variant="outline" className="text-[10px] h-5">
                              {interval}d before
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {reminder.notificationMethods.map(method => (
                            <Badge key={method} variant="secondary" className="text-[10px] h-5">
                              {method === 'inApp' && '📱 In-App'}
                              {method === 'sms' && '💬 SMS'}
                              {method === 'push' && '🔔 Push'}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(reminder)}
                            className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                          >
                            <PencilSimple size={12} weight="bold" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteReminder(reminder.id)}
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

      {activeReminders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <BellSlash size={48} weight="duotone" className="mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium text-[clamp(0.85rem,2.6vw,1rem)]">
                No active reminders
              </p>
              <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                Set up automated alerts to never miss a TLC deadline
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus size={18} weight="bold" />
              Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      )}

      {inactiveReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <BellSlash size={18} weight="fill" className="text-muted-foreground" />
              Inactive Reminders
              <Badge variant="outline" className="text-[10px]">
                {inactiveReminders.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {inactiveReminders.slice(0, 10).map(reminder => {
                const typeInfo = reminderTypes.find(t => t.value === reminder.type)
                
                return (
                  <div 
                    key={reminder.id} 
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0 opacity-50">{typeInfo?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-1 opacity-70">
                          {reminder.title}
                        </p>
                        <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">
                          {format(parseISO(reminder.targetDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash size={14} weight="bold" className="text-destructive" />
                      </Button>
                    </div>
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
              {editingReminder ? 'Edit Reminder' : 'Add TLC Reminder'}
            </DialogTitle>
            <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
              Set up automated alerts for TLC compliance deadlines
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Reminder Type *
              </Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger id="type" className="h-10">
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTypes.map(type => (
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
                placeholder="e.g., TLC License Renewal"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Target Date *
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Reminder Intervals * (select one or more)
              </Label>
              <div className="flex flex-wrap gap-2">
                {intervalOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={formData.reminderIntervals.includes(option.value) ? 'default' : 'outline'}
                    onClick={() => toggleInterval(option.value)}
                    className="h-8 text-[clamp(0.7rem,2.2vw,0.8rem)]"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Notification Methods
              </Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <span>📱</span>
                    <div>
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">In-App</p>
                      <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        Show alerts in the app
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.notificationMethods.includes('inApp')}
                    onCheckedChange={() => toggleNotificationMethod('inApp')}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border opacity-50">
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <div>
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">SMS</p>
                      <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                  </div>
                  <Switch disabled checked={false} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border opacity-50">
                  <div className="flex items-center gap-2">
                    <span>🔔</span>
                    <div>
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">Push</p>
                      <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                  </div>
                  <Switch disabled checked={false} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label htmlFor="enabled" className="text-[clamp(0.75rem,2.4vw,0.85rem)] cursor-pointer">
                Enable Reminder
              </Label>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReminder} className="gap-2">
              <CheckCircle size={16} weight="bold" />
              {editingReminder ? 'Update' : 'Add'} Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

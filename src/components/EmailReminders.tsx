import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  EnvelopeSimple,
  Bell,
  CheckCircle,
  Plus,
  Trash,
  PencilSimple,
  CalendarBlank,
  WarningCircle,
  EnvelopeOpen
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format, parseISO, differenceInDays } from 'date-fns'

interface EmailReminderConfig {
  id: string
  email: string
  enabled: boolean
  createdAt: string
  verified: boolean
}

interface ScheduledEmailReminder {
  id: string
  appointmentId: string
  appointmentType: 'tlc' | 'dmv'
  appointmentTitle: string
  appointmentDate: string
  email: string
  reminderDays: number
  scheduledDate: string
  sent: boolean
  sentAt?: string
}

export function EmailReminders() {
  const [emailConfig, setEmailConfig] = useKV<EmailReminderConfig | null>('email-reminder-config', null)
  const [scheduledReminders, setScheduledReminders] = useKV<ScheduledEmailReminder[]>('scheduled-email-reminders', [])
  const [tlcAppointments] = useKV<any[]>('tlc-appointments', [])
  const [dmvAppointments] = useKV<any[]>('dmv-appointments', [])
  const [isSetupOpen, setIsSetupOpen] = useState(false)
  const [emailInput, setEmailInput] = useState('')

  const allAppointments = [
    ...(tlcAppointments || []).map(apt => ({ ...apt, type: 'tlc' as const })),
    ...(dmvAppointments || []).map(apt => ({ ...apt, type: 'dmv' as const }))
  ]

  useEffect(() => {
    if (emailConfig?.enabled && emailConfig?.email) {
      generateScheduledReminders()
    }
  }, [tlcAppointments, dmvAppointments, emailConfig])

  const generateScheduledReminders = () => {
    if (!emailConfig?.enabled || !emailConfig?.email) return

    const reminderDays = [30, 14, 7, 3, 1]
    const newReminders: ScheduledEmailReminder[] = []

    allAppointments.forEach(apt => {
      reminderDays.forEach(days => {
        const aptDate = new Date(apt.date)
        const scheduledDate = new Date(aptDate)
        scheduledDate.setDate(scheduledDate.getDate() - days)

        const reminderId = `${apt.id}-${days}d`
        const existing = (scheduledReminders || []).find(r => r.id === reminderId)

        if (!existing) {
          newReminders.push({
            id: reminderId,
            appointmentId: apt.id,
            appointmentType: apt.type,
            appointmentTitle: apt.title,
            appointmentDate: apt.date,
            email: emailConfig.email,
            reminderDays: days,
            scheduledDate: scheduledDate.toISOString(),
            sent: false
          })
        }
      })
    })

    if (newReminders.length > 0) {
      setScheduledReminders(current => [...(current || []), ...newReminders])
    }
  }

  const handleSetupEmail = () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    const config: EmailReminderConfig = {
      id: `email-${Date.now()}`,
      email: emailInput,
      enabled: true,
      createdAt: new Date().toISOString(),
      verified: false
    }

    setEmailConfig(config)
    setIsSetupOpen(false)
    toast.success('Email reminders enabled')
    toast.info('Verification email sent (simulation)')
  }

  const handleToggleEmailReminders = (enabled: boolean) => {
    if (!emailConfig) return
    
    setEmailConfig(current => 
      current ? { ...current, enabled } : null
    )
    
    toast.success(enabled ? 'Email reminders enabled' : 'Email reminders disabled')
  }

  const handleVerifyEmail = () => {
    if (!emailConfig) return
    
    setEmailConfig(current => 
      current ? { ...current, verified: true } : null
    )
    
    toast.success('Email verified')
  }

  const upcomingReminders = (scheduledReminders || [])
    .filter(r => !r.sent && differenceInDays(parseISO(r.scheduledDate), new Date()) >= 0)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 10)

  const sentReminders = (scheduledReminders || [])
    .filter(r => r.sent)
    .sort((a, b) => new Date(b.sentAt || b.scheduledDate).getTime() - new Date(a.sentAt || a.scheduledDate).getTime())
    .slice(0, 5)

  const totalScheduled = (scheduledReminders || []).filter(r => !r.sent).length

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-[clamp(0.95rem,2.8vw,1.15rem)]">
                <EnvelopeSimple size={20} weight="fill" className="text-primary" />
                Email Reminders
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                Get appointment reminders delivered to your inbox
              </CardDescription>
            </div>
            {!emailConfig && (
              <Button onClick={() => setIsSetupOpen(true)} className="gap-2 flex-shrink-0">
                <Plus size={18} weight="bold" />
                <span className="hidden sm:inline">Setup</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-primary">
                {totalScheduled}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Scheduled
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-success">
                {sentReminders.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Sent
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
                {allAppointments.length}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Appointments
              </div>
            </div>
          </div>

          {emailConfig && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">
                      {emailConfig.email}
                    </p>
                    {emailConfig.verified ? (
                      <Badge variant="default" className="text-[10px] h-5 gap-1">
                        <CheckCircle size={12} weight="fill" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                        <WarningCircle size={12} weight="fill" />
                        Unverified
                      </Badge>
                    )}
                    {emailConfig.enabled ? (
                      <Badge variant="outline" className="text-[10px] h-5 text-success">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                        Paused
                      </Badge>
                    )}
                  </div>
                  <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                    Receive reminders 30, 14, 7, 3, and 1 day before appointments
                  </p>
                </div>
                <Switch
                  checked={emailConfig.enabled}
                  onCheckedChange={handleToggleEmailReminders}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {!emailConfig.verified && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleVerifyEmail}
                    className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                  >
                    <EnvelopeOpen size={12} weight="bold" />
                    Verify Email
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEmailInput(emailConfig.email)
                    setIsSetupOpen(true)
                  }}
                  className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                >
                  <PencilSimple size={12} weight="bold" />
                  Change Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEmailConfig(null)
                    setScheduledReminders([])
                    toast.success('Email reminders removed')
                  }}
                  className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)] text-destructive hover:text-destructive"
                >
                  <Trash size={12} weight="bold" />
                  Remove
                </Button>
              </div>
            </div>
          )}

          {!emailConfig && (
            <div className="rounded-lg border-dashed border-2 bg-muted/20 p-6 text-center space-y-3">
              <EnvelopeSimple size={40} weight="duotone" className="mx-auto text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-medium text-[clamp(0.85rem,2.6vw,1rem)]">
                  Email reminders not configured
                </p>
                <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                  Add your email to receive automatic appointment reminders
                </p>
              </div>
              <Button onClick={() => setIsSetupOpen(true)} className="gap-2">
                <Plus size={18} weight="bold" />
                Setup Email Reminders
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {emailConfig && upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <Bell size={18} weight="fill" className="text-primary" />
              Upcoming Email Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReminders.map(reminder => {
                const daysUntil = differenceInDays(parseISO(reminder.scheduledDate), new Date())
                
                return (
                  <div 
                    key={reminder.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                        <EnvelopeSimple size={16} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-1">
                          {reminder.appointmentTitle}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] h-4">
                            {reminder.appointmentType.toUpperCase()}
                          </Badge>
                          <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)]">
                            {reminder.reminderDays} day{reminder.reminderDays !== 1 ? 's' : ''} before
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] font-medium">
                        {format(parseISO(reminder.scheduledDate), 'MMM d')}
                      </p>
                      <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {emailConfig && sentReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Recent Sent Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentReminders.map(reminder => (
                <div 
                  key={reminder.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-success/5"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="rounded-full bg-success/10 p-2 flex-shrink-0">
                      <CheckCircle size={16} weight="fill" className="text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-1">
                        {reminder.appointmentTitle}
                      </p>
                      <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)]">
                        Sent {reminder.sentAt ? format(parseISO(reminder.sentAt), 'MMM d, yyyy') : 'recently'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 text-success flex-shrink-0">
                    Delivered
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
              {emailConfig ? 'Update Email Address' : 'Setup Email Reminders'}
            </DialogTitle>
            <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
              Enter your email to receive appointment reminders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[clamp(0.75rem,2.4vw,0.85rem)]">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">
                Automatic Reminders
              </p>
              <ul className="space-y-1 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" className="text-primary" />
                  30 days before appointment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" className="text-primary" />
                  14 days before appointment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" className="text-primary" />
                  7 days before appointment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" className="text-primary" />
                  3 days before appointment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={12} weight="fill" className="text-primary" />
                  1 day before appointment
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                <strong className="text-foreground">Note:</strong> Email reminders work with all TLC and DMV appointments you've added to the app. A verification email will be sent to confirm your address.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetupEmail} className="gap-2">
              <CheckCircle size={16} weight="bold" />
              {emailConfig ? 'Update Email' : 'Enable Reminders'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

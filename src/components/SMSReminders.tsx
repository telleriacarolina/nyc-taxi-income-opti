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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Phone,
  Bell,
  CheckCircle,
  Plus,
  Trash,
  PencilSimple,
  CalendarBlank,
  WarningCircle,
  ChatCircleDots,
  BellRinging,
  DownloadSimple,
  FileText
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format, parseISO, differenceInDays } from 'date-fns'

interface SMSReminderConfig {
  id: string
  phoneNumber: string
  enabled: boolean
  createdAt: string
  verified: boolean
  countryCode: string
}

interface ScheduledSMSReminder {
  id: string
  appointmentId: string
  appointmentType: 'tlc' | 'dmv'
  appointmentTitle: string
  appointmentDate: string
  phoneNumber: string
  reminderDays: number
  scheduledDate: string
  sent: boolean
  sentAt?: string
  message: string
}

export function SMSReminders() {
  const [smsConfig, setSmsConfig] = useKV<SMSReminderConfig | null>('sms-reminder-config', null)
  const [scheduledReminders, setScheduledReminders] = useKV<ScheduledSMSReminder[]>('scheduled-sms-reminders', [])
  const [tlcAppointments] = useKV<any[]>('tlc-appointments', [])
  const [dmvAppointments] = useKV<any[]>('dmv-appointments', [])
  
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [editingConfig, setEditingConfig] = useState(false)
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    countryCode: '+1'
  })

  const [scheduleFormData, setScheduleFormData] = useState({
    appointmentId: '',
    appointmentType: 'tlc' as 'tlc' | 'dmv',
    reminderDays: 1,
    customMessage: ''
  })

  useEffect(() => {
    if (!smsConfig?.enabled) return
    
    const interval = setInterval(() => {
      checkAndSimulateSend()
    }, 60000)

    return () => clearInterval(interval)
  }, [smsConfig, scheduledReminders])

  const checkAndSimulateSend = () => {
    if (!smsConfig?.enabled) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    setScheduledReminders((current) => {
      if (!current) return []
      let updated = false
      const newReminders = current.map(reminder => {
        if (reminder.sent) return reminder

        const scheduledDate = new Date(reminder.scheduledDate)
        scheduledDate.setHours(0, 0, 0, 0)

        if (scheduledDate <= today) {
          updated = true
          toast.success(`SMS Reminder Sent!`, {
            description: `Text message sent to ${reminder.phoneNumber.slice(-4)}`
          })
          
          return {
            ...reminder,
            sent: true,
            sentAt: new Date().toISOString()
          }
        }

        return reminder
      })

      return updated ? newReminders : current
    })
  }

  const handleSaveConfig = () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    const config: SMSReminderConfig = {
      id: smsConfig?.id || `sms-config-${Date.now()}`,
      phoneNumber: formData.phoneNumber,
      countryCode: formData.countryCode,
      enabled: true,
      verified: false,
      createdAt: smsConfig?.createdAt || new Date().toISOString()
    }

    setSmsConfig(config)
    setShowConfigDialog(false)
    setEditingConfig(false)
    toast.success('SMS reminder configuration saved', {
      description: 'You can now schedule SMS reminders for your appointments'
    })
  }

  const handleToggleEnabled = () => {
    if (!smsConfig) return
    
    setSmsConfig({
      ...smsConfig,
      enabled: !smsConfig.enabled
    })
    
    toast.success(smsConfig.enabled ? 'SMS reminders disabled' : 'SMS reminders enabled')
  }

  const handleVerifyPhone = () => {
    if (!smsConfig) return
    
    toast.success('Verification code sent!', {
      description: `Check your phone at ${smsConfig.phoneNumber.slice(-4)}`
    })
    
    setTimeout(() => {
      setSmsConfig({
        ...smsConfig,
        verified: true
      })
      toast.success('Phone number verified!')
    }, 2000)
  }

  const handleScheduleReminder = () => {
    if (!smsConfig) {
      toast.error('Please configure SMS settings first')
      return
    }

    if (!scheduleFormData.appointmentId) {
      toast.error('Please select an appointment')
      return
    }

    const allAppointments = [
      ...(tlcAppointments || []).map(a => ({ ...a, type: 'tlc' as const })),
      ...(dmvAppointments || []).map(a => ({ ...a, type: 'dmv' as const }))
    ]

    const appointment = allAppointments.find(a => a.id === scheduleFormData.appointmentId)
    if (!appointment) return

    const appointmentDate = new Date(appointment.date)
    const scheduledDate = new Date(appointmentDate)
    scheduledDate.setDate(scheduledDate.getDate() - scheduleFormData.reminderDays)

    const message = scheduleFormData.customMessage || 
      `Reminder: ${appointment.title} scheduled for ${format(appointmentDate, 'MMM d, yyyy')} at ${appointment.time || 'TBD'}. ${appointment.location ? `Location: ${appointment.location}` : ''}`

    const newReminder: ScheduledSMSReminder = {
      id: `sms-reminder-${Date.now()}`,
      appointmentId: appointment.id,
      appointmentType: scheduleFormData.appointmentType,
      appointmentTitle: appointment.title,
      appointmentDate: appointment.date,
      phoneNumber: smsConfig.phoneNumber,
      reminderDays: scheduleFormData.reminderDays,
      scheduledDate: scheduledDate.toISOString(),
      sent: false,
      message
    }

    setScheduledReminders((current) => [...(current || []), newReminder])
    setShowScheduleDialog(false)
    setScheduleFormData({
      appointmentId: '',
      appointmentType: 'tlc',
      reminderDays: 1,
      customMessage: ''
    })

    toast.success('SMS reminder scheduled', {
      description: `Will send ${scheduleFormData.reminderDays} day${scheduleFormData.reminderDays > 1 ? 's' : ''} before appointment`
    })
  }

  const handleDeleteReminder = (id: string) => {
    setScheduledReminders((current) => (current || []).filter(r => r.id !== id))
    toast.success('SMS reminder deleted')
  }

  const handleDeleteConfig = () => {
    setSmsConfig(null)
    setScheduledReminders([])
    toast.success('SMS configuration deleted')
  }

  const openEditConfig = () => {
    if (smsConfig) {
      setFormData({
        phoneNumber: smsConfig.phoneNumber,
        countryCode: smsConfig.countryCode
      })
      setEditingConfig(true)
      setShowConfigDialog(true)
    }
  }

  const allAppointments = [
    ...(tlcAppointments || []).map(a => ({ ...a, type: 'tlc' as const })),
    ...(dmvAppointments || []).map(a => ({ ...a, type: 'dmv' as const }))
  ].filter(a => {
    const appointmentDate = new Date(a.date)
    return appointmentDate >= new Date()
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingReminders = (scheduledReminders || []).filter(r => !r.sent).sort((a, b) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  )

  const sentReminders = (scheduledReminders || []).filter(r => r.sent).sort((a, b) => 
    new Date(b.sentAt || b.scheduledDate).getTime() - new Date(a.sentAt || a.scheduledDate).getTime()
  )

  const handleExportHistory = () => {
    if (sentReminders.length === 0) {
      toast.error('No SMS history to export')
      return
    }

    const csvHeaders = [
      'Date Sent',
      'Appointment Type',
      'Appointment Title',
      'Appointment Date',
      'Phone Number',
      'Reminder Days Before',
      'Message'
    ]

    const csvRows = sentReminders.map(reminder => [
      reminder.sentAt ? format(parseISO(reminder.sentAt), 'yyyy-MM-dd HH:mm:ss') : format(parseISO(reminder.scheduledDate), 'yyyy-MM-dd'),
      reminder.appointmentType.toUpperCase(),
      reminder.appointmentTitle,
      format(parseISO(reminder.appointmentDate), 'yyyy-MM-dd'),
      reminder.phoneNumber,
      reminder.reminderDays.toString(),
      `"${reminder.message.replace(/"/g, '""')}"`
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `sms-reminder-history-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('SMS history exported', {
      description: `${sentReminders.length} reminder${sentReminders.length !== 1 ? 's' : ''} exported to CSV`
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Phone size={24} weight="fill" className="text-primary" />
                SMS Text Message Reminders
              </CardTitle>
              <CardDescription>
                Receive text message reminders for upcoming TLC and DMV appointments on your phone
              </CardDescription>
            </div>
            {smsConfig && (
              <Switch
                checked={smsConfig.enabled}
                onCheckedChange={handleToggleEnabled}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!smsConfig ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-muted p-6">
                <ChatCircleDots size={48} weight="fill" className="text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">No SMS configuration set up</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Configure your phone number to receive text message reminders for your TLC and DMV appointments
                </p>
              </div>
              <Button onClick={() => setShowConfigDialog(true)}>
                <Plus size={16} weight="bold" />
                Configure SMS Reminders
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Phone size={16} />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Phone: {smsConfig.countryCode} {smsConfig.phoneNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added {format(parseISO(smsConfig.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={smsConfig.verified ? "default" : "outline"}>
                        {smsConfig.verified ? (
                          <><CheckCircle size={12} weight="fill" /> Verified</>
                        ) : (
                          <><WarningCircle size={12} weight="fill" /> Not Verified</>
                        )}
                      </Badge>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {!smsConfig.verified && (
                        <Button size="sm" onClick={handleVerifyPhone} variant="outline">
                          Verify Phone Number
                        </Button>
                      )}
                      <Button size="sm" onClick={openEditConfig} variant="outline">
                        <PencilSimple size={16} />
                        Edit
                      </Button>
                      <Button size="sm" onClick={handleDeleteConfig} variant="outline">
                        <Trash size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {sentReminders.length > 0 && (
                <Alert className="border-success/20 bg-success/5">
                  <FileText size={16} className="text-success" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium text-success">SMS History Available</p>
                      <p className="text-xs text-muted-foreground">
                        You have {sentReminders.length} sent reminder{sentReminders.length !== 1 ? 's' : ''} in your history. Export them as a CSV file for your records, tax documentation, or compliance tracking.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportHistory}
                        className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)] border-success/30 hover:bg-success/10"
                      >
                        <DownloadSimple size={12} weight="bold" />
                        Export {sentReminders.length} Record{sentReminders.length !== 1 ? 's' : ''} to CSV
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium">Scheduled SMS Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    {upcomingReminders.length} upcoming, {sentReminders.length} sent
                  </p>
                </div>
                <div className="flex gap-2">
                  {sentReminders.length > 0 && (
                    <Button 
                      onClick={handleExportHistory}
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <FileText size={16} weight="fill" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  )}
                  <Button 
                    onClick={() => setShowScheduleDialog(true)}
                    disabled={!smsConfig.enabled || allAppointments.length === 0}
                  >
                    <Plus size={16} weight="bold" />
                    Schedule SMS
                  </Button>
                </div>
              </div>

              {upcomingReminders.length === 0 && sentReminders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <BellRinging size={40} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No SMS reminders scheduled yet</p>
                  {allAppointments.length > 0 && (
                    <Button size="sm" onClick={() => setShowScheduleDialog(true)}>
                      Schedule Your First SMS Reminder
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="p-4 space-y-3">
                    {upcomingReminders.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                        {upcomingReminders.map(reminder => {
                          const daysUntilSend = differenceInDays(
                            new Date(reminder.scheduledDate),
                            new Date()
                          )
                          const appointmentDays = differenceInDays(
                            new Date(reminder.appointmentDate),
                            new Date()
                          )
                          
                          return (
                            <Card key={reminder.id} className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-start gap-2">
                                      <Badge variant="secondary" className="mt-0.5">
                                        {reminder.appointmentType.toUpperCase()}
                                      </Badge>
                                      <div className="flex-1">
                                        <p className="font-medium">{reminder.appointmentTitle}</p>
                                        <p className="text-xs text-muted-foreground">
                                          <CalendarBlank size={12} className="inline mr-1" />
                                          {format(parseISO(reminder.appointmentDate), 'MMM d, yyyy')}
                                          {appointmentDays >= 0 && ` (${appointmentDays} day${appointmentDays !== 1 ? 's' : ''})`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-sm">
                                      <p className="text-muted-foreground">
                                        <Bell size={12} className="inline mr-1" />
                                        SMS will send {daysUntilSend === 0 ? 'today' : daysUntilSend === 1 ? 'tomorrow' : `in ${daysUntilSend} days`}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        "{reminder.message}"
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteReminder(reminder.id)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}

                    {sentReminders.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Sent</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleExportHistory}
                            className="h-7 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                          >
                            <DownloadSimple size={12} weight="bold" />
                            Export History
                          </Button>
                        </div>
                        {sentReminders.map(reminder => (
                          <Card key={reminder.id} className="opacity-60">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-start gap-2">
                                    <Badge variant="outline" className="mt-0.5">
                                      {reminder.appointmentType.toUpperCase()}
                                    </Badge>
                                    <div className="flex-1">
                                      <p className="font-medium">{reminder.appointmentTitle}</p>
                                      <p className="text-xs text-muted-foreground">
                                        <CheckCircle size={12} className="inline mr-1" weight="fill" />
                                        Sent {reminder.sentAt ? format(parseISO(reminder.sentAt), 'MMM d, yyyy') : 'recently'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteReminder(reminder.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit SMS Configuration' : 'Configure SMS Reminders'}
            </DialogTitle>
            <DialogDescription>
              Enter your phone number to receive text message reminders for appointments
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                placeholder="+1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="5551234567"
              />
              <p className="text-xs text-muted-foreground">
                Enter your 10-digit phone number without spaces or dashes
              </p>
            </div>
            
            <Alert>
              <WarningCircle size={16} />
              <AlertDescription className="text-xs">
                SMS reminders are simulated in this demo. In production, actual text messages would be sent via a service like Twilio.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowConfigDialog(false)
              setEditingConfig(false)
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule SMS Reminder</DialogTitle>
            <DialogDescription>
              Choose an appointment and when to receive the reminder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appointment">Appointment</Label>
              <select
                id="appointment"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={scheduleFormData.appointmentId}
                onChange={(e) => {
                  const appointment = allAppointments.find(a => a.id === e.target.value)
                  setScheduleFormData({
                    ...scheduleFormData,
                    appointmentId: e.target.value,
                    appointmentType: appointment?.type || 'tlc'
                  })
                }}
              >
                <option value="">Select an appointment</option>
                {allAppointments.map(appointment => (
                  <option key={appointment.id} value={appointment.id}>
                    [{appointment.type.toUpperCase()}] {appointment.title} - {format(parseISO(appointment.date), 'MMM d, yyyy')}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDays">Reminder Timing</Label>
              <select
                id="reminderDays"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={scheduleFormData.reminderDays}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, reminderDays: parseInt(e.target.value) })}
              >
                <option value="1">1 day before</option>
                <option value="2">2 days before</option>
                <option value="3">3 days before</option>
                <option value="7">1 week before</option>
                <option value="14">2 weeks before</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                value={scheduleFormData.customMessage}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, customMessage: e.target.value })}
                placeholder="Leave blank for default message"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Default: Appointment name, date, time, and location
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReminder}>
              Schedule SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

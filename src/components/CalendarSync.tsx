import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarBlank,
  GoogleLogo,
  AppleLogo,
  DownloadSimple,
  ShareNetwork,
  CheckCircle,
  Info,
  Link as LinkIcon,
  Copy,
  ArrowSquareOut
} from '@phosphor-icons/react'
import { toast } from 'sonner'

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

interface TLCReminder {
  id: string
  type: 'license-expiration' | 'vehicle-expiration' | 'drug-test' | 'appointment' | 'custom'
  title: string
  targetDate: string
  reminderIntervals: number[]
  enabled: boolean
  notificationMethods: ('inApp' | 'sms' | 'push')[]
  createdAt: string
}

const generateICalEvent = (appointment: TLCAppointment): string => {
  const formatICalDate = (date: string, time?: string): string => {
    const dateObj = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':')
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    } else {
      dateObj.setHours(9, 0, 0, 0)
    }
    return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const startDateTime = formatICalDate(appointment.date, appointment.time)
  const endDate = new Date(appointment.date)
  if (appointment.time) {
    const [hours, minutes] = appointment.time.split(':')
    endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0, 0)
  } else {
    endDate.setHours(10, 0, 0, 0)
  }
  const endDateTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  let description = `TLC Driver Hub - ${appointment.title}`
  if (appointment.confirmationNumber) {
    description += `\\n\\nConfirmation Number: ${appointment.confirmationNumber}`
  }
  if (appointment.notes) {
    description += `\\n\\n${escapeText(appointment.notes)}`
  }
  if (appointment.resourceUrl) {
    description += `\\n\\nResource: ${appointment.resourceUrl}`
  }
  if (appointment.isRecurring) {
    description += `\\n\\nRecurring: ${appointment.recurringInterval}`
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TLC Driver Hub//Calendar Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@tlcdriverhub.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:${escapeText(appointment.title)}`,
    `DESCRIPTION:${description}`,
    appointment.location ? `LOCATION:${escapeText(appointment.location)}` : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: ${escapeText(appointment.title)}',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Starting soon: ${escapeText(appointment.title)}',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line !== '').join('\r\n')

  return icsContent
}

const generateBulkICalEvents = (appointments: TLCAppointment[]): string => {
  const formatICalDate = (date: string, time?: string): string => {
    const dateObj = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':')
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    } else {
      dateObj.setHours(9, 0, 0, 0)
    }
    return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const events = appointments.map(appointment => {
    const startDateTime = formatICalDate(appointment.date, appointment.time)
    const endDate = new Date(appointment.date)
    if (appointment.time) {
      const [hours, minutes] = appointment.time.split(':')
      endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0, 0)
    } else {
      endDate.setHours(10, 0, 0, 0)
    }
    const endDateTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    let description = `TLC Driver Hub - ${appointment.title}`
    if (appointment.confirmationNumber) {
      description += `\\n\\nConfirmation: ${appointment.confirmationNumber}`
    }
    if (appointment.notes) {
      description += `\\n\\n${escapeText(appointment.notes)}`
    }
    if (appointment.resourceUrl) {
      description += `\\n\\nResource: ${appointment.resourceUrl}`
    }

    return [
      'BEGIN:VEVENT',
      `UID:${appointment.id}@tlcdriverhub.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${escapeText(appointment.title)}`,
      `DESCRIPTION:${description}`,
      appointment.location ? `LOCATION:${escapeText(appointment.location)}` : '',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${escapeText(appointment.title)}`,
      'END:VALARM',
      'END:VEVENT'
    ].filter(line => line !== '').join('\r\n')
  }).join('\r\n')

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TLC Driver Hub//Calendar Sync//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR'
  ].join('\r\n')

  return icsContent
}

const generateGoogleCalendarUrl = (appointment: TLCAppointment): string => {
  const formatGoogleDate = (date: string, time?: string): string => {
    const dateObj = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':')
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    } else {
      dateObj.setHours(9, 0, 0, 0)
    }
    return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const startDateTime = formatGoogleDate(appointment.date, appointment.time)
  const endDate = new Date(appointment.date)
  if (appointment.time) {
    const [hours, minutes] = appointment.time.split(':')
    endDate.setHours(parseInt(hours) + 1, parseInt(minutes), 0, 0)
  } else {
    endDate.setHours(10, 0, 0, 0)
  }
  const endDateTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  let details = `TLC Driver Hub - ${appointment.title}`
  if (appointment.confirmationNumber) {
    details += `\n\nConfirmation Number: ${appointment.confirmationNumber}`
  }
  if (appointment.notes) {
    details += `\n\n${appointment.notes}`
  }
  if (appointment.resourceUrl) {
    details += `\n\nResource: ${appointment.resourceUrl}`
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointment.title,
    dates: `${startDateTime}/${endDateTime}`,
    details: details,
    location: appointment.location || '',
    trp: 'true'
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function CalendarSync() {
  const [appointments] = useKV<TLCAppointment[]>('tlc-appointments', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<TLCAppointment | null>(null)
  const [webcalUrl, setWebcalUrl] = useState<string>('')

  const upcomingAppointments = (appointments || [])
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const downloadSingleEvent = (appointment: TLCAppointment) => {
    const icsContent = generateICalEvent(appointment)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tlc-${appointment.title.toLowerCase().replace(/\s+/g, '-')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Event file downloaded - open to add to your calendar')
  }

  const downloadAllEvents = () => {
    if (upcomingAppointments.length === 0) {
      toast.error('No upcoming appointments to export')
      return
    }

    const icsContent = generateBulkICalEvents(upcomingAppointments)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tlc-all-appointments-${new Date().toISOString().split('T')[0]}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`${upcomingAppointments.length} events exported`)
  }

  const openGoogleCalendar = (appointment: TLCAppointment) => {
    const url = generateGoogleCalendarUrl(appointment)
    window.open(url, '_blank')
    toast.success('Opening Google Calendar...')
  }

  const generateWebcalSubscription = () => {
    const icsContent = generateBulkICalEvents(upcomingAppointments)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const webcalLink = url.replace('blob:', 'webcal://')
    setWebcalUrl(url)
    return url
  }

  const copyWebcalUrl = () => {
    if (webcalUrl) {
      navigator.clipboard.writeText(webcalUrl)
      toast.success('Calendar URL copied to clipboard')
    }
  }

  const handleOpenDialog = (appointment?: TLCAppointment) => {
    if (appointment) {
      setSelectedAppointment(appointment)
    } else {
      setSelectedAppointment(null)
    }
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
                Calendar Sync
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                Sync TLC appointments with Google Calendar, Apple Calendar, and other calendar apps
              </CardDescription>
            </div>
            <Button 
              onClick={downloadAllEvents} 
              disabled={upcomingAppointments.length === 0}
              className="gap-2 flex-shrink-0"
            >
              <DownloadSimple size={18} weight="bold" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info size={18} weight="fill" className="text-primary" />
            <AlertDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)] leading-snug">
              Sync your TLC appointments to any calendar app. Choose instant add for one-time events or export files for offline access.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-3">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <GoogleLogo size={24} weight="bold" className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)]">
                    Google Calendar
                  </h3>
                  <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-2 leading-snug">
                    Add events directly to your Google account
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-muted bg-gradient-to-br from-muted/30 to-transparent">
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                  <AppleLogo size={24} weight="bold" className="text-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)]">
                    Apple Calendar
                  </h3>
                  <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-2 leading-snug">
                    Download .ics files for iPhone, iPad, Mac
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <CalendarBlank size={18} weight="fill" />
              Upcoming Appointments ({upcomingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map(appointment => (
                <Card key={appointment.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1 mb-1">
                            {appointment.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)]">
                            <CalendarBlank size={14} weight="fill" className="flex-shrink-0" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              {appointment.time && ` at ${appointment.time}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openGoogleCalendar(appointment)}
                          className="h-8 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                        >
                          <GoogleLogo size={14} weight="bold" />
                          Google
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSingleEvent(appointment)}
                          className="h-8 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                        >
                          <AppleLogo size={14} weight="bold" />
                          Apple/iCal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSingleEvent(appointment)}
                          className="h-8 gap-1.5 text-[clamp(0.65rem,2vw,0.75rem)]"
                        >
                          <DownloadSimple size={14} weight="bold" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                Add TLC appointments to sync them with your calendar
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <Info size={18} weight="fill" className="text-primary" />
            Sync Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="google" className="gap-2">
                <GoogleLogo size={16} weight="bold" />
                Google
              </TabsTrigger>
              <TabsTrigger value="apple" className="gap-2">
                <AppleLogo size={16} weight="bold" />
                Apple
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="space-y-3 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)]">
                  Method 1: Quick Add (Recommended)
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                  <li>Click the "Google" button next to any appointment</li>
                  <li>Sign in to your Google account if needed</li>
                  <li>Review the event details and click "Save"</li>
                  <li>Event is instantly added to your calendar</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)]">
                  Method 2: Import .ics File
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                  <li>Click "Export All" or "Download" for individual events</li>
                  <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">calendar.google.com</a></li>
                  <li>Click the gear icon → Settings → Import & export</li>
                  <li>Select the downloaded .ics file and import</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="apple" className="space-y-3 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)]">
                  iPhone / iPad
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                  <li>Tap "Apple/iCal" button to download .ics file</li>
                  <li>Open the downloaded file from your Files app or email</li>
                  <li>Tap "Add to Calendar" when prompted</li>
                  <li>Choose which calendar to add it to</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-[clamp(0.8rem,2.5vw,0.9rem)]">
                  Mac
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
                  <li>Click "Apple/iCal" button to download .ics file</li>
                  <li>Double-click the downloaded .ics file</li>
                  <li>Calendar app will open automatically</li>
                  <li>Click "Add" to import the event</li>
                </ol>
              </div>
              
              <Alert>
                <CheckCircle size={16} weight="fill" className="text-success" />
                <AlertDescription className="text-[clamp(0.7rem,2.2vw,0.8rem)] leading-snug">
                  <strong>Tip:</strong> Events sync across all your Apple devices via iCloud
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-muted bg-muted/30">
        <CardHeader>
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <ShareNetwork size={18} weight="fill" />
            Other Calendar Apps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground leading-snug">
            The downloaded .ics files work with most calendar applications:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)]">
            <div className="flex items-center gap-2 p-2 rounded border bg-card">
              <CheckCircle size={14} weight="fill" className="text-success flex-shrink-0" />
              <span>Outlook</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded border bg-card">
              <CheckCircle size={14} weight="fill" className="text-success flex-shrink-0" />
              <span>Yahoo Calendar</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded border bg-card">
              <CheckCircle size={14} weight="fill" className="text-success flex-shrink-0" />
              <span>Thunderbird</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded border bg-card">
              <CheckCircle size={14} weight="fill" className="text-success flex-shrink-0" />
              <span>Any .ics app</span>
            </div>
          </div>
          <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground leading-snug">
            Simply download the .ics file and open it with your preferred calendar application.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

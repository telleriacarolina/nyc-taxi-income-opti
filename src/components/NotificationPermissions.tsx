import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Bell, DeviceMobile, EnvelopeSimple, Check, Warning, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported'

interface NotificationSettings {
  pushEnabled: boolean
  smsEnabled: boolean
  emailEnabled: boolean
  phoneNumber: string
  email: string
  reminderIntervals: {
    days30: boolean
    days14: boolean
    days7: boolean
    days1: boolean
  }
  notificationTypes: {
    licenseExpiration: boolean
    appointmentReminders: boolean
    vehicleRegistration: boolean
    complianceDeadlines: boolean
    earningsAlerts: boolean
    trafficAlerts: boolean
  }
}

export function NotificationPermissions() {
  const [settings, setSettings] = useKV<NotificationSettings>('notification-settings', {
    pushEnabled: false,
    smsEnabled: false,
    emailEnabled: false,
    phoneNumber: '',
    email: '',
    reminderIntervals: {
      days30: true,
      days14: true,
      days7: true,
      days1: true,
    },
    notificationTypes: {
      licenseExpiration: true,
      appointmentReminders: true,
      vehicleRegistration: true,
      complianceDeadlines: true,
      earningsAlerts: false,
      trafficAlerts: false,
    },
  })

  const [pushPermission, setPushPermission] = useState<NotificationPermissionStatus>('default')
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission as NotificationPermissionStatus)
    } else {
      setPushPermission('unsupported')
    }
  }, [])

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications are not supported in this browser')
      return
    }

    if (Notification.permission === 'granted') {
      setSettings((current) => ({ ...current, pushEnabled: true }))
      toast.success('Push notifications are already enabled')
      return
    }

    setIsRequestingPermission(true)
    try {
      const permission = await Notification.requestPermission()
      setPushPermission(permission as NotificationPermissionStatus)

      if (permission === 'granted') {
        setSettings((current) => ({ ...current, pushEnabled: true }))
        toast.success('Push notifications enabled successfully')
        
        new Notification('NYC TLC Driver Hub', {
          body: 'You will now receive important reminders and alerts',
          icon: '/icon-192.png',
        })
      } else {
        setSettings((current) => ({ ...current, pushEnabled: false }))
        toast.error('Push notification permission denied')
      }
    } catch (error) {
      toast.error('Failed to request notification permission')
    } finally {
      setIsRequestingPermission(false)
    }
  }

  const disablePushNotifications = () => {
    setSettings((current) => ({ ...current, pushEnabled: false }))
    toast.info('Push notifications disabled. You can re-enable them in browser settings.')
  }

  const testNotification = () => {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported')
      return
    }

    if (Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from TLC Driver Hub',
        icon: '/icon-192.png',
        tag: 'test-notification',
      })
      toast.success('Test notification sent')
    } else {
      toast.error('Please enable push notifications first')
    }
  }

  const updatePhoneNumber = (phone: string) => {
    setSettings((current) => ({ ...current, phoneNumber: phone }))
  }

  const updateEmail = (email: string) => {
    setSettings((current) => ({ ...current, email }))
  }

  const toggleSMS = (enabled: boolean) => {
    if (enabled && !settings.phoneNumber) {
      toast.error('Please enter a phone number first')
      return
    }
    setSettings((current) => ({ ...current, smsEnabled: enabled }))
    toast.success(enabled ? 'SMS reminders enabled' : 'SMS reminders disabled')
  }

  const toggleEmail = (enabled: boolean) => {
    if (enabled && !settings.email) {
      toast.error('Please enter an email address first')
      return
    }
    setSettings((current) => ({ ...current, emailEnabled: enabled }))
    toast.success(enabled ? 'Email reminders enabled' : 'Email reminders disabled')
  }

  const toggleReminderInterval = (interval: keyof NotificationSettings['reminderIntervals'], enabled: boolean) => {
    setSettings((current) => ({
      ...current,
      reminderIntervals: {
        ...current.reminderIntervals,
        [interval]: enabled,
      },
    }))
  }

  const toggleNotificationType = (type: keyof NotificationSettings['notificationTypes'], enabled: boolean) => {
    setSettings((current) => ({
      ...current,
      notificationTypes: {
        ...current.notificationTypes,
        [type]: enabled,
      },
    }))
  }

  const getPermissionStatusIcon = () => {
    switch (pushPermission) {
      case 'granted':
        return <Check className="text-success" size={20} weight="bold" />
      case 'denied':
        return <X className="text-destructive" size={20} weight="bold" />
      case 'unsupported':
        return <Warning className="text-warning" size={20} weight="bold" />
      default:
        return <Warning className="text-muted-foreground" size={20} weight="bold" />
    }
  }

  const getPermissionStatusText = () => {
    switch (pushPermission) {
      case 'granted':
        return 'Enabled'
      case 'denied':
        return 'Blocked'
      case 'unsupported':
        return 'Not Supported'
      default:
        return 'Not Enabled'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={24} weight="fill" className="text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Set up notifications to never miss TLC/DMV deadlines, appointments, or earning opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3 flex-1">
                <Bell size={24} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-base">Push Notifications</Label>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getPermissionStatusIcon()}
                      <span>{getPermissionStatusText()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive instant alerts on your device for urgent reminders
                  </p>
                  {pushPermission === 'denied' && (
                    <Alert className="mt-2">
                      <Warning className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Push notifications are blocked. Enable them in your browser settings to receive alerts.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {pushPermission === 'granted' ? (
                  <>
                    <Switch
                      checked={settings.pushEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((current) => ({ ...current, pushEnabled: checked }))
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={testNotification}
                      className="text-xs"
                    >
                      Test
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={requestPushPermission}
                    disabled={isRequestingPermission || pushPermission === 'denied'}
                  >
                    {isRequestingPermission ? 'Requesting...' : 'Enable'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3 flex-1">
                <DeviceMobile size={24} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <Label className="font-semibold text-base">SMS Text Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Get text reminders for appointments and deadlines
                  </p>
                  <div className="space-y-2">
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={settings.phoneNumber}
                      onChange={(e) => updatePhoneNumber(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.smsEnabled}
                onCheckedChange={toggleSMS}
                disabled={!settings.phoneNumber}
              />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3 flex-1">
                <EnvelopeSimple size={24} weight="fill" className="text-chart-2 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <Label className="font-semibold text-base">Email Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed email notifications with calendar attachments
                  </p>
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="driver@example.com"
                      value={settings.email}
                      onChange={(e) => updateEmail(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.emailEnabled}
                onCheckedChange={toggleEmail}
                disabled={!settings.email}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reminder Timing</CardTitle>
          <CardDescription>
            Choose when to receive reminders before appointments and deadlines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="days-30" className="cursor-pointer">30 days before</Label>
            <Switch
              id="days-30"
              checked={settings.reminderIntervals.days30}
              onCheckedChange={(checked) => toggleReminderInterval('days30', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="days-14" className="cursor-pointer">14 days before</Label>
            <Switch
              id="days-14"
              checked={settings.reminderIntervals.days14}
              onCheckedChange={(checked) => toggleReminderInterval('days14', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="days-7" className="cursor-pointer">7 days before</Label>
            <Switch
              id="days-7"
              checked={settings.reminderIntervals.days7}
              onCheckedChange={(checked) => toggleReminderInterval('days7', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="days-1" className="cursor-pointer">1 day before</Label>
            <Switch
              id="days-1"
              checked={settings.reminderIntervals.days1}
              onCheckedChange={(checked) => toggleReminderInterval('days1', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Types</CardTitle>
          <CardDescription>
            Select which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="license-exp" className="cursor-pointer">TLC License Expiration</Label>
            <Switch
              id="license-exp"
              checked={settings.notificationTypes.licenseExpiration}
              onCheckedChange={(checked) => toggleNotificationType('licenseExpiration', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="appointments" className="cursor-pointer">Appointment Reminders</Label>
            <Switch
              id="appointments"
              checked={settings.notificationTypes.appointmentReminders}
              onCheckedChange={(checked) => toggleNotificationType('appointmentReminders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="vehicle-reg" className="cursor-pointer">Vehicle Registration</Label>
            <Switch
              id="vehicle-reg"
              checked={settings.notificationTypes.vehicleRegistration}
              onCheckedChange={(checked) => toggleNotificationType('vehicleRegistration', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compliance" className="cursor-pointer">Compliance Deadlines</Label>
            <Switch
              id="compliance"
              checked={settings.notificationTypes.complianceDeadlines}
              onCheckedChange={(checked) => toggleNotificationType('complianceDeadlines', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="earnings" className="cursor-pointer">Earnings Alerts</Label>
            <Switch
              id="earnings"
              checked={settings.notificationTypes.earningsAlerts}
              onCheckedChange={(checked) => toggleNotificationType('earningsAlerts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="traffic" className="cursor-pointer">Traffic Alerts</Label>
            <Switch
              id="traffic"
              checked={settings.notificationTypes.trafficAlerts}
              onCheckedChange={(checked) => toggleNotificationType('trafficAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Privacy Note:</strong> Your contact information is stored locally on your device only. 
              SMS and email reminders require manual setup through your preferred notification service.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

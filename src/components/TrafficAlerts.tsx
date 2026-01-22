import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, 
  BellSlash,
  Warning, 
  CheckCircle,
  TrafficSign,
  MapPin,
  TrendUp,
  Lightning,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TrafficAlert {
  id: string
  type: 'traffic' | 'hotspot' | 'incident' | 'opportunity'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  location: string
  timestamp: Date
  read: boolean
  actionable: boolean
}

interface NotificationSettings {
  trafficAlerts: boolean
  hotspotNotifications: boolean
  incidentAlerts: boolean
  opportunityAlerts: boolean
  soundEnabled: boolean
}

const SEVERITY_STYLES = {
  low: 'border-success/40 bg-success/5',
  medium: 'border-warning/40 bg-warning/5',
  high: 'border-destructive/40 bg-destructive/5'
}

const SEVERITY_ICON_COLORS = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-destructive'
}

const TYPE_ICONS = {
  traffic: TrafficSign,
  hotspot: TrendUp,
  incident: Warning,
  opportunity: Lightning
}

export function TrafficAlerts() {
  const [alerts, setAlerts] = useKV<TrafficAlert[]>('traffic-alerts', [])
  const [settings, setSettings] = useKV<NotificationSettings>('alert-settings', {
    trafficAlerts: true,
    hotspotNotifications: true,
    incidentAlerts: true,
    opportunityAlerts: true,
    soundEnabled: false
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const currentSettings = settings ?? {
    trafficAlerts: true,
    hotspotNotifications: true,
    incidentAlerts: true,
    opportunityAlerts: true,
    soundEnabled: false
  }

  const currentAlerts = alerts ?? []
  const unreadCount = currentAlerts.filter(a => !a.read).length

  useEffect(() => {
    if (currentAlerts.length === 0) {
      generateInitialAlerts()
    }

    const interval = setInterval(() => {
      generatePeriodicAlerts()
    }, 120000)

    return () => clearInterval(interval)
  }, [])

  const generateInitialAlerts = async () => {
    const now = new Date()
    const initialAlerts: TrafficAlert[] = [
      {
        id: `alert-${Date.now()}-1`,
        type: 'hotspot',
        severity: 'high',
        title: 'High Demand Zone Active',
        message: 'Midtown Manhattan showing $45+ average fares. 3.2x surge pricing detected.',
        location: 'Midtown Manhattan',
        timestamp: new Date(now.getTime() - 300000),
        read: false,
        actionable: true
      },
      {
        id: `alert-${Date.now()}-2`,
        type: 'traffic',
        severity: 'medium',
        title: 'Heavy Traffic Alert',
        message: 'FDR Drive southbound congested. Average speed 12 mph. Consider alternative routes.',
        location: 'FDR Drive Southbound',
        timestamp: new Date(now.getTime() - 600000),
        read: false,
        actionable: true
      },
      {
        id: `alert-${Date.now()}-3`,
        type: 'opportunity',
        severity: 'high',
        title: 'Airport Run Opportunity',
        message: 'JFK pickups averaging $68 with minimal wait times. High demand period starting.',
        location: 'JFK Airport',
        timestamp: new Date(now.getTime() - 900000),
        read: false,
        actionable: true
      }
    ]

    setAlerts(initialAlerts)
  }

  const generatePeriodicAlerts = async () => {
    if (!currentSettings.trafficAlerts && !currentSettings.hotspotNotifications && 
        !currentSettings.incidentAlerts && !currentSettings.opportunityAlerts) {
      return
    }

    const hour = new Date().getHours()
    const alertTypes: Array<TrafficAlert['type']> = []

    if (currentSettings.trafficAlerts) alertTypes.push('traffic')
    if (currentSettings.hotspotNotifications) alertTypes.push('hotspot')
    if (currentSettings.incidentAlerts) alertTypes.push('incident')
    if (currentSettings.opportunityAlerts) alertTypes.push('opportunity')

    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

    const newAlert = await generateAlert(randomType, hour)
    
    if (newAlert) {
      setAlerts((current) => [newAlert, ...(current ?? [])])
      
      if (!document.hidden) {
        showNotificationToast(newAlert)
      }
    }
  }

  const generateAlert = async (type: TrafficAlert['type'], hour: number): Promise<TrafficAlert | null> => {
    const now = Date.now()
    
    try {
      const alertPrompt = `Generate a realistic NYC TLC driver alert for ${type} type at ${hour}:00. 
Return ONLY a JSON object with these exact fields: 
{
  "title": "string under 50 characters",
  "message": "string under 120 characters, specific and actionable",
  "location": "specific NYC area name",
  "severity": "low or medium or high"
}
Make it relevant to current time ${hour}:00 and realistic NYC driving conditions.`

      const response = await spark.llm(alertPrompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)

      return {
        id: `alert-${now}-${Math.random()}`,
        type,
        severity: data.severity || 'medium',
        title: data.title,
        message: data.message,
        location: data.location,
        timestamp: new Date(),
        read: false,
        actionable: true
      }
    } catch (error) {
      return null
    }
  }

  const showNotificationToast = (alert: TrafficAlert) => {
    const IconComponent = TYPE_ICONS[alert.type]
    const iconColor = SEVERITY_ICON_COLORS[alert.severity]
    
    toast.custom(() => (
      <Card className={`p-4 flex items-start gap-3 min-w-[320px] ${SEVERITY_STYLES[alert.severity]} border-2`}>
        <IconComponent className={`${iconColor} flex-shrink-0`} size={24} weight="fill" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1">{alert.title}</div>
          <div className="text-xs text-muted-foreground">{alert.message}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin size={12} weight="fill" />
            <span className="truncate">{alert.location}</span>
          </div>
        </div>
      </Card>
    ), {
      duration: 6000,
      position: 'top-right'
    })
  }

  const markAsRead = (alertId: string) => {
    setAlerts((current) => 
      (current ?? []).map(a => a.id === alertId ? { ...a, read: true } : a)
    )
  }

  const markAllAsRead = () => {
    setAlerts((current) => 
      (current ?? []).map(a => ({ ...a, read: true }))
    )
    toast.success('All alerts marked as read')
  }

  const deleteAlert = (alertId: string) => {
    setAlerts((current) => 
      (current ?? []).filter(a => a.id !== alertId)
    )
  }

  const clearAllAlerts = () => {
    setAlerts([])
    toast.success('All alerts cleared')
  }

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((current) => ({
      ...(current ?? currentSettings),
      [key]: value
    }))
  }

  const testAlert = async () => {
    setIsGenerating(true)
    try {
      const hour = new Date().getHours()
      const types: Array<TrafficAlert['type']> = ['traffic', 'hotspot', 'incident', 'opportunity']
      const randomType = types[Math.floor(Math.random() * types.length)]
      
      const newAlert = await generateAlert(randomType, hour)
      
      if (newAlert) {
        setAlerts((current) => [newAlert, ...(current ?? [])])
        showNotificationToast(newAlert)
        toast.success('Test alert generated')
      }
    } catch (error) {
      toast.error('Failed to generate test alert')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="text-primary" size={24} weight="fill" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Traffic Alerts & Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Real-time updates on traffic, hotspots, and opportunities
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="px-2 py-1">
            {unreadCount} new
          </Badge>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <TrafficSign className="text-primary" size={20} weight="fill" />
            <div>
              <div className="font-medium text-sm">Traffic Alerts</div>
              <div className="text-xs text-muted-foreground">Congestion and road conditions</div>
            </div>
          </div>
          <Switch
            checked={currentSettings.trafficAlerts}
            onCheckedChange={(checked) => updateSetting('trafficAlerts', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <TrendUp className="text-success" size={20} weight="fill" />
            <div>
              <div className="font-medium text-sm">Hotspot Notifications</div>
              <div className="text-xs text-muted-foreground">High-demand earning zones</div>
            </div>
          </div>
          <Switch
            checked={currentSettings.hotspotNotifications}
            onCheckedChange={(checked) => updateSetting('hotspotNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <Warning className="text-warning" size={20} weight="fill" />
            <div>
              <div className="font-medium text-sm">Incident Alerts</div>
              <div className="text-xs text-muted-foreground">Accidents and road closures</div>
            </div>
          </div>
          <Switch
            checked={currentSettings.incidentAlerts}
            onCheckedChange={(checked) => updateSetting('incidentAlerts', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            <Lightning className="text-accent" size={20} weight="fill" />
            <div>
              <div className="font-medium text-sm">Opportunity Alerts</div>
              <div className="text-xs text-muted-foreground">Surge pricing and premium fares</div>
            </div>
          </div>
          <Switch
            checked={currentSettings.opportunityAlerts}
            onCheckedChange={(checked) => updateSetting('opportunityAlerts', checked)}
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Alerts</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testAlert}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Test Alert'}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          {currentAlerts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllAlerts}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {currentAlerts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
          <CheckCircle className="mx-auto mb-3 text-success" size={48} weight="fill" />
          <h3 className="font-semibold mb-2">No Active Alerts</h3>
          <p className="text-sm text-muted-foreground mb-4">
            All clear! You'll receive notifications about traffic and opportunities.
          </p>
          <Button onClick={testAlert} disabled={isGenerating}>
            <Bell className="mr-2" size={16} weight="fill" />
            Generate Test Alert
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {currentAlerts.map((alert) => {
              const IconComponent = TYPE_ICONS[alert.type]
              const iconColor = SEVERITY_ICON_COLORS[alert.severity]

              return (
                <Card
                  key={alert.id}
                  className={`p-4 border-2 transition-all ${
                    alert.read 
                      ? 'opacity-60 hover:opacity-100 bg-muted/20' 
                      : `${SEVERITY_STYLES[alert.severity]}`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent 
                      className={`${iconColor} flex-shrink-0 mt-0.5`} 
                      size={22} 
                      weight="fill" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 flex-shrink-0"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} weight="fill" />
                            <span className="truncate max-w-[200px]">{alert.location}</span>
                          </div>
                          <span>•</span>
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => markAsRead(alert.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
  )
}

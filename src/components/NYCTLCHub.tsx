import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowSquareOut, 
  Link as LinkIcon, 
  CalendarBlank, 
  Bell, 
  FileText,
  CarProfile,
  IdentificationCard,
  Certificate,
  MapPin,
  Gavel,
  CreditCard,
  Warning,
  CheckCircle,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { TLCResourceDirectory } from '@/components/TLCResourceDirectory'
import { TLCAppointments } from '@/components/TLCAppointments'
import { TLCReminders } from '@/components/TLCReminders'

export function NYCTLCHub() {
  const [activeSection, setActiveSection] = useState<string>('resources')
  const [appointments, ] = useKV<any[]>('tlc-appointments', [])
  const [reminders, ] = useKV<any[]>('tlc-reminders', [])

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.date) >= new Date()
  ).length || 0

  const activeReminders = reminders?.filter(rem => 
    rem.enabled && new Date(rem.targetDate) >= new Date()
  ).length || 0

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] line-clamp-1">
                NYC TLC Official Hub
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.9rem)] line-clamp-2">
                Centralized access to TLC systems, appointments, and compliance tracking
              </CardDescription>
            </div>
            <IdentificationCard size={32} weight="fill" className="text-primary flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-primary">
                {upcomingAppointments}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Upcoming Appts
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-success">
                {activeReminders}
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Active Alerts
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold text-accent">
                8
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Quick Links
              </div>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <div className="text-[clamp(1.25rem,3.5vw,1.75rem)] font-bold">
                24/7
              </div>
              <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground line-clamp-1">
                Support
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-10 rounded-lg border bg-card/70">
          <TabsTrigger value="resources" className="gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)]">
            <LinkIcon size={16} weight="fill" />
            <span className="truncate">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)]">
            <CalendarBlank size={16} weight="fill" />
            <span className="truncate">Appointments</span>
            {upcomingAppointments > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                {upcomingAppointments}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)]">
            <Bell size={16} weight="fill" />
            <span className="truncate">Reminders</span>
            {activeReminders > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 min-w-4 px-1 text-[10px]">
                {activeReminders}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <TLCResourceDirectory />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <TLCAppointments />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <TLCReminders />
        </TabsContent>
      </Tabs>
    </div>
  )
}

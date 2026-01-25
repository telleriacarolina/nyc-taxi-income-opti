import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, Envelope, MapPin, Clock, ArrowSquareOut, Globe, CalendarBlank, ChatCircleDots } from '@phosphor-icons/react'
import { SMSReminders } from '@/components/SMSReminders'
import { EmailReminders } from '@/components/EmailReminders'

export function ContactTLC() {
  const tlcLink = 'https://www.nyc.gov/site/tlc/about/contact-tlc.page'
  const dmvLink = 'https://dmv.ny.gov/contact-us'

  const tlcContactMethods = [
    {
      icon: Phone,
      title: '311',
      description: 'Call NYC 311 for TLC inquiries',
      detail: 'Available 24/7',
    },
    {
      icon: Envelope,
      title: 'Email',
      description: 'licensing@tlc.nyc.gov',
      detail: 'For licensing questions',
    },
    {
      icon: MapPin,
      title: 'Visit',
      description: '33-34 Northern Blvd, Long Island City, NY 11101',
      detail: 'License Center location',
    },
    {
      icon: Clock,
      title: 'Hours',
      description: 'Monday - Friday',
      detail: '9:00 AM - 5:00 PM',
    },
  ]

  const dmvContactMethods = [
    {
      icon: Phone,
      title: 'DMV Phone',
      description: '1-518-486-9786',
      detail: 'Mon-Fri, 8:00 AM - 4:00 PM',
    },
    {
      icon: Phone,
      title: 'DMV Customer Service',
      description: '1-518-402-2100',
      detail: 'General inquiries',
    },
    {
      icon: Globe,
      title: 'Online Services',
      description: 'dmv.ny.gov',
      detail: 'Renewals, replacements, records',
    },
    {
      icon: MapPin,
      title: 'NYC Offices',
      description: 'Multiple locations throughout NYC',
      detail: 'Check website for addresses',
    },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact" className="gap-1.5">
            <Phone size={16} weight="fill" />
            <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Contact Info</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-1.5">
            <ChatCircleDots size={16} weight="fill" />
            <span className="text-[clamp(0.7rem,2vw,0.85rem)]">SMS Reminders</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1.5">
            <Envelope size={16} weight="fill" />
            <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Email Reminders</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[clamp(1rem,3vw,1.25rem)]">Contact NYC TLC</CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.9rem)]">
                Get help with licenses, complaints, and TLC services
              </CardDescription>
            </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => window.open(tlcLink, '_blank')}
            className="w-full h-12 text-[clamp(0.8rem,2.4vw,0.95rem)] gap-2"
          >
            <ArrowSquareOut size={20} weight="bold" />
            Visit Official TLC Contact Page
          </Button>

          <div className="grid gap-3 sm:grid-cols-2">
            {tlcContactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="border-muted">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon size={18} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                          {method.title}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-1 pl-11">
                      <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                        {method.description}
                      </p>
                      <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-1">
                        {method.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] mb-2">
                Common TLC Services
              </h3>
              <ul className="space-y-2 text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-2">TLC Driver License applications and renewals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-2">Vehicle inspections and base registrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-2">Filing complaints and accessing trip data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-2">DMV medical and drug testing information</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[clamp(1rem,3vw,1.25rem)]">Contact NY DMV</CardTitle>
          <CardDescription className="text-[clamp(0.75rem,2.4vw,0.9rem)]">
            Get help with driver licenses, vehicle registration, and DMV services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => window.open(dmvLink, '_blank')}
            className="w-full h-12 text-[clamp(0.8rem,2.4vw,0.95rem)] gap-2"
          >
            <ArrowSquareOut size={20} weight="bold" />
            Visit Official DMV Contact Page
          </Button>

          <div className="grid gap-3 sm:grid-cols-2">
            {dmvContactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="border-muted">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                        <Icon size={18} weight="fill" className="text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                          {method.title}
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-1 pl-11">
                      <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2">
                        {method.description}
                      </p>
                      <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-1">
                        {method.detail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] mb-2">
                Common DMV Services
              </h3>
              <ul className="space-y-2 text-[clamp(0.75rem,2.4vw,0.875rem)]">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">•</span>
                  <span className="line-clamp-2">Driver license renewal, replacement, and status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">•</span>
                  <span className="line-clamp-2">Vehicle registration and title services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">•</span>
                  <span className="line-clamp-2">Real ID and Enhanced ID information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-0.5">•</span>
                  <span className="line-clamp-2">Traffic violations and ticket payments</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarBlank size={20} weight="fill" className="text-primary" />
                <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)]">
                  Schedule DMV Appointments
                </h3>
              </div>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground">
                Book appointments online to save time at DMV offices
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => window.open('https://dmv.ny.gov/offices/make-reservation-dmv-office', '_blank')}
                  className="w-full gap-2 text-[clamp(0.75rem,2.4vw,0.875rem)]"
                  variant="default"
                >
                  <CalendarBlank size={18} weight="bold" />
                  Schedule Office Visit
                  <ArrowSquareOut size={16} />
                </Button>
                <Button
                  onClick={() => window.open('https://dmv.ny.gov/schedule-road-test', '_blank')}
                  className="w-full gap-2 text-[clamp(0.75rem,2.4vw,0.875rem)]"
                  variant="outline"
                >
                  <CalendarBlank size={18} weight="bold" />
                  Schedule Road Test
                  <ArrowSquareOut size={16} />
                </Button>
                <Button
                  onClick={() => window.open('https://dmv.ny.gov/offices', '_blank')}
                  className="w-full gap-2 text-[clamp(0.75rem,2.4vw,0.875rem)]"
                  variant="outline"
                >
                  <MapPin size={18} weight="bold" />
                  Find DMV Offices
                  <ArrowSquareOut size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <SMSReminders />
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <EmailReminders />
        </TabsContent>
      </Tabs>
    </div>
  )
}

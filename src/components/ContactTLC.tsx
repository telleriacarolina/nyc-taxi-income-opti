import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Envelope, MapPin, Clock, ArrowSquareOut } from '@phosphor-icons/react'

export function ContactTLC() {
  const officialLink = 'https://www.nyc.gov/site/tlc/about/contact-tlc.page'

  const contactMethods = [
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-[clamp(1rem,3vw,1.25rem)]">Contact NYC TLC</CardTitle>
          <CardDescription className="text-[clamp(0.75rem,2.4vw,0.9rem)]">
            Get help with licenses, complaints, and TLC services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => window.open(officialLink, '_blank')}
            className="w-full h-12 text-[clamp(0.8rem,2.4vw,0.95rem)] gap-2"
          >
            <ArrowSquareOut size={20} weight="bold" />
            Visit Official TLC Contact Page
          </Button>

          <div className="grid gap-3 sm:grid-cols-2">
            {contactMethods.map((method, index) => {
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
                Common Services
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
    </div>
  )
}

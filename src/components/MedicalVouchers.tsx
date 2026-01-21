import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FirstAidKit,
  Wheelchair,
  Ambulance,
  Buildings,
  CurrencyDollar,
  Clock,
  Phone,
  CheckCircle,
  Info,
  MapPin,
  Star
} from '@phosphor-icons/react'

interface VoucherProvider {
  id: string
  name: string
  type: 'medical' | 'ambulette' | 'paratransit'
  color: string
  bgColor: string
  icon: string
  description: string
  paymentStructure: string
  features: string[]
  requirements: string[]
  bestFor: string
  contactInfo?: string
  coverage?: string
}

const MEDICAL_PROVIDERS: VoucherProvider[] = [
  {
    id: 'mtm',
    name: 'MTM (ModivCare)',
    type: 'medical',
    color: '#0066CC',
    bgColor: '#E6F0FF',
    icon: '🏥',
    description: 'Leading non-emergency medical transportation provider for Medicaid patients',
    paymentStructure: '$25-$45 per trip',
    features: [
      'Guaranteed payment within 14 days',
      'GPS tracking and route optimization',
      ' 24/7 dispatch support',
      'Scheduled and on-demand rides'
    ],
    requirements: [
      'TLC license and base affiliation',
      'Clean driving record',
      'CPR certification recommended',
      'Background check'
    ],
    bestFor: 'Reliable scheduled income, medical transport focus',
    contactInfo: '1-866-527-9933',
    coverage: 'All 5 boroughs + suburbs'
  },
  {
    id: 'logisticare',
    name: 'LogistiCare',
    type: 'medical',
    color: '#00A651',
    bgColor: '#E6F7ED',
    icon: '🚑',
    description: 'NEMT broker serving NYC Health + Hospitals and major insurance providers',
    paymentStructure: '$28-$50 per trip',
    features: [
      'High trip volume',
      'Automated dispatching',
      'Direct deposit payments',
      'Mileage reimbursement'
    ],
    requirements: [
      'TLC-licensed vehicle',
      'Minimum liability insurance',
      'CPR/First Aid certification',
      'Vehicle inspection records'
    ],
    bestFor: 'High volume drivers, hospital trips',
    contactInfo: '1-844-666-6270',
    coverage: 'NYC metro area'
  },
  {
    id: 'access2care',
    name: 'Access2Care',
    type: 'medical',
    color: '#FF6B35',
    bgColor: '#FFF0EB',
    icon: '🏥',
    description: 'Growing NEMT provider with focus on senior and disabled patient transport',
    paymentStructure: '$30-$55 per trip',
    features: [
      'Wheelchair accessible trips bonus',
      'Long-distance trip options',
      'Bi-weekly guaranteed payment',
      'Flexible scheduling'
    ],
    requirements: [
      'TLC license required',
      'Wheelchair accessible vehicle (for WAV trips)',
      'Sensitivity training provided',
      'Clean DMV record'
    ],
    bestFor: 'Drivers with accessible vehicles, patient care focus',
    contactInfo: '1-877-561-1816',
    coverage: 'NYC and Long Island'
  },
  {
    id: 'ambulette',
    name: 'NYC Ambulette Services',
    type: 'ambulette',
    color: '#8B5CF6',
    bgColor: '#F3EFFF',
    icon: '♿',
    description: 'Specialized wheelchair-accessible vehicle service for medical appointments',
    paymentStructure: '$45-$75 per trip',
    features: [
      'Premium rates for WAV vehicles',
      'Scheduled medical appointments',
      'Hospital discharge transportation',
      'Dialysis center contracts'
    ],
    requirements: [
      'TLC-licensed WAV vehicle',
      'Wheelchair lift/ramp certification',
      'Patient handling training',
      'Commercial insurance'
    ],
    bestFor: 'WAV vehicle owners, premium medical transport',
    coverage: 'Citywide + regional hospitals'
  },
  {
    id: 'accessaride',
    name: 'Access-A-Ride',
    type: 'paratransit',
    color: '#003DA5',
    bgColor: '#E6EFFF',
    icon: '🚐',
    description: 'MTA paratransit service for customers unable to use public transportation',
    paymentStructure: '$35-$60 per trip',
    features: [
      'MTA-backed payment reliability',
      'Regular customer base',
      'Scheduled trip assignments',
      'Route optimization software'
    ],
    requirements: [
      'MTA Access-A-Ride contractor enrollment',
      'TLC license and commercial plates',
      'Vehicle must meet MTA standards',
      'DOT physical and drug testing'
    ],
    bestFor: 'Predictable routes, government-backed income',
    contactInfo: '1-877-337-2017',
    coverage: 'NYC 5 boroughs'
  }
]

export function MedicalVouchers() {
  const [enrolledProviders, setEnrolledProviders] = useKV<string[]>('enrolled-medical-providers', [])
  const [activeType, setActiveType] = useKV<string>('medical-active-type', 'all')

  const toggleEnrollment = (providerId: string) => {
    setEnrolledProviders((current) => {
      const enrolled = current || []
      if (enrolled.includes(providerId)) {
        return enrolled.filter(id => id !== providerId)
      } else {
        return [...enrolled, providerId]
      }
    })
  }

  const isEnrolled = (providerId: string) => {
    return (enrolledProviders || []).includes(providerId)
  }

  const filteredProviders = activeType === 'all' 
    ? MEDICAL_PROVIDERS 
    : MEDICAL_PROVIDERS.filter(p => p.type === activeType)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-lg p-4 border">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20">
            <FirstAidKit size={22} className="text-success" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Medical Transport</h2>
            <p className="text-xs text-muted-foreground">
              TLC-approved programs with reliable, scheduled trips
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeType || 'all'} onValueChange={setActiveType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="all">
            All Services
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-2">
            <FirstAidKit size={16} weight="fill" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="ambulette" className="gap-2">
            <Wheelchair size={16} weight="fill" />
            Ambulette
          </TabsTrigger>
          <TabsTrigger value="paratransit" className="gap-2">
            <Ambulance size={16} weight="fill" />
            Paratransit
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeType || 'all'} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {filteredProviders.map(provider => (
              <Card 
                key={provider.id} 
                className="p-4 transition-all hover:shadow-lg"
                style={{ borderLeft: `3px solid ${provider.color}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: provider.bgColor }}
                    >
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{provider.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className="mt-0.5 text-[10px] h-4"
                        style={{ 
                          backgroundColor: provider.bgColor,
                          color: provider.color 
                        }}
                      >
                        {provider.type.charAt(0).toUpperCase() + provider.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={isEnrolled(provider.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEnrollment(provider.id)}
                    className="gap-1 h-7 text-xs"
                  >
                    <CheckCircle 
                      size={12} 
                      weight={isEnrolled(provider.id) ? 'fill' : 'regular'}
                    />
                    {isEnrolled(provider.id) ? 'Enrolled' : 'Enroll'}
                  </Button>
                </div>

                <p className="text-xs text-foreground/80 mb-3">
                  {provider.description}
                </p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-success/20">
                      <CurrencyDollar size={14} className="text-success" weight="bold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Payment</div>
                      <div className="text-xs font-semibold font-mono">{provider.paymentStructure}</div>
                    </div>
                  </div>

                  {provider.coverage && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/20">
                        <MapPin size={14} className="text-primary" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Coverage</div>
                        <div className="text-xs font-medium">{provider.coverage}</div>
                      </div>
                    </div>
                  )}

                  {provider.contactInfo && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-accent/20">
                        <Phone size={14} className="text-accent" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Contact</div>
                        <div className="text-xs font-medium font-mono">{provider.contactInfo}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Features
                  </div>
                  <ul className="space-y-1">
                    {provider.features.map((feature, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-1.5">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Requirements
                  </div>
                  <ul className="space-y-1">
                    {provider.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-accent/10 rounded-lg p-2.5 border border-accent/30">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-accent" weight="fill" />
                    <div className="text-[10px] font-semibold text-accent">Best For:</div>
                  </div>
                  <div className="text-xs mt-0.5">{provider.bestFor}</div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
            <Info size={20} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Why Medical?</h3>
            <ul className="space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Guaranteed payment from insurance/government</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Scheduled trips - know routes in advance</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Lower competition vs standard rideshare</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Premium rates - $10-20 more per trip</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/30">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20">
            <Clock size={20} className="text-warning" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Getting Started</h3>
            <ul className="space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Start with MTM or LogistiCare for high volume</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Get CPR certified for premium opportunities</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Enroll with 2-3 providers to maximize trips</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>WAV certification pays 40-60% more</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

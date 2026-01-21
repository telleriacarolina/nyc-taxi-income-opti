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
      <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-lg p-6 border">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
            <FirstAidKit size={28} className="text-success" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Medical Transportation & Voucher Services</h2>
            <p className="text-muted-foreground">
              Supplement your rideshare income with medical transportation services. These TLC-approved 
              programs offer reliable, scheduled trips with guaranteed payment for transporting patients 
              to medical appointments, hospitals, and treatment centers.
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
          <div className="grid gap-5 md:grid-cols-2">
            {filteredProviders.map(provider => (
              <Card 
                key={provider.id} 
                className="p-6 transition-all hover:shadow-lg"
                style={{ borderLeft: `4px solid ${provider.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: provider.bgColor }}
                    >
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className="mt-1"
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
                    className="gap-2"
                  >
                    <CheckCircle 
                      size={16} 
                      weight={isEnrolled(provider.id) ? 'fill' : 'regular'}
                    />
                    {isEnrolled(provider.id) ? 'Enrolled' : 'Enroll'}
                  </Button>
                </div>

                <p className="text-sm text-foreground/80 mb-4">
                  {provider.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-success/20">
                      <CurrencyDollar size={16} className="text-success" weight="bold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Payment</div>
                      <div className="text-sm font-semibold font-mono">{provider.paymentStructure}</div>
                    </div>
                  </div>

                  {provider.coverage && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20">
                        <MapPin size={16} className="text-primary" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">Coverage Area</div>
                        <div className="text-sm font-medium">{provider.coverage}</div>
                      </div>
                    </div>
                  )}

                  {provider.contactInfo && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/20">
                        <Phone size={16} className="text-accent" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">Contact</div>
                        <div className="text-sm font-medium font-mono">{provider.contactInfo}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Key Features
                  </div>
                  <ul className="space-y-1.5">
                    {provider.features.map((feature, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-success mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Requirements
                  </div>
                  <ul className="space-y-1.5">
                    {provider.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-accent/10 rounded-lg p-3 border border-accent/30">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-accent" weight="fill" />
                    <div className="text-xs font-semibold text-accent">Best For:</div>
                  </div>
                  <div className="text-sm mt-1">{provider.bestFor}</div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-success/5 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <Info size={24} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Why Medical Transportation?</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span><strong>Guaranteed payment:</strong> Unlike rideshare apps, medical vouchers are paid by insurance companies and government programs with reliable payment schedules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span><strong>Scheduled trips:</strong> Know your routes and earnings in advance with pre-booked appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span><strong>Lower competition:</strong> Fewer drivers compete for medical transport compared to standard rideshare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span><strong>Premium rates:</strong> Medical trips typically pay $10-20 more per trip than equivalent rideshare fares</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">✓</span>
                <span><strong>Meaningful work:</strong> Help patients access critical healthcare services while earning a living</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/30">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/20">
            <Clock size={24} className="text-warning" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Getting Started Tips</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold">1.</span>
                <span><strong>Start with MTM or LogistiCare</strong> - These providers have the highest trip volume and easiest onboarding process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold">2.</span>
                <span><strong>Get CPR certified</strong> - While not always required, it opens up more opportunities and premium trips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold">3.</span>
                <span><strong>Enroll with multiple providers</strong> - Maximize your trip opportunities by working with 2-3 different services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold">4.</span>
                <span><strong>Consider WAV certification</strong> - Wheelchair accessible vehicle trips pay 40-60% more than standard trips</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning font-bold">5.</span>
                <span><strong>Build relationships</strong> - Regular patients and dispatchers can lead to consistent trip assignments</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package,
  Bicycle,
  Pizza,
  ShoppingBag,
  Bag,
  CurrencyDollar,
  Clock,
  Phone,
  CheckCircle,
  Info,
  MapPin,
  Star,
  TrendUp,
  Lightning,
  Percent,
  Users
} from '@phosphor-icons/react'

interface DeliveryPlatform {
  id: string
  name: string
  type: 'food' | 'grocery' | 'package' | 'multiservice'
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
  commissionRate?: string
  peakTimes?: string
}

const DELIVERY_PLATFORMS: DeliveryPlatform[] = [
  {
    id: 'ubereats',
    name: 'Uber Eats',
    type: 'food',
    color: '#06C167',
    bgColor: '#E6F9F0',
    icon: '🍔',
    description: 'Leading food delivery platform with high order volume and flexible scheduling',
    paymentStructure: '$3-$12 per delivery + tips',
    commissionRate: '0% (driver keeps 100% of delivery fee + tips)',
    peakTimes: 'Lunch 11am-2pm, Dinner 5pm-9pm',
    features: [
      'Instant pay available',
      'High order volume in NYC',
      'Tips average 15-20% of order value',
      'Quests and surge pricing bonuses',
      'No scheduling required - work anytime',
      'Real-time earnings tracker in app',
      'Multiple delivery batching for efficiency'
    ],
    requirements: [
      'Age 18+ with valid ID',
      'Smartphone (iOS 13+ or Android 8+)',
      'Insulated delivery bag',
      'Bicycle, e-bike, motorcycle, or car',
      'Background check (takes 3-5 days)',
      'Right to work in the US'
    ],
    bestFor: 'Maximum flexibility, high earning potential during peak hours',
    contactInfo: 'support.uber.com/ubereats',
    coverage: 'All 5 boroughs + suburbs'
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    type: 'food',
    color: '#FF3008',
    bgColor: '#FFE8E5',
    icon: '🍕',
    description: 'Top food delivery platform with DashPass priority and peak pay incentives',
    paymentStructure: '$2-$10 base pay + tips',
    commissionRate: '0% (driver keeps 100% of base + tips)',
    peakTimes: 'Lunch 11:30am-1:30pm, Dinner 5:30pm-8:30pm',
    features: [
      'DasherDirect instant daily deposits',
      'Peak Pay bonuses during busy times',
      'Challenge bonuses for completing order goals',
      'Catering orders for higher earnings',
      'Schedule Dash times or Dash Now',
      'In-app navigation and customer chat',
      'DashPass priority orders (higher tips)'
    ],
    requirements: [
      'Age 18+ with valid driver license',
      'Insulated food bag (free DoorDash bag)',
      'Bicycle, scooter, or vehicle',
      'Smartphone with GPS',
      'Background check completed',
      'Bank account for direct deposit'
    ],
    bestFor: 'Scheduled shifts, consistent peak pay bonuses',
    contactInfo: 'help.doordash.com',
    coverage: 'NYC metro + Long Island'
  },
  {
    id: 'grubhub',
    name: 'Grubhub',
    type: 'food',
    color: '#F63440',
    bgColor: '#FFE9EA',
    icon: '🥡',
    description: 'Established food delivery with block scheduling and guaranteed minimums in some markets',
    paymentStructure: '$3-$9 delivery + mileage + tips',
    commissionRate: '0% (driver keeps 100% + mileage)',
    peakTimes: 'Lunch 11am-2pm, Dinner 5pm-9pm, Late Night 9pm-12am',
    features: [
      'Mileage reimbursement (22¢/mile)',
      'Block scheduling for guaranteed hours',
      'Contribution pay if earnings fall short',
      'Instant cashout available',
      '100% of customer tips',
      'Premium delivery opportunities',
      'Driver levels with benefits (Pro, Premier)'
    ],
    requirements: [
      'Age 19+ with valid license',
      '2 years driving experience',
      'Insulated delivery bag',
      'Bicycle, car, or motorcycle',
      'Auto insurance (for car/motorcycle)',
      'Smartphone with data plan'
    ],
    bestFor: 'Drivers wanting scheduled blocks, guaranteed minimum earnings',
    contactInfo: 'driver.grubhub.com/contact',
    coverage: 'All boroughs + Westchester'
  },
  {
    id: 'seamless',
    name: 'Seamless',
    type: 'food',
    color: '#1CA0F2',
    bgColor: '#E6F5FE',
    icon: '🍱',
    description: 'NYC-focused food delivery (merged with Grubhub) with strong corporate lunch orders',
    paymentStructure: '$3-$9 delivery + tips',
    commissionRate: '0% (driver keeps 100%)',
    peakTimes: 'Business lunch 11:30am-2pm',
    features: [
      'Strong NYC business district presence',
      'Higher tips from corporate orders',
      'Same driver app as Grubhub',
      'Office building bulk orders',
      'Instant pay option',
      'Professional clientele'
    ],
    requirements: [
      'Age 19+ with background check',
      'Insulated bag required',
      'Bicycle or vehicle',
      'Smartphone',
      'Clean driving record',
      'Grubhub driver account (same platform)'
    ],
    bestFor: 'Manhattan business districts, corporate lunch delivery',
    contactInfo: 'seamless.com/help',
    coverage: 'Manhattan, Brooklyn, Queens'
  },
  {
    id: 'instacart',
    name: 'Instacart',
    type: 'grocery',
    color: '#0AAD0A',
    bgColor: '#E6F7E6',
    icon: '🛒',
    description: 'Grocery delivery and shopping service with higher order values and tips',
    paymentStructure: '$7-$20 per batch + tips',
    commissionRate: '0% (shopper keeps 100%)',
    peakTimes: 'Weekends 9am-7pm, Weekdays 4pm-8pm',
    features: [
      'Higher earnings per order ($15-30 average)',
      'Weekly instant cashout',
      'Shop and deliver or delivery-only batches',
      'Heavy order pay bonuses',
      'Flexible hours - no scheduling',
      'Customer ratings affect access to batches',
      'Mileage deduction eligible'
    ],
    requirements: [
      'Age 18+ in most areas',
      'Vehicle required (car or large SUV)',
      'Insulated cooler bags',
      'Ability to lift 40+ lbs',
      'Smartphone with Instacart Shopper app',
      'Background check',
      'Payment card provided by Instacart'
    ],
    bestFor: 'Drivers with cars, prefer higher pay per order, weekends',
    contactInfo: 'shoppers.instacart.com/help',
    coverage: 'All 5 boroughs + suburbs'
  },
  {
    id: 'amazonflex',
    name: 'Amazon Flex',
    type: 'package',
    color: '#FF9900',
    bgColor: '#FFF3E6',
    icon: '📦',
    description: 'Package delivery with scheduled blocks and guaranteed hourly rates',
    paymentStructure: '$18-$25 per hour (2-4 hour blocks)',
    commissionRate: 'Hourly rate (not per delivery)',
    peakTimes: 'Morning 6am-10am, Evening 4pm-8pm',
    features: [
      'Guaranteed hourly rate ($18-25/hr)',
      'Pre-scheduled 2-4 hour blocks',
      'Route planned by Amazon algorithm',
      'No tips (hourly rate only)',
      'Weekly direct deposit',
      'Prime Now and Amazon Fresh available',
      'Surge pricing during high demand'
    ],
    requirements: [
      'Age 21+ with valid license',
      'Mid-size sedan or larger vehicle required',
      'Smartphone (iPhone 6+ or Android 6+)',
      'Auto insurance and registration',
      'Clean driving record',
      'Pass background check (7-10 days)'
    ],
    bestFor: 'Prefer guaranteed hourly pay, scheduled work blocks',
    contactInfo: 'flex.amazon.com/support',
    coverage: 'All boroughs + delivery stations in NJ, CT'
  },
  {
    id: 'relay',
    name: 'Relay (Formerly Courier)',
    type: 'multiservice',
    color: '#6366F1',
    bgColor: '#EEF0FF',
    icon: '🚴',
    description: 'NYC-based multi-platform dispatch system aggregating orders from multiple apps',
    paymentStructure: '$4-$15 per delivery + tips',
    commissionRate: '10% platform fee',
    peakTimes: 'All day - aggregates from multiple platforms',
    features: [
      'Work multiple apps through single interface',
      'Aggregates orders from 15+ platforms',
      'AI-powered route optimization',
      'Batch deliveries automatically',
      'Real-time earnings dashboard',
      'Daily instant payouts',
      'Local NYC company with driver support'
    ],
    requirements: [
      'Age 18+ with valid ID',
      'Bicycle or e-bike',
      'Smartphone',
      'Insulated delivery bag',
      'NYC DOT commercial cyclist ID',
      'Background check'
    ],
    bestFor: 'Bicycle couriers, maximize orders from multiple apps',
    contactInfo: 'relay.delivery/support',
    coverage: 'Manhattan, Brooklyn, Queens'
  },
  {
    id: 'gopuff',
    name: 'Gopuff',
    type: 'multiservice',
    color: '#00C2E8',
    bgColor: '#E6F9FE',
    icon: '🏪',
    description: 'Convenience delivery with micro-fulfillment centers and scheduled shifts',
    paymentStructure: '$12-$18 per hour + tips',
    commissionRate: 'Hourly rate + subsidy per delivery',
    peakTimes: 'Evening 6pm-12am, Late Night 12am-3am',
    features: [
      'Guaranteed hourly rate plus delivery subsidy',
      'Scheduled shifts (3-8 hours)',
      'Deliver from local Gopuff warehouses',
      'Short delivery distances (1-3 miles)',
      'No shopping or waiting at stores',
      'Tips are extra income',
      'Gas/mileage reimbursement programs'
    ],
    requirements: [
      'Age 21+ with valid license',
      'Vehicle (car, motorcycle, or scooter)',
      'Smartphone',
      'Auto insurance',
      'Background and MVR check',
      'Reliable vehicle in good condition'
    ],
    bestFor: 'Prefer scheduled shifts, guaranteed hourly pay, short distances',
    contactInfo: 'gopuff.com/driver-support',
    coverage: 'Manhattan, Brooklyn, Bronx'
  }
]

export function DeliveryPlatforms() {
  const [enrolledPlatforms, setEnrolledPlatforms] = useKV<string[]>('enrolled-delivery-platforms', [])
  const [activeType, setActiveType] = useKV<string>('delivery-active-type', 'all')

  const toggleEnrollment = (platformId: string) => {
    setEnrolledPlatforms((current) => {
      const enrolled = current || []
      if (enrolled.includes(platformId)) {
        return enrolled.filter(id => id !== platformId)
      } else {
        return [...enrolled, platformId]
      }
    })
  }

  const isEnrolled = (platformId: string) => {
    return (enrolledPlatforms || []).includes(platformId)
  }

  const filteredPlatforms = activeType === 'all' 
    ? DELIVERY_PLATFORMS 
    : DELIVERY_PLATFORMS.filter(p => p.type === activeType)

  const enrolledCount = enrolledPlatforms?.length || 0

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-lg p-4 border">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20">
            <Package size={22} className="text-success" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Delivery Platforms</h2>
            <p className="text-xs text-muted-foreground">
              Food, grocery, and package delivery opportunities in NYC
            </p>
            {enrolledCount > 0 && (
              <Badge variant="secondary" className="mt-2 gap-1">
                <CheckCircle size={12} weight="fill" />
                {enrolledCount} platform{enrolledCount !== 1 ? 's' : ''} enrolled
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeType || 'all'} onValueChange={setActiveType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="all">
            All Platforms
          </TabsTrigger>
          <TabsTrigger value="food" className="gap-2">
            <Pizza size={16} weight="fill" />
            Food
          </TabsTrigger>
          <TabsTrigger value="grocery" className="gap-2">
            <ShoppingBag size={16} weight="fill" />
            Grocery
          </TabsTrigger>
          <TabsTrigger value="package" className="gap-2">
            <Package size={16} weight="fill" />
            Package
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeType || 'all'} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {filteredPlatforms.map(platform => (
              <Card 
                key={platform.id} 
                className="p-4 transition-all hover:shadow-lg"
                style={{ borderLeft: `3px solid ${platform.color}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: platform.bgColor }}
                    >
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{platform.name}</h3>
                      <Badge 
                        variant="secondary" 
                        className="mt-0.5 text-[10px] h-4"
                        style={{ 
                          backgroundColor: platform.bgColor,
                          color: platform.color 
                        }}
                      >
                        {platform.type === 'multiservice' ? 'Multi-Service' : platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={isEnrolled(platform.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEnrollment(platform.id)}
                    className="gap-1 h-7 text-xs"
                  >
                    <CheckCircle 
                      size={12} 
                      weight={isEnrolled(platform.id) ? 'fill' : 'regular'}
                    />
                    {isEnrolled(platform.id) ? 'Active' : 'Join'}
                  </Button>
                </div>

                <p className="text-xs text-foreground/80 mb-3">
                  {platform.description}
                </p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-success/20">
                      <CurrencyDollar size={14} className="text-success" weight="bold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Earnings</div>
                      <div className="text-xs font-semibold font-mono">{platform.paymentStructure}</div>
                    </div>
                  </div>

                  {platform.commissionRate && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/20">
                        <Percent size={14} className="text-primary" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Commission</div>
                        <div className="text-xs font-medium">{platform.commissionRate}</div>
                      </div>
                    </div>
                  )}

                  {platform.peakTimes && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-warning/20">
                        <Lightning size={14} className="text-warning" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Peak Times</div>
                        <div className="text-xs font-medium">{platform.peakTimes}</div>
                      </div>
                    </div>
                  )}

                  {platform.coverage && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-500/20">
                        <MapPin size={14} className="text-blue-600" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Coverage</div>
                        <div className="text-xs font-medium">{platform.coverage}</div>
                      </div>
                    </div>
                  )}

                  {platform.contactInfo && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded bg-accent/20">
                        <Phone size={14} className="text-accent" weight="fill" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-muted-foreground">Support</div>
                        <div className="text-xs font-medium">{platform.contactInfo}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Features
                  </div>
                  <ul className="space-y-1">
                    {platform.features.map((feature, idx) => (
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
                    {platform.requirements.map((req, idx) => (
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
                  <div className="text-xs mt-0.5">{platform.bestFor}</div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
            <TrendUp size={20} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Maximize Delivery Earnings</h3>
            <ul className="space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Multi-app during peak hours (11am-2pm, 5pm-9pm)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Position near restaurant clusters (Midtown, Williamsburg)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Accept orders with $1+ per mile and under 3 miles</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-success font-bold">✓</span>
                <span>Weekend evenings have highest tips (15-25% average)</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
            <Bicycle size={20} className="text-blue-600" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Bike vs. Car Delivery</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="bg-white/50 rounded p-2">
                <div className="text-[10px] font-semibold text-blue-700 uppercase mb-1">Bike/E-Bike</div>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Best for Manhattan (fast in traffic)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Lower expenses (no gas/parking)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Food delivery primarily</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/50 rounded p-2">
                <div className="text-[10px] font-semibold text-blue-700 uppercase mb-1">Car</div>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Grocery/package delivery</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Work all weather conditions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>Higher earnings per order</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/30">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20">
            <Info size={20} className="text-warning" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Getting Started Tips</h3>
            <ul className="space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Sign up for 2-3 platforms to maximize available orders</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Start with Uber Eats or DoorDash (easiest onboarding)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Track all miles for tax deductions (56¢ per mile in 2024)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-warning font-bold">•</span>
                <span>Use thermal bags to keep food hot and increase tips</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

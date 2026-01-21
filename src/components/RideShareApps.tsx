import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MedicalVouchers } from '@/components/MedicalVouchers'
import { 
  CarProfile, 
  Globe, 
  Star, 
  CurrencyDollar,
  Clock,
  MapPin,
  Lightning,
  Users,
  FirstAidKit
} from '@phosphor-icons/react'

interface RideShareApp {
  id: string
  name: string
  color: string
  bgColor: string
  icon: string
  description: string
  commissionRate: string
  features: string[]
  bestFor: string
  marketShare?: string
}

const RIDESHARE_APPS: RideShareApp[] = [
  {
    id: 'uber',
    name: 'Uber',
    color: '#000000',
    bgColor: '#f5f5f5',
    icon: '🚗',
    description: 'The largest ride-hailing platform with the most riders in NYC',
    commissionRate: '25-30%',
    features: [
      'UberX, UberXL, Comfort, Green',
      'Surge pricing during peak hours',
      'Instant pay available',
      'Driver rewards program'
    ],
    bestFor: 'High volume of rides, consistent demand',
    marketShare: '~70%'
  },
  {
    id: 'lyft',
    name: 'Lyft',
    color: '#FF00BF',
    bgColor: '#FFF0FB',
    icon: '🔮',
    description: 'Second-largest platform with competitive rates and bonuses',
    commissionRate: '20-28%',
    features: [
      'Standard, XL, Lux rides',
      'Prime Time pricing',
      'Express Pay available',
      'Weekly ride challenges'
    ],
    bestFor: 'Lower commission, bonus opportunities',
    marketShare: '~25%'
  },
  {
    id: 'curb',
    name: 'Curb',
    color: '#00B14F',
    bgColor: '#E8F8EE',
    icon: '🚕',
    description: 'E-hail service for yellow and green cabs with upfront pricing',
    commissionRate: '10-15%',
    features: [
      'Street hail integration',
      'Upfront pricing option',
      'Lower commission rates',
      'Cash or card payments'
    ],
    bestFor: 'Yellow/green cab drivers, lower fees',
    marketShare: '~3%'
  },
  {
    id: 'revel',
    name: 'Revel',
    color: '#5B7FFF',
    bgColor: '#EBF0FF',
    icon: '⚡',
    description: 'All-electric rideshare with Tesla vehicles and employee drivers',
    commissionRate: 'Employee wages',
    features: [
      'All Tesla fleet',
      'Hourly wage + tips',
      'No personal vehicle needed',
      'Benefits available'
    ],
    bestFor: 'Stable income, no vehicle ownership',
    marketShare: '~1%'
  },
  {
    id: 'via',
    name: 'Via',
    color: '#00D4AA',
    bgColor: '#E6FAF6',
    icon: '🚐',
    description: 'Shared ride service focusing on efficient pooled transportation',
    commissionRate: '15-20%',
    features: [
      'Shared rides focus',
      'Fixed route optimization',
      'Lower commission',
      'Predictable demand zones'
    ],
    bestFor: 'High-density areas, shared rides',
    marketShare: '~1%'
  },
  {
    id: 'juno',
    name: 'Juno',
    color: '#6C5CE7',
    bgColor: '#F3F1FF',
    icon: '💜',
    description: 'Driver-friendly platform with equity sharing and lower fees',
    commissionRate: '10-17%',
    features: [
      'Lowest commission rates',
      'Driver equity program',
      'Direct customer support',
      'Flexible scheduling'
    ],
    bestFor: 'Maximizing take-home pay',
    marketShare: '<1%'
  }
]

export function RideShareApps() {
  const [favoriteApps, setFavoriteApps] = useKV<string[]>('favorite-rideshare-apps', [])
  const [activeView, setActiveView] = useKV<string>('rideshare-view', 'platforms')

  const toggleFavorite = (appId: string) => {
    setFavoriteApps((current) => {
      const favorites = current || []
      if (favorites.includes(appId)) {
        return favorites.filter(id => id !== appId)
      } else {
        return [...favorites, appId]
      }
    })
  }

  const isFavorite = (appId: string) => {
    return (favoriteApps || []).includes(appId)
  }

  return (
    <Tabs value={activeView || 'platforms'} onValueChange={setActiveView} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="platforms" className="gap-2">
          <CarProfile size={20} weight="fill" />
          Rideshare Platforms
        </TabsTrigger>
        <TabsTrigger value="medical" className="gap-2">
          <FirstAidKit size={20} weight="fill" />
          Medical Vouchers
        </TabsTrigger>
      </TabsList>

      <TabsContent value="platforms" className="space-y-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border mb-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <CarProfile size={22} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Rideshare Platforms</h2>
              <p className="text-xs text-muted-foreground">
                Compare NYC platforms to maximize earnings
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {RIDESHARE_APPS.map(app => (
            <Card 
              key={app.id} 
              className="p-4 transition-all hover:shadow-lg"
              style={{ borderLeft: `3px solid ${app.color}` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: app.bgColor }}
                  >
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{app.name}</h3>
                    {app.marketShare && (
                      <p className="text-[10px] text-muted-foreground">
                        {app.marketShare}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(app.id)}
                  className="h-7 w-7 p-0"
                >
                  <Star 
                    size={16} 
                    weight={isFavorite(app.id) ? 'fill' : 'regular'}
                    className={isFavorite(app.id) ? 'text-accent' : 'text-muted-foreground'}
                  />
                </Button>
              </div>

              <p className="text-xs text-foreground/80 mb-3">
                {app.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded bg-accent/20">
                    <CurrencyDollar size={14} className="text-accent" weight="bold" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground">Fee</div>
                    <div className="text-xs font-semibold font-mono">{app.commissionRate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded bg-success/20">
                    <Lightning size={14} className="text-success" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-muted-foreground">Best For</div>
                    <div className="text-xs font-medium">{app.bestFor}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Features
                </div>
                <ul className="space-y-1">
                  {app.features.map((feature, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 bg-gradient-to-br from-accent/5 to-warning/5 border-accent/30">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20">
              <Users size={20} className="text-accent" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2">Multi-Apping Tips</h3>
              <ul className="space-y-1.5 text-xs text-foreground/80">
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold">•</span>
                  <span>Run multiple apps to maximize opportunities</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold">•</span>
                  <span>Compare fees - prioritize lower commission apps</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold">•</span>
                  <span>Track earnings per app for best performance</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-accent font-bold">•</span>
                  <span>Stay updated on bonuses and challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="medical" className="space-y-6">
        <MedicalVouchers />
      </TabsContent>
    </Tabs>
  )
}

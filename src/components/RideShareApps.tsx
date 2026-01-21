import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CarProfile, 
  Globe, 
  Star, 
  CurrencyDollar,
  Clock,
  MapPin,
  Lightning,
  Users
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
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
            <CarProfile size={28} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Ride Share Platforms</h2>
            <p className="text-muted-foreground">
              Compare NYC ride-sharing platforms to maximize your earnings. Each app has different 
              commission rates, features, and rider demand patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {RIDESHARE_APPS.map(app => (
          <Card 
            key={app.id} 
            className="p-6 transition-all hover:shadow-lg"
            style={{ borderLeft: `4px solid ${app.color}` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: app.bgColor }}
                >
                  {app.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{app.name}</h3>
                  {app.marketShare && (
                    <p className="text-xs text-muted-foreground">
                      {app.marketShare} market share
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(app.id)}
                className="h-9 w-9 p-0"
              >
                <Star 
                  size={20} 
                  weight={isFavorite(app.id) ? 'fill' : 'regular'}
                  className={isFavorite(app.id) ? 'text-accent' : 'text-muted-foreground'}
                />
              </Button>
            </div>

            <p className="text-sm text-foreground/80 mb-4">
              {app.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/20">
                  <CurrencyDollar size={16} className="text-accent" weight="bold" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Commission Rate</div>
                  <div className="text-sm font-semibold font-mono">{app.commissionRate}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-success/20">
                  <Lightning size={16} className="text-success" weight="fill" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Best For</div>
                  <div className="text-sm font-medium">{app.bestFor}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Key Features
              </div>
              <ul className="space-y-1.5">
                {app.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-accent/5 to-warning/5 border-accent/30">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20">
            <Users size={24} className="text-accent" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Pro Tips for Multi-Apping</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">1.</span>
                <span><strong>Run multiple apps simultaneously</strong> to maximize ride opportunities and minimize downtime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">2.</span>
                <span><strong>Compare commission rates</strong> when accepting rides - prioritize apps with lower fees during slow periods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">3.</span>
                <span><strong>Track your earnings per app</strong> to identify which platforms are most profitable for your driving pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">4.</span>
                <span><strong>Stay updated on bonus programs</strong> and ride challenges to boost your income</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

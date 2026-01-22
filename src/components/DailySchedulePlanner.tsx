import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  MapPin, 
  TrendUp, 
  Car, 
  NavigationArrow,
  CalendarBlank,
  Path,
  Target,
  Lightning
} from '@phosphor-icons/react'
import { OpenFreeMap } from './OpenFreeMap'

interface TimeBlock {
  id: string
  name: string
  timeRange: string
  description: string
  earningsTarget: number
  expectedRides: number
  zones: {
    name: string
    lat: number
    lng: number
    priority: 'high' | 'medium' | 'low'
    avgFare: number
    demandLevel: string
    trafficStatus: 'light' | 'moderate' | 'heavy'
  }[]
  platforms: string[]
  strategy: string
  tips: string[]
}

interface ScheduleRoute {
  id: string
  name: string
  timeBlocks: string[]
  totalEarnings: number
  totalHours: number
  rideCount: number
  description: string
}

const TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'early-morning',
    name: 'Early Morning Rush',
    timeRange: '5:00 AM - 9:00 AM',
    description: 'Airport runs and commuter traffic to Manhattan',
    earningsTarget: 150,
    expectedRides: 4,
    zones: [
      { 
        name: 'LaGuardia Airport', 
        lat: 40.7769, 
        lng: -73.8740, 
        priority: 'high', 
        avgFare: 45, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'JFK Airport', 
        lat: 40.6413, 
        lng: -73.7781, 
        priority: 'high', 
        avgFare: 55, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Midtown East', 
        lat: 40.7549, 
        lng: -73.9700, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Financial District', 
        lat: 40.7074, 
        lng: -74.0113, 
        priority: 'medium', 
        avgFare: 38, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Curb'],
    strategy: 'Start at airports for high-value long trips, then position in Midtown for business commuters',
    tips: [
      'Pre-position at LaGuardia by 5:30 AM for early flights',
      'Accept long trips to Manhattan - higher fares offset wait time',
      'Switch to Midtown by 7:30 AM for peak business commute'
    ]
  },
  {
    id: 'midday',
    name: 'Midday Steady',
    timeRange: '9:00 AM - 4:00 PM',
    description: 'Business meetings, medical appointments, shopping trips',
    earningsTarget: 200,
    expectedRides: 8,
    zones: [
      { 
        name: 'Upper East Side', 
        lat: 40.7736, 
        lng: -73.9566, 
        priority: 'high', 
        avgFare: 28, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Chelsea', 
        lat: 40.7465, 
        lng: -74.0014, 
        priority: 'medium', 
        avgFare: 25, 
        demandLevel: 'Medium',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Midtown West', 
        lat: 40.7614, 
        lng: -73.9776, 
        priority: 'high', 
        avgFare: 30, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'SoHo', 
        lat: 40.7233, 
        lng: -74.0030, 
        priority: 'medium', 
        avgFare: 27, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Medical Vouchers'],
    strategy: 'Focus on consistent short-to-medium trips in high-density areas, mix rideshare with medical vouchers',
    tips: [
      'Medical vouchers often available 10 AM - 2 PM',
      'Stay in Manhattan core for steady ride flow',
      'Use multiple platforms to minimize wait time',
      'Lunch rush 12-2 PM good for short high-volume trips'
    ]
  },
  {
    id: 'evening-rush',
    name: 'Evening Rush',
    timeRange: '4:00 PM - 8:00 PM',
    description: 'Commuters heading home, dinner reservations, entertainment',
    earningsTarget: 180,
    expectedRides: 6,
    zones: [
      { 
        name: 'Financial District', 
        lat: 40.7074, 
        lng: -74.0113, 
        priority: 'high', 
        avgFare: 42, 
        demandLevel: 'Very High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Midtown Manhattan', 
        lat: 40.7549, 
        lng: -73.9840, 
        priority: 'high', 
        avgFare: 38, 
        demandLevel: 'Very High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Upper West Side', 
        lat: 40.7870, 
        lng: -73.9754, 
        priority: 'medium', 
        avgFare: 35, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Brooklyn Heights', 
        lat: 40.6958, 
        lng: -73.9936, 
        priority: 'medium', 
        avgFare: 33, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Curb'],
    strategy: 'Capture commuters leaving Manhattan, accept trips to outer boroughs for premium pricing',
    tips: [
      'Position in Financial District by 4:30 PM',
      'Surge pricing likely 5-7 PM in business districts',
      'Accept outer borough trips - less return competition',
      'Avoid FDR Drive and West Side Highway 5-7 PM'
    ]
  },
  {
    id: 'night',
    name: 'Night Entertainment',
    timeRange: '8:00 PM - 2:00 AM',
    description: 'Dinner, bars, clubs, theater district, late entertainment',
    earningsTarget: 220,
    expectedRides: 7,
    zones: [
      { 
        name: 'Theater District', 
        lat: 40.7590, 
        lng: -73.9845, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Meatpacking District', 
        lat: 40.7409, 
        lng: -74.0069, 
        priority: 'high', 
        avgFare: 38, 
        demandLevel: 'High',
        trafficStatus: 'light'
      },
      { 
        name: 'East Village', 
        lat: 40.7264, 
        lng: -73.9818, 
        priority: 'medium', 
        avgFare: 30, 
        demandLevel: 'High',
        trafficStatus: 'light'
      },
      { 
        name: 'Williamsburg', 
        lat: 40.7081, 
        lng: -73.9571, 
        priority: 'high', 
        avgFare: 32, 
        demandLevel: 'Very High',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft'],
    strategy: 'Focus on entertainment districts with high tips, stay near bars/restaurants closing times',
    tips: [
      'Theater shows end 10-11 PM - high demand spike',
      'Bar/club closing times 2-4 AM have surge pricing',
      'Tips typically 15-25% higher for night rides',
      'Weekend nights can hit $300+ in 6 hours'
    ]
  },
  {
    id: 'late-night',
    name: 'Late Night Premium',
    timeRange: '2:00 AM - 5:00 AM',
    description: 'Bar closings, shift workers, early airport runs',
    earningsTarget: 120,
    expectedRides: 4,
    zones: [
      { 
        name: 'Lower East Side', 
        lat: 40.7153, 
        lng: -73.9877, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Bushwick', 
        lat: 40.6944, 
        lng: -73.9213, 
        priority: 'medium', 
        avgFare: 32, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Astoria', 
        lat: 40.7643, 
        lng: -73.9235, 
        priority: 'medium', 
        avgFare: 30, 
        demandLevel: 'Low',
        trafficStatus: 'light'
      },
      { 
        name: 'JFK Airport', 
        lat: 40.6413, 
        lng: -73.7781, 
        priority: 'high', 
        avgFare: 55, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft'],
    strategy: 'Maximize premium late-night rates, position near closing bars then transition to airports',
    tips: [
      'Surge multipliers 2-4x normal during bar closings',
      'Move to airports by 4 AM for early flights',
      'Less competition = higher acceptance of rides',
      'Safety first - trust your instincts on pickups'
    ]
  }
]

const SCHEDULE_ROUTES: ScheduleRoute[] = [
  {
    id: 'full-day',
    name: 'Full Day Maximizer',
    timeBlocks: ['early-morning', 'midday', 'evening-rush'],
    totalEarnings: 530,
    totalHours: 15,
    rideCount: 18,
    description: 'Complete early morning to evening shift capturing all peak periods'
  },
  {
    id: 'split-shift',
    name: 'Split Shift Strategy',
    timeBlocks: ['early-morning', 'evening-rush', 'night'],
    totalEarnings: 550,
    totalHours: 14,
    rideCount: 17,
    description: 'Work peak periods with midday break to avoid slow hours'
  },
  {
    id: 'night-owl',
    name: 'Night Owl Premium',
    timeBlocks: ['evening-rush', 'night', 'late-night'],
    totalEarnings: 520,
    totalHours: 14,
    rideCount: 17,
    description: 'Evening to late night capturing entertainment district premiums'
  },
  {
    id: 'steady-day',
    name: 'Steady Day Shift',
    timeBlocks: ['early-morning', 'midday'],
    totalEarnings: 350,
    totalHours: 11,
    rideCount: 12,
    description: 'Morning through afternoon for consistent reliable earnings'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    timeBlocks: ['midday', 'evening-rush', 'night'],
    totalEarnings: 600,
    totalHours: 14,
    rideCount: 21,
    description: 'Weekend-optimized schedule with higher tips and surge pricing'
  }
]

export function DailySchedulePlanner() {
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<ScheduleRoute | null>(null)
  const [viewMode, setViewMode] = useState<'blocks' | 'routes'>('blocks')

  const getZoneMarkers = (zones: TimeBlock['zones']) => {
    return zones.map(zone => ({
      position: [zone.lat, zone.lng] as [number, number],
      label: zone.name,
      earnings: zone.avgFare
    }))
  }

  const getRouteMarkers = (route: ScheduleRoute) => {
    const markers: { position: [number, number]; label: string; earnings?: number }[] = []
    route.timeBlocks.forEach((blockId, index) => {
      const block = TIME_BLOCKS.find(b => b.id === blockId)
      if (block) {
        block.zones.forEach(zone => {
          markers.push({
            position: [zone.lat, zone.lng],
            label: `${index + 1}. ${zone.name}`,
            earnings: zone.avgFare
          })
        })
      }
    })
    return markers
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-purple-600 text-white'
      case 'medium': return 'bg-blue-600 text-white'
      case 'low': return 'bg-gray-500 text-white'
    }
  }

  const getTrafficColor = (status: 'light' | 'moderate' | 'heavy') => {
    switch (status) {
      case 'light': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'heavy': return 'text-red-600'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                <CalendarBlank weight="fill" className="text-primary" />
                Daily Schedule Planner
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                Custom routes optimized for different times of day
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'blocks' | 'routes')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="blocks" className="gap-2">
                <Clock weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Time Blocks</span>
              </TabsTrigger>
              <TabsTrigger value="routes" className="gap-2">
                <Path weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Full Day Routes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TIME_BLOCKS.map((block) => (
                  <Card 
                    key={block.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBlock?.id === block.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                        {block.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                        <Clock size={14} />
                        <span className="truncate">{block.timeRange}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground line-clamp-2">
                        {block.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="secondary" className="gap-1">
                          <TrendUp size={12} weight="fill" />
                          ${block.earningsTarget}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Car size={12} weight="fill" />
                          {block.expectedRides} rides
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {block.platforms.slice(0, 2).map(platform => (
                          <Badge key={platform} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                            {platform}
                          </Badge>
                        ))}
                        {block.platforms.length > 2 && (
                          <Badge variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                            +{block.platforms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedBlock && (
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                          <Lightning weight="fill" className="text-purple-600" />
                          {selectedBlock.name} Details
                        </CardTitle>
                        <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                          {selectedBlock.timeRange}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBlock(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Target Earnings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                            ${selectedBlock.earningsTarget}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Expected Rides</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                            {selectedBlock.expectedRides}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Avg per Ride</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                            ${Math.round(selectedBlock.earningsTarget / selectedBlock.expectedRides)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2 flex items-center gap-2">
                        <MapPin weight="fill" className="text-purple-600" />
                        Priority Zones
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedBlock.zones.map((zone) => (
                          <Card key={zone.name}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-[clamp(0.8rem,2.5vw,0.9rem)] line-clamp-1">
                                  {zone.name}
                                </CardTitle>
                                <Badge className={`${getPriorityColor(zone.priority)} text-[clamp(0.6rem,1.8vw,0.65rem)]`}>
                                  {zone.priority}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-1">
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Avg Fare:</span>
                                <span className="font-semibold">${zone.avgFare}</span>
                              </div>
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Demand:</span>
                                <span className="font-semibold">{zone.demandLevel}</span>
                              </div>
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Traffic:</span>
                                <span className={`font-semibold capitalize ${getTrafficColor(zone.trafficStatus)}`}>
                                  {zone.trafficStatus}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="h-[300px] rounded-lg overflow-hidden border-2 border-purple-200">
                      <OpenFreeMap
                        center={[selectedBlock.zones[0].lat, selectedBlock.zones[0].lng]}
                        zoom={11}
                        markers={getZoneMarkers(selectedBlock.zones)}
                      />
                    </div>

                    <Card className="bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)] flex items-center gap-2">
                          <Target weight="fill" className="text-purple-600" />
                          Strategy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-3">
                          {selectedBlock.strategy}
                        </p>
                        <ul className="space-y-2">
                          {selectedBlock.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-[clamp(0.75rem,2.4vw,0.85rem)]">
                              <NavigationArrow size={16} weight="fill" className="text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2">Recommended Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBlock.platforms.map(platform => (
                          <Badge key={platform} variant="secondary" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="routes" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {SCHEDULE_ROUTES.map((route) => (
                  <Card 
                    key={route.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                        {route.name}
                      </CardTitle>
                      <CardDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                        {route.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Earnings</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-green-600">
                            ${route.totalEarnings}
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Hours</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-blue-600">
                            {route.totalHours}h
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Rides</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-purple-600">
                            {route.rideCount}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">Time Blocks:</p>
                        <div className="flex flex-wrap gap-1">
                          {route.timeBlocks.map(blockId => {
                            const block = TIME_BLOCKS.find(b => b.id === blockId)
                            return block ? (
                              <Badge key={blockId} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                {block.name.split(' ')[0]}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedRoute && (
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                          <Path weight="fill" className="text-purple-600" />
                          {selectedRoute.name}
                        </CardTitle>
                        <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                          {selectedRoute.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRoute(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Earnings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                            ${selectedRoute.totalEarnings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Hours</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                            {selectedRoute.totalHours}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Rides</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                            {selectedRoute.rideCount}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Per Hour</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-orange-600">
                            ${Math.round(selectedRoute.totalEarnings / selectedRoute.totalHours)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-[350px] rounded-lg overflow-hidden border-2 border-purple-200">
                      <OpenFreeMap
                        center={[40.7549, -73.9840]}
                        zoom={11}
                        markers={getRouteMarkers(selectedRoute)}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-3 flex items-center gap-2">
                        <Clock weight="fill" className="text-purple-600" />
                        Schedule Breakdown
                      </h3>
                      <div className="space-y-3">
                        {selectedRoute.timeBlocks.map((blockId, index) => {
                          const block = TIME_BLOCKS.find(b => b.id === blockId)
                          if (!block) return null
                          
                          return (
                            <Card key={blockId}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">
                                      Block {index + 1}: {block.name}
                                    </CardTitle>
                                    <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)] mt-1">
                                      {block.timeRange}
                                    </CardDescription>
                                  </div>
                                  <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                    ${block.earningsTarget}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-2">
                                  {block.strategy}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {block.zones.slice(0, 3).map(zone => (
                                    <Badge key={zone.name} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                      {zone.name}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

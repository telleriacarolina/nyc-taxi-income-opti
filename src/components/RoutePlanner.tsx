import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  ArrowsClockwise, 
  Path, 
  Clock, 
  CurrencyDollar, 
  Sparkle,
  NavigationArrow,
  Lightning,
  TrendUp
} from '@phosphor-icons/react'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface RouteStop {
  id: string
  neighborhood: string
  borough: string
  coordinates: [number, number]
  averageFare: number
  demandLevel: 'high' | 'medium' | 'low'
  expectedRidesPerHour: number
  estimatedTimeAtStop: number
  reason: string
}

interface OptimalRoute {
  id: string
  name: string
  stops: RouteStop[]
  totalDistance: number
  totalTime: number
  estimatedEarnings: number
  estimatedRides: number
  routeType: string
}

const TIME_PERIODS = [
  { id: 'morning', label: 'Morning (6-9AM)' },
  { id: 'midday', label: 'Midday (9AM-4PM)' },
  { id: 'evening', label: 'Evening (4-8PM)' },
  { id: 'night', label: 'Night (8PM-2AM)' },
]

export function RoutePlanner() {
  const [routes, setRoutes] = useState<OptimalRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<OptimalRoute | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('morning')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mapStyle] = useKV<MapStyle>('map-style', 'liberty')
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview')

  const generateRoutes = async (period: string) => {
    setIsLoading(true)
    
    try {
      const currentHour = new Date().getHours()
      const currentDay = new Date().getDay()
      const isWeekend = currentDay === 0 || currentDay === 6
      
      const prompt = (spark.llmPrompt as any)`You are an NYC TLC routing expert with access to historical trip data showing optimal patterns between zone types.

Based on ${period} time period ${isWeekend ? '(weekend)' : '(weekday)'}, generate 3 general route patterns connecting zone types for maximum earnings WITHOUT specific neighborhood names.

Each route should:
- Connect 3-5 general zone types in a logical sequence (e.g., "Residential areas", "Business districts", "Airport zones", "Entertainment areas")
- Consider traffic patterns, demand flow, and fare potential
- Include travel time between zone types
- Calculate total earnings potential based on TLC historical data
- Have a strategic theme (e.g., "Airport Loop", "Business Core", "Cross-Borough Pattern")

For each route, provide:
- Route name (descriptive but general, e.g., "Morning Commuter Pattern")
- Array of 3-5 stops with:
  * General zone type (NOT specific neighborhoods)
  * Borough category (Manhattan-focused, Outer boroughs, Multi-borough)
  * General NYC coordinates (use areas around 40.75, -73.98 with variations)
  * Average fare from TLC data ($25-75 range)
  * Demand level: high/medium/low
  * Expected rides per hour (2-8)
  * Estimated time at zone type in minutes (15-45)
  * Reason for this zone type citing general TLC patterns
- Total distance in miles (8-25 range)
- Total time in minutes including stops (90-180)
- Estimated earnings (sum of avg fare * rides per hour * time at stop)
- Estimated total rides
- Route type (e.g., "Airport Pattern", "Business Loop", "Mixed Zone")

Consider general patterns:
- Morning: Residential areas → Business districts → Airport zones
- Midday: Business hubs → Commercial areas → Transit centers
- Evening: Business districts → Residential areas → Entertainment zones
- Night: Entertainment zones → Late-night areas → Transit hubs

Return ONLY valid JSON in this exact format:
{
  "routes": [
    {
      "id": "route-1",
      "name": "Morning Commuter Pattern",
      "stops": [
        {
          "id": "stop-1",
          "neighborhood": "Residential Areas",
          "borough": "Manhattan-focused",
          "coordinates": [40.7870, -73.9754],
          "averageFare": 35.00,
          "demandLevel": "high",
          "expectedRidesPerHour": 6,
          "estimatedTimeAtStop": 30,
          "reason": "Morning residential pickup demand - TLC data shows $35 avg to business districts"
        }
      ],
      "totalDistance": 12.5,
      "totalTime": 120,
      "estimatedEarnings": 245.00,
      "estimatedRides": 7,
      "routeType": "Residential to Business"
    }
  ]
}`

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.routes && Array.isArray(data.routes)) {
        setRoutes(data.routes)
        setSelectedRoute(data.routes[0] || null)
        setLastUpdate(new Date())
        toast.success(`Generated ${data.routes.length} optimal routes`)
      }
    } catch (error) {
      console.error('Failed to generate routes:', error)
      toast.error('Failed to load route recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateRoutes(selectedPeriod)
  }, [selectedPeriod])

  const handleRefresh = () => {
    generateRoutes(selectedPeriod)
  }

  const getDemandColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-success text-success-foreground'
      case 'medium': return 'bg-warning text-warning-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (!routes.length && !isLoading) {
    return (
      <Card className="p-8 text-center border-2 border-dashed">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Path className="text-primary" size={32} />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">No Routes Generated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Generate general route patterns connecting zone types to maximize your efficiency
            </p>
            <Button onClick={() => generateRoutes(selectedPeriod)}>
              <Sparkle className="mr-2" />
              Generate Routes
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <NavigationArrow className="text-primary" size={24} weight="fill" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Route Planner</h3>
              <p className="text-sm text-muted-foreground">General route patterns between zone types</p>
            </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <ArrowsClockwise className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {lastUpdate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </Card>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <TabsList className="grid grid-cols-4 w-full">
          {TIME_PERIODS.map(period => (
            <TabsTrigger key={period.id} value={period.id} className="text-xs">
              {period.label.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing optimal routes...</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route, idx) => (
              <Card 
                key={route.id}
                className={`p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedRoute?.id === route.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-transparent hover:border-primary/30'
                }`}
                onClick={() => {
                  setSelectedRoute(route)
                  setViewMode('detail')
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Route {idx + 1}
                  </Badge>
                  <Badge className={getDemandColor('high')}>
                    <TrendUp size={12} className="mr-1" />
                    {route.routeType}
                  </Badge>
                </div>

                <h4 className="font-semibold mb-2 line-clamp-2">{route.name}</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stops:</span>
                    <span className="font-medium">{route.stops.length} zones</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">{route.totalDistance.toFixed(1)} mi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{formatTime(route.totalTime)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CurrencyDollar size={14} />
                      Est. Earnings:
                    </span>
                    <span className="font-bold text-success">${route.estimatedEarnings.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Est. Rides:</span>
                    <span className="font-medium">{route.estimatedRides} rides</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedRoute && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-xl mb-1">{selectedRoute.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRoute.routeType}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">
                    ${selectedRoute.estimatedEarnings.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedRoute.estimatedRides} rides · {formatTime(selectedRoute.totalTime)}
                  </div>
                </div>
              </div>

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'overview' | 'detail')}>
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="overview">
                    <Path size={16} className="mr-2" />
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value="detail">
                    <MapPin size={16} className="mr-2" />
                    Stop Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="h-96 rounded-lg overflow-hidden border">
                    <OpenFreeMap
                      center={selectedRoute.stops[0]?.coordinates || [40.7580, -73.9855]}
                      zoom={12}
                      style={mapStyle}
                      markers={selectedRoute.stops.map((stop, idx) => ({
                        position: stop.coordinates,
                        label: `Stop ${idx + 1}: ${stop.neighborhood}`,
                        earnings: stop.averageFare
                      }))}
                      enableClustering={false}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Total Distance</div>
                      <div className="text-2xl font-bold">{selectedRoute.totalDistance.toFixed(1)}<span className="text-sm font-normal text-muted-foreground ml-1">mi</span></div>
                    </Card>
                    <Card className="p-4 bg-accent/5 border-accent/20">
                      <div className="text-xs text-muted-foreground mb-1">Total Time</div>
                      <div className="text-2xl font-bold">{formatTime(selectedRoute.totalTime)}</div>
                    </Card>
                    <Card className="p-4 bg-success/5 border-success/20">
                      <div className="text-xs text-muted-foreground mb-1">Est. Earnings</div>
                      <div className="text-2xl font-bold text-success">${selectedRoute.estimatedEarnings.toFixed(0)}</div>
                    </Card>
                    <Card className="p-4 bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">Avg per Stop</div>
                      <div className="text-2xl font-bold">${(selectedRoute.estimatedEarnings / selectedRoute.stops.length).toFixed(0)}</div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="detail" className="space-y-3">
                  {selectedRoute.stops.map((stop, idx) => (
                    <Card key={stop.id} className="p-5 border-l-4 border-l-primary">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{stop.neighborhood}</h4>
                              <p className="text-sm text-muted-foreground">{stop.borough}</p>
                            </div>
                            <Badge className={getDemandColor(stop.demandLevel)}>
                              {stop.demandLevel}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{stop.reason}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Avg Fare</div>
                              <div className="font-semibold flex items-center gap-1">
                                <CurrencyDollar size={14} className="text-success" />
                                ${stop.averageFare.toFixed(0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Rides/Hour</div>
                              <div className="font-semibold flex items-center gap-1">
                                <TrendUp size={14} />
                                {stop.expectedRidesPerHour}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Time at Stop</div>
                              <div className="font-semibold flex items-center gap-1">
                                <Clock size={14} />
                                {stop.estimatedTimeAtStop}m
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Est. Earnings</div>
                              <div className="font-semibold text-success">
                                ${((stop.averageFare * stop.expectedRidesPerHour * stop.estimatedTimeAtStop) / 60).toFixed(0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {idx < selectedRoute.stops.length - 1 && (
                        <div className="flex items-center gap-2 mt-4 ml-14 text-xs text-muted-foreground">
                          <Lightning size={12} />
                          <span>Next stop</span>
                        </div>
                      )}
                    </Card>
                  ))}

                  <Card className="p-5 bg-gradient-to-br from-success/10 to-primary/5 border-success/20">
                    <div className="flex items-start gap-3">
                      <Sparkle className="text-success mt-1" size={20} weight="fill" />
                      <div>
                        <h4 className="font-semibold mb-1">Route Strategy</h4>
                        <p className="text-sm text-muted-foreground">
                          This route optimizes for {selectedRoute.routeType.toLowerCase()} patterns during {TIME_PERIODS.find(p => p.id === selectedPeriod)?.label}. 
                          Follow the sequence to maintain consistent ride flow with minimal downtime between zones.
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

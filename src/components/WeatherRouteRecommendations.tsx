import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  CloudRain, 
  NavigationArrow, 
  MapTrifold,
  Lightning, 
  Warning,
  CheckCircle,
  ArrowsClockwise,
  Sparkle,
  TrendUp,
  Clock,
  CurrencyDollar,
  Path,
  Gauge,
  Umbrella,
  Snowflake,
  Sun
} from '@phosphor-icons/react'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface WeatherCondition {
  type: 'clear' | 'rain' | 'heavy-rain' | 'snow' | 'fog' | 'extreme-heat'
  temperature: number
  precipitation: number
  visibility: number
  advisories: string[]
}

interface TrafficCondition {
  congestionLevel: 'low' | 'moderate' | 'high' | 'severe'
  avgSpeed: number
  incidentCount: number
  affectedAreas: string[]
}

interface RouteRecommendation {
  id: string
  name: string
  strategy: string
  weatherOptimized: boolean
  trafficOptimized: boolean
  stops: Array<{
    id: string
    name: string
    borough: string
    coordinates: [number, number]
    weatherScore: number
    trafficScore: number
    demandScore: number
    expectedEarnings: number
    reason: string
    warnings: string[]
  }>
  totalDistance: number
  estimatedTime: number
  estimatedEarnings: number
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
}

const WEATHER_ICONS = {
  'clear': Sun,
  'rain': CloudRain,
  'heavy-rain': CloudRain,
  'snow': Snowflake,
  'fog': CloudRain,
  'extreme-heat': Sun
}

export function WeatherRouteRecommendations() {
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null)
  const [currentTraffic, setCurrentTraffic] = useState<TrafficCondition | null>(null)
  const [routes, setRoutes] = useState<RouteRecommendation[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteRecommendation | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('current')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mapStyle] = useKV<MapStyle>('map-style', 'liberty')

  const generateWeatherAwareRoutes = async () => {
    setIsLoading(true)
    try {
      const currentHour = new Date().getHours()
      const month = new Date().getMonth()
      
      let season: 'winter' | 'spring' | 'summer' | 'fall'
      if (month >= 2 && month <= 4) season = 'spring'
      else if (month >= 5 && month <= 7) season = 'summer'
      else if (month >= 8 && month <= 10) season = 'fall'
      else season = 'winter'

      const weatherPrompt = (spark.llmPrompt as any)`Generate realistic current weather conditions for NYC at ${currentHour}:00 in ${season}. Return JSON with:
{
  "weather": {
    "type": "clear|rain|heavy-rain|snow|fog|extreme-heat",
    "temperature": number (realistic for season),
    "precipitation": number (0-100),
    "visibility": number (miles, 1-10),
    "advisories": [array of weather advisory strings if severe]
  },
  "traffic": {
    "congestionLevel": "low|moderate|high|severe",
    "avgSpeed": number (mph),
    "incidentCount": number (0-15),
    "affectedAreas": [array of general area descriptions]
  }
}`

      const weatherResponse = await spark.llm(weatherPrompt, 'gpt-4o-mini', true)
      const weatherData = JSON.parse(weatherResponse)
      
      setCurrentWeather(weatherData.weather)
      setCurrentTraffic(weatherData.traffic)

      const routePrompt = (spark.llmPrompt as any)`You are an expert NYC TLC route optimizer combining real-time weather and traffic data.

CURRENT CONDITIONS:
- Weather: ${weatherData.weather.type}, ${weatherData.weather.temperature}°F, ${weatherData.weather.precipitation}% precipitation
- Traffic: ${weatherData.traffic.congestionLevel} congestion, ${weatherData.traffic.avgSpeed} mph avg speed
- Time: ${currentHour}:00 (${currentHour >= 6 && currentHour < 10 ? 'morning rush' : currentHour >= 16 && currentHour < 20 ? 'evening rush' : currentHour >= 20 || currentHour < 2 ? 'night' : 'midday'})
- Weather Advisories: ${weatherData.weather.advisories.join(', ') || 'none'}

Generate 3 optimized route strategies that account for BOTH weather and traffic:

1. **Weather-Focused Route**: Prioritizes areas with highest weather-driven demand
2. **Traffic-Avoiding Route**: Maximizes efficiency by avoiding congested areas
3. **Balanced Route**: Optimal combination of weather opportunity and traffic efficiency

For each route provide:
- id, name, strategy (brief description)
- weatherOptimized: boolean (true if prioritizes weather demand)
- trafficOptimized: boolean (true if prioritizes traffic avoidance)
- stops: array of 3-4 strategic stops with:
  * id, name (general area type, not specific address)
  * borough: general region
  * coordinates: [lat, lng] (realistic NYC coords around 40.75, -73.98)
  * weatherScore: 1-10 (how weather affects demand here)
  * trafficScore: 1-10 (traffic accessibility, 10=good)
  * demandScore: 1-10 (overall current demand)
  * expectedEarnings: dollars per hour at this stop
  * reason: why this stop works in current conditions
  * warnings: array of any risks (e.g., "Heavy traffic", "Poor visibility", "Road closures")
- totalDistance: miles (8-20)
- estimatedTime: minutes (90-150)
- estimatedEarnings: total dollars for route
- riskLevel: low|medium|high based on weather/traffic
- recommendations: array of 3 driver tips for this specific route in current conditions

Return ONLY valid JSON:
{
  "routes": [route objects as described above]
}`

      const routeResponse = await spark.llm(routePrompt, 'gpt-4o', true)
      const routeData = JSON.parse(routeResponse)

      if (routeData.routes && Array.isArray(routeData.routes)) {
        setRoutes(routeData.routes)
        setSelectedRoute(routeData.routes[0])
        setLastUpdate(new Date())
        toast.success(`Generated ${routeData.routes.length} weather-optimized routes`)
      }
    } catch (error) {
      console.error('Error generating routes:', error)
      toast.error('Failed to generate route recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateWeatherAwareRoutes()
  }, [])

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-success/10 text-success border-success/30'
      case 'medium': return 'bg-warning/10 text-warning border-warning/30'
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success'
    if (score >= 5) return 'text-warning'
    return 'text-destructive'
  }

  const WeatherIcon = currentWeather ? WEATHER_ICONS[currentWeather.type] : CloudRain

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <NavigationArrow className="text-primary" size={24} weight="fill" />
            </div>
            <div>
              <h3 className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
                Weather-Based Route Optimizer
              </h3>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground mt-0.5">
                Intelligent routing combining traffic & precipitation data
              </p>
            </div>
          </div>
          <Button
            onClick={generateWeatherAwareRoutes}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <ArrowsClockwise className={isLoading ? 'animate-spin' : ''} size={16} />
          </Button>
        </div>

        {(currentWeather && currentTraffic) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-4 bg-card/80 border-primary/30">
              <div className="flex items-center gap-3 mb-3">
                <WeatherIcon size={32} weight="fill" className="text-primary" />
                <div>
                  <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                    Current Weather
                  </div>
                  <div className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] capitalize">
                    {currentWeather.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                <div>
                  <div className="text-muted-foreground">Temp</div>
                  <div className="font-semibold">{currentWeather.temperature}°F</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Rain</div>
                  <div className="font-semibold">{currentWeather.precipitation}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Visibility</div>
                  <div className="font-semibold">{currentWeather.visibility} mi</div>
                </div>
              </div>
              {currentWeather.advisories.length > 0 && (
                <div className="mt-3 flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
                  <Warning size={16} className="text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-[clamp(0.7rem,2vw,0.8rem)] text-warning">
                    {currentWeather.advisories[0]}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 bg-card/80 border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <Gauge size={32} weight="fill" className="text-accent" />
                <div>
                  <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                    Traffic Conditions
                  </div>
                  <div className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] capitalize">
                    {currentTraffic.congestionLevel} Congestion
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                <div>
                  <div className="text-muted-foreground">Avg Speed</div>
                  <div className="font-semibold">{currentTraffic.avgSpeed} mph</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Incidents</div>
                  <div className="font-semibold">{currentTraffic.incidentCount}</div>
                </div>
              </div>
              {currentTraffic.affectedAreas.length > 0 && (
                <div className="mt-3 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                  Delays: {currentTraffic.affectedAreas.slice(0, 2).join(', ')}
                </div>
              )}
            </Card>
          </div>
        )}

        {lastUpdate && (
          <div className="flex items-center gap-2 mt-3 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
            <Clock size={14} />
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </Card>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-[clamp(0.8rem,2.4vw,0.9rem)] text-muted-foreground">
              Analyzing weather patterns and traffic flow...
            </p>
          </div>
        </Card>
      ) : routes.length > 0 ? (
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
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Route {idx + 1}
                  </Badge>
                  <Badge className={getRiskColor(route.riskLevel)}>
                    {route.riskLevel} risk
                  </Badge>
                </div>

                <h4 className="font-semibold text-[clamp(0.9rem,2.6vw,1.05rem)] mb-2 line-clamp-2">
                  {route.name}
                </h4>
                <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground mb-3 line-clamp-2">
                  {route.strategy}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  {route.weatherOptimized && (
                    <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.75rem)]">
                      <CloudRain size={12} className="mr-1" />
                      Weather
                    </Badge>
                  )}
                  {route.trafficOptimized && (
                    <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.75rem)]">
                      <Gauge size={12} className="mr-1" />
                      Traffic
                    </Badge>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="space-y-2 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stops:</span>
                    <span className="font-medium">{route.stops.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">{route.totalDistance.toFixed(1)} mi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{Math.floor(route.estimatedTime / 60)}h {route.estimatedTime % 60}m</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CurrencyDollar size={14} />
                      Earnings:
                    </span>
                    <span className="font-bold text-success text-[clamp(0.85rem,2.4vw,1rem)]">
                      ${route.estimatedEarnings.toFixed(0)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedRoute && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-[clamp(1.1rem,3.2vw,1.4rem)] mb-1">
                    {selectedRoute.name}
                  </h3>
                  <p className="text-[clamp(0.8rem,2.4vw,0.9rem)] text-muted-foreground">
                    {selectedRoute.strategy}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-success">
                    ${selectedRoute.estimatedEarnings.toFixed(0)}
                  </div>
                  <div className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                    Est. earnings
                  </div>
                </div>
              </div>

              <Tabs defaultValue="map" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="map">
                    <MapTrifold size={16} className="mr-2" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="stops">
                    <Path size={16} className="mr-2" />
                    Stops
                  </TabsTrigger>
                  <TabsTrigger value="tips">
                    <Sparkle size={16} className="mr-2" />
                    Tips
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="space-y-4">
                  <div className="h-96 rounded-lg overflow-hidden border">
                    <OpenFreeMap
                      center={selectedRoute.stops[0]?.coordinates || [40.7580, -73.9855]}
                      zoom={12}
                      style={mapStyle}
                      markers={selectedRoute.stops.map((stop, idx) => ({
                        position: stop.coordinates,
                        label: `${idx + 1}. ${stop.name}`,
                        earnings: stop.expectedEarnings
                      }))}
                      enableClustering={false}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="p-3 bg-primary/5 border-primary/20">
                      <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                        Distance
                      </div>
                      <div className="text-[clamp(1.2rem,3.5vw,1.5rem)] font-bold">
                        {selectedRoute.totalDistance.toFixed(1)}
                        <span className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-normal text-muted-foreground ml-1">mi</span>
                      </div>
                    </Card>
                    <Card className="p-3 bg-accent/5 border-accent/20">
                      <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                        Duration
                      </div>
                      <div className="text-[clamp(1.2rem,3.5vw,1.5rem)] font-bold">
                        {Math.floor(selectedRoute.estimatedTime / 60)}h {selectedRoute.estimatedTime % 60}m
                      </div>
                    </Card>
                    <Card className="p-3 bg-success/5 border-success/20">
                      <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                        Earnings
                      </div>
                      <div className="text-[clamp(1.2rem,3.5vw,1.5rem)] font-bold text-success">
                        ${selectedRoute.estimatedEarnings.toFixed(0)}
                      </div>
                    </Card>
                    <Card className={`p-3 ${getRiskColor(selectedRoute.riskLevel)}`}>
                      <div className="text-[clamp(0.7rem,2vw,0.75rem)] mb-1 opacity-80">
                        Risk Level
                      </div>
                      <div className="text-[clamp(1.2rem,3.5vw,1.5rem)] font-bold capitalize">
                        {selectedRoute.riskLevel}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="stops" className="space-y-3">
                  {selectedRoute.stops.map((stop, idx) => (
                    <Card key={stop.id} className="p-5 border-l-4 border-l-primary">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)]">
                                {stop.name}
                              </h4>
                              <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
                                {stop.borough}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[clamp(0.95rem,2.8vw,1.1rem)] text-success">
                                ${stop.expectedEarnings}/hr
                              </div>
                            </div>
                          </div>

                          <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground mb-3">
                            {stop.reason}
                          </p>

                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                                Weather
                              </div>
                              <div className={`font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)] ${getScoreColor(stop.weatherScore)}`}>
                                {stop.weatherScore}/10
                              </div>
                            </div>
                            <div>
                              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                                Traffic
                              </div>
                              <div className={`font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)] ${getScoreColor(stop.trafficScore)}`}>
                                {stop.trafficScore}/10
                              </div>
                            </div>
                            <div>
                              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">
                                Demand
                              </div>
                              <div className={`font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)] ${getScoreColor(stop.demandScore)}`}>
                                {stop.demandScore}/10
                              </div>
                            </div>
                          </div>

                          {stop.warnings.length > 0 && (
                            <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
                              <Warning size={16} className="text-warning flex-shrink-0 mt-0.5" />
                              <div className="text-[clamp(0.7rem,2vw,0.8rem)] text-warning">
                                {stop.warnings.join(' • ')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {idx < selectedRoute.stops.length - 1 && (
                        <div className="flex items-center gap-2 mt-4 ml-14 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                          <Lightning size={12} />
                          <span>Next stop</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="tips" className="space-y-3">
                  <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
                    <div className="flex items-start gap-3 mb-4">
                      <Sparkle className="text-primary flex-shrink-0 mt-1" size={24} weight="fill" />
                      <div>
                        <h4 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] mb-1">
                          Route Recommendations
                        </h4>
                        <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
                          Optimized for current weather and traffic conditions
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedRoute.recommendations.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                          <CheckCircle size={20} weight="fill" className="text-success flex-shrink-0 mt-0.5" />
                          <p className="text-[clamp(0.75rem,2.2vw,0.85rem)]">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {currentWeather && currentWeather.advisories.length > 0 && (
                    <Card className="p-5 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30">
                      <div className="flex items-start gap-3">
                        <Warning className="text-warning flex-shrink-0 mt-1" size={24} weight="fill" />
                        <div>
                          <h4 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] mb-2 text-warning">
                            Weather Advisories
                          </h4>
                          <ul className="space-y-2">
                            {currentWeather.advisories.map((advisory, idx) => (
                              <li key={idx} className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-warning/90">
                                • {advisory}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-5 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
                    <div className="flex items-start gap-3">
                      <TrendUp className="text-success flex-shrink-0 mt-1" size={24} weight="fill" />
                      <div>
                        <h4 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] mb-2">
                          Earnings Potential
                        </h4>
                        <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground leading-relaxed">
                          This route is optimized for the current weather and traffic conditions, 
                          with an estimated earning potential of ${selectedRoute.estimatedEarnings.toFixed(0)} 
                          over {Math.floor(selectedRoute.estimatedTime / 60)} hours and {selectedRoute.estimatedTime % 60} minutes. 
                          Weather conditions are {currentWeather?.type === 'rain' || currentWeather?.type === 'heavy-rain' || currentWeather?.type === 'snow' ? 'favorable' : 'typical'} for 
                          increased demand in the selected areas.
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <NavigationArrow className="text-primary" size={32} weight="fill" />
            </div>
            <div>
              <h3 className="font-semibold text-[clamp(1rem,3vw,1.2rem)] mb-2">
                Generate Weather-Optimized Routes
              </h3>
              <p className="text-[clamp(0.8rem,2.4vw,0.9rem)] text-muted-foreground mb-4">
                Get intelligent route recommendations based on real-time weather and traffic data
              </p>
              <Button onClick={generateWeatherAwareRoutes}>
                <Sparkle className="mr-2" />
                Generate Routes
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

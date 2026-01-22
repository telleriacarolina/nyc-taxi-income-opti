import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MapPin, 
  NavigationArrow,
  Crosshair,
  ArrowsClockwise,
  Path,
  CurrencyDollar,
  Clock,
  TrendUp,
  Lightning,
  MapTrifold
} from '@phosphor-icons/react'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface RouteStop {
  id: string
  name: string
  zone: string
  coordinates: [number, number]
  distanceFromCurrent: number
  averageFare: number
  demandLevel: 'high' | 'medium' | 'low'
  expectedRides: number
  travelTime: number
  reason: string
}

interface GeneratedRoute {
  id: string
  name: string
  startLocation: [number, number]
  stops: RouteStop[]
  totalDistance: number
  totalTime: number
  estimatedEarnings: number
  routeType: string
}

export function CurrentLocationRouter() {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [mapStyle] = useKV<MapStyle>('map-style', 'liberty')

  const getCurrentLocation = () => {
    setIsLocating(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLocating(false)
      toast.error('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ]
        setCurrentLocation(coords)
        setIsLocating(false)
        toast.success('Location detected')
      },
      (error) => {
        let message = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable'
            break
          case error.TIMEOUT:
            message = 'Location request timed out'
            break
        }
        setLocationError(message)
        setIsLocating(false)
        toast.error(message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const generateRouteFromLocation = async () => {
    if (!currentLocation) {
      toast.error('Please get your current location first')
      return
    }

    setIsGenerating(true)

    try {
      const [lat, lng] = currentLocation
      const currentHour = new Date().getHours()
      const currentDay = new Date().getDay()
      const isWeekend = currentDay === 0 || currentDay === 6

      let timePeriod = 'midday'
      if (currentHour >= 6 && currentHour < 9) timePeriod = 'morning rush'
      else if (currentHour >= 16 && currentHour < 20) timePeriod = 'evening rush'
      else if (currentHour >= 20 || currentHour < 6) timePeriod = 'night'

      const prompt = (spark.llmPrompt as any)`You are an NYC TLC routing expert analyzing optimal routes from a driver's current location.

Driver's current location: Latitude ${lat}, Longitude ${lng}
Current time period: ${timePeriod}
Day type: ${isWeekend ? 'Weekend' : 'Weekday'}
Current time: ${new Date().toLocaleTimeString()}

Generate an optimal 4-stop route from this location that maximizes earnings potential. Consider:
- Proximity to current location (prioritize zones within 1-3 miles for first stop)
- Demand patterns for ${timePeriod}
- Traffic flow and direction
- Average fares and ride availability
- Natural progression toward high-demand areas

For each stop provide:
- General zone name (e.g., "Business District Area", "Residential Zone", "Transit Hub")
- Zone type description
- Coordinates (realistic NYC coordinates near the current location)
- Distance from previous point in miles
- Average fare based on TLC data ($25-75 range)
- Demand level: high/medium/low
- Expected rides at this stop (1-5)
- Travel time from previous stop in minutes
- Strategic reason for including this stop

Calculate:
- Total route distance (sum of all distances)
- Total travel time (sum of travel times between stops)
- Estimated earnings (sum of avg fare * expected rides per stop)
- Route type (e.g., "Proximity Loop", "Demand Chase", "Airport Run")

Return ONLY valid JSON:
{
  "route": {
    "id": "route-current-1",
    "name": "Optimal Route from Current Location",
    "startLocation": [${lat}, ${lng}],
    "stops": [
      {
        "id": "stop-1",
        "name": "Nearby Business District",
        "zone": "Commercial Area",
        "coordinates": [40.xxxx, -73.xxxx],
        "distanceFromCurrent": 1.2,
        "averageFare": 35.00,
        "demandLevel": "high",
        "expectedRides": 3,
        "travelTime": 8,
        "reason": "Close proximity with high morning commuter demand"
      }
    ],
    "totalDistance": 8.5,
    "totalTime": 65,
    "estimatedEarnings": 385.00,
    "routeType": "Proximity Optimization"
  }
}`

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)

      if (data.route) {
        setGeneratedRoute(data.route)
        toast.success('Route generated successfully')
      } else {
        throw new Error('Invalid route data')
      }
    } catch (error) {
      console.error('Failed to generate route:', error)
      toast.error('Failed to generate route')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

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

  const allMarkers = generatedRoute
    ? [
        {
          position: generatedRoute.startLocation,
          label: 'Your Current Location',
          earnings: 0
        },
        ...generatedRoute.stops.map((stop, idx) => ({
          position: stop.coordinates,
          label: `Stop ${idx + 1}: ${stop.name}`,
          earnings: stop.averageFare
        }))
      ]
    : currentLocation
    ? [
        {
          position: currentLocation,
          label: 'Your Current Location',
          earnings: 0
        }
      ]
    : []

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Crosshair className="text-primary" size={24} weight="fill" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Location-Based Router</h3>
              <p className="text-sm text-muted-foreground">Generate routes from your current position</p>
            </div>
          </div>
          <Button 
            onClick={getCurrentLocation} 
            disabled={isLocating}
            size="sm"
            variant="outline"
          >
            <ArrowsClockwise className={isLocating ? 'animate-spin' : ''} size={16} />
          </Button>
        </div>
      </Card>

      {locationError && (
        <Alert variant="destructive">
          <MapPin className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {currentLocation && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <MapPin className="text-success" size={20} weight="fill" />
              </div>
              <div>
                <h4 className="font-semibold">Current Location Detected</h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                </p>
              </div>
            </div>
            <Button 
              onClick={generateRouteFromLocation}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <NavigationArrow size={16} weight="fill" />
                  Generate Route
                </>
              )}
            </Button>
          </div>

          {!generatedRoute && (
            <div className="h-64 rounded-lg overflow-hidden border">
              <OpenFreeMap
                center={currentLocation}
                zoom={14}
                style={mapStyle}
                markers={allMarkers}
                enableClustering={false}
              />
            </div>
          )}
        </Card>
      )}

      {isGenerating && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Analyzing nearby zones and demand patterns...</p>
          </div>
        </Card>
      )}

      {generatedRoute && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-xl mb-1">{generatedRoute.name}</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {generatedRoute.routeType}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">
                ${generatedRoute.estimatedEarnings.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Est. earnings · {formatTime(generatedRoute.totalTime)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-xs text-muted-foreground mb-1">Distance</div>
              <div className="text-xl font-bold">{generatedRoute.totalDistance.toFixed(1)}<span className="text-sm font-normal text-muted-foreground ml-1">mi</span></div>
            </Card>
            <Card className="p-4 bg-accent/5 border-accent/20">
              <div className="text-xs text-muted-foreground mb-1">Total Time</div>
              <div className="text-xl font-bold">{formatTime(generatedRoute.totalTime)}</div>
            </Card>
            <Card className="p-4 bg-success/5 border-success/20">
              <div className="text-xs text-muted-foreground mb-1">Stops</div>
              <div className="text-xl font-bold">{generatedRoute.stops.length}</div>
            </Card>
          </div>

          <div className="h-96 rounded-lg overflow-hidden border mb-6">
            <OpenFreeMap
              center={currentLocation || [40.7580, -73.9855]}
              zoom={13}
              style={mapStyle}
              markers={allMarkers}
              enableClustering={false}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Path className="text-primary" size={20} weight="fill" />
              <h4 className="font-semibold">Route Stops</h4>
            </div>

            <Card className="p-4 border-l-4 border-l-primary bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  <Crosshair size={20} weight="fill" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold">Starting Point</h5>
                  <p className="text-sm text-muted-foreground">Your current location</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {generatedRoute.startLocation[0].toFixed(4)}, {generatedRoute.startLocation[1].toFixed(4)}
                  </p>
                </div>
              </div>
            </Card>

            {generatedRoute.stops.map((stop, idx) => (
              <div key={stop.id}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground my-2 ml-5">
                  <Lightning size={12} />
                  <span>{stop.travelTime}min · {stop.distanceFromCurrent.toFixed(1)}mi</span>
                </div>

                <Card className="p-5 border-l-4 border-l-accent">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{stop.name}</h4>
                          <p className="text-sm text-muted-foreground">{stop.zone}</p>
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
                          <div className="text-xs text-muted-foreground mb-1">Expected Rides</div>
                          <div className="font-semibold flex items-center gap-1">
                            <TrendUp size={14} />
                            {stop.expectedRides}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Distance</div>
                          <div className="font-semibold flex items-center gap-1">
                            <MapTrifold size={14} />
                            {stop.distanceFromCurrent.toFixed(1)}mi
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Est. Earnings</div>
                          <div className="font-semibold text-success">
                            ${(stop.averageFare * stop.expectedRides).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <Card className="p-5 bg-gradient-to-br from-success/10 to-primary/5 border-success/20 mt-6">
            <div className="flex items-start gap-3">
              <NavigationArrow className="text-success mt-1" size={20} weight="fill" />
              <div>
                <h4 className="font-semibold mb-1">Start Driving</h4>
                <p className="text-sm text-muted-foreground">
                  Follow this route for optimized earnings based on current demand patterns and your location. 
                  Total estimated earnings: <span className="font-semibold text-success">${generatedRoute.estimatedEarnings.toFixed(0)}</span> over {formatTime(generatedRoute.totalTime)}.
                </p>
              </div>
            </div>
          </Card>
        </Card>
      )}

      {!currentLocation && !isLocating && !locationError && (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Crosshair className="text-primary" size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Enable Location Access</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Allow location access to generate optimized routes from your current position
              </p>
              <Button onClick={getCurrentLocation}>
                <MapPin className="mr-2" />
                Get Current Location
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

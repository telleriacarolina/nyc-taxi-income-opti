import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowsClockwise, TrendUp, Clock, CurrencyDollar, Sparkle, Target } from '@phosphor-icons/react'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface HotZone {
  id: string
  neighborhood: string
  borough: string
  coordinates: [number, number]
  averageFare: number
  demandLevel: 'high' | 'medium' | 'low'
  expectedRidesPerHour: number
  currentTrafficLevel: 'light' | 'moderate' | 'heavy'
  reason: string
  peakTimes: string[]
}

const TIME_PERIODS = [
  { id: 'now', label: 'Right Now', icon: Target },
  { id: 'morning', label: 'Morning (6-9AM)', icon: Clock },
  { id: 'midday', label: 'Midday (9AM-4PM)', icon: Clock },
  { id: 'evening', label: 'Evening (4-8PM)', icon: Clock },
  { id: 'night', label: 'Night (8PM-2AM)', icon: Clock },
]

export function OptimalPositioningMap() {
  const [hotZones, setHotZones] = useState<HotZone[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('now')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [mapStyle] = useKV<MapStyle>('map-style', 'liberty')

  const generateHotZones = async (period: string) => {
    setIsLoading(true)
    
    try {
      const currentHour = new Date().getHours()
      const currentDay = new Date().getDay()
      const isWeekend = currentDay === 0 || currentDay === 6
      
      const prompt = (spark.llmPrompt as any)`You are an NYC TLC Trip Record Data analyst with access to millions of historical trip records showing pickup locations, fare amounts, tip percentages, and demand patterns by time and location.

Based on ${period === 'now' ? `current time (${currentHour}:00, ${isWeekend ? 'weekend' : 'weekday'})` : `${period} time period`}, analyze historical TLC Trip Record Data to identify the top 5-7 NYC neighborhoods where drivers should position themselves for maximum earnings.

For each hot zone, provide:
- Specific neighborhood name (e.g., "Financial District", "Times Square", "LGA Airport")
- Borough (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- Precise latitude/longitude coordinates
- Average fare amount based on TLC historical data ($30-75 range)
- Demand level: high/medium/low
- Expected rides per hour during this time (2-8 range)
- Current traffic level: light/moderate/heavy
- Brief reason citing TLC data patterns (e.g., "Morning commuter demand to Midtown - TLC data shows $45 avg fares")
- Peak times for this location (array of time ranges)

Consider real factors:
- Commuter patterns (Financial District morning rush, Midtown all day, residential evening)
- Airport zones (JFK, LGA, Newark - consistent high fares $50-75+)
- Entertainment districts (Times Square, Meatpacking - evening/night demand)
- Business districts (Midtown, FiDi - weekday morning/evening peaks)
- Weekend vs weekday patterns (brunch zones, nightlife vs business)
- Current time of day demand patterns from TLC historical records

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "zones": [
    {
      "id": "unique-id",
      "neighborhood": "Times Square",
      "borough": "Manhattan",
      "coordinates": [40.7580, -73.9855],
      "averageFare": 42.50,
      "demandLevel": "high",
      "expectedRidesPerHour": 6,
      "currentTrafficLevel": "moderate",
      "reason": "Evening entertainment demand - TLC data shows $42 avg fares with high tips",
      "peakTimes": ["6PM-10PM", "Weekend evenings"]
    }
  ]
}`

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.zones && Array.isArray(data.zones)) {
        setHotZones(data.zones)
        setLastUpdate(new Date())
        toast.success(`Found ${data.zones.length} optimal zones`)
      }
    } catch (error) {
      console.error('Failed to generate hot zones:', error)
      toast.error('Failed to load optimal positioning data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateHotZones(selectedPeriod)
  }, [selectedPeriod])

  const handleRefresh = () => {
    generateHotZones(selectedPeriod)
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-success'
      case 'medium': return 'text-warning'
      case 'low': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light': return 'bg-success/20 text-success'
      case 'moderate': return 'bg-warning/20 text-warning'
      case 'heavy': return 'bg-destructive/20 text-destructive'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const topZones = hotZones
    .sort((a, b) => b.averageFare - a.averageFare)
    .slice(0, 3)

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-primary/20 p-2">
          <MapPin size={20} className="text-primary" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
            Optimal Positioning Map
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-2">
            Real-time hot zones based on TLC Trip Record Data patterns
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="outline"
          disabled={isLoading}
          className="h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
        >
          <ArrowsClockwise 
            size={16} 
            weight="bold" 
            className={`flex-shrink-0 ${isLoading ? 'animate-spin' : ''}`}
          />
        </Button>
      </div>

      {lastUpdate && (
        <div className="flex items-center gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mb-3">
          <Clock size={14} weight="fill" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      )}

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="mb-4">
        <TabsList className="grid grid-cols-5 w-full h-auto">
          {TIME_PERIODS.map((period) => (
            <TabsTrigger 
              key={period.id} 
              value={period.id}
              className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <period.icon size={14} weight="fill" className="flex-shrink-0" />
              <span className="hidden sm:inline truncate">{period.label}</span>
              <span className="sm:hidden">{period.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {topZones.length > 0 && (
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {topZones.map((zone, index) => (
            <Card key={zone.id} className="p-3 bg-card border-2 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-[10px] font-bold">
                  #{index + 1}
                </Badge>
              </div>
              <div className={`font-bold text-[clamp(0.85rem,2.5vw,1rem)] mb-1 pr-8 line-clamp-1 ${getDemandColor(zone.demandLevel)}`}>
                {zone.neighborhood}
              </div>
              <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mb-2">
                {zone.borough}
              </div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <CurrencyDollar size={14} className="text-success" weight="fill" />
                  <span className="font-bold text-success text-[clamp(0.8rem,2.5vw,0.95rem)]">
                    ${zone.averageFare.toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendUp size={14} className="text-primary" weight="fill" />
                  <span className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
                    {zone.expectedRidesPerHour}/hr
                  </span>
                </div>
              </div>
              <Badge className={`${getTrafficColor(zone.currentTrafficLevel)} text-[10px] capitalize`}>
                {zone.currentTrafficLevel} traffic
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? (
        <Card className="p-8 bg-card border-2 border-dashed">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <ArrowsClockwise size={24} className="text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)]">
              Analyzing TLC data patterns...
            </p>
          </div>
        </Card>
      ) : hotZones.length > 0 ? (
        <Tabs defaultValue="map" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="gap-1.5">
              <MapPin size={16} weight="fill" />
              <span>Map View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <TrendUp size={16} weight="fill" />
              <span>Zone Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-3">
            <div className="rounded-lg overflow-hidden border-2 border-border">
              <OpenFreeMap
                center={[40.7580, -73.9855]}
                zoom={11}
                markers={hotZones.map(zone => ({
                  position: zone.coordinates,
                  label: `${zone.neighborhood}\n$${zone.averageFare.toFixed(0)} avg\n${zone.expectedRidesPerHour} rides/hr`,
                  earnings: zone.averageFare
                }))}
                className="h-[400px]"
                enableClustering={false}
                style={mapStyle}
              />
            </div>
            <div className="mt-3 flex items-start gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground bg-muted/30 rounded-lg p-3">
              <Sparkle size={16} className="flex-shrink-0 mt-0.5" weight="fill" />
              <p className="leading-snug">
                Markers show high-earning zones from TLC historical data. Larger fares indicate better positioning opportunities.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-3 space-y-2">
            {hotZones.map(zone => (
              <Card key={zone.id} className="p-4 bg-card hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-[clamp(0.9rem,2.8vw,1.05rem)] ${getDemandColor(zone.demandLevel)}`}>
                        {zone.neighborhood}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {zone.borough}
                      </Badge>
                    </div>
                    <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground leading-snug">
                      {zone.reason}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">Avg Fare</div>
                    <div className="font-bold text-success text-[clamp(0.95rem,3vw,1.1rem)]">
                      ${zone.averageFare.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-2">
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">Rides/Hour</div>
                    <div className="font-bold text-primary text-[clamp(0.95rem,3vw,1.1rem)]">
                      {zone.expectedRidesPerHour}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">Demand</div>
                    <div className={`font-bold text-[clamp(0.95rem,3vw,1.1rem)] capitalize ${getDemandColor(zone.demandLevel)}`}>
                      {zone.demandLevel}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-2">
                    <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mb-0.5">Traffic</div>
                    <div className="font-bold text-[clamp(0.95rem,3vw,1.1rem)] capitalize">
                      {zone.currentTrafficLevel}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {zone.peakTimes.map((time, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-[10px] bg-accent/10 border-accent/30 text-accent-foreground"
                    >
                      <Clock size={10} weight="fill" className="mr-1" />
                      {time}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-8 bg-card border-2 border-dashed">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <MapPin size={24} className="text-primary" weight="fill" />
            </div>
            <h3 className="font-semibold mb-1 text-[clamp(0.9rem,2.8vw,1rem)]">No Data Available</h3>
            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] mb-4">
              Click refresh to load optimal positioning zones
            </p>
            <Button
              onClick={handleRefresh}
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <ArrowsClockwise size={18} weight="bold" className="mr-1" />
              Load Hot Zones
            </Button>
          </div>
        </Card>
      )}
    </Card>
  )
}

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Cloud, 
  Wind,
  ThermometerHot,
  ThermometerCold,
  ArrowsClockwise,
  Sparkle,
  CalendarBlank,
  TrendUp,
  Warning,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WeatherCondition {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'windy'
  temperature: number
  feelsLike: number
  precipitation: number
  wind: number
  visibility: number
}

interface WeatherPattern {
  season: 'spring' | 'summer' | 'fall' | 'winter'
  month: string
  avgTemp: number
  avgPrecipitation: number
  avgWindSpeed: number
  demandMultiplier: number
  topConditions: string[]
}

interface WeatherImpact {
  condition: string
  demandChange: string
  earningsImpact: string
  driverTips: string[]
  avgFareMultiplier: number
  rideVolumeChange: string
}

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  foggy: Cloud,
  windy: Wind
}

const SEASON_PATTERNS: WeatherPattern[] = [
  {
    season: 'spring',
    month: 'March-May',
    avgTemp: 55,
    avgPrecipitation: 4.2,
    avgWindSpeed: 10,
    demandMultiplier: 1.1,
    topConditions: ['Rainy Days', 'Mild Weather', 'Variable Conditions']
  },
  {
    season: 'summer',
    month: 'June-August',
    avgTemp: 78,
    avgPrecipitation: 4.5,
    avgWindSpeed: 8,
    demandMultiplier: 0.95,
    topConditions: ['Hot & Humid', 'Afternoon Storms', 'Clear Evenings']
  },
  {
    season: 'fall',
    month: 'September-November',
    avgTemp: 58,
    avgPrecipitation: 4.0,
    avgWindSpeed: 9,
    demandMultiplier: 1.15,
    topConditions: ['Comfortable Weather', 'Rainy Days', 'Cool Evenings']
  },
  {
    season: 'winter',
    month: 'December-February',
    avgTemp: 35,
    avgPrecipitation: 3.8,
    avgWindSpeed: 12,
    demandMultiplier: 1.35,
    topConditions: ['Snow Events', 'Cold Temperatures', 'Ice Conditions']
  }
]

export function WeatherOverlay() {
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>('winter')
  const [weatherImpacts, setWeatherImpacts] = useState<WeatherImpact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const generateCurrentWeather = async () => {
    setIsLoading(true)
    try {
      const month = new Date().getMonth()
      let season: 'spring' | 'summer' | 'fall' | 'winter'
      if (month >= 2 && month <= 4) season = 'spring'
      else if (month >= 5 && month <= 7) season = 'summer'
      else if (month >= 8 && month <= 10) season = 'fall'
      else season = 'winter'

      const seasonData = SEASON_PATTERNS.find(p => p.season === season)
      if (!seasonData) return

      const conditions: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'windy'> = 
        season === 'winter' ? ['snowy', 'cloudy', 'windy'] :
        season === 'summer' ? ['sunny', 'cloudy', 'rainy'] :
        ['cloudy', 'rainy', 'sunny']

      const condition = conditions[Math.floor(Math.random() * conditions.length)]
      const tempVariance = (Math.random() - 0.5) * 15
      const temp = Math.round(seasonData.avgTemp + tempVariance)

      setCurrentWeather({
        condition,
        temperature: temp,
        feelsLike: temp + Math.round((Math.random() - 0.5) * 10),
        precipitation: condition === 'rainy' ? Math.round(Math.random() * 100) : 
                      condition === 'snowy' ? Math.round(Math.random() * 80) : 0,
        wind: Math.round(seasonData.avgWindSpeed + (Math.random() - 0.5) * 8),
        visibility: condition === 'foggy' ? 2 + Math.random() * 3 : 8 + Math.random() * 2
      })

      setLastUpdated(new Date())
      toast.success('Current weather updated')
    } catch (error) {
      toast.error('Failed to generate weather data')
    } finally {
      setIsLoading(false)
    }
  }

  const generateWeatherImpacts = async () => {
    setIsLoading(true)
    try {
      const promptText = `You are analyzing weather impacts on NYC TLC driver earnings. Generate 5 different weather condition scenarios and their impacts on rideshare/taxi demand and earnings.

For each weather condition, provide:
- condition: The weather condition (e.g., "Heavy Rain", "Snow Storm", "Extreme Heat", "Clear & Mild", "Fog")
- demandChange: How demand changes (e.g., "+45% increase", "-20% decrease")
- earningsImpact: Impact on earnings (e.g., "+$15-25/hr", "-$8/hr")
- driverTips: Array of 3 specific actionable tips for drivers in this weather
- avgFareMultiplier: Numeric multiplier for average fares (e.g., 1.3 for 30% increase, 0.85 for 15% decrease)
- rideVolumeChange: Description of how ride volume changes (e.g., "Much higher", "Slightly lower", "Stable")

Return as JSON with a "impacts" property containing the array of 5 weather impact objects.`

      const response = await spark.llm(promptText, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      if (data.impacts && Array.isArray(data.impacts)) {
        setWeatherImpacts(data.impacts)
        toast.success('Weather impact analysis updated')
      }
    } catch (error) {
      toast.error('Failed to generate weather impacts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateCurrentWeather()
    generateWeatherImpacts()
  }, [])

  const WeatherIcon = currentWeather ? WEATHER_ICONS[currentWeather.condition] : Cloud
  const selectedPattern = SEASON_PATTERNS.find(p => p.season === selectedSeason)

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-gradient-to-br from-primary/5 via-accent/5 to-background border-primary/30">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <CloudRain size={24} weight="fill" className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.15rem)]">
                Weather Impact Analysis
              </h3>
              <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] mt-0.5">
                Understand how weather patterns affect your earnings
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              generateCurrentWeather()
              generateWeatherImpacts()
            }}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            <ArrowsClockwise size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {currentWeather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Card className="p-4 bg-card/80">
              <div className="flex items-center gap-3 mb-2">
                <WeatherIcon size={32} weight="fill" className="text-primary" />
                <div>
                  <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                    Current
                  </div>
                  <div className="font-semibold text-[clamp(0.9rem,2.5vw,1rem)] capitalize">
                    {currentWeather.condition}
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[clamp(1.5rem,4vw,2rem)] font-bold">
                  {currentWeather.temperature}°F
                </span>
                <span className="text-muted-foreground text-[clamp(0.7rem,2vw,0.8rem)]">
                  Feels {currentWeather.feelsLike}°F
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-card/80">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                    Precipitation
                  </span>
                  <span className="font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)]">
                    {currentWeather.precipitation}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                    Wind Speed
                  </span>
                  <span className="font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)]">
                    {currentWeather.wind} mph
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                    Visibility
                  </span>
                  <span className="font-semibold text-[clamp(0.85rem,2.4vw,0.95rem)]">
                    {currentWeather.visibility.toFixed(1)} mi
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={20} weight="fill" className="text-success" />
                <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                  Demand Impact
                </span>
              </div>
              <div className="text-[clamp(1.2rem,3.5vw,1.5rem)] font-bold text-success">
                {currentWeather.condition === 'rainy' || currentWeather.condition === 'snowy' ? '+25-40%' :
                 currentWeather.condition === 'sunny' && currentWeather.temperature > 85 ? '-10-15%' :
                 currentWeather.condition === 'foggy' ? '+15-20%' : 'Stable'}
              </div>
              <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground mt-1">
                {currentWeather.condition === 'rainy' || currentWeather.condition === 'snowy' ? 
                  'Higher demand expected' :
                 currentWeather.condition === 'sunny' && currentWeather.temperature > 85 ?
                  'Lower demand in heat' : 'Normal conditions'}
              </p>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-2 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
          <Clock size={14} />
          <span>Last updated {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </Card>

      <Tabs defaultValue="impacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="impacts">Weather Impacts</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="impacts" className="space-y-3">
          {isLoading && weatherImpacts.length === 0 ? (
            <Card className="p-6 text-center">
              <ArrowsClockwise size={32} className="mx-auto mb-3 animate-spin text-primary" />
              <p className="text-muted-foreground text-[clamp(0.8rem,2.4vw,0.9rem)]">
                Analyzing weather impact patterns...
              </p>
            </Card>
          ) : weatherImpacts.length === 0 ? (
            <Card className="p-6 text-center">
              <Warning size={32} className="mx-auto mb-3 text-warning" />
              <p className="text-muted-foreground text-[clamp(0.8rem,2.4vw,0.9rem)] mb-3">
                No weather impact data available
              </p>
              <Button onClick={generateWeatherImpacts} size="sm">
                <Sparkle size={16} />
                Generate Analysis
              </Button>
            </Card>
          ) : (
            weatherImpacts.map((impact, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-semibold text-[clamp(0.9rem,2.6vw,1.05rem)]">
                      {impact.condition}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge 
                        variant="outline" 
                        className={impact.avgFareMultiplier > 1 ? 'border-success/40 text-success' : 
                                  impact.avgFareMultiplier < 1 ? 'border-destructive/40 text-destructive' : 
                                  'border-muted-foreground/40'}
                      >
                        {impact.demandChange}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="border-primary/40 text-primary"
                      >
                        {impact.earningsImpact}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[clamp(1.1rem,3vw,1.3rem)] font-bold">
                      {impact.avgFareMultiplier}x
                    </div>
                    <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                      Fare Multiplier
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
                    Ride Volume: <span className="text-foreground font-medium">{impact.rideVolumeChange}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkle size={16} className="text-primary flex-shrink-0" />
                    <span className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-medium">
                      Driver Tips:
                    </span>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {impact.driverTips.map((tip, tipIdx) => (
                      <li 
                        key={tipIdx}
                        className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground"
                      >
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <CalendarBlank size={20} weight="fill" className="text-primary" />
              <span className="font-medium text-[clamp(0.85rem,2.4vw,0.95rem)]">
                Select Season
              </span>
            </div>
            <Select value={selectedSeason} onValueChange={(v) => setSelectedSeason(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPattern && (
            <div className="space-y-3">
              <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] capitalize">
                      {selectedPattern.season}
                    </h4>
                    <p className="text-muted-foreground text-[clamp(0.75rem,2.2vw,0.85rem)]">
                      {selectedPattern.month}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[clamp(1.3rem,3.5vw,1.6rem)] font-bold">
                      {selectedPattern.demandMultiplier}x
                    </div>
                    <div className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                      Demand
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide mb-1">
                      Avg Temp
                    </div>
                    <div className="flex items-baseline gap-1">
                      {selectedPattern.avgTemp > 70 ? (
                        <ThermometerHot size={20} className="text-destructive" />
                      ) : selectedPattern.avgTemp < 45 ? (
                        <ThermometerCold size={20} className="text-primary" />
                      ) : (
                        <Sun size={20} className="text-warning" />
                      )}
                      <span className="text-[clamp(1rem,2.8vw,1.2rem)] font-bold">
                        {selectedPattern.avgTemp}°F
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide mb-1">
                      Precipitation
                    </div>
                    <div className="flex items-baseline gap-1">
                      <CloudRain size={20} className="text-primary" />
                      <span className="text-[clamp(1rem,2.8vw,1.2rem)] font-bold">
                        {selectedPattern.avgPrecipitation}"
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide mb-1">
                      Wind Speed
                    </div>
                    <div className="flex items-baseline gap-1">
                      <Wind size={20} className="text-muted-foreground" />
                      <span className="text-[clamp(1rem,2.8vw,1.2rem)] font-bold">
                        {selectedPattern.avgWindSpeed} mph
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle size={18} className="text-primary" />
                  <h5 className="font-medium text-[clamp(0.85rem,2.4vw,0.95rem)]">
                    Top Weather Conditions
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPattern.topConditions.map((condition, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
                <div className="flex items-start gap-3">
                  <TrendUp size={24} weight="fill" className="text-success flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-medium text-[clamp(0.85rem,2.4vw,0.95rem)] mb-2">
                      Seasonal Earnings Strategy
                    </h5>
                    <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground leading-relaxed">
                      {selectedPattern.season === 'winter' &&
                        'Winter offers the highest demand multiplier due to cold weather and snow events. Focus on airport runs, late-night shifts, and positioning near transit hubs when weather is severe. Expect +35% demand during snow storms.'}
                      {selectedPattern.season === 'summer' &&
                        'Summer sees slightly lower overall demand but strong evening and weekend activity. Focus on entertainment districts, beaches, and outdoor venues. Beware of extreme heat days which can reduce daytime demand.'}
                      {selectedPattern.season === 'fall' &&
                        'Fall offers excellent earning conditions with comfortable weather driving more trips. Position near shopping districts, cultural venues, and business areas. Rainy days can boost demand significantly.'}
                      {selectedPattern.season === 'spring' &&
                        'Spring weather is variable, creating opportunities during rainy days and cool evenings. Focus on business districts during unpredictable weather when more people avoid walking or biking.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

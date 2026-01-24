import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  CloudRain, 
  CloudSnow, 
  Sun, 
  ThermometerHot, 
  Wind,
  ArrowsClockwise,
  Sparkle,
  TrendUp,
  TrendDown,
  CalendarBlank,
  CurrencyDollar,
  Lightbulb
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface WeatherPattern {
  weatherType: string
  icon: string
  avgEarnings: number
  avgHourlyRate: number
  totalDays: number
  bestDay: string
  worstDay: string
  earningsRange: { min: number; max: number }
  demandMultiplier: number
  tips: string[]
  monthlyBreakdown: { month: string; avgEarnings: number; days: number }[]
}

interface DayPerformance {
  date: string
  dayOfWeek: string
  earnings: number
  hours: number
  hourlyRate: number
  trips: number
  weatherType: string
}

export function HistoricalWeatherPatterns() {
  const [weatherPatterns, setWeatherPatterns] = useKV<WeatherPattern[]>('weather-patterns', [])
  const [topDays, setTopDays] = useKV<DayPerformance[]>('top-weather-days', [])
  const [loading, setLoading] = useState(false)
  const [activeWeather, setActiveWeather] = useState<string>('all')

  const generateWeatherPatterns = async () => {
    setLoading(true)
    try {
      const promptText = `You are analyzing historical weather patterns and their impact on NYC TLC driver earnings. Generate comprehensive historical weather pattern analysis showing how different weather conditions affect driver earnings.

Generate 6 weather patterns with realistic NYC data:
1. Heavy Rain - High demand, surge pricing
2. Snow Storm - Very high demand, premium fares
3. Clear & Mild - Normal demand, baseline earnings
4. Extreme Heat - Reduced demand, shorter trips
5. Light Rain - Moderate demand boost
6. Fog/Overcast - Slight demand increase

For each pattern, provide:
- weatherType: descriptive name
- icon: one of (CloudRain, CloudSnow, Sun, ThermometerHot, Wind, Cloud)
- avgEarnings: average daily earnings for this weather (range $180-$450)
- avgHourlyRate: average hourly rate (range $25-$55)
- totalDays: number of historical days tracked (range 15-60)
- bestDay: day of week that performs best in this weather
- worstDay: day of week that performs worst
- earningsRange: {min, max} showing earnings spread
- demandMultiplier: 0.85-1.45 based on weather impact
- tips: array of 3 specific actionable driver strategies for this weather
- monthlyBreakdown: array of 4-6 months showing avgEarnings and days count

Also generate 10 top performing days showing:
- date: YYYY-MM-DD format (within last 6 months)
- dayOfWeek: full day name
- earnings: daily total ($200-$500)
- hours: 6-12 hours worked
- hourlyRate: calculated rate
- trips: 8-20 trips
- weatherType: match to one of the 6 weather types above

Return as JSON: {
  patterns: [WeatherPattern...],
  topDays: [DayPerformance...]
}`

      const response = await spark.llm(promptText, 'gpt-4o', true)
      const data = JSON.parse(response)
      
      setWeatherPatterns(data.patterns || [])
      setTopDays(data.topDays || [])
    } catch (error) {
      console.error('Failed to generate weather patterns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      CloudRain: CloudRain,
      CloudSnow: CloudSnow,
      Sun: Sun,
      ThermometerHot: ThermometerHot,
      Wind: Wind,
      Cloud: Wind
    }
    const IconComponent = icons[iconName] || Sun
    return <IconComponent size={32} weight="fill" />
  }

  const filteredPatterns = activeWeather === 'all' 
    ? weatherPatterns 
    : weatherPatterns?.filter(p => p.weatherType.toLowerCase().includes(activeWeather.toLowerCase())) || []

  const filteredTopDays = activeWeather === 'all'
    ? topDays
    : topDays?.filter(d => d.weatherType.toLowerCase().includes(activeWeather.toLowerCase())) || []

  const getBestWeatherType = () => {
    if (!weatherPatterns || weatherPatterns.length === 0) return null
    return weatherPatterns.reduce((best, current) => 
      current.avgEarnings > best.avgEarnings ? current : best
    )
  }

  const getWorstWeatherType = () => {
    if (!weatherPatterns || weatherPatterns.length === 0) return null
    return weatherPatterns.reduce((worst, current) => 
      current.avgEarnings < worst.avgEarnings ? current : worst
    )
  }

  const bestWeather = getBestWeatherType()
  const worstWeather = getWorstWeatherType()

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-success/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarBlank size={24} weight="fill" className="text-primary" />
                <CardTitle className="text-2xl">Historical Weather Patterns</CardTitle>
              </div>
              <CardDescription className="text-base">
                Analyze how different weather conditions have impacted your earnings over time
              </CardDescription>
            </div>
            <Button 
              onClick={generateWeatherPatterns}
              disabled={loading}
              className="gap-2"
            >
              <ArrowsClockwise 
                size={16} 
                weight="bold"
                className={cn(loading && "animate-spin")}
              />
              {loading ? 'Analyzing...' : (weatherPatterns && weatherPatterns.length > 0) ? 'Refresh' : 'Generate'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {!weatherPatterns || weatherPatterns.length === 0 ? (
        <Alert>
          <Sparkle className="h-4 w-4" />
          <AlertDescription>
            Click "Generate" to analyze historical weather patterns and discover which conditions drive your best earnings
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {bestWeather && worstWeather && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-success/50 bg-success/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendUp size={20} weight="fill" className="text-success" />
                    <CardTitle className="text-lg">Best Weather for Earnings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-success">
                      {getWeatherIcon(bestWeather.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{bestWeather.weatherType}</p>
                      <p className="text-sm text-muted-foreground">{bestWeather.totalDays} days tracked</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-3xl font-bold text-success">
                      ${bestWeather.avgEarnings.toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Average daily earnings</p>
                  </div>
                  <Badge variant="outline" className="border-success text-success">
                    {bestWeather.demandMultiplier}x demand multiplier
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-warning/50 bg-warning/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendDown size={20} weight="fill" className="text-warning" />
                    <CardTitle className="text-lg">Lowest Earning Weather</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-warning">
                      {getWeatherIcon(worstWeather.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{worstWeather.weatherType}</p>
                      <p className="text-sm text-muted-foreground">{worstWeather.totalDays} days tracked</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-3xl font-bold text-warning">
                      ${worstWeather.avgEarnings.toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Average daily earnings</p>
                  </div>
                  <Badge variant="outline" className="border-warning text-warning">
                    {worstWeather.demandMultiplier}x demand multiplier
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs value={activeWeather} onValueChange={setActiveWeather}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Weather</TabsTrigger>
              <TabsTrigger value="rain">Rain</TabsTrigger>
              <TabsTrigger value="snow">Snow</TabsTrigger>
              <TabsTrigger value="clear">Clear</TabsTrigger>
            </TabsList>

            <TabsContent value={activeWeather} className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkle size={20} weight="fill" className="text-primary" />
                  Weather Pattern Analysis
                </h3>
                <div className="grid gap-4">
                  {filteredPatterns && filteredPatterns.map((pattern, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-primary">
                              {getWeatherIcon(pattern.icon)}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{pattern.weatherType}</CardTitle>
                              <CardDescription>
                                {pattern.totalDays} days tracked • {pattern.demandMultiplier}x demand
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Avg Daily Earnings</p>
                            <p className="text-2xl font-bold text-primary">
                              ${pattern.avgEarnings.toFixed(0)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Avg Hourly Rate</p>
                            <p className="text-2xl font-bold">
                              ${pattern.avgHourlyRate.toFixed(0)}/hr
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Earnings Range</p>
                            <p className="text-lg font-semibold">
                              ${pattern.earningsRange.min} - ${pattern.earningsRange.max}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Day Performance</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendUp size={16} weight="fill" className="text-success" />
                              <span className="text-muted-foreground">Best:</span>
                              <Badge variant="outline" className="border-success text-success">
                                {pattern.bestDay}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendDown size={16} weight="fill" className="text-muted-foreground" />
                              <span className="text-muted-foreground">Worst:</span>
                              <Badge variant="outline">
                                {pattern.worstDay}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb size={16} weight="fill" className="text-accent" />
                            <p className="text-sm font-medium">Driver Strategies</p>
                          </div>
                          <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {pattern.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-accent mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm font-medium">Monthly Performance</p>
                          <div className="space-y-2">
                            {pattern.monthlyBreakdown.map((month, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{month.month}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">{month.days} days</span>
                                    <span className="font-semibold">${month.avgEarnings.toFixed(0)}</span>
                                  </div>
                                </div>
                                <Progress 
                                  value={(month.avgEarnings / pattern.earningsRange.max) * 100}
                                  className="h-2"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CurrencyDollar size={20} weight="fill" className="text-success" />
                  Top Earning Days by Weather
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredTopDays && filteredTopDays.slice(0, 10).map((day, index) => (
                        <div 
                          key={index}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                                index === 0 && "bg-success/20 text-success",
                                index === 1 && "bg-primary/20 text-primary",
                                index === 2 && "bg-accent/20 text-accent",
                                index > 2 && "bg-muted text-muted-foreground"
                              )}>
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold">{day.dayOfWeek}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {day.weatherType}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(day.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xl font-bold text-success">
                                ${day.earnings.toFixed(0)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                ${day.hourlyRate.toFixed(0)}/hr • {day.trips} trips
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

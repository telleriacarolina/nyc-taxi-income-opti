import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  TrendUp, 
  TrendDown,
  MapTrifold,
  CurrencyDollar,
  ArrowsClockwise,
  ChartBar,
  CalendarBlank
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TimeSlotPattern {
  timeSlot: string
  startHour: number
  endHour: number
  avgSpeed: number
  congestionLevel: 'low' | 'moderate' | 'high' | 'severe'
  avgTripTime: number
  estimatedEarnings: number
  hotZones: string[]
  tripVolume: number
  recommendation: string
}

interface DayTypePattern {
  dayType: string
  patterns: TimeSlotPattern[]
  peakEarningsTime: string
  worstTrafficTime: string
}

const CONGESTION_COLORS = {
  'low': 'text-success bg-success/10 border-success/30',
  'moderate': 'text-warning bg-warning/10 border-warning/30',
  'high': 'text-destructive/70 bg-destructive/10 border-destructive/30',
  'severe': 'text-destructive bg-destructive/15 border-destructive/40'
}

const TIME_SLOTS = [
  { label: 'Early Morning', hours: '5AM-9AM', icon: '🌅' },
  { label: 'Midday', hours: '9AM-4PM', icon: '☀️' },
  { label: 'Evening Rush', hours: '4PM-8PM', icon: '🌆' },
  { label: 'Night', hours: '8PM-2AM', icon: '🌙' },
  { label: 'Late Night', hours: '2AM-5AM', icon: '🌃' }
]

export function TrafficPatternComparison() {
  const [dayType, setDayType] = useState<'weekday' | 'weekend'>('weekday')
  const [patterns, setPatterns] = useState<TimeSlotPattern[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchTrafficPatterns = async () => {
    setIsLoading(true)
    try {
      const prompt = spark.llmPrompt`You are a New York City traffic, demand, and earnings optimization analyst specializing in TLC drivers (Uber, Lyft, Yellow Taxi, and multi-app drivers).

Your mission is to maximize driver earnings while minimizing wasted time, congestion exposure, and fatigue, using real NYC traffic behavior, rider demand, and app dynamics.

Generate realistic NYC traffic and earnings patterns for
${dayType === ‘weekday’ ? ‘weekdays’ : ‘weekends’}.

User-Configurable Tuning Parameters

1. Rideshare App Focus

${appPreference}:
	•	"uber" → surge-heavy, longer trips, airport bias
	•	"lyft" → steady volume, residential demand, bonuses
	•	"taxi" → Manhattan core, short trips, street hails
	•	"multi" → dynamic switching for best earnings


2. Airport Optimization

${airportMode}:
	•	"none" → avoid airport queues
	•	"balanced" → airports only during high ROI windows
	•	"aggressive" → prioritize JFK, LGA, EWR runs and queues

Adjust:
	•	Earnings
	•	Trip duration
	•	Hot zones
	•	Strategy text

3. Borough Preference

${boroughPreference}:
	•	"all"
	•	"manhattan"
	•	"brooklyn"
	•	"queens"
	•	"bronx"
	•	"staten_island"

Favor borough-specific:
	•	Demand
	•	Traffic flow
	•	Neighborhood hotspots

4. Weather Impact Modeling

${weatherCondition}:
	•	"clear"
	•	"rain"
	•	"snow"
	•	"extreme"

Weather effects:
	•	Rain/snow → higher demand, lower speeds, higher surge
	•	Extreme weather → reduced supply, higher earnings but slower trips


5. Driver Fatigue & Shift Strategy

${shiftLengthHours} (e.g., 6, 8, 10, 12)

Use this to:
	•	Reduce earnings efficiency after long shifts
	•	Recommend breaks or repositioning
	•	Optimize when to stop driving

 Analyze 5 NYC Time Slots
	1.	Early Morning (5AM–9AM) — Commute + airports
	2.	Midday (9AM–4PM) — Tourism, errands, light traffic
	3.	Evening Rush (4PM–8PM) — Commute congestion
	4.	Night (8PM–2AM) — Dining, nightlife, events
	5.	Late Night (2AM–5AM) — Bar close, airports, low supply


 For EACH Time Slot, Return
	•	timeSlot
	•	startHour
	•	endHour
	•	avgSpeed (mph, NYC-realistic: 15–45)
	•	congestionLevel: "low" | "moderate" | "high" | "severe"
	•	avgTripTime (minutes: 10–35)
	•	estimatedEarnings (hourly: $25–$65)
	•	surgeProbability (0–1 realistic likelihood)
	•	tripVolume (1–6 trips/hour)
	•	hotZones (3 specific NYC neighborhoods or hubs)
	•	repositionTip (1 sentence where to move next)
	•	recommendation
	•	2–3 actionable sentences including:
	•	Where to wait
	•	What trips to accept/avoid
	•	App + borough + airport logic

 Daily & Weekly Forecast

After the 5 time slots, calculate:
	•	estimatedDailyEarnings
	•	estimatedWeeklyEarnings (5–6 driving days)
	•	bestEarningTimeSlot
	•	highestRiskTimeSlot (low ROI / heavy congestion)
	•	overallStrategySummary (2–3 sentences)

Target modeling:
	•	$300/day achievable on strong days
	•	Average profitable trips: $35–$50
	•	Congestion reduces efficiency even during high demand

 Behavior Rules
	•	Weekdays → commuter-heavy, sharp rush hours
	•	Weekends → leisure-heavy, late starts, nightlife surge
	•	Reflect real NYC choke points (Midtown, bridges, tunnels)
	•	Balance demand vs supply realistically

 Output Rules
	•	Return ONLY valid JSON
	•	One top-level object
	•	Required keys:
	•	"patterns" (array of 5 objects)
	•	"dailyForecast"
	•	No markdown
	•	No comments
	•	No extra text`

      const result = await spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(result)
      
      if (data.patterns && Array.isArray(data.patterns)) {
        setPatterns(data.patterns)
        setLastUpdate(new Date())
        toast.success('Traffic patterns updated')
      }
    } catch (error) {
      console.error('Error fetching traffic patterns:', error)
      toast.error('Failed to load traffic patterns')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrafficPatterns()
  }, [dayType])

  const getBestTimeSlot = () => {
    if (patterns.length === 0) return null
    return patterns.reduce((best, current) => 
      current.estimatedEarnings > best.estimatedEarnings ? current : best
    )
  }

  const getWorstCongestion = () => {
    if (patterns.length === 0) return null
    const congestionScores = { low: 1, moderate: 2, high: 3, severe: 4 }
    return patterns.reduce((worst, current) => 
      congestionScores[current.congestionLevel] > congestionScores[worst.congestionLevel] ? current : worst
    )
  }

  const bestTime = getBestTimeSlot()
  const worstCongestion = getWorstCongestion()

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="text-primary" size={20} weight="fill" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)]">
                Traffic Patterns by Time of Day
              </h3>
            </div>
            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)]">
              Compare traffic & earnings across different times
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchTrafficPatterns}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            <ArrowsClockwise 
              size={16} 
              className={isLoading ? 'animate-spin' : ''} 
            />
          </Button>
        </div>

        <Tabs value={dayType} onValueChange={(v) => setDayType(v as 'weekday' | 'weekend')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekday" className="gap-1 text-[clamp(0.7rem,2vw,0.85rem)]">
              <CalendarBlank size={16} weight="fill" />
              Weekday
            </TabsTrigger>
            <TabsTrigger value="weekend" className="gap-1 text-[clamp(0.7rem,2vw,0.85rem)]">
              <CalendarBlank size={16} weight="fill" />
              Weekend
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {lastUpdate && (
          <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
            Updated {lastUpdate.toLocaleTimeString()}
          </p>
        )}

        {patterns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bestTime && (
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendUp size={16} className="text-success" weight="bold" />
                  <span className="text-[clamp(0.7rem,2vw,0.8rem)] font-medium text-success">
                    Best Earnings
                  </span>
                </div>
                <p className="text-[clamp(0.9rem,2.5vw,1.1rem)] font-bold">
                  {bestTime.timeSlot}
                </p>
                <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                  ${bestTime.estimatedEarnings}/hr avg
                </p>
              </div>
            )}

            {worstCongestion && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendDown size={16} className="text-destructive" weight="bold" />
                  <span className="text-[clamp(0.7rem,2vw,0.8rem)] font-medium text-destructive">
                    Heaviest Traffic
                  </span>
                </div>
                <p className="text-[clamp(0.9rem,2.5vw,1.1rem)] font-bold">
                  {worstCongestion.timeSlot}
                </p>
                <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                  {worstCongestion.avgSpeed} mph avg speed
                </p>
              </div>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <Card key={pattern.timeSlot} className="p-4 border-l-4 hover:shadow-md transition-shadow" style={{
                borderLeftColor: pattern.congestionLevel === 'severe' ? 'oklch(0.55 0.22 25)' :
                                 pattern.congestionLevel === 'high' ? 'oklch(0.70 0.15 50)' :
                                 pattern.congestionLevel === 'moderate' ? 'oklch(0.70 0.15 50)' :
                                 'oklch(0.65 0.15 145)'
              }}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{TIME_SLOTS[index]?.icon || '⏰'}</span>
                        <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,1rem)]">
                          {pattern.timeSlot}
                        </h4>
                      </div>
                      <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                        {pattern.startHour === 0 ? '12' : pattern.startHour > 12 ? pattern.startHour - 12 : pattern.startHour}
                        {pattern.startHour >= 12 ? 'PM' : 'AM'} - 
                        {pattern.endHour === 0 ? '12' : pattern.endHour > 12 ? pattern.endHour - 12 : pattern.endHour}
                        {pattern.endHour >= 12 ? 'PM' : 'AM'}
                      </p>
                    </div>
                    <Badge className={CONGESTION_COLORS[pattern.congestionLevel]}>
                      {pattern.congestionLevel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <CurrencyDollar size={14} className="text-success" weight="bold" />
                        <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                          Earnings
                        </span>
                      </div>
                      <p className="text-[clamp(0.8rem,2.2vw,0.95rem)] font-bold text-success">
                        ${pattern.estimatedEarnings}/hr
                      </p>
                    </div>

                    <div className="p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <ChartBar size={14} className="text-primary" weight="fill" />
                        <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                          Speed
                        </span>
                      </div>
                      <p className="text-[clamp(0.8rem,2.2vw,0.95rem)] font-bold">
                        {pattern.avgSpeed} mph
                      </p>
                    </div>

                    <div className="p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={14} className="text-primary" weight="fill" />
                        <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                          Trip Time
                        </span>
                      </div>
                      <p className="text-[clamp(0.8rem,2.2vw,0.95rem)] font-bold">
                        {pattern.avgTripTime} min
                      </p>
                    </div>

                    <div className="p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <MapTrifold size={14} className="text-primary" weight="fill" />
                        <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">
                          Trips/hr
                        </span>
                      </div>
                      <p className="text-[clamp(0.8rem,2.2vw,0.95rem)] font-bold">
                        {pattern.tripVolume}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-2 mb-2">
                      <MapTrifold size={16} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[clamp(0.7rem,2vw,0.75rem)] font-medium mb-1">
                          Hot Zones
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pattern.hotZones.map((zone) => (
                            <Badge key={zone} variant="secondary" className="text-[clamp(0.65rem,1.8vw,0.7rem)]">
                              {zone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[clamp(0.7rem,2vw,0.8rem)] leading-snug text-foreground/90">
                      {pattern.recommendation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

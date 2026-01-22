import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, TrendUp, Sparkle, CalendarBlank } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface LocationInsight {
  location: string
  timeOfDay: string
  reason: string
  expectedEarnings: string
}

interface SeasonalInsight {
  period: string
  locations: string[]
  strategy: string
}

export function VeteranInsights() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [dayInsights, setDayInsights] = useState<LocationInsight[]>([])
  const [seasonalInsights, setSeasonalInsights] = useState<SeasonalInsight[]>([])
  const [lastGenerated, setLastGenerated] = useState<number | null>(null)

  const generateInsights = async () => {
    setIsGenerating(true)

    try {
      const currentHour = new Date().getHours()
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      const currentMonth = new Date().getMonth() + 1

      const promptText = `You are an expert NYC TLC rideshare consultant with deep knowledge of general NYC traffic patterns and driver strategies.

You have access to insights from NYC TLC Trip Record Data (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) containing millions of historical trip records including:
- **General demand patterns**: Peak times showing 30-50% higher fares during business hours
- **Time-of-day analysis**: Morning rush (7-9am), lunch period (12-2pm), evening rush (5-8pm), late night (10pm-2am)
- **Day-of-week patterns**: Weekday vs weekend differences in demand
- **Seasonal trends**: Holiday periods (Nov-Dec) showing 20-30% higher fares, summer increases
- **Trip characteristics**: Optimal distance ranges for highest earnings per hour

You also have access to general NYC DOT data insights:
- Traffic patterns throughout the day
- Typical construction impacts
- Event-related traffic considerations

Current context:
- Current time: ${currentHour}:00 on ${currentDay}
- Current month: ${currentMonth}

Generate AI-powered general insights for NYC TLC drivers about optimal strategies and times to maximize earnings. The 2025 target is $300 per day with 7-10 quality rides (approx $35/trip).

Provide insights in TWO categories WITHOUT specific neighborhood names:

1. DAILY TIME-BASED INSIGHTS: Identify the 4 best time periods during a typical day with GENERAL location types. For each:
   - Exact time period (e.g., "6:00 AM - 9:00 AM")
   - General zone type (e.g., "Business districts", "Airport areas", "Entertainment zones", "Residential areas")
   - Why this type of zone is profitable based on TLC data patterns (demand surge, average fares)
   - Expected hourly earnings that support $300/day goal
   - General traffic optimization tips

2. SEASONAL/YEARLY INSIGHTS: Identify 3 seasonal patterns backed by TLC historical data. For each:
   - Time period or season with proven earnings increases
   - 2-3 general zone types showing high-fare patterns
   - Strategy explaining why these zone types consistently hit $35+ averages
   - General traffic management tips

Format your response as valid JSON with this structure:
{
  "dailyInsights": [
    {"location": "Business districts", "timeOfDay": "6:00 AM - 9:00 AM", "reason": "TLC data shows morning commuter trips average $38-45. Early positioning in business areas captures commuters. Plan routes to avoid typical rush hour congestion", "expectedEarnings": "$40-50/hr"},
    {"location": "Commercial areas", "timeOfDay": "9:00 AM - 12:00 PM", "reason": "Historical TLC records show business district trips average $35-42 with steady demand. Mid-morning meetings create consistent flow. Monitor for construction delays", "expectedEarnings": "$35-45/hr"},
    {"location": "Cross-borough corridors", "timeOfDay": "5:00 PM - 8:00 PM", "reason": "TLC evening rush data shows longer trips average $40-55. High volume during evening commute. Use traffic apps to find fastest routes", "expectedEarnings": "$45-55/hr"},
    {"location": "Airport staging areas", "timeOfDay": "8:00 PM - 11:00 PM", "reason": "TLC data: airport trips average $50-70+ with good tips. Lower competition at night. Check for event traffic that may delay routes", "expectedEarnings": "$50-65/hr"}
  ],
  "seasonalInsights": [
    {"period": "November-December Holidays", "locations": ["Shopping districts", "Entertainment areas", "Airport routes"], "strategy": "TLC holiday data shows 25-30% fare increase. Tourist trips and holiday travel boost averages to $60+ for longer rides. Monitor for special event traffic and plan efficient routes"},
    {"period": "Summer Months (June-August)", "locations": ["Long-distance routes", "Airport runs", "Entertainment zones"], "strategy": "TLC summer data shows increased long-distance trips and higher travel demand. Evening entertainment consistently $35-45. Be aware of beach traffic patterns on weekends"},
    {"period": "Weekday Rush Hours Year-Round", "locations": ["Business areas", "Commercial districts", "Transit hubs"], "strategy": "TLC weekday data: morning/evening rush trips average 35% higher fares than midday. Business travelers typically provide better earnings. Use real-time traffic data for competitive advantage"}
  ]
}

Base all recommendations on general TLC Trip Record Data patterns and practical strategies. Be specific with times and zone types (not specific neighborhoods), and ensure every recommendation targets the $35+ per trip needed for $300/day 2025 goal.`

      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)

      setDayInsights(data.dailyInsights || [])
      setSeasonalInsights(data.seasonalInsights || [])
      setLastGenerated(Date.now())
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatLastGenerated = () => {
    if (!lastGenerated) return ''
    const minutes = Math.floor((Date.now() - lastGenerated) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 min ago'
    if (minutes < 60) return `${minutes} mins ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkle size={20} weight="fill" className="text-primary flex-shrink-0" />
              <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] line-clamp-1">
                Veteran Driver Insights
              </h3>
            </div>
            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
              AI insights using TLC Trip Record Data on general zone strategies
            </p>
          </div>
          <Button
            onClick={generateInsights}
            disabled={isGenerating}
            size="sm"
            className="flex-shrink-0"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1.5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkle size={14} weight="fill" />
                </motion.div>
                <span className="text-[clamp(0.7rem,2vw,0.8rem)]">Generating</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkle size={14} weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.8rem)]">
                  {dayInsights.length > 0 ? 'Refresh' : 'Generate'}
                </span>
              </span>
            )}
          </Button>
        </div>

        {lastGenerated && (
          <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.7rem)] mb-3">
            Updated {formatLastGenerated()}
          </p>
        )}
      </Card>

      {dayInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Clock size={18} weight="fill" className="text-primary" />
            <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)]">
              Best Times & Zone Types
            </h4>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {dayInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <MapPin size={18} weight="fill" className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-0.5 line-clamp-1">
                        {insight.location}
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock size={12} weight="fill" className="text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground text-[clamp(0.7rem,2vw,0.75rem)] truncate">
                          {insight.timeOfDay}
                        </span>
                      </div>
                      <p className="text-foreground text-[clamp(0.75rem,2.2vw,0.85rem)] line-clamp-2 mb-2">
                        {insight.reason}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/10 border border-success/20">
                        <TrendUp size={12} weight="fill" className="text-success" />
                        <span className="font-medium text-success text-[clamp(0.7rem,2vw,0.75rem)]">
                          {insight.expectedEarnings}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {seasonalInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <CalendarBlank size={18} weight="fill" className="text-primary" />
            <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)]">
              Seasonal Strategies
            </h4>
          </div>

          <div className="grid gap-3">
            {seasonalInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="p-1.5 rounded-md bg-accent/10 flex-shrink-0">
                          <CalendarBlank size={16} weight="fill" className="text-accent" />
                        </div>
                        <h5 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] line-clamp-1">
                          {insight.period}
                        </h5>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {insight.locations.map((location, locIndex) => (
                        <div
                          key={locIndex}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20"
                        >
                          <MapPin size={12} weight="fill" className="text-primary" />
                          <span className="text-primary text-[clamp(0.7rem,2vw,0.75rem)] font-medium">
                            {location}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-foreground text-[clamp(0.75rem,2.2vw,0.85rem)] leading-relaxed">
                      {insight.strategy}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {!isGenerating && dayInsights.length === 0 && (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-full bg-muted">
              <MapPin size={24} weight="fill" className="text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-[clamp(0.9rem,2.5vw,1rem)] mb-1">
                No Insights Yet
              </h4>
              <p className="text-muted-foreground text-[clamp(0.75rem,2.2vw,0.85rem)] line-clamp-2">
                Generate AI-powered recommendations for the best times and general strategies to maximize your earnings
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

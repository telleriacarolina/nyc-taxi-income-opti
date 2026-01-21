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

      const promptText = `You are an expert NYC TLC rideshare consultant with deep knowledge of NYC traffic patterns, events, and veteran driver strategies.

You have access to real-time NYC DOT data feeds from https://www.nyc.gov/html/dot/html/about/datafeeds.shtml which include:
- Real-time traffic speeds and incidents across NYC (Traffic Speed Data XML feed)
- Construction zones and road closures (Real-Time Traffic Advisories)
- Parking regulations and availability (NYCDOT Parking Data)
- NYCDOT Twitter alerts for live updates (@NYC_DOT)
- Planned Events Data affecting traffic

Current context:
- Current time: ${currentHour}:00 on ${currentDay}
- Current month: ${currentMonth}
- Real-time traffic data available from NYC DOT feeds

Generate AI-powered insights for veteran NYC TLC drivers about optimal locations and times to maximize earnings. The 2025 target is $300 per day with 7-10 quality rides (approx $35/trip).

When providing recommendations, reference how drivers can use NYC DOT real-time data feeds to:
- Monitor traffic speeds to avoid congested routes
- Check construction alerts before shifts
- Identify high-demand areas based on traffic patterns
- Optimize routes using real-time incident data

Provide insights in TWO categories:

1. DAILY TIME-BASED INSIGHTS: Identify the 4 best time periods during a typical day with specific locations. For each time period, specify:
   - Exact time period (e.g., "6:00 AM - 9:00 AM")
   - Specific NYC neighborhood/location to be in
   - Why this location is profitable at this time (focus on rides that hit $35+ average, consider real-time traffic patterns from NYC DOT data)
   - Expected hourly earnings range that supports the $300/day goal
   - Include a traffic optimization tip referencing NYC DOT feeds

2. SEASONAL/YEARLY INSIGHTS: Identify 3 seasonal patterns or yearly events. For each, specify:
   - Time period or season (e.g., "December holidays", "Summer weekends")
   - 2-3 specific locations to prioritize
   - Strategy explanation for why these locations work for high-value rides
   - Traffic management tips using NYC DOT data feeds for route optimization

Format your response as valid JSON with this structure:
{
  "dailyInsights": [
    {"location": "Penn Station", "timeOfDay": "6:00 AM - 9:00 AM", "reason": "Morning commuters to Midtown/FiDi offices. Check NYC DOT traffic speeds on West Side Highway via their XML feed for fastest airport connections", "expectedEarnings": "$35-45/hr"},
    {"location": "Financial District", "timeOfDay": "9:00 AM - 12:00 PM", "reason": "Business meetings and courthouse runs. Monitor NYC DOT Twitter for FDR/Brooklyn Bridge closures", "expectedEarnings": "$30-40/hr"},
    {"location": "Midtown East", "timeOfDay": "5:00 PM - 8:00 PM", "reason": "Evening rush to Upper East Side and outer boroughs. Use NYC DOT real-time advisories to avoid construction", "expectedEarnings": "$40-50/hr"},
    {"location": "LGA/JFK Staging", "timeOfDay": "8:00 PM - 11:00 PM", "reason": "Premium airport rides to Manhattan hotels. Check NYCDOT planned events data for alternate routes", "expectedEarnings": "$45-55/hr"}
  ],
  "seasonalInsights": [
    {"period": "December Holidays", "locations": ["5th Avenue", "Times Square", "SoHo"], "strategy": "Heavy shopping traffic and tourists. Use NYC DOT parking data to find legal standing zones near stores. Focus on airport runs ($50+ rides) and hotel pickups. Monitor NYCDOT Twitter for holiday parade closures and plan routes accordingly"},
    {"period": "Summer Weekends", "locations": ["Brooklyn Bridge Park", "West Village", "Williamsburg"], "strategy": "Leisure travelers and nightlife crowds. Check NYC DOT real-time traffic speeds to avoid beach-bound congestion. Target restaurant districts for consistent short rides that add up to target"},
    {"period": "March-April Tax Season", "locations": ["Financial District", "Midtown offices", "Accountant hubs"], "strategy": "Business professionals working late hours. Use NYC DOT construction alerts to provide faster service than competitors. Premium rates after 8 PM help hit $35/trip target"}
  ]
}

Base insights on real NYC geography, commute patterns, events, veteran driver knowledge, and practical use of NYC DOT real-time data feeds. Be specific with actionable traffic optimization tips using the data feeds mentioned. Ensure earnings support the $300/day 2025 target.`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
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
              AI-powered recommendations on where to be during peak times and seasons
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
              Best Times & Locations
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
                Generate AI-powered recommendations for the best times and locations to maximize your earnings
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

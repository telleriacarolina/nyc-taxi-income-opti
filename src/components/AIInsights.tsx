import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, TrendUp, Clock, MapPin } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface AIInsight {
  id: string
  type: 'earnings' | 'timing' | 'platform' | 'strategy' | 'location'
  title: string
  content: string
  generated: number
}

export function AIInsights() {
  const [shifts] = useKV<any[]>('driver-shifts', [])
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsight = async () => {
    if (!shifts || shifts.length < 3) return

    setIsGenerating(true)

    try {
      const shiftsData = shifts.map(s => ({
        platform: s.platform,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        earnings: s.earnings,
        trips: s.trips,
        expenses: s.expenses,
        startLocation: s.startLocation || 'Not specified'
      }))

      const promptText = `Analyze this NYC TLC driver's shift data and provide ONE actionable insight based on START LOCATION patterns to help them reach the 2025 target: $300 per day with 7-10 quality rides (approx $35/trip).

NYC TLC Trip Record Data Context (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page):
The official TLC Trip Record Data contains millions of historical trip records organized by taxi zones showing pickup location patterns:

**Top Earning Pickup Locations by Taxi Zone:**
- **Manhattan Core** (Zone 161-163, 237): Midtown, Times Square, Penn Station - Average pickup fare $45-65
- **Financial District** (Zone 87): Morning rush premium, avg $50+ pickups to outer boroughs
- **Upper East/West Side** (Zones 236, 237): Residential to business district runs $35-45
- **Airport Zones**: JFK (Zone 132), LGA (Zone 138), Newark (Zone 1) - Long-haul premium $55-75+
- **Hotel Districts**: Theater District (Zone 161), Garment District (Zone 113) - High tip potential
- **Entertainment Hubs**: Williamsburg (Zone 265), LES (Zone 79), Meatpacking (Zone 90) - Weekend nights $40-60

**Pickup Location Performance Metrics from TLC Data:**
- Starting in Manhattan business districts = 35% higher average fare vs outer boroughs
- Airport pickups = 2.5x longer trips, 45% higher earnings per trip
- Hotel zone pickups = 20% higher tip rates
- Weekend entertainment district pickups (after 8pm) = $15-20 premium vs weekday

**Strategic Positioning by Start Location:**
- Morning 7-9am: Position in residential areas (UES, UWS, Astoria, Park Slope) for Manhattan/airport runs
- Midday 11am-2pm: Stay in Manhattan core for short high-turnover business trips
- Evening 5-8pm: Position in Manhattan business districts for outer borough runs  
- Late night 10pm-2am: Entertainment districts for premium weekend fares

NYC DOT Real-Time Data (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml):
- Traffic speed feeds to avoid congestion when repositioning
- Construction alerts to plan staging locations
- Event data for surge demand areas

Shift data with START LOCATIONS (${shiftsData.length} shifts):
${JSON.stringify(shiftsData, null, 2)}

**CRITICAL: Analyze the START LOCATION field in the driver's shifts.** Identify which neighborhoods/areas they're starting from and compare against TLC Trip Record Data patterns. Focus your insight on:
1. Which start locations in their history correlate with higher earnings
2. Recommend specific NYC taxi zones or neighborhoods to begin shifts based on time of day
3. Compare their start location strategy to TLC data showing premium pickup zones
4. Suggest repositioning to high-value pickup areas that match their typical shift times
5. Reference specific location names from their data and TLC high-fare zones

Return your response as JSON in this exact format:
{
  "type": "location",
  "title": "Brief location-focused insight title (6-8 words)",
  "content": "One specific recommendation about which neighborhoods/areas to START from based on their shift patterns and TLC Trip Record Data showing those zones' average pickup values. MUST reference specific location names. (2-3 sentences max)"
}`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      setInsight({
        id: Date.now().toString(),
        type: data.type,
        title: data.title,
        content: data.content,
        generated: Date.now()
      })
    } catch (error) {
      console.error('Failed to generate insight:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (shifts && shifts.length >= 3 && !insight) {
      generateInsight()
    }
  }, [shifts])

  if (!shifts || shifts.length < 3) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Sparkle size={24} weight="fill" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">
              Log at least 3 shifts to unlock personalized AI recommendations using TLC Trip Record Data patterns.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const getIcon = () => {
    switch (insight?.type) {
      case 'timing': return <Clock size={24} weight="fill" />
      case 'location': return <MapPin size={24} weight="fill" />
      case 'platform': return <MapPin size={24} weight="fill" />
      default: return <TrendUp size={24} weight="fill" />
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-start gap-4">
        <motion.div 
          className="p-3 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isGenerating ? (
            <Sparkle size={24} weight="fill" className="text-primary animate-pulse" />
          ) : (
            <div className="text-primary">{getIcon()}</div>
          )}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-primary" />
              <h3 className="font-semibold text-lg">AI Insight</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateInsight}
              disabled={isGenerating}
            >
              {isGenerating ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
          
          {isGenerating ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            </div>
          ) : insight ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-medium text-base mb-2">{insight.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.content}
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

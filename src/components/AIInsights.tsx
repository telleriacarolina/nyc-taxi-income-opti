import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, TrendUp, Clock, MapPin } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface AIInsight {
  id: string
  type: 'earnings' | 'timing' | 'platform' | 'strategy'
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
        expenses: s.expenses
      }))

      const promptText = `Analyze this NYC TLC driver's shift data and provide ONE actionable insight to help them reach the 2025 target: $300 per day with 7-10 quality rides (approx $35/trip).

NYC TLC Trip Record Data Context (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page):
The official TLC Trip Record Data contains millions of historical trip records with valuable patterns:
- **High-Fare Zones**: Manhattan business districts (Midtown, Financial District), airports (JFK, LGA, EWR)
- **Peak Times**: Morning rush 7-9am (to Manhattan/airports), evening rush 5-8pm (from Manhattan to outer boroughs)
- **High-Tip Locations**: Upscale dining/entertainment areas, hotels, airports
- **Long-Distance Opportunities**: Cross-borough trips, airport runs, late-night service gaps
- **Average Fare Patterns**: Manhattan pickups typically 30-50% higher than outer boroughs
- **Weekend Patterns**: Entertainment districts (Williamsburg, LES, Meatpacking) peak 8pm-2am
- **Seasonal Trends**: Holiday season (Nov-Dec) shows 20-30% higher fares, summer airport traffic increases

NYC DOT Real-Time Data (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml):
- Traffic speed feeds to avoid congestion
- Construction and incident alerts
- Planned events affecting traffic
- Parking regulations for staging

Shift data (${shiftsData.length} shifts):
${JSON.stringify(shiftsData, null, 2)}

Based on this data, identify ONE specific pattern or opportunity to hit the 2025 target. Focus on:
- Best earning times or locations based on TLC historical patterns showing $35+ average fares
- Most profitable platform for hitting $35/trip consistently
- Multi-apping opportunities to cherry-pick high-value rides from TLC high-fare zones
- Shift length optimization for quality over quantity in proven high-earning areas
- How current performance compares to the $300/day target
- Specific NYC neighborhoods/zones from TLC data known for premium fares
- How to use NYC DOT real-time feeds to reach high-fare zones efficiently

Return your response as JSON in this exact format:
{
  "type": "earnings" | "timing" | "platform" | "strategy",
  "title": "Brief insight title (6-8 words)",
  "content": "One specific, actionable recommendation referencing the 2025 target, citing specific neighborhoods or patterns from TLC Trip Record Data, and mentioning how to leverage this historical data (2-3 sentences max)"
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

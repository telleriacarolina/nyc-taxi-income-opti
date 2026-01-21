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

NYC DOT Data Context:
This driver has access to real-time NYC DOT data feeds (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml) including:
- Traffic speed data across NYC
- Real-time traffic advisories and construction alerts
- Planned events data
- Parking regulations
- @NYC_DOT Twitter feed for live updates

Shift data (${shiftsData.length} shifts):
${JSON.stringify(shiftsData, null, 2)}

Based on this data, identify ONE specific pattern or opportunity to hit the 2025 target. Focus on:
- Best earning times or days to maximize per-trip rates
- Most profitable platform for hitting $35/trip
- Multi-apping opportunities to cherry-pick high-value rides
- Shift length optimization for quality over quantity
- How current performance compares to the $300/day target
- How to use NYC DOT data feeds to optimize routes and avoid congestion

Return your response as JSON in this exact format:
{
  "type": "earnings" | "timing" | "platform" | "strategy",
  "title": "Brief insight title (6-8 words)",
  "content": "One specific, actionable recommendation referencing the 2025 target and mentioning how NYC DOT data can help (2-3 sentences max)"
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
              Log at least 3 shifts to unlock personalized AI recommendations on how to maximize your earnings.
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

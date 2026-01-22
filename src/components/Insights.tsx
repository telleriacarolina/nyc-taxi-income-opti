import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, TrendUp, Clock, MapPin, Download, FileCsv, FileText, FileJs } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { calculateStats } from '@/lib/earnings-utils'
import { exportToCSV, exportInsightsToPDF, exportInsightsAsJSON } from '@/lib/report-export'
import { toast } from 'sonner'

interface AIInsight {
  id: string
  type: 'earnings' | 'timing' | 'platform' | 'strategy'
  title: string
  content: string
  generated: number
}

export function Insights() {
  const [shifts] = useKV<any[]>('driver-shifts', [])
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const generateAIInsight = async () => {
    if (!shifts || shifts.length < 3) return

    setIsGeneratingAI(true)

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

      const promptText = `Analyze this NYC TLC driver's shift data and provide ONE actionable general insight to help them reach the 2025 target: $300 per day with 7-10 quality rides (approx $35/trip).

NYC TLC Trip Record Data Context (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page):
The official TLC Trip Record Data contains millions of historical trip records organized by taxi zones showing general pickup patterns and earnings trends across NYC.

**General TLC Data Insights:**
- Manhattan business districts show 35% higher average fare vs outer boroughs
- Airport trips average 2.5x longer distance and 45% higher earnings
- Weekend evening trips (after 8pm) show $15-20 premium vs weekday
- Morning rush (7-9am) and evening rush (5-8pm) show highest trip frequency
- Midday (11am-2pm) offers high-turnover short trips

NYC DOT Real-Time Data (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml):
- Traffic patterns affect trip efficiency throughout the day
- Event data indicates surge demand areas
- Construction and road conditions impact routing strategies

Shift data (${shiftsData.length} shifts):
${JSON.stringify(shiftsData, null, 2)}

Provide a GENERAL insight about optimizing earnings based on their shift patterns. Focus on:
1. Time-of-day strategies based on their shift timing
2. Platform performance patterns
3. Trip efficiency and earnings per hour trends
4. General recommendations without specific location references

Return your response as JSON in this exact format:
{
  "type": "timing" | "platform" | "strategy" | "earnings",
  "title": "Brief insight title (6-8 words)",
  "content": "One actionable recommendation based on general TLC data patterns and their shift performance. NO specific location names or neighborhoods. (2-3 sentences max)"
}`

      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      setAiInsight({
        id: Date.now().toString(),
        type: data.type,
        title: data.title,
        content: data.content,
        generated: Date.now()
      })
    } catch (error) {
      console.error('Failed to generate AI insight:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }



  useEffect(() => {
    if (shifts && shifts.length >= 3 && !aiInsight) {
      generateAIInsight()
    }
  }, [shifts])

  const getIcon = () => {
    switch (aiInsight?.type) {
      case 'timing': return <Clock size={24} weight="fill" />
      case 'platform': return <TrendUp size={24} weight="fill" />
      case 'strategy': return <MapPin size={24} weight="fill" />
      default: return <TrendUp size={24} weight="fill" />
    }
  }



  const handleExport = (format: 'csv' | 'txt' | 'json') => {
    if (!shifts || shifts.length === 0) {
      toast.error('No data to export')
      return
    }

    const stats = calculateStats(shifts)

    try {
      if (format === 'csv') {
        exportToCSV(shifts, stats)
        toast.success('CSV report downloaded')
      } else if (format === 'txt') {
        exportInsightsToPDF(shifts, stats, aiInsight || undefined, [], [])
        toast.success('Insights report downloaded')
      } else if (format === 'json') {
        exportInsightsAsJSON(shifts, stats, aiInsight || undefined, [], [])
        toast.success('JSON report downloaded')
      }
    } catch (error) {
      toast.error('Failed to export report')
      console.error('Export error:', error)
    }
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkle size={20} weight="fill" className="text-primary flex-shrink-0" />
          <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] line-clamp-1">
            AI-Powered Insights
          </h3>
        </div>
        {shifts && shifts.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 h-8">
                <Download size={14} weight="bold" />
                <span className="text-[clamp(0.7rem,2vw,0.8rem)]">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('txt')} className="gap-2">
                <FileText size={16} weight="fill" />
                <span>Insights Report (.txt)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
                <FileCsv size={16} weight="fill" />
                <span>Shift Data (.csv)</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('json')} className="gap-2">
                <FileJs size={16} weight="fill" />
                <span>Full Report (.json)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!shifts || shifts.length < 3 ? (
        <div className="p-6 text-center bg-card/50 rounded-lg border">
          <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkle size={24} weight="fill" className="text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-[clamp(0.9rem,2.5vw,1rem)] mb-1">
                AI-Powered Insights
              </h4>
              <p className="text-muted-foreground text-[clamp(0.75rem,2.2vw,0.85rem)] line-clamp-2">
                Log at least 3 shifts to unlock AI recommendations using TLC Trip Record Data patterns.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border">
          <motion.div 
            className="p-3 rounded-full bg-primary/10 flex-shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isGeneratingAI ? (
              <Sparkle size={24} weight="fill" className="text-primary animate-pulse" />
            ) : (
              <div className="text-primary">{getIcon()}</div>
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[clamp(0.9rem,2.5vw,1rem)]">AI-Generated Insight</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAIInsight}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? 'Analyzing...' : 'Refresh'}
              </Button>
            </div>
            
            {isGeneratingAI ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-full" />
                <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              </div>
            ) : aiInsight ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h5 className="font-medium text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2">{aiInsight.title}</h5>
                <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground leading-relaxed">
                  {aiInsight.content}
                </p>
              </motion.div>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  )
}

import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkle, MapPin, X, Plus, ArrowsLeftRight } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface LocationInsight {
  id: string
  location: string
  title: string
  content: string
  generated: number
}

export function LocationInsightComparison() {
  const [shifts] = useKV<any[]>('driver-shifts', [])
  const [locationInsights, setLocationInsights] = useState<LocationInsight[]>([])
  const [newLocation, setNewLocation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateLocationInsight = async (location: string) => {
    if (!shifts || shifts.length < 3) {
      toast.error('Need at least 3 shifts to generate insights')
      return
    }

    if (locationInsights.some(insight => insight.location.toLowerCase() === location.toLowerCase())) {
      toast.error('Already comparing this location')
      return
    }

    if (locationInsights.length >= 4) {
      toast.error('Maximum 4 locations can be compared')
      return
    }

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

      const hvfhApiUrl = 'https://data.cityofnewyork.us/resource/8wbx-tsch.json'
      const currentDate = new Date()
      const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1)
      const dateFilter = threeMonthsAgo.toISOString().split('T')[0]

      let hvfhData: any[] = []

      try {
        const hvfhParams = new URLSearchParams({
          '$limit': '5000',
          '$where': `pickup_datetime >= '${dateFilter}'`,
          '$select': 'hvfhs_license_num,PULocationID,DOLocationID,driver_pay,tips,trip_miles,trip_time,pickup_datetime',
          '$order': 'driver_pay DESC'
        })
        const hvfhResponse = await fetch(`${hvfhApiUrl}?${hvfhParams}`)
        if (hvfhResponse.ok) {
          hvfhData = await hvfhResponse.json()
        }
      } catch (error) {
        console.warn('HVFH data fetch failed:', error)
      }

      let marketIntel = 'NYC TLC Database Market Intelligence:\n\n'

      if (hvfhData.length > 0) {
        const avgDriverPay = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.driver_pay) || 0), 0) / hvfhData.length
        const avgTips = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.tips) || 0), 0) / hvfhData.length
        
        marketIntel += `Recent Trip Data (Last 3 Months):\n`
        marketIntel += `- Average driver pay per trip: $${avgDriverPay.toFixed(2)}\n`
        marketIntel += `- Average tips per trip: $${avgTips.toFixed(2)}\n`
        marketIntel += `- Sample size: ${hvfhData.length} trips analyzed\n\n`
      }

      const shiftsJson = JSON.stringify(shiftsData, null, 2)

      const prompt = `Analyze NYC TLC data for starting a shift SPECIFICALLY in "${location}". Provide actionable insight for this exact location.

${marketIntel}

Key NYC Zones & Earnings Patterns (TLC Data):
- Manhattan Core (Midtown, Times Square): Premium fares, high turnover
- Financial District: Morning rush advantage, corporate runs
- Airport Zones (JFK, LGA): 2.5x longer trips, 45% higher earnings
- Brooklyn (Williamsburg, Bushwick, Park Slope): Residential-to-entertainment flow
- Queens (Astoria, LIC, Flushing): Airport connections, diverse trip types

Driver's Historical Shift Data (${shiftsData.length} shifts):
${shiftsJson}

CRITICAL REQUIREMENTS:
1. Focus ONLY on "${location}" as the starting point
2. Provide specific directional strategies (where to head from this location)
3. Mention optimal times for this specific location
4. Reference nearby high-value zones or trip patterns
5. Use TLC database patterns for this area
6. Compare to the driver's historical performance
7. Be concise but actionable (2-3 sentences)

Return your response as JSON in this exact format:
{
  "title": "Brief title mentioning ${location} (6-8 words)",
  "content": "Specific actionable recommendation for starting in ${location}. Include directions, timing, and expected outcomes based on TLC data. (2-3 sentences)"
}`

      const response = await spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      const newInsight: LocationInsight = {
        id: Date.now().toString(),
        location,
        title: data.title,
        content: data.content,
        generated: Date.now()
      }

      setLocationInsights(prev => [...prev, newInsight])
      setNewLocation('')
      toast.success(`Insight generated for ${location}`)
    } catch (error) {
      console.error('Failed to generate insight:', error)
      toast.error('Failed to generate insight')
    } finally {
      setIsGenerating(false)
    }
  }

  const removeInsight = (id: string) => {
    setLocationInsights(prev => prev.filter(insight => insight.id !== id))
  }

  const addQuickLocation = (location: string) => {
    setNewLocation(location)
    generateLocationInsight(location)
  }

  if (!shifts || shifts.length < 3) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ArrowsLeftRight size={24} weight="fill" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)] mb-2">
              Compare Multiple Start Locations
            </h3>
            <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
              Log at least 3 shifts to compare AI insights from different starting locations side-by-side.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ArrowsLeftRight size={20} weight="fill" className="text-primary" />
            <h3 className="font-semibold text-[clamp(0.95rem,2.8vw,1.1rem)]">
              Compare Start Locations
            </h3>
          </div>
          <span className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
            {locationInsights.length}/4 locations
          </span>
        </div>

        <div className="space-y-3">
          <Label htmlFor="location-input" className="text-[clamp(0.8rem,2.3vw,0.9rem)] font-medium">
            Add Location to Compare
          </Label>
          <div className="flex gap-2">
            <Input
              id="location-input"
              placeholder="e.g., Williamsburg Brooklyn, Times Square..."
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newLocation.trim()) {
                  generateLocationInsight(newLocation.trim())
                }
              }}
              className="flex-1"
              disabled={isGenerating || locationInsights.length >= 4}
            />
            <Button
              onClick={() => generateLocationInsight(newLocation.trim())}
              disabled={isGenerating || !newLocation.trim() || locationInsights.length >= 4}
              className="gap-1.5 h-10"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden sm:inline text-[clamp(0.7rem,2vw,0.85rem)]">Add</span>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Williamsburg Brooklyn', 'Times Square Manhattan', 'JFK Airport', 'Financial District', 'Astoria Queens', 'Park Slope Brooklyn'].map((loc) => (
              <Button
                key={loc}
                variant="outline"
                size="sm"
                onClick={() => addQuickLocation(loc)}
                disabled={isGenerating || locationInsights.length >= 4 || locationInsights.some(i => i.location.toLowerCase() === loc.toLowerCase())}
                className="text-[clamp(0.65rem,2vw,0.75rem)] gap-1 h-7"
              >
                <MapPin size={12} weight="fill" />
                {loc.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>

        {isGenerating && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkle size={20} weight="fill" className="text-primary animate-pulse" />
              <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
                Analyzing TLC data for {newLocation}...
              </p>
            </div>
          </Card>
        )}

        <AnimatePresence mode="popLayout">
          {locationInsights.length === 0 && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed"
            >
              <ArrowsLeftRight size={32} weight="fill" className="text-muted-foreground mx-auto mb-3" />
              <p className="text-[clamp(0.8rem,2.3vw,0.9rem)] font-medium text-muted-foreground mb-1">
                No locations added yet
              </p>
              <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                Add locations to compare AI-powered insights side-by-side
              </p>
            </motion.div>
          )}

          {locationInsights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 h-full relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInsight(insight.id)}
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X size={14} weight="bold" />
                    </Button>
                    
                    <div className="flex items-start gap-3 mb-3 pr-8">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <MapPin size={18} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[clamp(0.8rem,2.3vw,0.9rem)] text-primary mb-1 line-clamp-1">
                          {insight.location}
                        </h4>
                        <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                          Added {new Date(insight.generated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-[clamp(0.8rem,2.3vw,0.9rem)] line-clamp-2">
                        {insight.title}
                      </h5>
                      <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground leading-relaxed">
                        {insight.content}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {locationInsights.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
              <Sparkle size={14} weight="fill" className="text-primary" />
              <p>
                Compare insights to identify the most promising starting location for your next shift
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

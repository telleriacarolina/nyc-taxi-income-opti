import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Lightning, CheckCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface RideRecommendation {
  shouldAccept: boolean
  confidence: 'high' | 'medium' | 'low'
  reasons: string[]
  estimated_value: string
}

export function SmartRideRecommender() {
  const [rides] = useKV<any[]>('driver-rides', [])
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [platform, setPlatform] = useState('Uber')
  const [grossPay, setGrossPay] = useState('')
  const [recommendation, setRecommendation] = useState<RideRecommendation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeRide = async () => {
    if (!distance || !duration || !grossPay) return

    setIsAnalyzing(true)

    try {
      const avgPayPerMile = rides && rides.length > 0 
        ? rides.reduce((sum, r) => sum + (r.netPay / r.distance), 0) / rides.length 
        : 2.5

      const avgPayPerMin = rides && rides.length > 0
        ? rides.reduce((sum, r) => sum + (r.netPay / r.duration), 0) / rides.length
        : 0.5

      const ridePayPerMile = parseFloat(grossPay) / parseFloat(distance)
      const ridePayPerMin = parseFloat(grossPay) / parseFloat(duration)

      const promptText = `You are analyzing whether a NYC TLC driver should accept a ride offer using historical TLC Trip Record Data patterns.

NYC TLC Trip Record Data Context (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page):
- Manhattan pickups typically average $3.50-4.50 per mile vs $2.00-3.00 in outer boroughs
- Airport trips (JFK/LGA/EWR) average $50-70 with higher tip percentages
- Business district trips during rush hours command 30-40% premium over base rates
- Evening entertainment district rides (8pm-2am) show higher per-minute value due to traffic
- Trips over 10 miles often have better per-mile rates but require deadhead consideration
- Premium locations: Financial District, Midtown Manhattan, airports consistently beat averages

2025 Target Context: Driver needs to average $35+ per trip to hit $300/day with 7-10 rides.

Ride Details:
- Platform: ${platform}
- Distance: ${distance} miles
- Duration: ${duration} minutes
- Gross Pay: $${grossPay}
- Pay per mile: $${ridePayPerMile.toFixed(2)}
- Pay per minute: $${ridePayPerMin.toFixed(2)}

Driver's Historical Averages:
- Average pay per mile: $${avgPayPerMile.toFixed(2)}
- Average pay per minute: $${avgPayPerMin.toFixed(2)}
- Total rides logged: ${rides?.length || 0}

Analyze this ride using TLC historical patterns:
1. Compare the ride's metrics to both driver's history AND TLC data benchmarks
2. Consider if this ride supports the $35+ per trip target needed for $300/day goal
3. Factor in time efficiency - is pay per minute competitive with TLC data patterns?
4. Assess if this is a premium route type (airport, business district, cross-borough rush hour)

Return JSON in this exact format:
{
  "shouldAccept": true or false,
  "confidence": "high" | "medium" | "low",
  "reasons": ["reason 1 referencing TLC data or $35 target", "reason 2", "reason 3"],
  "estimated_value": "great" | "good" | "average" | "below_average" | "poor"
}`

      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      setRecommendation(data)
    } catch (error) {
      console.error('Failed to analyze ride:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain weight="fill" className="text-primary" size={24} />
        <div>
          <h3 className="font-semibold text-lg">Smart Ride Analyzer</h3>
          <p className="text-xs text-muted-foreground">AI advisor using TLC Trip Data patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Distance (miles)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md"
            placeholder="8.5"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md"
            placeholder="25"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md"
          >
            <option>Uber</option>
            <option>Lyft</option>
            <option>Via</option>
            <option>Curb</option>
            <option>Revel</option>
            <option>Juno</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Gross Pay ($)</label>
          <input
            type="number"
            value={grossPay}
            onChange={(e) => setGrossPay(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md"
            placeholder="32.50"
            step="0.01"
          />
        </div>
      </div>

      <Button 
        onClick={analyzeRide}
        disabled={!distance || !duration || !grossPay || isAnalyzing}
        className="w-full mb-4"
      >
        {isAnalyzing ? (
          <>
            <Brain weight="fill" className="animate-pulse" />
            Analyzing...
          </>
        ) : (
          <>
            <Lightning weight="fill" />
            Analyze Ride
          </>
        )}
      </Button>

      {recommendation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg border-2 ${
            recommendation.shouldAccept 
              ? 'bg-success/10 border-success' 
              : 'bg-destructive/10 border-destructive'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle 
                weight="fill" 
                size={24}
                className={recommendation.shouldAccept ? 'text-success' : 'text-destructive'}
              />
              <span className="font-semibold">
                {recommendation.shouldAccept ? 'Accept This Ride' : 'Skip This Ride'}
              </span>
            </div>
            <Badge variant={recommendation.confidence === 'high' ? 'default' : 'secondary'}>
              {recommendation.confidence} confidence
            </Badge>
          </div>

          <div className="space-y-2">
            {recommendation.reasons.map((reason, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-muted-foreground">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t">
            <span className="text-xs font-medium text-muted-foreground">
              Estimated Value: <span className="capitalize">{recommendation.estimated_value.replace('_', ' ')}</span>
            </span>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

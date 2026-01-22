import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkle, TrendUp, Clock, MapPin } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface AIInsight {
  id: string
  type: 'earnings' | 'timing' | 'platform' | 'strategy' | 'location'
  title: string
  content: string
  generated: number
  startLocation?: string
}

export function AIInsights() {
  const [shifts] = useKV<any[]>('driver-shifts', [])
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [startLocation, setStartLocation] = useState('')

  const generateInsight = async (customLocation?: string) => {
    if (!shifts || shifts.length < 3) return

    setIsGenerating(true)
    const locationToUse = customLocation || startLocation

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
      const baseAggregateUrl = 'https://data.cityofnewyork.us/resource/2v9c-2k7f.json'
      
      const currentDate = new Date()
      const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1)
      const dateFilter = threeMonthsAgo.toISOString().split('T')[0]

      let hvfhData: any[] = []
      let baseAggregateData: any[] = []

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

      try {
        const baseParams = new URLSearchParams({
          '$limit': '500',
          '$where': `month >= '${dateFilter}'`,
          '$select': 'base_number,base_name,month,total_dispatched_trips,unique_dispatched_drivers,total_trip_miles',
          '$order': 'month DESC'
        })
        const baseResponse = await fetch(`${baseAggregateUrl}?${baseParams}`)
        if (baseResponse.ok) {
          baseAggregateData = await baseResponse.json()
        }
      } catch (error) {
        console.warn('Base aggregate data fetch failed:', error)
      }

      const platformMap: Record<string, string[]> = {
        'Uber': ['B02764', 'B02617', 'B02598', 'B02682', 'B02765', 'HV0003'],
        'Lyft': ['B02510', 'B02844', 'HV0005'],
        'Via': ['B03136', 'B02800', 'HV0004'],
        'Juno': ['B02914', 'B02907', 'B02835', 'B02864', 'HV0002']
      }

      let marketIntel = 'NYC TLC Database Market Intelligence:\n\n'

      if (hvfhData.length > 0) {
        const avgDriverPay = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.driver_pay) || 0), 0) / hvfhData.length
        const avgTips = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.tips) || 0), 0) / hvfhData.length
        const topZones = hvfhData.reduce((acc: Record<number, number>, trip: any) => {
          const zone = parseInt(trip.pulocationid)
          if (!isNaN(zone)) {
            acc[zone] = (acc[zone] || 0) + parseFloat(trip.driver_pay || 0)
          }
          return acc
        }, {})
        const topZonesSorted = Object.entries(topZones)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)

        marketIntel += `Recent Trip Data (Last 3 Months):\n`
        marketIntel += `- Average driver pay per trip: $${avgDriverPay.toFixed(2)}\n`
        marketIntel += `- Average tips per trip: $${avgTips.toFixed(2)}\n`
        marketIntel += `- Top earning pickup zones: ${topZonesSorted.map(([zone]) => `Zone ${zone}`).join(', ')}\n`
        marketIntel += `- Sample size: ${hvfhData.length} trips analyzed\n\n`
      }

      if (baseAggregateData.length > 0) {
        const platformStats: Record<string, { trips: number, drivers: number }> = {}
        
        baseAggregateData.forEach((record: any) => {
          for (const [platform, bases] of Object.entries(platformMap)) {
            if (bases.includes(record.base_number)) {
              if (!platformStats[platform]) {
                platformStats[platform] = { trips: 0, drivers: 0 }
              }
              platformStats[platform].trips += parseInt(record.total_dispatched_trips || 0)
              platformStats[platform].drivers += parseInt(record.unique_dispatched_drivers || 0)
            }
          }
        })

        marketIntel += `Platform Performance (Last 3 Months):\n`
        for (const [platform, stats] of Object.entries(platformStats)) {
          const tripsPerDriver = stats.drivers > 0 ? stats.trips / stats.drivers : 0
          marketIntel += `- ${platform}: ${tripsPerDriver.toFixed(1)} trips per driver\n`
        }
        marketIntel += `\n`
      }

      const shiftsJson = JSON.stringify(shiftsData, null, 2)

      const locationContext = locationToUse 
        ? `\n\nSPECIFIC START LOCATION REQUEST: "${locationToUse}"\nFocus this insight SPECIFICALLY on starting a shift in ${locationToUse}. Provide detailed recommendations for this exact starting location including:\n- Best times to start from this location\n- Optimal directions/zones to head toward from here\n- Typical fare expectations from this area\n- Platform advantages specific to this neighborhood\n- Nearby high-demand zones to target\n`
        : ''

      const prompt = `Analyze this NYC TLC driver's shift data and provide ONE actionable insight using REAL NYC TLC DATABASE DATA to help them reach the 2025 target: $300 per day with 7-10 quality rides (approx $35/trip).

${marketIntel}

Additional TLC Database Context:
NYC maintains several real-time data sources:
- HVFH Trip Records: Individual trip-level data with driver_pay, tips, pickup/dropoff zones
- FHV Base Aggregate Reports: Monthly platform statistics (trips, drivers, miles)
- Active Vehicle Database: Fleet sizes by platform
- New Driver Applications: Supply growth indicators

Top Earning Pickup Locations by Taxi Zone (from TLC data):
- Manhattan Core (Zone 161-163, 237): Midtown, Times Square, Penn Station
- Financial District (Zone 87): Morning rush premium pickups
- Upper East/West Side (Zones 236, 237): Residential to business district runs
- Airport Zones: JFK (Zone 132), LGA (Zone 138), Newark (Zone 1)
- Hotel Districts: Theater District (Zone 161), Garment District (Zone 113)
- Entertainment Hubs: Williamsburg (Zone 265), LES (Zone 79), Meatpacking (Zone 90)
- Brooklyn Zones: Williamsburg (Zone 265), Greenpoint (Zone 130), Bushwick (Zone 37), Park Slope (Zone 189)
- Queens Zones: Astoria (Zone 7), LIC (Zone 145), Flushing (Zone 100), Jackson Heights (Zone 132)

Shift data with START LOCATIONS (${shiftsData.length} shifts):
${shiftsJson}${locationContext}

CRITICAL: Use the REAL DATABASE INTEL above combined with the driver's shift patterns. Analyze:
1. Compare their earnings to TLC database averages (driver_pay per trip)
2. Identify if their platform choice aligns with trips-per-driver metrics
3. Match their start locations to high-earning pickup zones from TLC data
4. Reference specific data points from the market intelligence section
5. Provide actionable recommendations based on real TLC database patterns
${locationToUse ? '6. MUST focus specifically on the requested start location and provide location-specific strategies' : ''}

Return your response as JSON in this exact format:
{
  "type": "location",
  "title": "Brief data-driven insight title (6-8 words)${locationToUse ? ' - MUST mention ' + locationToUse : ''}",
  "content": "One specific recommendation using REAL database statistics. MUST reference actual numbers from the market intel.${locationToUse ? ' MUST be specific to starting in ' + locationToUse + ' with actionable directions and timing.' : ''} (2-3 sentences max)"
}`

      const response = await spark.llm(prompt, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      setInsight({
        id: Date.now().toString(),
        type: data.type,
        title: data.title,
        content: data.content,
        generated: Date.now(),
        startLocation: locationToUse || undefined
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
              Log at least 3 shifts to unlock personalized AI recommendations using TLC database intel.
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
      <div className="space-y-4">
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
                <h3 className="font-semibold text-lg">Database-Powered Insight</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateInsight()}
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
                {insight.startLocation && (
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} weight="fill" className="text-primary" />
                    <span className="text-xs font-medium text-primary">Start: {insight.startLocation}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.content}
                </p>
              </motion.div>
            ) : null}
          </div>
        </div>

        <div className="border-t pt-4">
          <Label htmlFor="start-location" className="text-sm font-medium mb-2 block">
            Request Insight for Specific Start Location
          </Label>
          <div className="flex gap-2 mb-3">
            <Input
              id="start-location"
              placeholder="e.g., Williamsburg Brooklyn, Times Square, JFK Airport..."
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => generateInsight(startLocation)}
              disabled={isGenerating || !startLocation.trim()}
              className="gap-2"
            >
              <Sparkle size={16} weight="fill" />
              Generate
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartLocation('Williamsburg Brooklyn')
                generateInsight('Williamsburg Brooklyn')
              }}
              disabled={isGenerating}
              className="text-xs gap-1"
            >
              <MapPin size={12} weight="fill" />
              Williamsburg
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartLocation('Times Square Manhattan')
                generateInsight('Times Square Manhattan')
              }}
              disabled={isGenerating}
              className="text-xs gap-1"
            >
              <MapPin size={12} weight="fill" />
              Times Square
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartLocation('JFK Airport')
                generateInsight('JFK Airport')
              }}
              disabled={isGenerating}
              className="text-xs gap-1"
            >
              <MapPin size={12} weight="fill" />
              JFK Airport
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Get AI-powered recommendations for starting your shift from a specific location using TLC database insights.
          </p>
        </div>
      </div>
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MapPin, Fire, Clock, TrendUp, Path } from '@phosphor-icons/react'
import { Shift } from '@/lib/earnings-types'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'
import { cn } from '@/lib/utils'

interface LocationHistoryHeatmapProps {
  shifts: Shift[]
}

interface LocationFrequency {
  location: string
  count: number
  percentage: number
}

const NYC_NEIGHBORHOODS: Record<string, [number, number]> = {
  'manhattan': [40.7831, -73.9712],
  'midtown': [40.7549, -73.9840],
  'times square': [40.7580, -73.9855],
  'upper west side': [40.7870, -73.9754],
  'upper east side': [40.7736, -73.9566],
  'harlem': [40.8116, -73.9465],
  'east harlem': [40.7957, -73.9389],
  'financial district': [40.7074, -74.0089],
  'tribeca': [40.7163, -74.0086],
  'soho': [40.7233, -74.0030],
  'greenwich village': [40.7336, -74.0027],
  'east village': [40.7264, -73.9815],
  'lower east side': [40.7153, -73.9874],
  'chelsea': [40.7465, -74.0014],
  'gramercy': [40.7368, -73.9841],
  'murray hill': [40.7478, -73.9764],
  'kips bay': [40.7429, -73.9772],
  'union square': [40.7359, -73.9911],
  'brooklyn': [40.6782, -73.9442],
  'williamsburg': [40.7081, -73.9571],
  'bushwick': [40.6942, -73.9194],
  'bedstuy': [40.6872, -73.9418],
  'park slope': [40.6710, -73.9778],
  'downtown brooklyn': [40.6942, -73.9878],
  'dumbo': [40.7033, -73.9888],
  'queens': [40.7282, -73.7949],
  'astoria': [40.7644, -73.9235],
  'long island city': [40.7447, -73.9485],
  'jackson heights': [40.7557, -73.8831],
  'flushing': [40.7673, -73.8330],
  'forest hills': [40.7186, -73.8448],
  'bronx': [40.8448, -73.8648],
  'fordham': [40.8613, -73.8977],
  'concourse': [40.8272, -73.9218],
  'staten island': [40.5795, -74.1502],
  'lga': [40.7769, -73.8740],
  'jfk': [40.6413, -73.7781],
  'newark': [40.6895, -74.1745]
}

export function LocationHistoryHeatmap({ shifts }: LocationHistoryHeatmapProps) {
  const [locationFrequency, setLocationFrequency] = useState<LocationFrequency[]>([])
  const [showHeatmap, setShowHeatmap] = useKV<boolean>('history-heatmap-enabled', true)
  const [mapStyle, setMapStyle] = useKV<MapStyle>('history-map-style', 'liberty')

  useEffect(() => {
    const shiftsWithLocation = shifts.filter(s => s.startLocation && s.startLocation.trim() !== '')
    
    const locationMap = new Map<string, number>()

    shiftsWithLocation.forEach(shift => {
      const loc = shift.startLocation!.trim().toLowerCase()
      locationMap.set(loc, (locationMap.get(loc) || 0) + 1)
    })

    const totalShifts = shiftsWithLocation.length
    const data = Array.from(locationMap.entries())
      .map(([location, count]) => ({
        location: location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count,
        percentage: (count / totalShifts) * 100
      }))
      .sort((a, b) => b.count - a.count)

    setLocationFrequency(data)
  }, [shifts])

  if (locationFrequency.length === 0) {
    return null
  }

  const maxCount = locationFrequency.length > 0 ? Math.max(...locationFrequency.map(d => d.count)) : 1
  
  const heatmapPoints = locationFrequency.map(loc => {
    const normalizedName = loc.location.toLowerCase()
    const coords = NYC_NEIGHBORHOODS[normalizedName] || [40.7128, -74.0060]
    const normalizedIntensity = loc.count / maxCount
    return {
      position: coords as [number, number],
      intensity: normalizedIntensity
    }
  })

  const topLocation = locationFrequency[0]
  const totalShifts = shifts.filter(s => s.startLocation && s.startLocation.trim() !== '').length

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-warning/10 via-warning/5 to-primary/5 border-warning/30 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-gradient-to-br from-warning to-warning/80 p-2.5 shadow-md">
          <Path size={22} className="text-warning-foreground" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.95rem,2.8vw,1.2rem)] font-bold mb-0.5 line-clamp-1 tracking-tight">
            Driving History Heatmap
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            See where you've driven most frequently
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-warning/20 to-warning/10 rounded-lg p-3 border border-warning/30">
          <div className="flex items-center gap-2 mb-1">
            <Fire size={16} className="text-warning flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-warning/90 uppercase tracking-wide font-semibold">
              Most Frequent
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] line-clamp-1 text-warning">
            {topLocation.location}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-warning/80 mt-0.5">
            {topLocation.count} shifts ({topLocation.percentage.toFixed(1)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-3 border border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-primary flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-primary/90 uppercase tracking-wide font-semibold">
              Total Zones
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] text-primary">
            {locationFrequency.length}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary/80 mt-0.5">
            Unique locations
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-muted-foreground flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Total Shifts
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
            {totalShifts}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            With location data
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={16} className="text-success flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Avg/Location
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
            {(totalShifts / locationFrequency.length).toFixed(1)}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            Shifts per zone
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Fire size={20} weight="fill" className={cn(
              "transition-colors",
              showHeatmap ? "text-warning" : "text-muted-foreground"
            )} />
            <div>
              <Label htmlFor="history-heatmap-toggle" className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold cursor-pointer">
                Frequency Heatmap Overlay
              </Label>
              <p className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
                Visualize driving frequency by location
              </p>
            </div>
          </div>
          <Switch
            id="history-heatmap-toggle"
            checked={showHeatmap}
            onCheckedChange={setShowHeatmap}
            className="data-[state=checked]:bg-warning"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 via-green-500/20 via-yellow-500/20 to-red-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-[clamp(0.7rem,2.2vw,0.8rem)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Rare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Occasional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-muted-foreground">Frequent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-semibold text-warning">Very Frequent</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-4">
        <OpenFreeMap
          center={[40.7128, -74.0060]}
          zoom={11}
          markers={[]}
          heatmapPoints={heatmapPoints}
          enableHeatmap={showHeatmap}
          heatmapOptions={{
            radius: 45,
            blur: 35,
            maxZoom: 13,
            max: 1.0,
            minOpacity: 0.5,
            gradient: {
              0.0: 'rgba(59, 130, 246, 0)',
              0.25: 'rgba(59, 130, 246, 0.6)',
              0.5: 'rgba(34, 197, 94, 0.7)',
              0.75: 'rgba(234, 179, 8, 0.8)',
              1.0: 'rgba(239, 68, 68, 0.9)'
            }
          }}
          className="rounded-lg"
          style={mapStyle}
        />
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="text-[clamp(0.85rem,2.6vw,1rem)] font-bold mb-3 flex items-center gap-2">
          <MapPin size={18} weight="fill" className="text-primary" />
          Location Frequency Breakdown
        </h3>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {locationFrequency.map((loc, index) => {
            const barWidth = (loc.count / maxCount) * 100
            const isTopLocation = index === 0
            
            return (
              <div key={loc.location} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[clamp(0.65rem,2vw,0.75rem)] font-bold w-6 text-center",
                      isTopLocation ? "text-warning" : "text-muted-foreground"
                    )}>
                      #{index + 1}
                    </span>
                    <span className={cn(
                      "text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold",
                      isTopLocation && "text-warning"
                    )}>
                      {loc.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                      {loc.count} {loc.count === 1 ? 'shift' : 'shifts'}
                    </span>
                    <span className={cn(
                      "text-[clamp(0.75rem,2.2vw,0.85rem)] font-bold min-w-[3rem] text-right",
                      isTopLocation ? "text-warning" : "text-primary"
                    )}>
                      {loc.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      isTopLocation 
                        ? "bg-gradient-to-r from-warning to-warning/80" 
                        : "bg-gradient-to-r from-primary to-primary/80"
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {locationFrequency.length > 1 && (
        <div className="mt-4 bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/40 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Fire size={20} className="text-warning flex-shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <h4 className="text-[clamp(0.8rem,2.4vw,0.95rem)] font-bold mb-2">
                Driving Pattern Insights
              </h4>
              <div className="space-y-2 text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">{topLocation.percentage.toFixed(0)}%</span> of your shifts start in <span className="font-semibold text-warning">{topLocation.location}</span>, making it your primary operating zone.
                </p>
                {locationFrequency.length >= 3 && (
                  <p>
                    Your top 3 locations ({locationFrequency.slice(0, 3).map(l => l.location).join(', ')}) account for{' '}
                    <span className="font-semibold text-foreground">
                      {locationFrequency.slice(0, 3).reduce((sum, l) => sum + l.percentage, 0).toFixed(0)}%
                    </span>{' '}
                    of all shifts.
                  </p>
                )}
                {locationFrequency.length >= 5 && (
                  <p className="text-success">
                    <TrendUp size={14} className="inline mr-1" weight="fill" />
                    You have good geographic diversity with {locationFrequency.length} different starting zones tracked.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

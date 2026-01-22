import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { Ride } from '@/lib/ride-types'
import { formatCurrency } from '@/lib/earnings-utils'
import { formatDistance } from '@/lib/ride-utils'
import { useKV } from '@github/spark/hooks'
import { MapTrifold, MapPin, CurrencyDollar, Path, Palette } from '@phosphor-icons/react'

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
  'bed-stuy': [40.6872, -73.9418],
  'park slope': [40.6710, -73.9778],
  'downtown brooklyn': [40.6942, -73.9878],
  'dumbo': [40.7033, -73.9888],
  'queens': [40.7282, -73.7949],
  'astoria': [40.7644, -73.9235],
  'long island city': [40.7447, -73.9485],
  'lic': [40.7447, -73.9485],
  'jackson heights': [40.7557, -73.8831],
  'flushing': [40.7673, -73.8330],
  'forest hills': [40.7186, -73.8448],
  'bronx': [40.8448, -73.8648],
  'fordham': [40.8613, -73.8977],
  'concourse': [40.8272, -73.9218],
  'staten island': [40.5795, -74.1502],
  'lga': [40.7769, -73.8740],
  'laguardia': [40.7769, -73.8740],
  'jfk': [40.6413, -73.7781],
  'newark': [40.6895, -74.1745],
  'ewr': [40.6895, -74.1745]
}

interface LocationComparisonMapProps {
  rides: Ride[]
}

interface LocationStats {
  location: string
  pickupCount: number
  dropoffCount: number
  totalCount: number
  totalEarnings: number
  avgEarnings: number
  totalDistance: number
}

function getCoordinatesForLocation(location: string): [number, number] | null {
  const normalized = location.toLowerCase().trim()
  const coords = NYC_NEIGHBORHOODS[normalized]
  
  if (coords) return coords

  for (const [key, value] of Object.entries(NYC_NEIGHBORHOODS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  return [40.7128, -74.0060]
}

export function LocationComparisonMap({ rides }: LocationComparisonMapProps) {
  const [mapStyle, setMapStyle] = useKV<MapStyle>('location-map-style', 'liberty')
  const [selectedView, setSelectedView] = useState<'all' | 'pickups' | 'dropoffs'>('all')

  const locationStats = useMemo(() => {
    const stats: Record<string, LocationStats> = {}

    rides.forEach(ride => {
      const pickup = ride.pickupLocation.toLowerCase().trim()
      const dropoff = ride.dropoffLocation.toLowerCase().trim()

      if (pickup && !stats[pickup]) {
        stats[pickup] = {
          location: ride.pickupLocation,
          pickupCount: 0,
          dropoffCount: 0,
          totalCount: 0,
          totalEarnings: 0,
          avgEarnings: 0,
          totalDistance: 0
        }
      }

      if (dropoff && !stats[dropoff]) {
        stats[dropoff] = {
          location: ride.dropoffLocation,
          pickupCount: 0,
          dropoffCount: 0,
          totalCount: 0,
          totalEarnings: 0,
          avgEarnings: 0,
          totalDistance: 0
        }
      }

      if (pickup) {
        stats[pickup].pickupCount++
        stats[pickup].totalCount++
        stats[pickup].totalEarnings += ride.netPay
        stats[pickup].totalDistance += ride.distance
      }

      if (dropoff) {
        stats[dropoff].dropoffCount++
        stats[dropoff].totalCount++
        stats[dropoff].totalEarnings += ride.netPay
        stats[dropoff].totalDistance += ride.distance
      }
    })

    Object.values(stats).forEach(stat => {
      stat.avgEarnings = stat.totalCount > 0 ? stat.totalEarnings / stat.totalCount : 0
    })

    return Object.values(stats).sort((a, b) => b.totalEarnings - a.totalEarnings)
  }, [rides])

  const markers = useMemo(() => {
    return locationStats
      .filter(stat => {
        if (selectedView === 'pickups') return stat.pickupCount > 0
        if (selectedView === 'dropoffs') return stat.dropoffCount > 0
        return stat.totalCount > 0
      })
      .map(stat => {
        const coords = getCoordinatesForLocation(stat.location)
        if (!coords) return null

        const label = `${stat.location} • ${stat.totalCount} trips • ${formatCurrency(stat.totalEarnings)} total`
        
        return {
          position: coords as [number, number],
          label,
          earnings: stat.totalEarnings
        }
      })
      .filter(Boolean) as Array<{ position: [number, number]; label: string; earnings?: number }>
  }, [locationStats, selectedView])

  const topLocations = locationStats.slice(0, 5)

  if (rides.length === 0) {
    return null
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapTrifold size={24} className="text-primary" weight="fill" />
          <h3 className="text-xl font-semibold">Location Map</h3>
          <Badge variant="secondary" className="font-mono text-xs">
            {locationStats.length} locations
          </Badge>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Palette size={16} className="mr-1" />
              Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="space-y-2">
              <div className="text-sm font-semibold mb-2">Map Style</div>
              <Button
                variant={mapStyle === 'liberty' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('liberty')}
                className="w-full justify-start"
              >
                Liberty
              </Button>
              <Button
                variant={mapStyle === 'bright' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('bright')}
                className="w-full justify-start"
              >
                Bright
              </Button>
              <Button
                variant={mapStyle === 'positron' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('positron')}
                className="w-full justify-start"
              >
                Positron
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Locations</TabsTrigger>
          <TabsTrigger value="pickups">Pickups</TabsTrigger>
          <TabsTrigger value="dropoffs">Dropoffs</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-primary" weight="fill" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Total Trips</span>
          </div>
          <div className="text-2xl font-bold">{rides.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatDistance(rides.reduce((sum, r) => sum + r.distance, 0))} total
          </div>
        </Card>

        <Card className="p-4 bg-success/5 border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyDollar size={18} className="text-success" weight="fill" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Total Earnings</span>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(rides.reduce((sum, r) => sum + r.netPay, 0))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatCurrency(rides.reduce((sum, r) => sum + r.netPay, 0) / rides.length)} avg/ride
          </div>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Path size={18} className="text-accent" weight="bold" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Unique Spots</span>
          </div>
          <div className="text-2xl font-bold">{locationStats.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {locationStats.filter(s => s.pickupCount > 0).length} pickup / {locationStats.filter(s => s.dropoffCount > 0).length} dropoff
          </div>
        </Card>
      </div>

      <div className="rounded-lg overflow-hidden border mb-4" style={{ height: '400px' }}>
        <OpenFreeMap
          center={[40.7128, -74.0060]}
          zoom={11}
          markers={markers}
          className="w-full h-full"
          enableClustering={true}
          style={mapStyle}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={18} className="text-primary" weight="fill" />
          <h4 className="text-sm font-semibold">Top 5 Locations by Earnings</h4>
        </div>
        
        {topLocations.map((stat, index) => (
          <div
            key={stat.location}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs w-8 justify-center">
                #{index + 1}
              </Badge>
              <div>
                <div className="font-semibold capitalize">{stat.location}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.pickupCount > 0 && `${stat.pickupCount} pickup${stat.pickupCount !== 1 ? 's' : ''}`}
                  {stat.pickupCount > 0 && stat.dropoffCount > 0 && ' • '}
                  {stat.dropoffCount > 0 && `${stat.dropoffCount} dropoff${stat.dropoffCount !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold font-mono">{formatCurrency(stat.totalEarnings)}</div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(stat.avgEarnings)} avg
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

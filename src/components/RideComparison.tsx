import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Ride } from '@/lib/ride-types'
import { calculateRideStats, getPlatformRideStats, formatDistance, formatDuration } from '@/lib/ride-utils'
import { formatCurrency } from '@/lib/earnings-utils'
import { exportRidesToCSV } from '@/lib/csv-export'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RideDialog } from './RideDialog'
import { RideCard } from './RideCard'
import { RideFilters, RideFilterOptions } from './RideFilters'
import { SmartRideRecommender } from './SmartRideRecommender'
import { LocationComparisonMap } from './LocationComparisonMap'
import { toast } from 'sonner'
import { 
  Plus, 
  MapTrifold, 
  Path,
  Clock,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  ChartBar,
  Lightbulb,
  DownloadSimple
} from '@phosphor-icons/react'

export function RideComparison() {
  const [rides, setRides] = useKV<Ride[]>('driver-rides', [])
  const [isRideDialogOpen, setIsRideDialogOpen] = useState(false)
  const [editingRide, setEditingRide] = useState<Ride | null>(null)
  const [filters, setFilters] = useState<RideFilterOptions>({
    platforms: [],
    dateFrom: '',
    dateTo: '',
    datePreset: 'all'
  })

  const availablePlatforms = useMemo(() => {
    const platforms = new Set((rides || []).map(r => r.platform))
    return Array.from(platforms).sort()
  }, [rides])

  const filteredRides = useMemo(() => {
    let filtered = rides || []

    if (filters.platforms.length > 0) {
      filtered = filtered.filter(ride => filters.platforms.includes(ride.platform))
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(ride => ride.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter(ride => ride.date <= filters.dateTo)
    }

    return filtered
  }, [rides, filters])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.platforms.length > 0) count++
    if (filters.dateFrom || filters.dateTo) count++
    return count
  }, [filters])

  const stats = calculateRideStats(filteredRides)
  const platformStats = getPlatformRideStats(filteredRides)

  const handleSaveRide = (ride: Ride) => {
    setRides((currentRides) => {
      const existing = (currentRides || []).find(r => r.id === ride.id)
      if (existing) {
        return (currentRides || []).map(r => r.id === ride.id ? ride : r)
      } else {
        return [...(currentRides || []), ride]
      }
    })
    setEditingRide(null)
  }

  const handleEditRide = (ride: Ride) => {
    setEditingRide(ride)
    setIsRideDialogOpen(true)
  }

  const handleDeleteRide = (rideId: string) => {
    setRides((currentRides) => (currentRides || []).filter(r => r.id !== rideId))
  }

  const handleAddRide = () => {
    setEditingRide(null)
    setIsRideDialogOpen(true)
  }

  const handleExportCSV = () => {
    if (filteredRides.length === 0) {
      toast.error('No rides to export')
      return
    }

    let filterDescription = ''
    if (activeFiltersCount > 0) {
      const parts: string[] = []
      if (filters.platforms.length > 0) {
        parts.push(filters.platforms.join('_'))
      }
      if (filters.datePreset !== 'all') {
        parts.push(filters.datePreset)
      }
      filterDescription = parts.join('_')
    }

    exportRidesToCSV(filteredRides, filterDescription)
    toast.success(`Exported ${filteredRides.length} ride${filteredRides.length !== 1 ? 's' : ''} to CSV`)
  }

  const sortedRides = [...filteredRides].sort((a, b) => {
    const dateTimeA = new Date(a.date + 'T' + a.time).getTime()
    const dateTimeB = new Date(b.date + 'T' + b.time).getTime()
    return dateTimeB - dateTimeA
  })

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border mb-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <MapTrifold size={22} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-1">Ride Comparison</h2>
            <p className="text-xs text-muted-foreground">
              Compare rides by distance, time & pay to find best platforms
            </p>
          </div>
        </div>
      </div>

      <SmartRideRecommender />

      {(rides || []).length > 0 && (
        <RideFilters
          filters={filters}
          onFiltersChange={setFilters}
          availablePlatforms={availablePlatforms}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {filteredRides.length > 0 && (
        <>
          <LocationComparisonMap rides={filteredRides} />

          <div className="grid gap-3 md:grid-cols-4 mb-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rides</span>
                <MapTrifold size={18} className="text-primary" weight="fill" />
              </div>
              <div className="text-2xl font-bold">{stats.totalRides}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistance(stats.totalDistance)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Pay</span>
                <CurrencyDollar size={18} className="text-success" weight="fill" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageNetPay)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatCurrency(stats.totalNetPay)} total
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fuel</span>
                <Path size={18} className="text-warning" weight="bold" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalFuelCost)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatCurrency(stats.averageFuelCostPerMile)}/mi
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Profit</span>
                <TrendUp size={18} className="text-accent" weight="bold" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {formatCurrency(stats.averageProfitPerMile)}/mi
              </div>
            </Card>
          </div>

          {platformStats.length > 1 && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <ChartBar size={24} className="text-primary" weight="fill" />
                <h3 className="text-xl font-semibold">Platform Comparison</h3>
              </div>

              <div className="space-y-4">
                {platformStats.map((platform, index) => {
                  const maxProfitPerMile = platformStats[0].averageProfitPerMile
                  const progressProfit = maxProfitPerMile > 0 ? (platform.averageProfitPerMile / maxProfitPerMile) * 100 : 0
                  
                  return (
                    <div key={platform.platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {index === 0 && (
                            <Badge className="bg-accent text-accent-foreground">Best Profit/mi</Badge>
                          )}
                          <span className="font-semibold capitalize">{platform.platform}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {platform.rides} rides
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold font-mono">{formatCurrency(platform.averageProfitPerMile)}/mi</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(platform.totalFuelCost)} fuel cost
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progressProfit} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDistance(platform.totalDistance)} total • {formatCurrency(platform.totalProfit)} profit</span>
                        <span className="text-destructive">{platform.feePercentage.toFixed(1)}% avg fees</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {stats.bestRide && stats.worstRide && (rides || []).length >= 3 && (
            <Card className="p-6 mb-6 bg-gradient-to-br from-accent/5 to-warning/5 border-accent/30">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20">
                  <Lightbulb size={24} className="text-accent" weight="fill" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Ride Insights</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <TrendUp size={24} className="text-success flex-shrink-0 mt-0.5" weight="bold" />
                      <div>
                        <div className="font-semibold text-success mb-1">Most Profitable</div>
                        <div className="text-sm">
                          <span className="capitalize font-medium">{stats.bestRide.platform}</span>
                          {' • '}
                          {formatDistance(stats.bestRide.distance)} for {formatCurrency(stats.bestRide.netPay)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(stats.bestRide.distance > 0 ? 
                            (stats.bestRide.netPay - (stats.bestRide.fuelCost || 0)) / stats.bestRide.distance : 0)}/mi profit
                          {stats.bestRide.fuelCost && ` • ${formatCurrency(stats.bestRide.fuelCost)} fuel`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <TrendDown size={24} className="text-destructive flex-shrink-0 mt-0.5" weight="bold" />
                      <div>
                        <div className="font-semibold text-destructive mb-1">Least Profitable</div>
                        <div className="text-sm">
                          <span className="capitalize font-medium">{stats.worstRide.platform}</span>
                          {' • '}
                          {formatDistance(stats.worstRide.distance)} for {formatCurrency(stats.worstRide.netPay)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(stats.worstRide.distance > 0 ? 
                            (stats.worstRide.netPay - (stats.worstRide.fuelCost || 0)) / stats.worstRide.distance : 0)}/mi profit
                          {' • '}
                          Avoid similar routes
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-foreground/80">
                    💡 <strong>Tip:</strong> {stats.totalFuelCost > 0 
                      ? `Track fuel costs to maximize profit. Your current fuel cost is ${formatCurrency(stats.averageFuelCostPerMile)}/mi.`
                      : `Add fuel costs to your rides to track actual profit after expenses.`
                    } Focus on rides with the best profit-per-mile ratio on {platformStats[0]?.platform || 'your top platform'}.
                  </div>
                </div>
              </div>
            </Card>
          )}

          {filteredRides.length !== (rides || []).length && (
            <Card className="p-4 mb-6 bg-accent/10 border-accent/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono text-sm">
                    {filteredRides.length} of {(rides || []).length} rides
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Showing filtered results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <DownloadSimple size={16} weight="bold" className="mr-1" />
                    Export Filtered
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      platforms: [],
                      dateFrom: '',
                      dateTo: '',
                      datePreset: 'all'
                    })}
                    className="text-accent hover:text-accent/90"
                  >
                    View All Rides
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Rides</h2>
        <div className="flex items-center gap-2">
          {(rides || []).length > 0 && (
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <DownloadSimple size={16} weight="bold" className="mr-1" />
              Export
            </Button>
          )}
          <Button 
            onClick={handleAddRide}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={18} weight="bold" className="mr-1" />
            Add
          </Button>
        </div>
      </div>

      {(rides || []).length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-3">
            <MapTrifold size={24} className="text-accent" />
          </div>
          <h3 className="text-base font-semibold mb-1">Compare Rides</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Track rides to compare platforms & routes
          </p>
          <Button 
            onClick={handleAddRide}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={18} weight="bold" className="mr-1" />
            Log Ride
          </Button>
        </Card>
      ) : filteredRides.length === 0 ? (
        <Card className="p-8 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3">
            <MapTrifold size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">No Matches</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Adjust filters to see results
          </p>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setFilters({
              platforms: [],
              dateFrom: '',
              dateTo: '',
              datePreset: 'all'
            })}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sortedRides.map(ride => (
            <RideCard 
              key={ride.id}
              ride={ride}
              onEdit={handleEditRide}
              onDelete={handleDeleteRide}
            />
          ))}
        </div>
      )}

      <RideDialog
        open={isRideDialogOpen}
        onOpenChange={(open) => {
          setIsRideDialogOpen(open)
          if (!open) setEditingRide(null)
        }}
        ride={editingRide}
        onSave={handleSaveRide}
      />
    </>
  )
}

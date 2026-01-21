import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, TrendUp, CurrencyDollar, DownloadSimple, CalendarBlank, X, ChartBar, Globe, Palette } from '@phosphor-icons/react'
import { Shift } from '@/lib/earnings-types'
import { toast } from 'sonner'
import * as d3 from 'd3'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { OpenFreeMap, MapStyle } from '@/components/OpenFreeMap'
import { useKV } from '@github/spark/hooks'

interface LocationData {
  location: string
  earnings: number
  trips: number
  hours: number
  avgHourly: number
  count: number
}

interface LocationHeatmapProps {
  shifts: Shift[]
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

export function LocationHeatmap({ shifts }: LocationHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [viewMode, setViewMode] = useState<'chart' | 'map'>('chart')
  const [mapStyle, setMapStyle] = useKV<MapStyle>('map-style', 'liberty')

  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined })
  }

  const filteredShifts = dateRange.from || dateRange.to
    ? shifts.filter(shift => {
        const shiftDate = new Date(shift.date)
        if (dateRange.from && dateRange.to) {
          return shiftDate >= dateRange.from && shiftDate <= dateRange.to
        } else if (dateRange.from) {
          return shiftDate >= dateRange.from
        } else if (dateRange.to) {
          return shiftDate <= dateRange.to
        }
        return true
      })
    : shifts

  useEffect(() => {
    const shiftsWithLocation = filteredShifts.filter(s => s.startLocation && s.startLocation.trim() !== '')
    
    const locationMap = new Map<string, {
      earnings: number
      trips: number
      hours: number
      count: number
    }>()

    shiftsWithLocation.forEach(shift => {
      const loc = shift.startLocation!.trim().toLowerCase()
      const existing = locationMap.get(loc) || { earnings: 0, trips: 0, hours: 0, count: 0 }
      
      const hours = shift.startTime && shift.endTime 
        ? (new Date(`1970-01-01T${shift.endTime}`).getTime() - new Date(`1970-01-01T${shift.startTime}`).getTime()) / (1000 * 60 * 60)
        : 0

      locationMap.set(loc, {
        earnings: existing.earnings + (shift.earnings - (shift.expenses || 0)),
        trips: existing.trips + (shift.trips || 0),
        hours: existing.hours + hours,
        count: existing.count + 1
      })
    })

    const data = Array.from(locationMap.entries()).map(([location, stats]) => ({
      location: location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      earnings: stats.earnings,
      trips: stats.trips,
      hours: stats.hours,
      avgHourly: stats.hours > 0 ? stats.earnings / stats.hours : 0,
      count: stats.count
    })).sort((a, b) => b.earnings - a.earnings)

    setLocationData(data)
  }, [filteredShifts])

  useEffect(() => {
    if (!svgRef.current || locationData.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = Math.max(450, Math.min(locationData.length * 60, 800))

    svg.attr('width', width).attr('height', height)

    const margin = { top: 20, right: 80, bottom: 40, left: 140 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const maxEarnings = d3.max(locationData, d => d.earnings) || 1
    const minEarnings = d3.min(locationData, d => d.earnings) || 0
    
    const colorScale = d3.scaleSequential()
      .domain([minEarnings, maxEarnings])
      .interpolator(t => {
        if (t < 0.2) return d3.interpolateRgb('#f0f4f8', '#bfdbfe')(t * 5)
        if (t < 0.5) return d3.interpolateRgb('#bfdbfe', '#60a5fa')(t * 2)
        if (t < 0.8) return d3.interpolateRgb('#60a5fa', '#3b82f6')(t * 1.5)
        return d3.interpolateRgb('#3b82f6', '#1e40af')(t * 1.2)
      })

    const yScale = d3.scaleBand()
      .domain(locationData.map(d => d.location))
      .range([0, innerHeight])
      .padding(0.15)

    const xScale = d3.scaleLinear()
      .domain([0, maxEarnings * 1.1])
      .range([0, innerWidth])

    const barHeight = Math.min(yScale.bandwidth(), 45)

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-opacity', 0.9)
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-opacity', 1)

    const bars = g.selectAll('.bar-group')
      .data(locationData)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(0, ${yScale(d.location) || 0})`)

    bars.append('rect')
      .attr('class', 'bar-shadow')
      .attr('x', 2)
      .attr('y', 2)
      .attr('height', barHeight)
      .attr('width', 0)
      .attr('fill', '#000')
      .attr('opacity', 0.1)
      .attr('rx', 6)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('width', d => xScale(d.earnings))

    bars.append('rect')
      .attr('class', 'bar-main')
      .attr('y', 0)
      .attr('height', barHeight)
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', d => colorScale(d.earnings))
      .attr('rx', 6)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))')
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('width', d => xScale(d.earnings))

    bars.selectAll('.bar-main')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .style('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))')
          .attr('transform', 'translateY(-2px)')
        setSelectedLocation(d)
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))')
          .attr('transform', 'translateY(0)')
      })

    bars.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', barHeight / 2)
      .attr('y2', barHeight / 2)
      .attr('stroke', d => {
        const baseColor = colorScale(d.earnings)
        return d3.color(baseColor)?.darker(0.8).toString() || baseColor
      })
      .attr('stroke-width', 2)
      .attr('opacity', 0.3)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('x2', d => xScale(d.earnings))

    g.selectAll('.label')
      .data(locationData)
      .join('text')
      .attr('class', 'label')
      .attr('x', -10)
      .attr('y', d => (yScale(d.location) || 0) + barHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('font-size', '13px')
      .style('fill', '#475569')
      .style('font-weight', '600')
      .style('opacity', 0)
      .text(d => d.location)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .style('opacity', 1)

    g.selectAll('.value')
      .data(locationData)
      .join('text')
      .attr('class', 'value')
      .attr('x', d => xScale(d.earnings) + 10)
      .attr('y', d => (yScale(d.location) || 0) + barHeight / 2)
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('fill', '#0f172a')
      .style('font-weight', '700')
      .style('opacity', 0)
      .text(d => `$${d.earnings.toFixed(0)}`)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .style('opacity', 1)

    g.selectAll('.hourly-rate')
      .data(locationData)
      .join('text')
      .attr('class', 'hourly-rate')
      .attr('x', d => xScale(d.earnings) + 10)
      .attr('y', d => (yScale(d.location) || 0) + barHeight / 2 + 14)
      .style('font-size', '10px')
      .style('fill', '#64748b')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text(d => `$${d.avgHourly.toFixed(0)}/hr`)
      .transition()
      .duration(600)
      .delay((d, i) => i * 50)
      .style('opacity', 1)

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, ${height - 25})`)

    const legendWidth = 200
    const legendHeight = 10
    const legendSteps = 20

    for (let i = 0; i < legendSteps; i++) {
      legend.append('rect')
        .attr('x', i * (legendWidth / legendSteps))
        .attr('width', legendWidth / legendSteps)
        .attr('height', legendHeight)
        .attr('fill', colorScale(minEarnings + (i / legendSteps) * (maxEarnings - minEarnings)))
        .attr('rx', i === 0 ? 2 : i === legendSteps - 1 ? 2 : 0)
    }

    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 14)
      .style('font-size', '10px')
      .style('fill', '#64748b')
      .text(`$${minEarnings.toFixed(0)}`)

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 14)
      .attr('text-anchor', 'end')
      .style('font-size', '10px')
      .style('fill', '#64748b')
      .text(`$${maxEarnings.toFixed(0)}`)

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#475569')
      .style('font-weight', '600')
      .text('Earnings Intensity')

  }, [locationData])

  const handleExportCSV = () => {
    if (locationData.length === 0) {
      toast.error('No location data to export')
      return
    }

    const csvHeaders = [
      'Location',
      'Total Earnings',
      'Total Trips',
      'Hours Worked',
      'Hourly Rate',
      'Number of Shifts',
      'Avg Earnings per Shift',
      'Avg Trips per Shift'
    ]

    const csvRows = locationData.map(location => [
      location.location,
      location.earnings.toFixed(2),
      location.trips,
      location.hours.toFixed(2),
      location.avgHourly.toFixed(2),
      location.count,
      (location.earnings / location.count).toFixed(2),
      (location.trips / location.count).toFixed(2)
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    let filename = 'location-earnings'
    if (dateRange.from && dateRange.to) {
      filename += `-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}`
    } else if (dateRange.from) {
      filename += `-from-${format(dateRange.from, 'yyyy-MM-dd')}`
    } else if (dateRange.to) {
      filename += `-until-${format(dateRange.to, 'yyyy-MM-dd')}`
    } else {
      filename += `-${new Date().toISOString().split('T')[0]}`
    }
    filename += '.csv'
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Location earnings exported to CSV')
  }

  if (locationData.length === 0) {
    return null
  }

  const topLocation = locationData[0]
  const totalEarnings = locationData.reduce((sum, d) => sum + d.earnings, 0)

  const avgHourlyAcrossAll = locationData.reduce((sum, d) => sum + d.avgHourly, 0) / locationData.length

  const mapMarkers = locationData.map(loc => {
    const normalizedName = loc.location.toLowerCase()
    const coords = NYC_NEIGHBORHOODS[normalizedName] || [40.7128, -74.0060]
    return {
      position: coords as [number, number],
      label: loc.location,
      earnings: loc.earnings
    }
  })

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 border-primary/30 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-gradient-to-br from-primary to-primary/80 p-2.5 shadow-md">
          <MapPin size={22} className="text-primary-foreground" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.95rem,2.8vw,1.2rem)] font-bold mb-0.5 line-clamp-1 tracking-tight">
            Neighborhood Earnings Map
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Identify high-earning pickup zones across NYC
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 border-primary/30",
                  (dateRange.from || dateRange.to) && "border-primary bg-primary/5"
                )}
              >
                <CalendarBlank size={16} weight="bold" />
                <span className="hidden sm:inline">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  setDateRange({ from: range?.from, to: range?.to })
                }}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
              {(dateRange.from || dateRange.to) && (
                <div className="p-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearDateRange}
                    className="w-full gap-1.5 h-8 text-[clamp(0.7rem,2vw,0.8rem)]"
                  >
                    <X size={16} weight="bold" />
                    Clear Dates
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleExportCSV}
            size="sm"
            variant="outline"
            className="h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 border-primary/30"
          >
            <DownloadSimple size={16} weight="bold" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {(dateRange.from || dateRange.to) && (
        <div className="mb-3 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary font-medium">
            {dateRange.from && dateRange.to ? (
              <>Showing data from {format(dateRange.from, "MMM d, yyyy")} to {format(dateRange.to, "MMM d, yyyy")}</>
            ) : dateRange.from ? (
              <>Showing data from {format(dateRange.from, "MMM d, yyyy")} onwards</>
            ) : (
              <>Showing data until {format(dateRange.to!, "MMM d, yyyy")}</>
            )}
            {' '}• {filteredShifts.length} {filteredShifts.length === 1 ? 'shift' : 'shifts'}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-success/20 to-success/10 rounded-lg p-3 border border-success/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={16} className="text-success flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-success/90 uppercase tracking-wide font-semibold">
              Top Zone
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] line-clamp-1 text-success">
            {topLocation.location}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-success/80 mt-0.5">
            ${topLocation.earnings.toFixed(0)} earned
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-3 border border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <CurrencyDollar size={16} className="text-primary flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-primary/90 uppercase tracking-wide font-semibold">
              Best Rate
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] text-primary">
            ${topLocation.avgHourly.toFixed(2)}/hr
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary/80 mt-0.5 line-clamp-1">
            {topLocation.location}
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-accent flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Zones
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
            {locationData.length}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            Areas tracked
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <CurrencyDollar size={16} className="text-muted-foreground flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Avg Rate
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
            ${avgHourlyAcrossAll.toFixed(2)}/hr
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            All zones
          </div>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'chart' | 'map')} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="chart" className="gap-1.5">
            <ChartBar size={16} weight="fill" />
            <span>Chart</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-1.5">
            <Globe size={16} weight="fill" />
            <span>Map</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <div className="bg-card rounded-lg p-4 border shadow-sm">
            <svg ref={svgRef} className="w-full" />
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="mb-4">
            <div className="text-[clamp(0.8rem,2.2vw,0.9rem)] font-semibold mb-3 flex items-center gap-2">
              <Palette size={18} weight="fill" className="text-primary" />
              Map Style
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMapStyle('liberty')}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  mapStyle === 'liberty' ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-2 left-2 right-2 h-px bg-white/20" />
                    <div className="absolute top-4 left-2 right-2 h-px bg-white/20" />
                    <div className="absolute top-6 left-2 right-2 h-px bg-white/15" />
                    <div className="absolute bottom-4 left-2 w-12 h-12 rounded-full bg-blue-400/30 blur-sm" />
                    <div className="absolute top-8 right-4 w-8 h-8 bg-green-400/20 blur-sm" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex gap-1">
                      <div className="h-3 w-16 bg-white/30 rounded-sm backdrop-blur-sm" />
                      <div className="h-3 w-10 bg-white/20 rounded-sm backdrop-blur-sm" />
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "p-2 text-center transition-colors",
                  mapStyle === 'liberty' ? 'bg-primary/10' : 'bg-muted/30'
                )}>
                  <div className={cn(
                    "font-semibold text-[clamp(0.75rem,2vw,0.85rem)]",
                    mapStyle === 'liberty' ? 'text-primary' : 'text-foreground'
                  )}>
                    Liberty
                  </div>
                  <div className="text-[clamp(0.65rem,1.8vw,0.7rem)] text-muted-foreground">
                    Detailed streets
                  </div>
                </div>
                {mapStyle === 'liberty' && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setMapStyle('bright')}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  mapStyle === 'bright' ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-3 left-3 right-3 h-px bg-orange-300/40" />
                    <div className="absolute top-5 left-3 right-3 h-px bg-orange-300/40" />
                    <div className="absolute top-7 left-3 right-3 h-px bg-orange-200/30" />
                    <div className="absolute bottom-5 left-3 w-10 h-10 rounded-full bg-cyan-300/40 blur-sm" />
                    <div className="absolute top-6 right-5 w-6 h-6 bg-lime-300/40 blur-sm" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,191,36,0.1),transparent_50%)]" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex gap-1">
                      <div className="h-3 w-14 bg-orange-400/40 rounded-sm" />
                      <div className="h-3 w-8 bg-yellow-400/30 rounded-sm" />
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "p-2 text-center transition-colors",
                  mapStyle === 'bright' ? 'bg-primary/10' : 'bg-muted/30'
                )}>
                  <div className={cn(
                    "font-semibold text-[clamp(0.75rem,2vw,0.85rem)]",
                    mapStyle === 'bright' ? 'text-primary' : 'text-foreground'
                  )}>
                    Bright
                  </div>
                  <div className="text-[clamp(0.65rem,1.8vw,0.7rem)] text-muted-foreground">
                    Vibrant colors
                  </div>
                </div>
                {mapStyle === 'bright' && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              <button
                onClick={() => setMapStyle('positron')}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  mapStyle === 'positron' ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-3 left-3 right-3 h-px bg-gray-300/50" />
                    <div className="absolute top-5 left-3 right-3 h-px bg-gray-300/50" />
                    <div className="absolute top-7 left-3 right-3 h-px bg-gray-200/40" />
                    <div className="absolute bottom-5 left-3 w-10 h-10 rounded-full bg-blue-200/30 blur-sm" />
                    <div className="absolute top-6 right-5 w-6 h-6 bg-emerald-200/30 blur-sm" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex gap-1">
                      <div className="h-3 w-12 bg-gray-300/50 rounded-sm" />
                      <div className="h-3 w-8 bg-gray-200/40 rounded-sm" />
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "p-2 text-center transition-colors",
                  mapStyle === 'positron' ? 'bg-primary/10' : 'bg-muted/30'
                )}>
                  <div className={cn(
                    "font-semibold text-[clamp(0.75rem,2vw,0.85rem)]",
                    mapStyle === 'positron' ? 'text-primary' : 'text-foreground'
                  )}>
                    Positron
                  </div>
                  <div className="text-[clamp(0.65rem,1.8vw,0.7rem)] text-muted-foreground">
                    Clean & minimal
                  </div>
                </div>
                {mapStyle === 'positron' && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <OpenFreeMap
              center={[40.7128, -74.0060]}
              zoom={11}
              markers={mapMarkers}
              className="rounded-lg"
              style={mapStyle}
              onMarkerClick={(label) => {
                const location = locationData.find(loc => loc.location === label)
                if (location) {
                  setSelectedLocation(location)
                }
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {selectedLocation && (
        <div className="bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/40 rounded-lg p-4 shadow-md">
          <div className="flex items-start gap-3 mb-3">
            <div className="rounded-full bg-accent/30 p-2">
              <MapPin size={20} className="text-accent flex-shrink-0" weight="fill" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[clamp(0.9rem,2.8vw,1.1rem)] mb-2 line-clamp-1">
                {selectedLocation.location}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-card/80 rounded-md p-2 border">
                  <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mb-0.5 uppercase tracking-wide">
                    Total Earned
                  </div>
                  <div className="font-bold text-[clamp(0.95rem,3vw,1.15rem)] text-success">
                    ${selectedLocation.earnings.toFixed(0)}
                  </div>
                </div>
                
                <div className="bg-card/80 rounded-md p-2 border">
                  <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mb-0.5 uppercase tracking-wide">
                    Hourly Rate
                  </div>
                  <div className="font-bold text-[clamp(0.95rem,3vw,1.15rem)] text-primary">
                    ${selectedLocation.avgHourly.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-card/80 rounded-md p-2 border">
                  <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mb-0.5 uppercase tracking-wide">
                    Total Trips
                  </div>
                  <div className="font-bold text-[clamp(0.95rem,3vw,1.15rem)]">
                    {selectedLocation.trips}
                  </div>
                </div>
                
                <div className="bg-card/80 rounded-md p-2 border">
                  <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mb-0.5 uppercase tracking-wide">
                    Shifts
                  </div>
                  <div className="font-bold text-[clamp(0.95rem,3vw,1.15rem)]">
                    {selectedLocation.count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-accent/20">
            <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
              <span className="font-semibold text-foreground">{((selectedLocation.earnings / totalEarnings) * 100).toFixed(1)}%</span> of total earnings
            </div>
            <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
              <span className="font-semibold text-foreground">{(selectedLocation.hours).toFixed(1)} hrs</span> worked here
            </div>
          </div>
          
          {selectedLocation.avgHourly > topLocation.avgHourly * 0.8 && (
            <div className="mt-3 pt-3 border-t border-accent/20">
              <div className="flex items-start gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)] text-success">
                <TrendUp size={16} className="flex-shrink-0 mt-0.5" weight="fill" />
                <span className="font-medium">High-earning zone • Consider prioritizing this area during peak hours</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

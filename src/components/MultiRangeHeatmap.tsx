import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CalendarBlank, Plus, Trash, Eye, EyeSlash, DownloadSimple, FileCsv, TrendUp, MapPin } from '@phosphor-icons/react'
import { Shift } from '@/lib/earnings-types'
import { toast } from 'sonner'
import * as d3 from 'd3'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useKV } from '@github/spark/hooks'

interface LocationData {
  location: string
  earnings: number
  trips: number
  hours: number
  avgHourly: number
  count: number
}

interface DateRangeOverlay {
  id: string
  name: string
  from: Date
  to: Date
  color: string
  visible: boolean
}

interface MultiRangeHeatmapProps {
  shifts: Shift[]
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6', rgb: 'rgb(59, 130, 246)' },
  { name: 'Green', value: '#10b981', rgb: 'rgb(16, 185, 129)' },
  { name: 'Purple', value: '#8b5cf6', rgb: 'rgb(139, 92, 246)' },
  { name: 'Orange', value: '#f97316', rgb: 'rgb(249, 115, 22)' },
  { name: 'Pink', value: '#ec4899', rgb: 'rgb(236, 72, 153)' },
  { name: 'Teal', value: '#14b8a6', rgb: 'rgb(20, 184, 166)' },
  { name: 'Red', value: '#ef4444', rgb: 'rgb(239, 68, 68)' },
  { name: 'Yellow', value: '#eab308', rgb: 'rgb(234, 179, 8)' },
]

export function MultiRangeHeatmap({ shifts }: MultiRangeHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dateRangeOverlays, setDateRangeOverlays] = useKV<DateRangeOverlay[]>('multi-range-overlays', [])
  const [showOverlayManager, setShowOverlayManager] = useState(false)
  const [newOverlayName, setNewOverlayName] = useState('')
  const [newOverlayDateRange, setNewOverlayDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [newOverlayColor, setNewOverlayColor] = useState(PRESET_COLORS[0].value)

  const handleAddOverlay = () => {
    if (!newOverlayName.trim()) {
      toast.error('Please enter a name for the overlay')
      return
    }
    if (!newOverlayDateRange.from || !newOverlayDateRange.to) {
      toast.error('Please select a complete date range')
      return
    }

    const newOverlay: DateRangeOverlay = {
      id: `overlay-${Date.now()}`,
      name: newOverlayName,
      from: newOverlayDateRange.from,
      to: newOverlayDateRange.to,
      color: newOverlayColor,
      visible: true
    }

    setDateRangeOverlays((current) => [...(current || []), newOverlay])
    setNewOverlayName('')
    setNewOverlayDateRange({ from: undefined, to: undefined })
    setNewOverlayColor(PRESET_COLORS[0].value)
    toast.success(`Added overlay: ${newOverlayName}`)
  }

  const handleRemoveOverlay = (id: string) => {
    setDateRangeOverlays((current) => (current || []).filter(o => o.id !== id))
    toast.success('Overlay removed')
  }

  const handleToggleOverlayVisibility = (id: string) => {
    setDateRangeOverlays((current) =>
      (current || []).map(o => o.id === id ? { ...o, visible: !o.visible } : o)
    )
  }

  const visibleOverlays = (dateRangeOverlays || []).filter(o => o.visible)

  const getShiftsForDateRange = (from: Date, to: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date)
      return shiftDate >= from && shiftDate <= to
    })
  }

  const processLocationData = (filteredShifts: Shift[]): LocationData[] => {
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

    return Array.from(locationMap.entries()).map(([location, stats]) => ({
      location: location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      earnings: stats.earnings,
      trips: stats.trips,
      hours: stats.hours,
      avgHourly: stats.hours > 0 ? stats.earnings / stats.hours : 0,
      count: stats.count
    })).sort((a, b) => b.earnings - a.earnings)
  }

  const overlayDataMap = new Map(
    visibleOverlays.map(overlay => [
      overlay.id,
      processLocationData(getShiftsForDateRange(overlay.from, overlay.to))
    ])
  )

  const allLocations = Array.from(new Set(
    Array.from(overlayDataMap.values()).flatMap(data => data.map(d => d.location))
  )).sort()

  useEffect(() => {
    if (!svgRef.current || allLocations.length === 0 || visibleOverlays.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const barHeight = 40
    const overlaySpacing = 8
    const groupHeight = barHeight * visibleOverlays.length + overlaySpacing * (visibleOverlays.length - 1)
    const locationSpacing = 20
    const height = Math.max(450, allLocations.length * (groupHeight + locationSpacing) + 80)

    svg.attr('width', width).attr('height', height)

    const margin = { top: 40, right: 120, bottom: 40, left: 160 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const maxEarnings = Math.max(...Array.from(overlayDataMap.values()).flatMap(data => data.map(d => d.earnings)))
    
    const xScale = d3.scaleLinear()
      .domain([0, maxEarnings * 1.1])
      .range([0, innerWidth])

    allLocations.forEach((location, locIdx) => {
      const yPos = locIdx * (groupHeight + locationSpacing)

      g.append('text')
        .attr('x', -10)
        .attr('y', yPos + groupHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .style('fill', '#475569')
        .style('font-weight', '600')
        .text(location)

      visibleOverlays.forEach((overlay, overlayIdx) => {
        const overlayData = overlayDataMap.get(overlay.id) || []
        const locationData = overlayData.find(d => d.location === location)
        const earnings = locationData?.earnings || 0

        const barY = yPos + overlayIdx * (barHeight + overlaySpacing)

        if (earnings > 0) {
          g.append('rect')
            .attr('x', 2)
            .attr('y', barY + 2)
            .attr('height', barHeight - 4)
            .attr('width', 0)
            .attr('fill', '#000')
            .attr('opacity', 0.1)
            .attr('rx', 4)
            .transition()
            .duration(800)
            .delay(locIdx * 30 + overlayIdx * 15)
            .attr('width', xScale(earnings))

          g.append('rect')
            .attr('x', 0)
            .attr('y', barY)
            .attr('height', barHeight - 4)
            .attr('width', 0)
            .attr('fill', overlay.color)
            .attr('opacity', 0.8)
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .transition()
            .duration(800)
            .delay(locIdx * 30 + overlayIdx * 15)
            .attr('width', xScale(earnings))

          g.append('text')
            .attr('x', xScale(earnings) + 10)
            .attr('y', barY + (barHeight - 4) / 2)
            .attr('dy', '0.35em')
            .style('font-size', '13px')
            .style('fill', '#0f172a')
            .style('font-weight', '700')
            .style('opacity', 0)
            .text(`$${earnings.toFixed(0)}`)
            .transition()
            .duration(600)
            .delay(locIdx * 30 + overlayIdx * 15)
            .style('opacity', 1)
        }
      })
    })

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${margin.left}, 10)`)

    visibleOverlays.forEach((overlay, idx) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${idx * 180}, 0)`)

      legendItem.append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('fill', overlay.color)
        .attr('opacity', 0.8)
        .attr('rx', 3)

      legendItem.append('text')
        .attr('x', 22)
        .attr('y', 8)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#475569')
        .style('font-weight', '600')
        .text(overlay.name)
    })

  }, [allLocations, visibleOverlays, overlayDataMap])

  const handleExportCSV = () => {
    if (visibleOverlays.length === 0) {
      toast.error('No overlays to export')
      return
    }

    const csvHeaders = ['Location', ...visibleOverlays.map(o => `${o.name} (${format(o.from, 'MMM d')} - ${format(o.to, 'MMM d')})`)]
    
    const csvRows = allLocations.map(location => {
      const row = [location]
      visibleOverlays.forEach(overlay => {
        const overlayData = overlayDataMap.get(overlay.id) || []
        const locationData = overlayData.find(d => d.location === location)
        row.push(locationData?.earnings.toFixed(2) || '0.00')
      })
      return row
    })

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const filename = `multi-range-comparison-${new Date().toISOString().split('T')[0]}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Multi-range comparison exported to CSV')
  }

  if (shifts.length === 0) {
    return null
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-purple/10 via-purple/5 to-accent/5 border-purple/30 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 shadow-md">
          <TrendUp size={22} className="text-white" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.95rem,2.8vw,1.2rem)] font-bold mb-0.5 line-clamp-1 tracking-tight">
            Multi-Range Trend Analyzer
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Compare earnings across different time periods
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOverlayManager(!showOverlayManager)}
            className="h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 border-purple/30"
          >
            <Plus size={16} weight="bold" />
            <span className="hidden sm:inline">Add Range</span>
          </Button>
          {visibleOverlays.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 border-purple/30"
            >
              <DownloadSimple size={16} weight="bold" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
        </div>
      </div>

      {showOverlayManager && (
        <div className="mb-4 p-4 border border-purple/30 rounded-lg bg-card/50">
          <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-3">
            Add Date Range Overlay
          </h3>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="overlay-name" className="text-[clamp(0.75rem,2vw,0.8rem)] mb-1.5 block">
                Range Name
              </Label>
              <Input
                id="overlay-name"
                placeholder="e.g., December 2024, Summer Peak"
                value={newOverlayName}
                onChange={(e) => setNewOverlayName(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-[clamp(0.75rem,2vw,0.8rem)] mb-1.5 block">
                Date Range
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !newOverlayDateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarBlank size={16} weight="bold" className="mr-2" />
                    {newOverlayDateRange.from ? (
                      newOverlayDateRange.to ? (
                        <>
                          {format(newOverlayDateRange.from, "MMM d, yyyy")} - {format(newOverlayDateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(newOverlayDateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: newOverlayDateRange.from, to: newOverlayDateRange.to }}
                    onSelect={(range) => {
                      setNewOverlayDateRange({ from: range?.from, to: range?.to })
                    }}
                    numberOfMonths={2}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-[clamp(0.75rem,2vw,0.8rem)] mb-1.5 block">
                Color
              </Label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewOverlayColor(color.value)}
                    className={cn(
                      "w-full aspect-square rounded border-2 transition-all hover:scale-110",
                      newOverlayColor === color.value ? "border-foreground scale-110" : "border-border"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddOverlay}
              className="w-full h-9 gap-1.5"
            >
              <Plus size={16} weight="bold" />
              Add Overlay
            </Button>
          </div>
        </div>
      )}

      {(dateRangeOverlays || []).length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2">
            Active Overlays ({visibleOverlays.length})
          </h3>
          <div className="grid gap-2">
            {(dateRangeOverlays || []).map((overlay) => (
              <div
                key={overlay.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  overlay.visible ? "bg-card border-border" : "bg-muted/30 border-border/50 opacity-60"
                )}
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: overlay.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[clamp(0.8rem,2.3vw,0.9rem)] line-clamp-1">
                    {overlay.name}
                  </div>
                  <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                    {format(overlay.from, "MMM d, yyyy")} - {format(overlay.to, "MMM d, yyyy")}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleOverlayVisibility(overlay.id)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  {overlay.visible ? (
                    <Eye size={16} weight="bold" />
                  ) : (
                    <EyeSlash size={16} weight="bold" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveOverlay(overlay.id)}
                  className="h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash size={16} weight="bold" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {visibleOverlays.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg">
          <div className="p-3 rounded-full bg-muted mb-3">
            <TrendUp size={24} weight="fill" className="text-muted-foreground" />
          </div>
          <p className="text-[clamp(0.8rem,2.3vw,0.9rem)] font-semibold mb-1">
            No active overlays
          </p>
          <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground max-w-sm">
            Add date ranges to compare earnings trends across different time periods
          </p>
        </div>
      )}

      {visibleOverlays.length > 0 && allLocations.length > 0 && (
        <div className="bg-card rounded-lg p-4 border shadow-sm">
          <svg ref={svgRef} className="w-full" />
        </div>
      )}

      {visibleOverlays.length > 0 && allLocations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <MapPin size={24} weight="fill" className="text-muted-foreground" />
          </div>
          <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-muted-foreground">
            No location data found in selected date ranges
          </p>
        </div>
      )}
    </Card>
  )
}

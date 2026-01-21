import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, TrendUp, CurrencyDollar } from '@phosphor-icons/react'
import { Shift } from '@/lib/earnings-types'
import * as d3 from 'd3'

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

export function LocationHeatmap({ shifts }: LocationHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)

  useEffect(() => {
    const shiftsWithLocation = shifts.filter(s => s.startLocation && s.startLocation.trim() !== '')
    
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
  }, [shifts])

  useEffect(() => {
    if (!svgRef.current || locationData.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = svgRef.current.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = Math.max(400, locationData.length * 50)

    svg.attr('width', width).attr('height', height)

    const margin = { top: 20, right: 20, bottom: 40, left: 150 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const maxEarnings = d3.max(locationData, d => d.earnings) || 1
    
    const colorScale = d3.scaleSequential()
      .domain([0, maxEarnings])
      .interpolator(d3.interpolateRgb('#f0f4f8', '#2563eb'))

    const yScale = d3.scaleBand()
      .domain(locationData.map(d => d.location))
      .range([0, innerHeight])
      .padding(0.2)

    const xScale = d3.scaleLinear()
      .domain([0, maxEarnings])
      .range([0, innerWidth])

    g.selectAll('rect')
      .data(locationData)
      .join('rect')
      .attr('y', d => yScale(d.location) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', d => xScale(d.earnings))
      .attr('fill', d => colorScale(d.earnings))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
        setSelectedLocation(d)
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
      })

    g.selectAll('.label')
      .data(locationData)
      .join('text')
      .attr('class', 'label')
      .attr('x', -10)
      .attr('y', d => (yScale(d.location) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#64748b')
      .style('font-weight', '500')
      .text(d => d.location)

    g.selectAll('.value')
      .data(locationData)
      .join('text')
      .attr('class', 'value')
      .attr('x', d => xScale(d.earnings) + 8)
      .attr('y', d => (yScale(d.location) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#0f172a')
      .style('font-weight', '600')
      .text(d => `$${d.earnings.toFixed(0)}`)

  }, [locationData])

  if (locationData.length === 0) {
    return null
  }

  const topLocation = locationData[0]
  const totalEarnings = locationData.reduce((sum, d) => sum + d.earnings, 0)

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-primary/20 p-2">
          <MapPin size={20} className="text-primary" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
            Earnings by Start Location
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Which pickup areas generate the most income
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={16} className="text-success flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Top Location
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] line-clamp-1">
            {topLocation.location}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            ${topLocation.earnings.toFixed(0)} total earnings
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <CurrencyDollar size={16} className="text-primary flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Avg Hourly
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
            ${topLocation.avgHourly.toFixed(2)}/hr
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            From {topLocation.location}
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-accent flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Locations
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.2rem)]">
            {locationData.length}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            Areas tracked
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border mb-4">
        <svg ref={svgRef} className="w-full" />
      </div>

      {selectedLocation && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
          <div className="flex items-start gap-2 mb-2">
            <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <div className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] mb-1 line-clamp-1">
                {selectedLocation.location}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[clamp(0.7rem,2.2vw,0.8rem)]">
                <div>
                  <span className="text-muted-foreground">Earnings: </span>
                  <span className="font-semibold">${selectedLocation.earnings.toFixed(0)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hourly: </span>
                  <span className="font-semibold">${selectedLocation.avgHourly.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trips: </span>
                  <span className="font-semibold">{selectedLocation.trips}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Shifts: </span>
                  <span className="font-semibold">{selectedLocation.count}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
            {((selectedLocation.earnings / totalEarnings) * 100).toFixed(1)}% of total earnings from this location
          </div>
        </div>
      )}
    </Card>
  )
}

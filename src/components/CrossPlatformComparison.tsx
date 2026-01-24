import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  ChartBar, 
  TrendUp, 
  CurrencyDollar, 
  Clock,
  Package,
  CarProfile,
  Pizza,
  ArrowsClockwise,
  Percent,
  Calendar,
  Download
} from '@phosphor-icons/react'
import { startOfWeek, startOfMonth, format, subDays, subWeeks, subMonths, isWithinInterval } from 'date-fns'

interface Shift {
  id: string
  date: string
  platform: string
  hours: number
  earnings: number
  tips: number
  trips: number
  expenses: number
  platformType?: 'rideshare' | 'delivery' | 'package'
}

interface PlatformTypeData {
  type: string
  earnings: number
  hours: number
  trips: number
  tips: number
  expenses: number
  avgHourly: number
  avgPerTrip: number
  netEarnings: number
  color: string
}

const PLATFORM_TYPES = {
  rideshare: {
    label: 'Rideshare',
    color: 'oklch(0.45 0.15 260)',
    icon: CarProfile,
    platforms: ['Uber', 'Lyft', 'Via', 'Revel', 'Curb']
  },
  delivery: {
    label: 'Food Delivery',
    color: 'oklch(0.70 0.15 50)',
    icon: Pizza,
    platforms: ['Uber Eats', 'DoorDash', 'Grubhub', 'Relay', 'Seamless']
  },
  package: {
    label: 'Package Delivery',
    color: 'oklch(0.55 0.22 25)',
    icon: Package,
    platforms: ['Amazon Flex', 'UPS', 'FedEx', 'USPS', 'GoPuff']
  }
}

const getPlatformType = (platform: string): 'rideshare' | 'delivery' | 'package' => {
  const normalizedPlatform = platform.toLowerCase()
  
  if (PLATFORM_TYPES.rideshare.platforms.some(p => normalizedPlatform.includes(p.toLowerCase()))) {
    return 'rideshare'
  }
  if (PLATFORM_TYPES.delivery.platforms.some(p => normalizedPlatform.includes(p.toLowerCase()))) {
    return 'delivery'
  }
  if (PLATFORM_TYPES.package.platforms.some(p => normalizedPlatform.includes(p.toLowerCase()))) {
    return 'package'
  }
  
  return 'rideshare'
}

export function CrossPlatformComparison() {
  const [shifts] = useKV<Shift[]>('driver-shifts', [])
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const filteredShifts = useMemo(() => {
    if (!shifts || shifts.length === 0) return []
    
    const now = new Date()
    let startDate: Date | null = null

    switch (dateRange) {
      case '7d':
        startDate = subDays(now, 7)
        break
      case '30d':
        startDate = subDays(now, 30)
        break
      case '90d':
        startDate = subDays(now, 90)
        break
      case 'all':
        return shifts
    }

    if (!startDate) return shifts

    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date)
      return shiftDate >= startDate && shiftDate <= now
    })
  }, [shifts, dateRange])

  const platformTypeStats = useMemo(() => {
    const stats: Record<string, PlatformTypeData> = {}

    filteredShifts.forEach(shift => {
      const type = shift.platformType || getPlatformType(shift.platform)
      
      if (!stats[type]) {
        stats[type] = {
          type: PLATFORM_TYPES[type].label,
          earnings: 0,
          hours: 0,
          trips: 0,
          tips: 0,
          expenses: 0,
          avgHourly: 0,
          avgPerTrip: 0,
          netEarnings: 0,
          color: PLATFORM_TYPES[type].color
        }
      }

      stats[type].earnings += shift.earnings
      stats[type].hours += shift.hours
      stats[type].trips += shift.trips
      stats[type].tips += shift.tips || 0
      stats[type].expenses += shift.expenses || 0
    })

    Object.values(stats).forEach(stat => {
      stat.avgHourly = stat.hours > 0 ? stat.earnings / stat.hours : 0
      stat.avgPerTrip = stat.trips > 0 ? stat.earnings / stat.trips : 0
      stat.netEarnings = stat.earnings - stat.expenses
    })

    return Object.values(stats).sort((a, b) => b.earnings - a.earnings)
  }, [filteredShifts])

  const timeSeriesData = useMemo(() => {
    const dataByDate: Record<string, any> = {}

    filteredShifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'MMM dd')
      const type = shift.platformType || getPlatformType(shift.platform)

      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = { date: dateKey }
      }

      const typeKey = PLATFORM_TYPES[type].label
      dataByDate[dateKey][typeKey] = (dataByDate[dateKey][typeKey] || 0) + shift.earnings
    })

    return Object.values(dataByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [filteredShifts])

  const pieChartData = useMemo(() => {
    return platformTypeStats.map(stat => ({
      name: stat.type,
      value: stat.earnings,
      color: stat.color
    }))
  }, [platformTypeStats])

  const hourlyComparisonData = useMemo(() => {
    return platformTypeStats.map(stat => ({
      type: stat.type,
      hourlyRate: stat.avgHourly,
      trips: stat.avgPerTrip
    }))
  }, [platformTypeStats])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h${m > 0 ? ` ${m}m` : ''}`
  }

  const totalStats = useMemo(() => {
    return platformTypeStats.reduce(
      (acc, stat) => ({
        earnings: acc.earnings + stat.earnings,
        hours: acc.hours + stat.hours,
        trips: acc.trips + stat.trips,
        tips: acc.tips + stat.tips,
        expenses: acc.expenses + stat.expenses,
        netEarnings: acc.netEarnings + stat.netEarnings
      }),
      { earnings: 0, hours: 0, trips: 0, tips: 0, expenses: 0, netEarnings: 0 }
    )
  }, [platformTypeStats])

  const exportComparison = () => {
    const headers = ['Platform Type', 'Total Earnings', 'Hours', 'Trips', 'Tips', 'Expenses', 'Net Earnings', 'Avg Hourly', 'Avg Per Trip']
    const rows = platformTypeStats.map(stat => [
      stat.type,
      stat.earnings.toFixed(2),
      stat.hours.toFixed(1),
      stat.trips,
      stat.tips.toFixed(2),
      stat.expenses.toFixed(2),
      stat.netEarnings.toFixed(2),
      stat.avgHourly.toFixed(2),
      stat.avgPerTrip.toFixed(2)
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `platform-comparison-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!shifts || shifts.length === 0) {
    return (
      <Card className="p-8 text-center border-2 border-dashed">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
          <ArrowsClockwise size={24} className="text-primary" weight="fill" />
        </div>
        <h3 className="font-semibold mb-1 text-[clamp(0.9rem,2.8vw,1rem)]">No Platform Data</h3>
        <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2 max-w-md mx-auto">
          Log shifts across different platforms to see earnings comparison
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/20 p-2">
              <ArrowsClockwise size={20} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
                Cross-Platform Earnings Comparison
              </h2>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
                Compare performance across rideshare, delivery, and package platforms
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger className="w-[110px] h-8 text-[clamp(0.7rem,2vw,0.8rem)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={exportComparison}
              className="h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
            >
              <Download size={16} weight="fill" className="mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4 mb-4">
          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Total Earnings
              </span>
              <CurrencyDollar size={16} className="text-success" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
              {formatCurrency(totalStats.earnings)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              {filteredShifts.length} total shifts
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Net Income
              </span>
              <TrendUp size={16} className="text-primary" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] text-primary">
              {formatCurrency(totalStats.netEarnings)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              -{formatCurrency(totalStats.expenses)} expenses
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Avg Hourly
              </span>
              <Clock size={16} className="text-warning" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
              {formatCurrency(totalStats.hours > 0 ? totalStats.earnings / totalStats.hours : 0)}/hr
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              {formatHours(totalStats.hours)} total
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Total Tips
              </span>
              <CurrencyDollar size={16} className="text-accent" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
              {formatCurrency(totalStats.tips)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              {totalStats.earnings > 0 ? Math.round((totalStats.tips / totalStats.earnings) * 100) : 0}% of earnings
            </div>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-3 mb-4">
          {platformTypeStats.map(stat => {
            const Icon = PLATFORM_TYPES[stat.type.toLowerCase().replace(' ', '') as keyof typeof PLATFORM_TYPES]?.icon || ChartBar
            const percentage = totalStats.earnings > 0 ? (stat.earnings / totalStats.earnings) * 100 : 0

            return (
              <Card key={stat.type} className="p-4 bg-card/80 backdrop-blur border-2" style={{ borderColor: `${stat.color}40` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-2" style={{ backgroundColor: `${stat.color}20` }}>
                      <Icon size={18} weight="fill" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                        {stat.type}
                      </h3>
                      <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.7rem)] mt-0.5">
                        {percentage.toFixed(0)}% of earnings
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Total Earnings</span>
                    <span className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]" style={{ color: stat.color }}>
                      {formatCurrency(stat.earnings)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Net Income</span>
                    <span className="font-semibold text-[clamp(0.8rem,2.4vw,0.9rem)]">
                      {formatCurrency(stat.netEarnings)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold text-[clamp(0.8rem,2.4vw,0.9rem)]">
                      {formatCurrency(stat.avgHourly)}/hr
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Per Trip/Delivery</span>
                    <span className="font-semibold text-[clamp(0.8rem,2.4vw,0.9rem)]">
                      {formatCurrency(stat.avgPerTrip)}
                    </span>
                  </div>

                  <div className="pt-2 border-t space-y-1">
                    <div className="flex items-center justify-between text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">
                      <span>{stat.trips} trips</span>
                      <span>{formatHours(stat.hours)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[clamp(0.65rem,2vw,0.75rem)]">
                      <span className="text-success">Tips: {formatCurrency(stat.tips)}</span>
                      <span className="text-destructive">Costs: {formatCurrency(stat.expenses)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {platformTypeStats.length > 0 && (
          <Tabs defaultValue="earnings" className="space-y-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="earnings" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                <ChartBar size={16} weight="fill" className="mr-1" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="hourly" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                <Clock size={16} weight="fill" className="mr-1" />
                Hourly
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                <TrendUp size={16} weight="fill" className="mr-1" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="earnings">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-[clamp(0.85rem,2.6vw,1rem)]">Earnings Distribution</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={platformTypeStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
                      <XAxis 
                        dataKey="type" 
                        tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                      />
                      <YAxis 
                        tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))}
                        contentStyle={{ 
                          backgroundColor: 'oklch(1.00 0 0)',
                          border: '1px solid oklch(0.88 0.01 240)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="earnings" fill="oklch(0.45 0.15 260)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="hourly">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-[clamp(0.85rem,2.6vw,1rem)]">Hourly Rate Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
                    <XAxis 
                      type="number"
                      tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      type="category"
                      dataKey="type" 
                      tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'oklch(1.00 0 0)',
                        border: '1px solid oklch(0.88 0.01 240)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="hourlyRate" fill="oklch(0.65 0.15 145)" name="Hourly Rate" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-[clamp(0.85rem,2.6vw,1rem)]">Earnings Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                    />
                    <YAxis 
                      tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 11 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ 
                        backgroundColor: 'oklch(1.00 0 0)',
                        border: '1px solid oklch(0.88 0.01 240)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {platformTypeStats.map((stat, index) => (
                      <Line
                        key={stat.type}
                        type="monotone"
                        dataKey={stat.type}
                        stroke={stat.color}
                        strokeWidth={2}
                        dot={{ fill: stat.color, r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  )
}

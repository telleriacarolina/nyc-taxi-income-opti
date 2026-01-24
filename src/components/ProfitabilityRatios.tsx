import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { 
  Percent, 
  TrendUp, 
  TrendDown,
  CurrencyDollar, 
  ChartPie,
  ArrowsClockwise,
  Download,
  Receipt,
  ChartBar,
  Equals
} from '@phosphor-icons/react'
import { format, subDays } from 'date-fns'

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

interface ProfitabilityMetrics {
  type: string
  grossEarnings: number
  expenses: number
  netProfit: number
  profitMargin: number
  roi: number
  expenseRatio: number
  netHourlyRate: number
  netPerTrip: number
  color: string
  hours: number
  trips: number
}

const PLATFORM_TYPES = {
  rideshare: {
    label: 'Rideshare',
    color: 'oklch(0.45 0.15 260)',
  },
  delivery: {
    label: 'Food Delivery',
    color: 'oklch(0.70 0.15 50)',
  },
  package: {
    label: 'Package Delivery',
    color: 'oklch(0.55 0.22 25)',
  }
}

const getPlatformType = (platform: string): 'rideshare' | 'delivery' | 'package' => {
  const normalizedPlatform = platform.toLowerCase()
  
  const rideshareKeywords = ['uber', 'lyft', 'via', 'revel', 'curb']
  const deliveryKeywords = ['eats', 'doordash', 'grubhub', 'relay', 'seamless']
  const packageKeywords = ['amazon', 'flex', 'ups', 'fedex', 'usps', 'gopuff']
  
  if (rideshareKeywords.some(k => normalizedPlatform.includes(k))) return 'rideshare'
  if (deliveryKeywords.some(k => normalizedPlatform.includes(k))) return 'delivery'
  if (packageKeywords.some(k => normalizedPlatform.includes(k))) return 'package'
  
  return 'rideshare'
}

export function ProfitabilityRatios() {
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

  const profitabilityMetrics = useMemo(() => {
    const metrics: Record<string, ProfitabilityMetrics> = {}

    filteredShifts.forEach(shift => {
      const type = shift.platformType || getPlatformType(shift.platform)
      
      if (!metrics[type]) {
        metrics[type] = {
          type: PLATFORM_TYPES[type].label,
          grossEarnings: 0,
          expenses: 0,
          netProfit: 0,
          profitMargin: 0,
          roi: 0,
          expenseRatio: 0,
          netHourlyRate: 0,
          netPerTrip: 0,
          color: PLATFORM_TYPES[type].color,
          hours: 0,
          trips: 0
        }
      }

      metrics[type].grossEarnings += shift.earnings
      metrics[type].expenses += shift.expenses || 0
      metrics[type].hours += shift.hours
      metrics[type].trips += shift.trips
    })

    Object.values(metrics).forEach(metric => {
      metric.netProfit = metric.grossEarnings - metric.expenses
      metric.profitMargin = metric.grossEarnings > 0 
        ? (metric.netProfit / metric.grossEarnings) * 100 
        : 0
      metric.roi = metric.expenses > 0 
        ? (metric.netProfit / metric.expenses) * 100 
        : 0
      metric.expenseRatio = metric.grossEarnings > 0 
        ? (metric.expenses / metric.grossEarnings) * 100 
        : 0
      metric.netHourlyRate = metric.hours > 0 
        ? metric.netProfit / metric.hours 
        : 0
      metric.netPerTrip = metric.trips > 0 
        ? metric.netProfit / metric.trips 
        : 0
    })

    return Object.values(metrics).sort((a, b) => b.netProfit - a.netProfit)
  }, [filteredShifts])

  const radarData = useMemo(() => {
    if (profitabilityMetrics.length === 0) return []
    
    const maxMargin = Math.max(...profitabilityMetrics.map(m => m.profitMargin))
    const maxROI = Math.max(...profitabilityMetrics.map(m => m.roi))
    const maxHourly = Math.max(...profitabilityMetrics.map(m => m.netHourlyRate))
    
    return [
      {
        metric: 'Profit Margin',
        ...Object.fromEntries(
          profitabilityMetrics.map(m => [m.type, maxMargin > 0 ? (m.profitMargin / maxMargin) * 100 : 0])
        )
      },
      {
        metric: 'ROI',
        ...Object.fromEntries(
          profitabilityMetrics.map(m => [m.type, maxROI > 0 ? (m.roi / maxROI) * 100 : 0])
        )
      },
      {
        metric: 'Net Hourly',
        ...Object.fromEntries(
          profitabilityMetrics.map(m => [m.type, maxHourly > 0 ? (m.netHourlyRate / maxHourly) * 100 : 0])
        )
      },
      {
        metric: 'Expense Efficiency',
        ...Object.fromEntries(
          profitabilityMetrics.map(m => [m.type, 100 - m.expenseRatio])
        )
      }
    ]
  }, [profitabilityMetrics])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const exportData = () => {
    const headers = [
      'Platform Type',
      'Gross Earnings',
      'Total Expenses',
      'Net Profit',
      'Profit Margin %',
      'ROI %',
      'Expense Ratio %',
      'Net Hourly Rate',
      'Net Per Trip',
      'Hours',
      'Trips'
    ]
    
    const rows = profitabilityMetrics.map(m => [
      m.type,
      m.grossEarnings.toFixed(2),
      m.expenses.toFixed(2),
      m.netProfit.toFixed(2),
      m.profitMargin.toFixed(2),
      m.roi.toFixed(2),
      m.expenseRatio.toFixed(2),
      m.netHourlyRate.toFixed(2),
      m.netPerTrip.toFixed(2),
      m.hours.toFixed(1),
      m.trips
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `profitability-ratios-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getBestPerformer = (metric: keyof ProfitabilityMetrics) => {
    if (profitabilityMetrics.length === 0) return null
    if (profitabilityMetrics.length === 1) return profitabilityMetrics[0]
    return profitabilityMetrics.reduce((best, current) => 
      (current[metric] as number) > (best[metric] as number) ? current : best
    )
  }

  const totalMetrics = useMemo(() => {
    return profitabilityMetrics.reduce(
      (acc, m) => ({
        grossEarnings: acc.grossEarnings + m.grossEarnings,
        expenses: acc.expenses + m.expenses,
        netProfit: acc.netProfit + m.netProfit,
        hours: acc.hours + m.hours,
        trips: acc.trips + m.trips
      }),
      { grossEarnings: 0, expenses: 0, netProfit: 0, hours: 0, trips: 0 }
    )
  }, [profitabilityMetrics])

  const overallMargin = totalMetrics.grossEarnings > 0 
    ? (totalMetrics.netProfit / totalMetrics.grossEarnings) * 100 
    : 0

  const overallROI = totalMetrics.expenses > 0 
    ? (totalMetrics.netProfit / totalMetrics.expenses) * 100 
    : 0

  if (!shifts || shifts.length === 0) {
    return (
      <Card className="p-8 text-center border-2 border-dashed">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
          <ChartPie size={24} className="text-primary" weight="fill" />
        </div>
        <h3 className="font-semibold mb-1 text-[clamp(0.9rem,2.8vw,1rem)]">No Profitability Data</h3>
        <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2 max-w-md mx-auto">
          Track shifts with expenses to analyze profitability ratios across platforms
        </p>
      </Card>
    )
  }

  const bestMargin = getBestPerformer('profitMargin')
  const bestROI = getBestPerformer('roi')
  const mostEfficient = profitabilityMetrics.length > 0 
    ? profitabilityMetrics.reduce((best, current) => 
        current.expenseRatio < best.expenseRatio ? current : best
      )
    : null

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-success/10 to-primary/5 border-success/30">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-success/20 p-2">
              <ChartPie size={20} className="text-success" weight="fill" />
            </div>
            <div className="flex-1">
              <h2 className="text-[clamp(0.9rem,2.8vw,1.125rem)] font-semibold mb-0.5 line-clamp-1">
                Profitability Ratios by Platform Type
              </h2>
              <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
                Compare profit margins, ROI, and expense ratios after all costs
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
              onClick={exportData}
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
                Overall Profit
              </span>
              <CurrencyDollar size={16} className="text-success" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] text-success">
              {formatCurrency(totalMetrics.netProfit)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              from {formatCurrency(totalMetrics.grossEarnings)}
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Profit Margin
              </span>
              <Percent size={16} className="text-primary" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] text-primary">
              {formatPercent(overallMargin)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              {bestMargin?.type} leads at {formatPercent(bestMargin?.profitMargin || 0)}
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Overall ROI
              </span>
              <TrendUp size={16} className="text-warning" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)] text-warning">
              {formatPercent(overallROI)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground mt-0.5">
              {bestROI?.type} leads at {formatPercent(bestROI?.roi || 0)}
            </div>
          </Card>

          <Card className="p-3 bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
                Total Expenses
              </span>
              <Receipt size={16} className="text-destructive" weight="fill" />
            </div>
            <div className="font-bold text-[clamp(1.1rem,3.5vw,1.35rem)]">
              {formatCurrency(totalMetrics.expenses)}
            </div>
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-success mt-0.5">
              {mostEfficient ? `${mostEfficient.type} most efficient` : 'Track expenses'}
            </div>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-3 mb-4">
          {profitabilityMetrics.map(metric => {
            const isTopMargin = metric.profitMargin === Math.max(...profitabilityMetrics.map(m => m.profitMargin))
            const isTopROI = metric.roi === Math.max(...profitabilityMetrics.map(m => m.roi))

            return (
              <Card key={metric.type} className="p-4 bg-card/80 backdrop-blur border-2" style={{ borderColor: `${metric.color}40` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1 mb-1">
                      {metric.type}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {isTopMargin && (
                        <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.65rem)] bg-success/10 text-success border-success/30">
                          Best Margin
                        </Badge>
                      )}
                      {isTopROI && (
                        <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.65rem)] bg-warning/10 text-warning border-warning/30">
                          Best ROI
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="rounded-full p-2" style={{ backgroundColor: `${metric.color}20` }}>
                    <Equals size={18} weight="bold" style={{ color: metric.color }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Profit Margin</span>
                      <span className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]" style={{ color: metric.color }}>
                        {formatPercent(metric.profitMargin)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(metric.profitMargin, 100)} 
                      className="h-1.5"
                      style={{ 
                        ['--progress-background' as any]: metric.color 
                      }}
                    />
                    <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mt-0.5">
                      {formatCurrency(metric.netProfit)} profit from {formatCurrency(metric.grossEarnings)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Return on Investment</span>
                      <span className="font-bold text-[clamp(0.85rem,2.6vw,1rem)]">
                        {formatPercent(metric.roi)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(metric.roi, 200) / 2} 
                      className="h-1.5"
                      style={{ 
                        ['--progress-background' as any]: 'oklch(0.65 0.15 145)' 
                      }}
                    />
                    <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mt-0.5">
                      {formatCurrency(metric.expenses)} expenses invested
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">Expense Ratio</span>
                      <span className="font-semibold text-[clamp(0.8rem,2.4vw,0.9rem)]">
                        {formatPercent(metric.expenseRatio)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(metric.expenseRatio, 100)} 
                      className="h-1.5"
                      style={{ 
                        ['--progress-background' as any]: 'oklch(0.55 0.22 25)' 
                      }}
                    />
                    <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground mt-0.5">
                      {formatPercent(100 - metric.expenseRatio)} take-home
                    </div>
                  </div>

                  <div className="pt-2 border-t grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Net Hourly</div>
                      <div className="font-semibold text-[clamp(0.75rem,2.2vw,0.85rem)]">
                        {formatCurrency(metric.netHourlyRate)}/hr
                      </div>
                    </div>
                    <div>
                      <div className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Net Per Trip</div>
                      <div className="font-semibold text-[clamp(0.75rem,2.2vw,0.85rem)]">
                        {formatCurrency(metric.netPerTrip)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {profitabilityMetrics.length > 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-[clamp(0.85rem,2.6vw,1rem)] flex items-center gap-2">
                <ChartBar size={18} weight="fill" />
                Profitability Comparison
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={profitabilityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240)" />
                  <XAxis 
                    dataKey="type" 
                    tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name.includes('%')) return formatPercent(Number(value))
                      return formatCurrency(Number(value))
                    }}
                    contentStyle={{ 
                      backgroundColor: 'oklch(1.00 0 0)',
                      border: '1px solid oklch(0.88 0.01 240)',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="netProfit" fill="oklch(0.65 0.15 145)" name="Net Profit" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="oklch(0.55 0.22 25)" name="Expenses" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-[clamp(0.85rem,2.6vw,1rem)] flex items-center gap-2">
                <Percent size={18} weight="fill" />
                Performance Radar
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.88 0.01 240)" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 10 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]}
                    tick={{ fill: 'oklch(0.45 0.01 240)', fontSize: 9 }}
                  />
                  {profitabilityMetrics.map((metric, index) => (
                    <Radar
                      key={metric.type}
                      name={metric.type}
                      dataKey={metric.type}
                      stroke={metric.color}
                      fill={metric.color}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        <Card className="p-4 mt-4 bg-accent/5 border-accent/30">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-accent/20 p-2 flex-shrink-0">
              <TrendUp size={18} className="text-accent" weight="fill" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] mb-2">Key Insights</h3>
              <div className="space-y-2 text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground">
                {bestMargin && (
                  <div className="flex items-start gap-2">
                    <span className="text-success mt-0.5">●</span>
                    <span className="line-clamp-2">
                      <span className="font-semibold text-foreground">{bestMargin.type}</span> has the best profit margin at <span className="font-semibold text-foreground">{formatPercent(bestMargin.profitMargin)}</span>, keeping {formatCurrency(bestMargin.netProfit)} from every {formatCurrency(bestMargin.grossEarnings)} earned.
                    </span>
                  </div>
                )}
                {bestROI && (
                  <div className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">●</span>
                    <span className="line-clamp-2">
                      <span className="font-semibold text-foreground">{bestROI.type}</span> delivers the highest ROI at <span className="font-semibold text-foreground">{formatPercent(bestROI.roi)}</span>, returning {formatCurrency(bestROI.netProfit)} for every {formatCurrency(bestROI.expenses)} in expenses.
                    </span>
                  </div>
                )}
                {mostEfficient && (
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">●</span>
                    <span className="line-clamp-2">
                      <span className="font-semibold text-foreground">{mostEfficient.type}</span> is most expense-efficient with only <span className="font-semibold text-foreground">{formatPercent(mostEfficient.expenseRatio)}</span> of earnings going to costs.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  )
}

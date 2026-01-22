import { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import {
  Truck,
  ClipboardText,
  Clock,
  Lightning,
  Package,
  SteeringWheel,
  MapPin,
  CurrencyDollar,
  CarProfile,
  GasPump,
  ChartLineUp,
  TrendUp,
  Calculator,
  CheckCircle,
  Phone,
  Info,
  Percent,
  Calendar,
  Star,
  ChartBar,
  CalendarBlank
} from '@phosphor-icons/react'
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth, format, isWithinInterval, subDays, subWeeks, subMonths } from 'date-fns'

interface PackagePlatform {
  id: string
  name: string
  rate: string
  block: string
  vehicle: string
  notes: string
  coverage: string
  perks: string[]
  hourlyLow: number
  hourlyHigh: number
  requirements: string[]
  contactInfo: string
  enrollmentUrl?: string
  color: string
  bgColor: string
}

interface ChecklistItem {
  id: string
  title: string
  detail: string
}

interface ShiftLog {
  id: string
  date: string
  platform: string
  hours: number
  blocks: number
  deliveries: number
  earnings: number
  gasExpense: number
  vehicle: 'gas' | 'electric' | 'hybrid'
}

const PACKAGE_PLATFORMS: PackagePlatform[] = [
  {
    id: 'amazon-flex',
    name: 'Amazon Flex',
    rate: '$18-$25/hr',
    block: '2-4 hr blocks',
    vehicle: 'Mid-size sedan or larger',
    notes: 'Load at station; plan 10-15 min for staging and scanning.',
    coverage: 'All boroughs + NJ/CT stations',
    perks: ['Guaranteed hourly blocks', 'Surge pay on busy days', 'Amazon Fresh and Prime Now variants'],
    hourlyLow: 18,
    hourlyHigh: 25,
    color: '#FF9900',
    bgColor: '#FFF3E6',
    contactInfo: 'flex.amazon.com/support',
    enrollmentUrl: 'https://flex.amazon.com',
    requirements: [
      'Age 21+ with valid driver license',
      'Mid-size sedan or larger vehicle',
      'Smartphone (iPhone 6+ or Android 6+)',
      'Auto insurance and registration',
      'Clean driving record',
      'Pass background check (7-10 days)'
    ]
  },
  {
    id: 'ups-pvd',
    name: 'UPS Personal Vehicle Driver',
    rate: '$21-$28/hr',
    block: '4-8 hr shifts',
    vehicle: 'SUV/van/pickup preferred',
    notes: 'Seasonal peaks with heavy volume; UPS provides uniforms + scanner.',
    coverage: 'Most NYC depots + outer boroughs',
    perks: ['Higher hourly rate', 'Mileage reimbursement programs', 'Priority for peak season blocks'],
    hourlyLow: 21,
    hourlyHigh: 28,
    color: '#351C15',
    bgColor: '#F5F0ED',
    contactInfo: 'ups.com/pvd',
    enrollmentUrl: 'https://www.ups.com/pvd',
    requirements: [
      'Age 21+ with valid license',
      'SUV, van, or pickup truck',
      'Ability to lift 70 lbs',
      'Smartphone with UPS app',
      'Pass MVR and background check',
      'Available for peak season (Nov-Jan)'
    ]
  },
  {
    id: 'ontrac-laser',
    name: 'LaserShip / OnTrac',
    rate: '$19-$24/hr',
    block: '3-6 hr routes',
    vehicle: 'Sedan ok; hatchback ideal',
    notes: 'Smaller, denser routes with many stairs/elevator stops.',
    coverage: 'Manhattan, Brooklyn, Queens focus',
    perks: ['Short routes (3-5 miles total)', 'Daily instant pay options', 'Local dispatch support'],
    hourlyLow: 19,
    hourlyHigh: 24,
    color: '#0066CC',
    bgColor: '#E6F2FF',
    contactInfo: 'lasership.com/drivers',
    enrollmentUrl: 'https://www.lasership.com/careers',
    requirements: [
      'Age 21+ with license',
      'Sedan or hatchback vehicle',
      'Smartphone with GPS',
      'Valid insurance',
      'Background check',
      'NYC metro area residence'
    ]
  }
]

const CHECKLIST: ChecklistItem[] = [
  {
    id: 'fuel',
    title: 'Fuel/charge for full block',
    detail: 'Start at 70%+ tank or battery to avoid mid-route stops.'
  },
  {
    id: 'load-gear',
    title: 'Dolly + bungees ready',
    detail: 'Keep foldable hand truck, straps, and extra totes in trunk.'
  },
  {
    id: 'safety',
    title: 'Hi-vis vest and gloves',
    detail: 'Required at most stations; prevents missed gate access.'
  },
  {
    id: 'mount',
    title: 'Phone mount + charger',
    detail: 'Secure mount saves time at each stop; carry spare cable.'
  },
  {
    id: 'weather',
    title: 'Rain layer + towels',
    detail: 'Protect parcels and seats; reduces re-attempts.'
  }
]

const ROUTE_WINDOWS = [
  {
    id: 'early',
    label: 'Early (6-10a)',
    focus: 'Apartments and concierge buildings before rush.',
    tips: ['Arrive 20 minutes before block to stage cart', 'Stack stops by floor to minimize elevator rides', 'Leave photo proof to avoid reattempts'],
    icon: Clock
  },
  {
    id: 'midday',
    label: 'Midday (10a-2p)',
    focus: 'Commercial zones and office towers.',
    tips: ['Batch nearby offices before lunch crowd hits', 'Use freight entrances where possible', 'Plan garage parking for dense clusters'],
    icon: MapPin
  },
  {
    id: 'evening',
    label: 'Evening (4-9p)',
    focus: 'Residential deliveries with better parking openings.',
    tips: ['Prioritize walk-ups before dark', 'Call ahead for gated deliveries', 'Keep spare labels for damaged tags'],
    icon: Lightning
  }
]

export function PackageDeliveryWork() {
  const [doneItems, setDoneItems] = useKV<string[]>('package-prep-checklist', [])
  const [enrolledPlatforms, setEnrolledPlatforms] = useKV<string[]>('enrolled-package-platforms', [])
  const [shiftLogs, setShiftLogs] = useKV<ShiftLog[]>('package-shift-logs', [])
  const [activeView, setActiveView] = useState<string>('overview')
  const [dateRange, setDateRange] = useState<string>('all')
  const [comparisonView, setComparisonView] = useState<string>('weekly')
  
  const [newShift, setNewShift] = useState({
    platform: '',
    hours: '',
    blocks: '',
    deliveries: '',
    earnings: '',
    gasExpense: '',
    vehicle: 'gas' as 'gas' | 'electric' | 'hybrid'
  })

  const completion = useMemo(() => {
    const total = CHECKLIST.length
    const done = doneItems?.length || 0
    return Math.round((done / total) * 100)
  }, [doneItems])

  const filteredLogs = useMemo(() => {
    const logs = shiftLogs || []
    const now = new Date()
    
    if (dateRange === 'all') return logs
    
    let startDate: Date
    
    switch (dateRange) {
      case '7days':
        startDate = subDays(now, 7)
        break
      case '30days':
        startDate = subDays(now, 30)
        break
      case 'thisWeek':
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        break
      case 'lastWeek':
        startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
        return logs.filter(log => {
          const logDate = new Date(log.date)
          return isWithinInterval(logDate, {
            start: startDate,
            end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
          })
        })
      case 'thisMonth':
        startDate = startOfMonth(now)
        break
      case 'lastMonth':
        startDate = startOfMonth(subMonths(now, 1))
        return logs.filter(log => {
          const logDate = new Date(log.date)
          return isWithinInterval(logDate, {
            start: startDate,
            end: endOfMonth(subMonths(now, 1))
          })
        })
      default:
        return logs
    }
    
    return logs.filter(log => new Date(log.date) >= startDate)
  }, [shiftLogs, dateRange])

  const weeklyStats = useMemo(() => {
    const logs = filteredLogs
    const totalEarnings = logs.reduce((sum, log) => sum + log.earnings, 0)
    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0)
    const totalGas = logs.reduce((sum, log) => sum + log.gasExpense, 0)
    const netEarnings = totalEarnings - totalGas
    const hourlyRate = totalHours > 0 ? totalEarnings / totalHours : 0
    const netHourlyRate = totalHours > 0 ? netEarnings / totalHours : 0
    
    return {
      totalEarnings,
      totalHours,
      totalGas,
      netEarnings,
      hourlyRate,
      netHourlyRate,
      totalDeliveries: logs.reduce((sum, log) => sum + log.deliveries, 0),
      shiftsCount: logs.length
    }
  }, [filteredLogs])

  const weeklyComparisonData = useMemo(() => {
    const logs = shiftLogs || []
    const now = new Date()
    const weeks: { [key: string]: { earnings: number; hours: number; gasExpense: number; deliveries: number } } = {}
    
    const weeksToShow = 8
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 })
      const weekKey = format(weekStart, 'MMM d')
      
      weeks[weekKey] = { earnings: 0, hours: 0, gasExpense: 0, deliveries: 0 }
      
      logs.forEach(log => {
        const logDate = new Date(log.date)
        if (isWithinInterval(logDate, { start: weekStart, end: weekEnd })) {
          weeks[weekKey].earnings += log.earnings
          weeks[weekKey].hours += log.hours
          weeks[weekKey].gasExpense += log.gasExpense
          weeks[weekKey].deliveries += log.deliveries
        }
      })
    }
    
    return Object.entries(weeks).map(([week, data]) => ({
      week,
      earnings: parseFloat(data.earnings.toFixed(2)),
      netEarnings: parseFloat((data.earnings - data.gasExpense).toFixed(2)),
      hours: parseFloat(data.hours.toFixed(1)),
      gasExpense: parseFloat(data.gasExpense.toFixed(2)),
      deliveries: data.deliveries,
      hourlyRate: data.hours > 0 ? parseFloat((data.earnings / data.hours).toFixed(2)) : 0
    }))
  }, [shiftLogs])

  const monthlyComparisonData = useMemo(() => {
    const logs = shiftLogs || []
    const now = new Date()
    const months: { [key: string]: { earnings: number; hours: number; gasExpense: number; deliveries: number } } = {}
    
    const monthsToShow = 6
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i))
      const monthEnd = endOfMonth(subMonths(now, i))
      const monthKey = format(monthStart, 'MMM yyyy')
      
      months[monthKey] = { earnings: 0, hours: 0, gasExpense: 0, deliveries: 0 }
      
      logs.forEach(log => {
        const logDate = new Date(log.date)
        if (isWithinInterval(logDate, { start: monthStart, end: monthEnd })) {
          months[monthKey].earnings += log.earnings
          months[monthKey].hours += log.hours
          months[monthKey].gasExpense += log.gasExpense
          months[monthKey].deliveries += log.deliveries
        }
      })
    }
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      earnings: parseFloat(data.earnings.toFixed(2)),
      netEarnings: parseFloat((data.earnings - data.gasExpense).toFixed(2)),
      hours: parseFloat(data.hours.toFixed(1)),
      gasExpense: parseFloat(data.gasExpense.toFixed(2)),
      deliveries: data.deliveries,
      hourlyRate: data.hours > 0 ? parseFloat((data.earnings / data.hours).toFixed(2)) : 0
    }))
  }, [shiftLogs])

  const platformComparisonData = useMemo(() => {
    const logs = filteredLogs
    const platforms: { [key: string]: { earnings: number; hours: number; gasExpense: number; deliveries: number; shifts: number } } = {}
    
    logs.forEach(log => {
      if (!platforms[log.platform]) {
        platforms[log.platform] = { earnings: 0, hours: 0, gasExpense: 0, deliveries: 0, shifts: 0 }
      }
      platforms[log.platform].earnings += log.earnings
      platforms[log.platform].hours += log.hours
      platforms[log.platform].gasExpense += log.gasExpense
      platforms[log.platform].deliveries += log.deliveries
      platforms[log.platform].shifts += 1
    })
    
    return Object.entries(platforms).map(([platform, data]) => ({
      platform,
      earnings: parseFloat(data.earnings.toFixed(2)),
      netEarnings: parseFloat((data.earnings - data.gasExpense).toFixed(2)),
      hours: parseFloat(data.hours.toFixed(1)),
      gasExpense: parseFloat(data.gasExpense.toFixed(2)),
      deliveries: data.deliveries,
      shifts: data.shifts,
      hourlyRate: data.hours > 0 ? parseFloat((data.earnings / data.hours).toFixed(2)) : 0,
      netHourlyRate: data.hours > 0 ? parseFloat(((data.earnings - data.gasExpense) / data.hours).toFixed(2)) : 0
    })).sort((a, b) => b.netEarnings - a.netEarnings)
  }, [filteredLogs])

  const toggleItem = (id: string) => {
    setDoneItems((current) => {
      const next = current || []
      if (next.includes(id)) return next.filter(item => item !== id)
      return [...next, id]
    })
  }

  const toggleEnrollment = (platformId: string) => {
    setEnrolledPlatforms((current) => {
      const enrolled = current || []
      if (enrolled.includes(platformId)) {
        return enrolled.filter(id => id !== platformId)
      } else {
        return [...enrolled, platformId]
      }
    })
  }

  const isEnrolled = (platformId: string) => {
    return (enrolledPlatforms || []).includes(platformId)
  }

  const addShiftLog = () => {
    if (!newShift.platform || !newShift.hours || !newShift.earnings) return
    
    const log: ShiftLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      platform: newShift.platform,
      hours: parseFloat(newShift.hours),
      blocks: parseInt(newShift.blocks) || 1,
      deliveries: parseInt(newShift.deliveries) || 0,
      earnings: parseFloat(newShift.earnings),
      gasExpense: parseFloat(newShift.gasExpense) || 0,
      vehicle: newShift.vehicle
    }
    
    setShiftLogs((current) => [log, ...(current || [])])
    
    setNewShift({
      platform: '',
      hours: '',
      blocks: '',
      deliveries: '',
      earnings: '',
      gasExpense: '',
      vehicle: 'gas'
    })
  }

  const deleteShiftLog = (id: string) => {
    setShiftLogs((current) => (current || []).filter(log => log.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-200 text-amber-800">
            <Truck size={26} weight="fill" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold">Package Delivery Work</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Scheduled blocks</Badge>
              <Badge variant="outline">Hourly rate</Badge>
              {enrolledPlatforms && enrolledPlatforms.length > 0 && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle size={12} weight="fill" />
                  {enrolledPlatforms.length} platform{enrolledPlatforms.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-foreground/80 line-clamp-2">
              Track package delivery earnings, vehicle expenses, and optimize your block schedule across Amazon Flex, UPS PVD, and LaserShip.
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="overview" className="gap-1.5">
            <Package size={16} weight="fill" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="platforms" className="gap-1.5">
            <Truck size={16} weight="fill" />
            <span className="hidden sm:inline">Platforms</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-1.5">
            <ChartLineUp size={16} weight="fill" />
            <span className="hidden sm:inline">Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="prep" className="gap-1.5">
            <ClipboardText size={16} weight="fill" />
            <span className="hidden sm:inline">Prep</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <CurrencyDollar size={16} className="text-success" weight="fill" />
                <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground uppercase tracking-wide font-semibold">Total Earned</span>
              </div>
              <div className="text-[clamp(1.25rem,4vw,1.5rem)] font-bold font-mono text-success">
                ${weeklyStats.totalEarnings.toFixed(2)}
              </div>
              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                ${weeklyStats.hourlyRate.toFixed(2)}/hr average
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-primary" weight="fill" />
                <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground uppercase tracking-wide font-semibold">Hours</span>
              </div>
              <div className="text-[clamp(1.25rem,4vw,1.5rem)] font-bold font-mono">
                {weeklyStats.totalHours.toFixed(1)}
              </div>
              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                {weeklyStats.shiftsCount} shift{weeklyStats.shiftsCount !== 1 ? 's' : ''}
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <GasPump size={16} className="text-destructive" weight="fill" />
                <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground uppercase tracking-wide font-semibold">Gas Cost</span>
              </div>
              <div className="text-[clamp(1.25rem,4vw,1.5rem)] font-bold font-mono text-destructive">
                ${weeklyStats.totalGas.toFixed(2)}
              </div>
              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                {weeklyStats.totalHours > 0 ? `$${(weeklyStats.totalGas / weeklyStats.totalHours).toFixed(2)}/hr` : '$0/hr'}
              </div>
            </Card>

            <Card className="p-3 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendUp size={16} className="text-success" weight="fill" />
                <span className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground uppercase tracking-wide font-semibold">Net Income</span>
              </div>
              <div className="text-[clamp(1.25rem,4vw,1.5rem)] font-bold font-mono text-success">
                ${weeklyStats.netEarnings.toFixed(2)}
              </div>
              <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-success">
                ${weeklyStats.netHourlyRate.toFixed(2)}/hr net
              </div>
            </Card>
          </div>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardText size={18} weight="fill" className="text-primary" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Pre-route readiness</h3>
              <Badge variant="outline" className="ml-auto">{completion}%</Badge>
            </div>
            <Progress value={completion} className="h-2" />
            <div className="grid gap-2 sm:grid-cols-2">
              {CHECKLIST.slice(0, 4).map((item) => {
                const checked = (doneItems || []).includes(item.id)
                return (
                  <label key={item.id} className="flex items-start gap-2 cursor-pointer text-[clamp(0.75rem,2.4vw,0.85rem)]">
                    <Checkbox
                      id={item.id}
                      checked={checked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-0.5"
                    />
                    <span className={checked ? 'line-through text-muted-foreground' : ''}>{item.title}</span>
                  </label>
                )
              })}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} weight="fill" className="text-success" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Route playbook</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {ROUTE_WINDOWS.map((window) => {
                const Icon = window.icon
                return (
                  <div key={window.id} className="rounded-lg border p-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} weight="fill" className="text-foreground/80" />
                      <span className="text-[clamp(0.7rem,2vw,0.75rem)] font-semibold">{window.label}</span>
                    </div>
                    <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground line-clamp-2">{window.focus}</p>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {PACKAGE_PLATFORMS.map((platform) => (
              <Card 
                key={platform.id} 
                className="p-4 transition-all hover:shadow-lg"
                style={{ borderLeft: `3px solid ${platform.color}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: platform.bgColor }}
                    >
                      <Package size={20} weight="fill" style={{ color: platform.color }} />
                    </div>
                    <div>
                      <h3 className="text-[clamp(0.9rem,2.8vw,1rem)] font-semibold">{platform.name}</h3>
                      <Badge variant="secondary" className="mt-0.5 text-[10px] h-4">
                        {platform.block}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={isEnrolled(platform.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleEnrollment(platform.id)}
                    className="gap-1 h-7 text-[clamp(0.7rem,2vw,0.75rem)]"
                  >
                    <CheckCircle 
                      size={12} 
                      weight={isEnrolled(platform.id) ? 'fill' : 'regular'}
                    />
                    {isEnrolled(platform.id) ? 'Active' : 'Join'}
                  </Button>
                </div>

                <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-foreground/80 mb-3 line-clamp-2">
                  {platform.notes}
                </p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-success/20">
                      <CurrencyDollar size={14} className="text-success" weight="bold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Hourly Rate</div>
                      <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-semibold font-mono">{platform.rate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-primary/20">
                      <CarProfile size={14} className="text-primary" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Vehicle</div>
                      <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">{platform.vehicle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-500/20">
                      <MapPin size={14} className="text-blue-600" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Coverage</div>
                      <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-medium">{platform.coverage}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded bg-accent/20">
                      <Phone size={14} className="text-accent" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-muted-foreground">Support</div>
                      <div className="text-[clamp(0.65rem,2vw,0.75rem)] font-medium truncate">{platform.contactInfo}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Key Features
                  </div>
                  <ul className="space-y-1">
                    {platform.perks.map((perk, idx) => (
                      <li key={idx} className="text-[clamp(0.7rem,2vw,0.8rem)] flex items-start gap-1.5">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Requirements
                  </div>
                  <ul className="space-y-1">
                    {platform.requirements.map((req, idx) => (
                      <li key={idx} className="text-[clamp(0.7rem,2vw,0.8rem)] flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {platform.enrollmentUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-[clamp(0.7rem,2vw,0.75rem)]"
                    onClick={() => window.open(platform.enrollmentUrl, '_blank')}
                  >
                    <Star size={14} weight="fill" />
                    Sign Up Now
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-gradient-to-br from-primary/5 to-success/5 border-primary/30">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                <TrendUp size={20} className="text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-[clamp(0.9rem,2.8vw,1rem)] font-semibold mb-2">Package Delivery Success Tips</h3>
                <ul className="space-y-1.5 text-[clamp(0.75rem,2.4vw,0.85rem)] text-foreground/80">
                  <li className="flex items-start gap-1.5">
                    <span className="text-success font-bold">✓</span>
                    <span>Sign up for multiple platforms to get consistent block availability</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success font-bold">✓</span>
                    <span>Grab morning blocks (6-10am) for lighter traffic and easier parking</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success font-bold">✓</span>
                    <span>Amazon Flex surge rates can reach $30-35/hr during peak times</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success font-bold">✓</span>
                    <span>UPS PVD offers best rates during holiday season (Nov-Dec)</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarBlank size={18} weight="fill" className="text-primary" />
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Date range</h3>
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px] h-8 text-[clamp(0.7rem,2vw,0.75rem)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="thisWeek">This week</SelectItem>
                  <SelectItem value="lastWeek">Last week</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ChartBar size={18} weight="fill" className="text-success" />
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Earnings comparison</h3>
              </div>
              <div className="mb-3">
                <Select value={comparisonView} onValueChange={setComparisonView}>
                  <SelectTrigger className="w-full h-8 text-[clamp(0.7rem,2vw,0.75rem)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly trends (8 weeks)</SelectItem>
                    <SelectItem value="monthly">Monthly trends (6 months)</SelectItem>
                    <SelectItem value="platform">By platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {comparisonView === 'weekly' && weeklyComparisonData.length > 0 && (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyComparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="earnings" name="Gross" fill="oklch(0.45 0.15 260)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="netEarnings" name="Net" fill="oklch(0.65 0.15 145)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {comparisonView === 'monthly' && monthlyComparisonData.length > 0 && (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyComparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.45 0.15 260)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="oklch(0.45 0.15 260)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.65 0.15 145)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="oklch(0.65 0.15 145)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        name="Gross" 
                        stroke="oklch(0.45 0.15 260)" 
                        fill="url(#earningsGradient)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="netEarnings" 
                        name="Net" 
                        stroke="oklch(0.65 0.15 145)" 
                        fill="url(#netGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {comparisonView === 'platform' && platformComparisonData.length > 0 && (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={platformComparisonData} 
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis 
                        type="category" 
                        dataKey="platform" 
                        tick={{ fontSize: 10 }}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="netHourlyRate" name="Net $/hr" fill="oklch(0.65 0.15 145)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {((comparisonView === 'weekly' && weeklyComparisonData.length === 0) ||
                (comparisonView === 'monthly' && monthlyComparisonData.length === 0) ||
                (comparisonView === 'platform' && platformComparisonData.length === 0)) && (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)]">
                  No data available for comparison
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ChartLineUp size={18} weight="fill" className="text-primary" />
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Performance metrics</h3>
              </div>

              {comparisonView === 'platform' && platformComparisonData.length > 0 && (
                <div className="space-y-3">
                  {platformComparisonData.map((platform) => (
                    <div key={platform.platform} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)]">
                          {platform.platform}
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {platform.shifts} shift{platform.shifts !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10px] text-muted-foreground">Total Earnings</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                            ${platform.earnings.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Net Earnings</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                            ${platform.netEarnings.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Hourly Rate</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)]">
                            ${platform.hourlyRate.toFixed(2)}/hr
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Net Rate</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                            ${platform.netHourlyRate.toFixed(2)}/hr
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Total Hours</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)]">
                            {platform.hours.toFixed(1)}h
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Deliveries</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)]">
                            {platform.deliveries}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(comparisonView === 'weekly' || comparisonView === 'monthly') && (
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-gradient-to-br from-success/10 to-success/5">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      Best {comparisonView === 'weekly' ? 'Week' : 'Month'}
                    </div>
                    {(() => {
                      const data = comparisonView === 'weekly' ? weeklyComparisonData : monthlyComparisonData
                      if (data.length === 0) return <div className="text-muted-foreground">No data</div>
                      const best = data.reduce((max, curr) => 
                        curr.netEarnings > max.netEarnings ? curr : max, 
                        data[0]
                      )
                      const label = comparisonView === 'weekly' 
                        ? ('week' in best ? best.week : 'N/A')
                        : ('month' in best ? best.month : 'N/A')
                      return (
                        <div>
                          <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)]">
                            {label}
                          </div>
                          <div className="font-mono font-bold text-[clamp(1rem,3vw,1.25rem)] text-success">
                            ${best.netEarnings.toFixed(2)}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="border rounded-lg p-3 bg-muted/30">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      Average per {comparisonView === 'weekly' ? 'week' : 'month'}
                    </div>
                    {(() => {
                      const data = comparisonView === 'weekly' ? weeklyComparisonData : monthlyComparisonData
                      const nonZeroData = data.filter(d => d.netEarnings > 0)
                      const avgEarnings = nonZeroData.length > 0 
                        ? nonZeroData.reduce((sum, curr) => sum + curr.netEarnings, 0) / nonZeroData.length 
                        : 0
                      const avgHours = nonZeroData.length > 0
                        ? nonZeroData.reduce((sum, curr) => sum + curr.hours, 0) / nonZeroData.length
                        : 0
                      return (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[10px] text-muted-foreground">Earnings</div>
                            <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                              ${avgEarnings.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">Hours</div>
                            <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)]">
                              {avgHours.toFixed(1)}h
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="border rounded-lg p-3 bg-muted/30">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                      Trend analysis
                    </div>
                    {(() => {
                      const data = comparisonView === 'weekly' ? weeklyComparisonData : monthlyComparisonData
                      const nonZeroData = data.filter(d => d.netEarnings > 0)
                      if (nonZeroData.length < 2) {
                        return <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">Need more data</div>
                      }
                      const recent = nonZeroData.slice(-3).reduce((sum, curr) => sum + curr.netEarnings, 0) / Math.min(3, nonZeroData.length)
                      const older = nonZeroData.slice(0, -3).reduce((sum, curr) => sum + curr.netEarnings, 0) / Math.max(1, nonZeroData.length - 3)
                      const trend = older > 0 ? ((recent - older) / older * 100) : 0
                      return (
                        <div className="flex items-center gap-2">
                          <TrendUp 
                            size={20} 
                            weight="fill" 
                            className={trend >= 0 ? 'text-success' : 'text-destructive'}
                            style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }}
                          />
                          <div>
                            <div className={`font-mono font-bold text-[clamp(0.9rem,2.8vw,1rem)] ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-muted-foreground">vs earlier periods</div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={18} weight="fill" className="text-primary" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Log a shift</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="platform" className="text-[clamp(0.7rem,2vw,0.75rem)]">Platform</Label>
                <Select value={newShift.platform} onValueChange={(val) => setNewShift(prev => ({ ...prev, platform: val }))}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_PLATFORMS.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hours" className="text-[clamp(0.7rem,2vw,0.75rem)]">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="4.0"
                  value={newShift.hours}
                  onChange={(e) => setNewShift(prev => ({ ...prev, hours: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blocks" className="text-[clamp(0.7rem,2vw,0.75rem)]">Blocks</Label>
                <Input
                  id="blocks"
                  type="number"
                  placeholder="1"
                  value={newShift.blocks}
                  onChange={(e) => setNewShift(prev => ({ ...prev, blocks: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deliveries" className="text-[clamp(0.7rem,2vw,0.75rem)]">Deliveries</Label>
                <Input
                  id="deliveries"
                  type="number"
                  placeholder="45"
                  value={newShift.deliveries}
                  onChange={(e) => setNewShift(prev => ({ ...prev, deliveries: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="earnings" className="text-[clamp(0.7rem,2vw,0.75rem)]">Earnings ($)</Label>
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  placeholder="85.00"
                  value={newShift.earnings}
                  onChange={(e) => setNewShift(prev => ({ ...prev, earnings: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gas" className="text-[clamp(0.7rem,2vw,0.75rem)]">Gas Cost ($)</Label>
                <Input
                  id="gas"
                  type="number"
                  step="0.01"
                  placeholder="15.00"
                  value={newShift.gasExpense}
                  onChange={(e) => setNewShift(prev => ({ ...prev, gasExpense: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vehicle" className="text-[clamp(0.7rem,2vw,0.75rem)]">Vehicle Type</Label>
                <Select value={newShift.vehicle} onValueChange={(val: 'gas' | 'electric' | 'hybrid') => setNewShift(prev => ({ ...prev, vehicle: val }))}>
                  <SelectTrigger id="vehicle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={addShiftLog} 
              className="mt-4 w-full sm:w-auto gap-2"
              disabled={!newShift.platform || !newShift.hours || !newShift.earnings}
            >
              <CheckCircle size={16} weight="fill" />
              Add Shift
            </Button>
          </Card>

          {shiftLogs && shiftLogs.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} weight="fill" className="text-success" />
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Shift history</h3>
              </div>

              <div className="space-y-2">
                {shiftLogs.map((log) => {
                  const hourlyRate = log.hours > 0 ? log.earnings / log.hours : 0
                  const netEarnings = log.earnings - log.gasExpense
                  const netRate = log.hours > 0 ? netEarnings / log.hours : 0
                  
                  return (
                    <div key={log.id} className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)]">{log.platform}</div>
                          <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
                            {new Date(log.date).toLocaleDateString()} • {log.hours}h • {log.deliveries} deliveries
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteShiftLog(log.id)}
                          className="h-7 w-7 p-0"
                        >
                          ×
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <div className="text-[10px] text-muted-foreground">Earned</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                            ${log.earnings.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Gas Cost</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-destructive">
                            ${log.gasExpense.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Hourly</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)]">
                            ${hourlyRate.toFixed(2)}/hr
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Net/hr</div>
                          <div className="font-mono font-semibold text-[clamp(0.75rem,2.4vw,0.85rem)] text-success">
                            ${netRate.toFixed(2)}/hr
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className="mt-2 text-[10px]">
                        <GasPump size={10} className="mr-1" />
                        {log.vehicle}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prep" className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardText size={18} weight="fill" className="text-primary" />
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Pre-route checklist</h3>
              </div>
              <div className="text-right">
                <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Completion</div>
                <div className="text-[clamp(1rem,3vw,1.25rem)] font-bold">{completion}%</div>
              </div>
            </div>
            <Progress value={completion} className="h-2" />
            <div className="space-y-2">
              {CHECKLIST.map((item) => {
                const checked = (doneItems || []).includes(item.id)
                return (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      id={item.id}
                      checked={checked}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className={`text-[clamp(0.85rem,2.5vw,0.95rem)] font-medium leading-none ${checked ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </div>
                      <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} weight="fill" className="text-success" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Route playbook by time</h3>
            </div>
            <div className="grid gap-3">
              {ROUTE_WINDOWS.map((window) => {
                const Icon = window.icon
                return (
                  <div key={window.id} className="rounded-lg border p-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} weight="fill" className="text-foreground/80" />
                      <span className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-semibold">{window.label}</span>
                    </div>
                    <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-2">{window.focus}</p>
                    <ul className="space-y-1.5">
                      {window.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-foreground/80">
                          <span className="text-success mt-0.5">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Truck size={18} weight="fill" className="text-amber-700" />
              <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1rem)]">Loadout & safety essentials</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-semibold mb-2 flex items-center gap-1.5">
                  <CarProfile size={14} weight="fill" />
                  Vehicle setup
                </div>
                <ul className="space-y-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-foreground/80">
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Seat protectors + cargo divider</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Flashlight for late stops</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Extra labels + marker in glove box</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-semibold mb-2 flex items-center gap-1.5">
                  <Package size={14} weight="fill" />
                  Station workflow
                </div>
                <ul className="space-y-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-foreground/80">
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Sort by cluster (N/S/E/W) while scanning</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Heavy items loaded lowest/closest</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Keep photo of load order for re-tries</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-semibold mb-2 flex items-center gap-1.5">
                  <Lightning size={14} weight="fill" />
                  On-route habits
                </div>
                <ul className="space-y-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-foreground/80">
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Batch 3-5 stops before moving car</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Photo proof + notes for gated access</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-success">•</span>
                    <span>Mark exceptions immediately to avoid returns</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/30">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20">
                <Info size={20} className="text-warning" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-[clamp(0.9rem,2.8vw,1rem)] font-semibold mb-2">Pro Tips for Package Delivery</h3>
                <ul className="space-y-1.5 text-[clamp(0.75rem,2.4vw,0.85rem)] text-foreground/80">
                  <li className="flex items-start gap-1.5">
                    <span className="text-warning font-bold">•</span>
                    <span>Arrive 20 minutes early to claim best routes at station</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-warning font-bold">•</span>
                    <span>Keep a dolly/hand truck for apartment buildings (saves time and energy)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-warning font-bold">•</span>
                    <span>Track mileage for tax deductions (56¢ per mile in 2024)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-warning font-bold">•</span>
                    <span>Download offline maps for buildings with poor cell reception</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

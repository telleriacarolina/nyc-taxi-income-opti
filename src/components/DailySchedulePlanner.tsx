import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Clock, 
  MapPin, 
  TrendUp, 
  Car, 
  NavigationArrow,
  CalendarBlank,
  Path,
  Target,
  Lightning,
  Star,
  Plus,
  Trash,
  PencilSimple
} from '@phosphor-icons/react'
import { OpenFreeMap } from './OpenFreeMap'
import { toast } from 'sonner'

interface TimeBlock {
  id: string
  name: string
  timeRange: string
  description: string
  earningsTarget: number
  expectedRides: number
  zones: {
    name: string
    lat: number
    lng: number
    priority: 'high' | 'medium' | 'low'
    avgFare: number
    demandLevel: string
    trafficStatus: 'light' | 'moderate' | 'heavy'
  }[]
  platforms: string[]
  strategy: string
  tips: string[]
}

interface ScheduleRoute {
  id: string
  name: string
  timeBlocks: string[]
  totalEarnings: number
  totalHours: number
  rideCount: number
  description: string
  isFavorite?: boolean
  isCustom?: boolean
  customNotes?: string
}

const TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'early-morning',
    name: 'Early Morning Rush',
    timeRange: '5:00 AM - 9:00 AM',
    description: 'Airport runs and commuter traffic to Manhattan',
    earningsTarget: 150,
    expectedRides: 4,
    zones: [
      { 
        name: 'LaGuardia Airport', 
        lat: 40.7769, 
        lng: -73.8740, 
        priority: 'high', 
        avgFare: 45, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'JFK Airport', 
        lat: 40.6413, 
        lng: -73.7781, 
        priority: 'high', 
        avgFare: 55, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Midtown East', 
        lat: 40.7549, 
        lng: -73.9700, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Financial District', 
        lat: 40.7074, 
        lng: -74.0113, 
        priority: 'medium', 
        avgFare: 38, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Curb'],
    strategy: 'Start at airports for high-value long trips, then position in Midtown for business commuters',
    tips: [
      'Pre-position at LaGuardia by 5:30 AM for early flights',
      'Accept long trips to Manhattan - higher fares offset wait time',
      'Switch to Midtown by 7:30 AM for peak business commute'
    ]
  },
  {
    id: 'midday',
    name: 'Midday Steady',
    timeRange: '9:00 AM - 4:00 PM',
    description: 'Business meetings, medical appointments, shopping trips',
    earningsTarget: 200,
    expectedRides: 8,
    zones: [
      { 
        name: 'Upper East Side', 
        lat: 40.7736, 
        lng: -73.9566, 
        priority: 'high', 
        avgFare: 28, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Chelsea', 
        lat: 40.7465, 
        lng: -74.0014, 
        priority: 'medium', 
        avgFare: 25, 
        demandLevel: 'Medium',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Midtown West', 
        lat: 40.7614, 
        lng: -73.9776, 
        priority: 'high', 
        avgFare: 30, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'SoHo', 
        lat: 40.7233, 
        lng: -74.0030, 
        priority: 'medium', 
        avgFare: 27, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Medical Vouchers'],
    strategy: 'Focus on consistent short-to-medium trips in high-density areas, mix rideshare with medical vouchers',
    tips: [
      'Medical vouchers often available 10 AM - 2 PM',
      'Stay in Manhattan core for steady ride flow',
      'Use multiple platforms to minimize wait time',
      'Lunch rush 12-2 PM good for short high-volume trips'
    ]
  },
  {
    id: 'evening-rush',
    name: 'Evening Rush',
    timeRange: '4:00 PM - 8:00 PM',
    description: 'Commuters heading home, dinner reservations, entertainment',
    earningsTarget: 180,
    expectedRides: 6,
    zones: [
      { 
        name: 'Financial District', 
        lat: 40.7074, 
        lng: -74.0113, 
        priority: 'high', 
        avgFare: 42, 
        demandLevel: 'Very High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Midtown Manhattan', 
        lat: 40.7549, 
        lng: -73.9840, 
        priority: 'high', 
        avgFare: 38, 
        demandLevel: 'Very High',
        trafficStatus: 'heavy'
      },
      { 
        name: 'Upper West Side', 
        lat: 40.7870, 
        lng: -73.9754, 
        priority: 'medium', 
        avgFare: 35, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Brooklyn Heights', 
        lat: 40.6958, 
        lng: -73.9936, 
        priority: 'medium', 
        avgFare: 33, 
        demandLevel: 'High',
        trafficStatus: 'moderate'
      }
    ],
    platforms: ['Uber', 'Lyft', 'Curb'],
    strategy: 'Capture commuters leaving Manhattan, accept trips to outer boroughs for premium pricing',
    tips: [
      'Position in Financial District by 4:30 PM',
      'Surge pricing likely 5-7 PM in business districts',
      'Accept outer borough trips - less return competition',
      'Avoid FDR Drive and West Side Highway 5-7 PM'
    ]
  },
  {
    id: 'night',
    name: 'Night Entertainment',
    timeRange: '8:00 PM - 2:00 AM',
    description: 'Dinner, bars, clubs, theater district, late entertainment',
    earningsTarget: 220,
    expectedRides: 7,
    zones: [
      { 
        name: 'Theater District', 
        lat: 40.7590, 
        lng: -73.9845, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'Very High',
        trafficStatus: 'moderate'
      },
      { 
        name: 'Meatpacking District', 
        lat: 40.7409, 
        lng: -74.0069, 
        priority: 'high', 
        avgFare: 38, 
        demandLevel: 'High',
        trafficStatus: 'light'
      },
      { 
        name: 'East Village', 
        lat: 40.7264, 
        lng: -73.9818, 
        priority: 'medium', 
        avgFare: 30, 
        demandLevel: 'High',
        trafficStatus: 'light'
      },
      { 
        name: 'Williamsburg', 
        lat: 40.7081, 
        lng: -73.9571, 
        priority: 'high', 
        avgFare: 32, 
        demandLevel: 'Very High',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft'],
    strategy: 'Focus on entertainment districts with high tips, stay near bars/restaurants closing times',
    tips: [
      'Theater shows end 10-11 PM - high demand spike',
      'Bar/club closing times 2-4 AM have surge pricing',
      'Tips typically 15-25% higher for night rides',
      'Weekend nights can hit $300+ in 6 hours'
    ]
  },
  {
    id: 'late-night',
    name: 'Late Night Premium',
    timeRange: '2:00 AM - 5:00 AM',
    description: 'Bar closings, shift workers, early airport runs',
    earningsTarget: 120,
    expectedRides: 4,
    zones: [
      { 
        name: 'Lower East Side', 
        lat: 40.7153, 
        lng: -73.9877, 
        priority: 'high', 
        avgFare: 35, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Bushwick', 
        lat: 40.6944, 
        lng: -73.9213, 
        priority: 'medium', 
        avgFare: 32, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      },
      { 
        name: 'Astoria', 
        lat: 40.7643, 
        lng: -73.9235, 
        priority: 'medium', 
        avgFare: 30, 
        demandLevel: 'Low',
        trafficStatus: 'light'
      },
      { 
        name: 'JFK Airport', 
        lat: 40.6413, 
        lng: -73.7781, 
        priority: 'high', 
        avgFare: 55, 
        demandLevel: 'Medium',
        trafficStatus: 'light'
      }
    ],
    platforms: ['Uber', 'Lyft'],
    strategy: 'Maximize premium late-night rates, position near closing bars then transition to airports',
    tips: [
      'Surge multipliers 2-4x normal during bar closings',
      'Move to airports by 4 AM for early flights',
      'Less competition = higher acceptance of rides',
      'Safety first - trust your instincts on pickups'
    ]
  }
]

const SCHEDULE_ROUTES: ScheduleRoute[] = [
  {
    id: 'full-day',
    name: 'Full Day Maximizer',
    timeBlocks: ['early-morning', 'midday', 'evening-rush'],
    totalEarnings: 530,
    totalHours: 15,
    rideCount: 18,
    description: 'Complete early morning to evening shift capturing all peak periods'
  },
  {
    id: 'split-shift',
    name: 'Split Shift Strategy',
    timeBlocks: ['early-morning', 'evening-rush', 'night'],
    totalEarnings: 550,
    totalHours: 14,
    rideCount: 17,
    description: 'Work peak periods with midday break to avoid slow hours'
  },
  {
    id: 'night-owl',
    name: 'Night Owl Premium',
    timeBlocks: ['evening-rush', 'night', 'late-night'],
    totalEarnings: 520,
    totalHours: 14,
    rideCount: 17,
    description: 'Evening to late night capturing entertainment district premiums'
  },
  {
    id: 'steady-day',
    name: 'Steady Day Shift',
    timeBlocks: ['early-morning', 'midday'],
    totalEarnings: 350,
    totalHours: 11,
    rideCount: 12,
    description: 'Morning through afternoon for consistent reliable earnings'
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    timeBlocks: ['midday', 'evening-rush', 'night'],
    totalEarnings: 600,
    totalHours: 14,
    rideCount: 21,
    description: 'Weekend-optimized schedule with higher tips and surge pricing'
  }
]

export function DailySchedulePlanner() {
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<ScheduleRoute | null>(null)
  const [viewMode, setViewMode] = useState<'blocks' | 'routes' | 'favorites'>('blocks')
  const [customSchedules, setCustomSchedules] = useKV<ScheduleRoute[]>('custom-schedules', [])
  const [favoriteSchedules, setFavoriteSchedules] = useKV<string[]>('favorite-schedule-ids', [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRoute | null>(null)
  const [selectedTimeBlocks, setSelectedTimeBlocks] = useState<string[]>([])
  const [scheduleName, setScheduleName] = useState('')
  const [scheduleDescription, setScheduleDescription] = useState('')
  const [scheduleNotes, setScheduleNotes] = useState('')

  const allSchedules = [...SCHEDULE_ROUTES, ...(customSchedules || [])]
  const favoriteSchedulesList = allSchedules.filter(s => (favoriteSchedules || []).includes(s.id))

  const toggleFavorite = (scheduleId: string) => {
    setFavoriteSchedules((current) => {
      const currentFavorites = current || []
      if (currentFavorites.includes(scheduleId)) {
        toast.success('Removed from favorites')
        return currentFavorites.filter(id => id !== scheduleId)
      } else {
        toast.success('Added to favorites')
        return [...currentFavorites, scheduleId]
      }
    })
  }

  const handleCreateSchedule = () => {
    if (!scheduleName.trim()) {
      toast.error('Please enter a schedule name')
      return
    }
    if (selectedTimeBlocks.length === 0) {
      toast.error('Please select at least one time block')
      return
    }

    const selectedBlocks = TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id))
    const totalEarnings = selectedBlocks.reduce((sum, b) => sum + b.earningsTarget, 0)
    const totalHours = selectedBlocks.length * 4
    const rideCount = selectedBlocks.reduce((sum, b) => sum + b.expectedRides, 0)

    const newSchedule: ScheduleRoute = {
      id: `custom-${Date.now()}`,
      name: scheduleName,
      timeBlocks: selectedTimeBlocks,
      totalEarnings,
      totalHours,
      rideCount,
      description: scheduleDescription || 'Custom schedule',
      isCustom: true,
      customNotes: scheduleNotes
    }

    setCustomSchedules((current) => [...(current || []), newSchedule])
    setIsCreateDialogOpen(false)
    setScheduleName('')
    setScheduleDescription('')
    setScheduleNotes('')
    setSelectedTimeBlocks([])
    toast.success('Custom schedule created!')
  }

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return
    if (!scheduleName.trim()) {
      toast.error('Please enter a schedule name')
      return
    }
    if (selectedTimeBlocks.length === 0) {
      toast.error('Please select at least one time block')
      return
    }

    const selectedBlocks = TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id))
    const totalEarnings = selectedBlocks.reduce((sum, b) => sum + b.earningsTarget, 0)
    const totalHours = selectedBlocks.length * 4
    const rideCount = selectedBlocks.reduce((sum, b) => sum + b.expectedRides, 0)

    const updatedSchedule: ScheduleRoute = {
      ...editingSchedule,
      name: scheduleName,
      timeBlocks: selectedTimeBlocks,
      totalEarnings,
      totalHours,
      rideCount,
      description: scheduleDescription || 'Custom schedule',
      customNotes: scheduleNotes
    }

    setCustomSchedules((current) => 
      (current || []).map(s => s.id === editingSchedule.id ? updatedSchedule : s)
    )
    setIsEditDialogOpen(false)
    setEditingSchedule(null)
    setScheduleName('')
    setScheduleDescription('')
    setScheduleNotes('')
    setSelectedTimeBlocks([])
    toast.success('Schedule updated!')
  }

  const handleEditSchedule = (schedule: ScheduleRoute) => {
    setEditingSchedule(schedule)
    setScheduleName(schedule.name)
    setScheduleDescription(schedule.description)
    setScheduleNotes(schedule.customNotes || '')
    setSelectedTimeBlocks(schedule.timeBlocks)
    setIsEditDialogOpen(true)
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    setCustomSchedules((current) => (current || []).filter(s => s.id !== scheduleId))
    setFavoriteSchedules((current) => (current || []).filter(id => id !== scheduleId))
    toast.success('Schedule deleted')
  }

  const toggleTimeBlock = (blockId: string) => {
    setSelectedTimeBlocks((current) => {
      if (current.includes(blockId)) {
        return current.filter(id => id !== blockId)
      } else {
        return [...current, blockId]
      }
    })
  }

  const openCreateDialog = () => {
    setScheduleName('')
    setScheduleDescription('')
    setScheduleNotes('')
    setSelectedTimeBlocks([])
    setIsCreateDialogOpen(true)
  }

  const getZoneMarkers = (zones: TimeBlock['zones']) => {
    return zones.map(zone => ({
      position: [zone.lat, zone.lng] as [number, number],
      label: zone.name,
      earnings: zone.avgFare
    }))
  }

  const getRouteMarkers = (route: ScheduleRoute) => {
    const markers: { position: [number, number]; label: string; earnings?: number }[] = []
    route.timeBlocks.forEach((blockId, index) => {
      const block = TIME_BLOCKS.find(b => b.id === blockId)
      if (block) {
        block.zones.forEach(zone => {
          markers.push({
            position: [zone.lat, zone.lng],
            label: `${index + 1}. ${zone.name}`,
            earnings: zone.avgFare
          })
        })
      }
    })
    return markers
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-purple-600 text-white'
      case 'medium': return 'bg-blue-600 text-white'
      case 'low': return 'bg-gray-500 text-white'
    }
  }

  const getTrafficColor = (status: 'light' | 'moderate' | 'heavy') => {
    switch (status) {
      case 'light': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'heavy': return 'text-red-600'
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                <CalendarBlank weight="fill" className="text-primary" />
                Daily Schedule Planner
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                Custom routes optimized for different times of day
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'blocks' | 'routes' | 'favorites')}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="blocks" className="gap-2">
                <Clock weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Time Blocks</span>
              </TabsTrigger>
              <TabsTrigger value="routes" className="gap-2">
                <Path weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.85rem)]">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Star weight="fill" />
                <span className="text-[clamp(0.7rem,2vw,0.85rem)]">My Schedules</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TIME_BLOCKS.map((block) => (
                  <Card 
                    key={block.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBlock?.id === block.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                        {block.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                        <Clock size={14} />
                        <span className="truncate">{block.timeRange}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground line-clamp-2">
                        {block.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="secondary" className="gap-1">
                          <TrendUp size={12} weight="fill" />
                          ${block.earningsTarget}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Car size={12} weight="fill" />
                          {block.expectedRides} rides
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {block.platforms.slice(0, 2).map(platform => (
                          <Badge key={platform} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                            {platform}
                          </Badge>
                        ))}
                        {block.platforms.length > 2 && (
                          <Badge variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                            +{block.platforms.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedBlock && (
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                          <Lightning weight="fill" className="text-purple-600" />
                          {selectedBlock.name} Details
                        </CardTitle>
                        <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                          {selectedBlock.timeRange}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBlock(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Target Earnings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                            ${selectedBlock.earningsTarget}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Expected Rides</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                            {selectedBlock.expectedRides}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Avg per Ride</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                            ${Math.round(selectedBlock.earningsTarget / selectedBlock.expectedRides)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2 flex items-center gap-2">
                        <MapPin weight="fill" className="text-purple-600" />
                        Priority Zones
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedBlock.zones.map((zone) => (
                          <Card key={zone.name}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-[clamp(0.8rem,2.5vw,0.9rem)] line-clamp-1">
                                  {zone.name}
                                </CardTitle>
                                <Badge className={`${getPriorityColor(zone.priority)} text-[clamp(0.6rem,1.8vw,0.65rem)]`}>
                                  {zone.priority}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-1">
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Avg Fare:</span>
                                <span className="font-semibold">${zone.avgFare}</span>
                              </div>
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Demand:</span>
                                <span className="font-semibold">{zone.demandLevel}</span>
                              </div>
                              <div className="flex justify-between text-[clamp(0.7rem,2vw,0.8rem)]">
                                <span className="text-muted-foreground">Traffic:</span>
                                <span className={`font-semibold capitalize ${getTrafficColor(zone.trafficStatus)}`}>
                                  {zone.trafficStatus}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="h-[300px] rounded-lg overflow-hidden border-2 border-purple-200">
                      <OpenFreeMap
                        center={[selectedBlock.zones[0].lat, selectedBlock.zones[0].lng]}
                        zoom={11}
                        markers={getZoneMarkers(selectedBlock.zones)}
                      />
                    </div>

                    <Card className="bg-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)] flex items-center gap-2">
                          <Target weight="fill" className="text-purple-600" />
                          Strategy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-3">
                          {selectedBlock.strategy}
                        </p>
                        <ul className="space-y-2">
                          {selectedBlock.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-[clamp(0.75rem,2.4vw,0.85rem)]">
                              <NavigationArrow size={16} weight="fill" className="text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-2">Recommended Platforms</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedBlock.platforms.map(platform => (
                          <Badge key={platform} variant="secondary" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="routes" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {SCHEDULE_ROUTES.map((route) => (
                  <Card 
                    key={route.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                            {route.name}
                          </CardTitle>
                          <CardDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                            {route.description}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(route.id)
                          }}
                        >
                          <Star 
                            size={16} 
                            weight={(favoriteSchedules || []).includes(route.id) ? 'fill' : 'regular'}
                            className={(favoriteSchedules || []).includes(route.id) ? 'text-yellow-500' : ''}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Earnings</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-green-600">
                            ${route.totalEarnings}
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Hours</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-blue-600">
                            {route.totalHours}h
                          </p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Rides</p>
                          <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-purple-600">
                            {route.rideCount}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">Time Blocks:</p>
                        <div className="flex flex-wrap gap-1">
                          {route.timeBlocks.map(blockId => {
                            const block = TIME_BLOCKS.find(b => b.id === blockId)
                            return block ? (
                              <Badge key={blockId} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                {block.name.split(' ')[0]}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedRoute && (
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
                          <Path weight="fill" className="text-purple-600" />
                          {selectedRoute.name}
                        </CardTitle>
                        <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)] mt-1">
                          {selectedRoute.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRoute(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Earnings</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-green-600">
                            ${selectedRoute.totalEarnings}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Hours</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-blue-600">
                            {selectedRoute.totalHours}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Total Rides</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-purple-600">
                            {selectedRoute.rideCount}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)]">Per Hour</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-orange-600">
                            ${Math.round(selectedRoute.totalEarnings / selectedRoute.totalHours)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-[350px] rounded-lg overflow-hidden border-2 border-purple-200">
                      <OpenFreeMap
                        center={[40.7549, -73.9840]}
                        zoom={11}
                        markers={getRouteMarkers(selectedRoute)}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] mb-3 flex items-center gap-2">
                        <Clock weight="fill" className="text-purple-600" />
                        Schedule Breakdown
                      </h3>
                      <div className="space-y-3">
                        {selectedRoute.timeBlocks.map((blockId, index) => {
                          const block = TIME_BLOCKS.find(b => b.id === blockId)
                          if (!block) return null
                          
                          return (
                            <Card key={blockId}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">
                                      Block {index + 1}: {block.name}
                                    </CardTitle>
                                    <CardDescription className="text-[clamp(0.7rem,2vw,0.75rem)] mt-1">
                                      {block.timeRange}
                                    </CardDescription>
                                  </div>
                                  <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                    ${block.earningsTarget}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-2">
                                  {block.strategy}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {block.zones.slice(0, 3).map(zone => (
                                    <Badge key={zone.name} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                      {zone.name}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)]">My Custom Schedules</h3>
                  <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                    Create and save your favorite daily schedules
                  </p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus weight="bold" />
                  <span className="hidden sm:inline text-[clamp(0.75rem,2vw,0.85rem)]">Create Schedule</span>
                </Button>
              </div>

              {favoriteSchedulesList.length === 0 && (customSchedules || []).length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Star size={48} className="text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] mb-1">No Schedules Yet</h3>
                      <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground mb-4">
                        Create your first custom schedule or mark templates as favorites
                      </p>
                      <Button onClick={openCreateDialog} className="gap-2">
                        <Plus weight="bold" />
                        Create Your First Schedule
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <>
                  {(customSchedules || []).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] flex items-center gap-2">
                        <PencilSimple weight="fill" className="text-primary" />
                        Custom Schedules
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(customSchedules || []).map((schedule) => (
                          <Card 
                            key={schedule.id}
                            className="cursor-pointer transition-all hover:shadow-md"
                            onClick={() => setSelectedRoute(schedule)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                                  {schedule.name}
                                </CardTitle>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(schedule.id)
                                    }}
                                  >
                                    <Star 
                                      size={16} 
                                      weight={(favoriteSchedules || []).includes(schedule.id) ? 'fill' : 'regular'}
                                      className={(favoriteSchedules || []).includes(schedule.id) ? 'text-yellow-500' : ''}
                                    />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditSchedule(schedule)
                                    }}
                                  >
                                    <PencilSimple size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteSchedule(schedule.id)
                                    }}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </div>
                              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                                {schedule.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Earnings</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-green-600">
                                    ${schedule.totalEarnings}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Hours</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-blue-600">
                                    {schedule.totalHours}h
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Rides</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-purple-600">
                                    {schedule.rideCount}
                                  </p>
                                </div>
                              </div>

                              {schedule.customNotes && (
                                <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground italic border-l-2 border-primary pl-2">
                                  {schedule.customNotes}
                                </p>
                              )}

                              <div>
                                <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">Time Blocks:</p>
                                <div className="flex flex-wrap gap-1">
                                  {schedule.timeBlocks.map(blockId => {
                                    const block = TIME_BLOCKS.find(b => b.id === blockId)
                                    return block ? (
                                      <Badge key={blockId} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                        {block.name.split(' ')[0]}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {favoriteSchedulesList.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] flex items-center gap-2">
                        <Star weight="fill" className="text-yellow-500" />
                        Favorite Templates
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {favoriteSchedulesList.filter(s => !s.isCustom).map((schedule) => (
                          <Card 
                            key={schedule.id}
                            className="cursor-pointer transition-all hover:shadow-md"
                            onClick={() => setSelectedRoute(schedule)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">
                                  {schedule.name}
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(schedule.id)
                                  }}
                                >
                                  <Star 
                                    size={16} 
                                    weight="fill"
                                    className="text-yellow-500"
                                  />
                                </Button>
                              </div>
                              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2">
                                {schedule.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Earnings</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-green-600">
                                    ${schedule.totalEarnings}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Hours</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-blue-600">
                                    {schedule.totalHours}h
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[clamp(0.65rem,2vw,0.7rem)] text-muted-foreground">Rides</p>
                                  <p className="text-[clamp(0.9rem,2.5vw,1rem)] font-bold text-purple-600">
                                    {schedule.rideCount}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-1">Time Blocks:</p>
                                <div className="flex flex-wrap gap-1">
                                  {schedule.timeBlocks.map(blockId => {
                                    const block = TIME_BLOCKS.find(b => b.id === blockId)
                                    return block ? (
                                      <Badge key={blockId} variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                                        {block.name.split(' ')[0]}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
              <Plus weight="fill" className="text-primary" />
              Create Custom Schedule
            </DialogTitle>
            <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
              Build your own daily schedule by selecting time blocks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Schedule Name*</Label>
              <Input
                id="schedule-name"
                placeholder="e.g., My Monday Schedule"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-description">Description</Label>
              <Input
                id="schedule-description"
                placeholder="Brief description of this schedule"
                value={scheduleDescription}
                onChange={(e) => setScheduleDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-notes">Personal Notes</Label>
              <Textarea
                id="schedule-notes"
                placeholder="Add any personal notes or reminders for this schedule"
                value={scheduleNotes}
                onChange={(e) => setScheduleNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time Blocks*</Label>
              <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-2">
                Choose which time periods to include in your schedule
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TIME_BLOCKS.map((block) => (
                  <Card 
                    key={block.id}
                    className={`cursor-pointer transition-all ${
                      selectedTimeBlocks.includes(block.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleTimeBlock(block.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)] line-clamp-1">
                          {block.name}
                        </CardTitle>
                        {selectedTimeBlocks.includes(block.id) && (
                          <Badge className="bg-primary">Selected</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                        <Clock size={14} />
                        <span className="truncate">{block.timeRange}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                          ${block.earningsTarget}
                        </Badge>
                        <Badge variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                          {block.expectedRides} rides
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedTimeBlocks.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">Schedule Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Earnings</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-green-600">
                      ${TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id)).reduce((sum, b) => sum + b.earningsTarget, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Hours</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-blue-600">
                      {selectedTimeBlocks.length * 4}h
                    </p>
                  </div>
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Rides</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-purple-600">
                      {TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id)).reduce((sum, b) => sum + b.expectedRides, 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule}>
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[clamp(1rem,3vw,1.25rem)] flex items-center gap-2">
              <PencilSimple weight="fill" className="text-primary" />
              Edit Custom Schedule
            </DialogTitle>
            <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
              Update your schedule details and time blocks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-schedule-name">Schedule Name*</Label>
              <Input
                id="edit-schedule-name"
                placeholder="e.g., My Monday Schedule"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-schedule-description">Description</Label>
              <Input
                id="edit-schedule-description"
                placeholder="Brief description of this schedule"
                value={scheduleDescription}
                onChange={(e) => setScheduleDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-schedule-notes">Personal Notes</Label>
              <Textarea
                id="edit-schedule-notes"
                placeholder="Add any personal notes or reminders for this schedule"
                value={scheduleNotes}
                onChange={(e) => setScheduleNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time Blocks*</Label>
              <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-2">
                Choose which time periods to include in your schedule
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {TIME_BLOCKS.map((block) => (
                  <Card 
                    key={block.id}
                    className={`cursor-pointer transition-all ${
                      selectedTimeBlocks.includes(block.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleTimeBlock(block.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)] line-clamp-1">
                          {block.name}
                        </CardTitle>
                        {selectedTimeBlocks.includes(block.id) && (
                          <Badge className="bg-primary">Selected</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">
                        <Clock size={14} />
                        <span className="truncate">{block.timeRange}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                          ${block.earningsTarget}
                        </Badge>
                        <Badge variant="outline" className="text-[clamp(0.65rem,2vw,0.7rem)]">
                          {block.expectedRides} rides
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedTimeBlocks.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[clamp(0.85rem,2.5vw,0.95rem)]">Schedule Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Earnings</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-green-600">
                      ${TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id)).reduce((sum, b) => sum + b.earningsTarget, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Hours</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-blue-600">
                      {selectedTimeBlocks.length * 4}h
                    </p>
                  </div>
                  <div>
                    <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">Total Rides</p>
                    <p className="text-[clamp(1rem,2.8vw,1.25rem)] font-bold text-purple-600">
                      {TIME_BLOCKS.filter(b => selectedTimeBlocks.includes(b.id)).reduce((sum, b) => sum + b.expectedRides, 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSchedule}>
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

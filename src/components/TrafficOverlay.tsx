import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrafficSign, 
  Warning, 
  CheckCircle, 
  Lightning, 
  Gauge,
  MapPin,
  Clock,
  X,
  ArrowsClockwise
} from '@phosphor-icons/react'
import { OpenFreeMap } from '@/components/OpenFreeMap'
import { toast } from 'sonner'

interface TrafficSpeed {
  id: string
  borough: string
  street: string
  direction: string
  speed: number
  travelTime: number
  status: 'free-flow' | 'moderate' | 'congested' | 'severe'
  lastUpdated: Date
  coordinates?: [number, number]
}

interface TrafficIncident {
  id: string
  type: 'construction' | 'accident' | 'event' | 'closure'
  location: string
  description: string
  severity: 'low' | 'medium' | 'high'
  startDate: Date
  endDate?: Date
  coordinates?: [number, number]
}

const TRAFFIC_STATUS_COLORS = {
  'free-flow': 'text-success bg-success/10 border-success/30',
  'moderate': 'text-warning bg-warning/10 border-warning/30',
  'congested': 'text-destructive/70 bg-destructive/10 border-destructive/30',
  'severe': 'text-destructive bg-destructive/15 border-destructive/40'
}

const INCIDENT_COLORS = {
  'low': 'text-success bg-success/10 border-success/30',
  'medium': 'text-warning bg-warning/10 border-warning/30',
  'high': 'text-destructive bg-destructive/10 border-destructive/30'
}

export function TrafficOverlay() {
  const [trafficData, setTrafficData] = useState<TrafficSpeed[]>([])
  const [incidents, setIncidents] = useState<TrafficIncident[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedBorough, setSelectedBorough] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'traffic' | 'incidents'>('traffic')

  const fetchTrafficData = async () => {
    setIsLoading(true)
    try {
      const promptText = `You are a NYC DOT traffic data simulator. Generate realistic real-time traffic speed data for major NYC corridors based on current time patterns.

Generate 12 traffic speed records for major NYC streets across all boroughs. Include:
- Manhattan: FDR Drive (NB/SB), West Side Highway (NB/SB), Broadway, Park Avenue
- Brooklyn: BQE sections, Atlantic Avenue
- Queens: LIE sections, Queens Boulevard
- Bronx: Major Deegan, Cross Bronx Expressway

Consider realistic current time traffic patterns (rush hour vs off-peak).

For each record provide:
- id: unique identifier
- borough: Manhattan/Brooklyn/Queens/Bronx/Staten Island
- street: street or highway name
- direction: NB/SB/EB/WB/Both
- speed: current average speed in mph (realistic for that corridor)
- travelTime: travel time index (1.0 = free flow, >1.5 = congestion)
- status: free-flow (>35mph), moderate (25-35mph), congested (15-25mph), severe (<15mph)
- lastUpdated: current timestamp
- coordinates: [lat, lng] approximate midpoint of corridor

Return as JSON object with a single "trafficData" property containing the array.`

      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      const formattedData: TrafficSpeed[] = data.trafficData.map((item: any) => ({
        ...item,
        lastUpdated: new Date(item.lastUpdated || new Date())
      }))

      setTrafficData(formattedData)
      setLastUpdate(new Date())
      toast.success('Traffic data updated')
    } catch (error) {
      console.error('Error fetching traffic data:', error)
      toast.error('Failed to load traffic data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchIncidents = async () => {
    setIsLoading(true)
    try {
      const promptText = `You are a NYC DOT incident tracker. Generate realistic current traffic incidents and planned construction for NYC.

Generate 8-10 realistic traffic incidents including:
- Construction projects (ongoing street work, utility work)
- Planned events (marathons, parades, street fairs if applicable)
- Road closures
- Major incidents if realistic for current conditions

For each incident provide:
- id: unique identifier
- type: construction/accident/event/closure
- location: specific street/intersection/area
- description: brief description of incident and impact
- severity: low (minor delay), medium (moderate delay), high (significant delay/closure)
- startDate: start time (use realistic times)
- endDate: end time if temporary (null for ongoing construction)
- coordinates: [lat, lng] approximate location

Return as JSON object with a single "incidents" property containing the array.`

      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)
      
      const formattedIncidents: TrafficIncident[] = data.incidents.map((item: any) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: item.endDate ? new Date(item.endDate) : undefined
      }))

      setIncidents(formattedIncidents)
      setLastUpdate(new Date())
      toast.success('Incident data updated')
    } catch (error) {
      console.error('Error fetching incidents:', error)
      toast.error('Failed to load incident data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrafficData()
    fetchIncidents()
  }, [])

  const filteredTraffic = selectedBorough === 'all' 
    ? trafficData 
    : trafficData.filter(t => t.borough === selectedBorough)

  const filteredIncidents = selectedBorough === 'all'
    ? incidents
    : incidents.filter(i => i.location.includes(selectedBorough))

  const trafficMarkers = filteredTraffic
    .filter(t => t.coordinates)
    .map(t => ({
      position: t.coordinates as [number, number],
      label: `${t.street} ${t.direction}`,
      earnings: t.speed
    }))

  const incidentMarkers = filteredIncidents
    .filter(i => i.coordinates)
    .map(i => ({
      position: i.coordinates as [number, number],
      label: i.location,
      earnings: undefined
    }))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free-flow':
        return <CheckCircle weight="fill" />
      case 'moderate':
        return <Gauge weight="fill" />
      case 'congested':
      case 'severe':
        return <Warning weight="fill" />
      default:
        return <Gauge weight="fill" />
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'construction':
        return <Warning weight="fill" />
      case 'accident':
        return <Warning weight="fill" />
      case 'event':
        return <MapPin weight="fill" />
      case 'closure':
        return <X weight="fill" />
      default:
        return <Warning weight="fill" />
    }
  }

  const boroughs = ['all', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']

  const averageSpeed = trafficData.length > 0
    ? trafficData.reduce((sum, t) => sum + t.speed, 0) / trafficData.length
    : 0

  const congestedCount = trafficData.filter(t => t.status === 'congested' || t.status === 'severe').length
  const highSeverityIncidents = incidents.filter(i => i.severity === 'high').length

  return (
    <Card className="p-4 bg-gradient-to-br from-destructive/10 via-warning/5 to-success/5 border-warning/30 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-gradient-to-br from-warning to-warning/80 p-2.5 shadow-md">
          <TrafficSign size={22} className="text-warning-foreground" weight="fill" />
        </div>
        <div className="flex-1">
          <h2 className="text-[clamp(0.95rem,2.8vw,1.2rem)] font-bold mb-0.5 line-clamp-1 tracking-tight">
            Real-Time Traffic Intelligence
          </h2>
          <p className="text-[clamp(0.75rem,2.4vw,0.875rem)] text-muted-foreground line-clamp-1">
            Live NYC DOT traffic speeds & construction alerts
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {lastUpdate && (
            <div className="hidden sm:flex items-center gap-1.5 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
              <Clock size={14} weight="fill" />
              <span>{lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          <Button
            onClick={() => {
              fetchTrafficData()
              fetchIncidents()
            }}
            size="sm"
            variant="outline"
            disabled={isLoading}
            className="h-8 px-3 gap-1.5 text-[clamp(0.7rem,2vw,0.8rem)] bg-card hover:bg-accent/10 border-warning/30"
          >
            <ArrowsClockwise size={16} weight="bold" className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-3 border border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={16} className="text-primary flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-primary/90 uppercase tracking-wide font-semibold">
              Avg Speed
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] text-primary">
            {averageSpeed.toFixed(0)} mph
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary/80 mt-0.5">
            Current citywide
          </div>
        </div>

        <div className={`rounded-lg p-3 border ${congestedCount > 3 ? 'bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/30' : 'bg-gradient-to-br from-success/20 to-success/10 border-success/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Warning size={16} className={congestedCount > 3 ? 'text-destructive' : 'text-success'} weight="fill" />
            <div className={`text-[clamp(0.65rem,2vw,0.75rem)] uppercase tracking-wide font-semibold ${congestedCount > 3 ? 'text-destructive/90' : 'text-success/90'}`}>
              Congestion
            </div>
          </div>
          <div className={`font-bold text-[clamp(1rem,3vw,1.25rem)] ${congestedCount > 3 ? 'text-destructive' : 'text-success'}`}>
            {congestedCount} areas
          </div>
          <div className={`text-[clamp(0.7rem,2.2vw,0.8rem)] mt-0.5 ${congestedCount > 3 ? 'text-destructive/80' : 'text-success/80'}`}>
            {congestedCount > 3 ? 'Heavy delays' : 'Light traffic'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/20 to-warning/10 rounded-lg p-3 border border-warning/30">
          <div className="flex items-center gap-2 mb-1">
            <Warning size={16} className="text-warning flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-warning/90 uppercase tracking-wide font-semibold">
              Incidents
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)] text-warning">
            {incidents.length}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-warning/80 mt-0.5">
            {highSeverityIncidents} high severity
          </div>
        </div>

        <div className="bg-card rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <Lightning size={16} className="text-muted-foreground flex-shrink-0" weight="fill" />
            <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground uppercase tracking-wide">
              Live Data
            </div>
          </div>
          <div className="font-bold text-[clamp(1rem,3vw,1.25rem)]">
            {trafficData.length}
          </div>
          <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground mt-0.5">
            Corridors tracked
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {boroughs.map((borough) => (
          <Button
            key={borough}
            onClick={() => setSelectedBorough(borough)}
            size="sm"
            variant={selectedBorough === borough ? 'default' : 'outline'}
            className="h-7 px-3 text-[clamp(0.7rem,2vw,0.75rem)]"
          >
            {borough === 'all' ? 'All Boroughs' : borough}
          </Button>
        ))}
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'traffic' | 'incidents')} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="traffic" className="gap-1.5">
            <Gauge size={16} weight="fill" />
            <span>Traffic Speeds</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[0.65rem]">
              {filteredTraffic.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="incidents" className="gap-1.5">
            <Warning size={16} weight="fill" />
            <span>Incidents</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[0.65rem]">
              {filteredIncidents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-3">
          {filteredTraffic.length > 0 ? (
            <>
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-4">
                <OpenFreeMap
                  center={[40.7128, -74.0060]}
                  zoom={11}
                  markers={trafficMarkers}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                {filteredTraffic.map((traffic) => (
                  <div 
                    key={traffic.id}
                    className="bg-card rounded-lg p-3 border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${TRAFFIC_STATUS_COLORS[traffic.status]} border`}>
                        {getStatusIcon(traffic.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] line-clamp-1">
                              {traffic.street}
                            </div>
                            <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-muted-foreground">
                              {traffic.direction} • {traffic.borough}
                            </div>
                          </div>
                          <Badge className={`${TRAFFIC_STATUS_COLORS[traffic.status]} border font-mono whitespace-nowrap`}>
                            {traffic.speed} mph
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[clamp(0.7rem,2.2vw,0.75rem)] text-muted-foreground">
                          <span>Travel Time: {traffic.travelTime.toFixed(1)}x</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="capitalize">{traffic.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-card rounded-lg p-8 border text-center">
              <Gauge size={48} className="mx-auto mb-3 text-muted-foreground/50" weight="fill" />
              <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-medium mb-1">
                No traffic data for {selectedBorough}
              </p>
              <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                Try selecting a different borough or refresh data
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-3">
          {filteredIncidents.length > 0 ? (
            <>
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden mb-4">
                <OpenFreeMap
                  center={[40.7128, -74.0060]}
                  zoom={11}
                  markers={incidentMarkers}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                {filteredIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className="bg-card rounded-lg p-3 border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${INCIDENT_COLORS[incident.severity]} border`}>
                        {getIncidentIcon(incident.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <div className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] line-clamp-1">
                              {incident.location}
                            </div>
                            <div className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-foreground/90 mt-1 line-clamp-2">
                              {incident.description}
                            </div>
                          </div>
                          <Badge className={`${INCIDENT_COLORS[incident.severity]} border capitalize whitespace-nowrap`}>
                            {incident.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[clamp(0.7rem,2.2vw,0.75rem)] text-muted-foreground">
                          <span>Severity: <span className="font-semibold capitalize">{incident.severity}</span></span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>
                            {incident.endDate 
                              ? `Until ${incident.endDate.toLocaleDateString()}`
                              : 'Ongoing'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-card rounded-lg p-8 border text-center">
              <CheckCircle size={48} className="mx-auto mb-3 text-success/50" weight="fill" />
              <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] font-medium mb-1">
                No incidents in {selectedBorough}
              </p>
              <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] text-muted-foreground">
                Clear roads ahead!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightning size={16} className="text-primary flex-shrink-0 mt-0.5" weight="fill" />
          <div>
            <p className="text-[clamp(0.75rem,2.4vw,0.85rem)] font-semibold text-primary mb-1">
              Traffic Intelligence Tips
            </p>
            <p className="text-[clamp(0.7rem,2.2vw,0.8rem)] text-primary/90">
              Use traffic data to avoid congested areas and reach high-earning zones faster. Check construction alerts before starting your shift to plan optimal routes.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

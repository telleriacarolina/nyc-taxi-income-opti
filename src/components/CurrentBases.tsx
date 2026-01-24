import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Buildings, 
  Phone, 
  MapPin, 
  MagnifyingGlass, 
  ArrowsClockwise,
  Taxi,
  Briefcase,
  ListBullets,
  Globe
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BaseData {
  base_number: string
  base_name: string
  base_type: string
  dba: string
  base_telephone_number?: string
  website?: string
  base_address?: string
  reason?: string
  app_company_affiliation?: string
  veh?: string
}

export function CurrentBases() {
  const [bases, setBases] = useState<BaseData[]>([])
  const [filteredBases, setFilteredBases] = useState<BaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchBases = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/eccv-9dzr.json?$limit=1000')
      if (!response.ok) throw new Error('Failed to fetch base data')
      
      const data = await response.json()
      setBases(data)
      setFilteredBases(data)
      setLastUpdate(new Date())
      toast.success(`Loaded ${data.length} TLC bases`)
    } catch (error) {
      console.error('Error fetching bases:', error)
      toast.error('Failed to load TLC base data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBases()
  }, [])

  useEffect(() => {
    let filtered = bases

    if (selectedType !== 'all') {
      filtered = filtered.filter(base => 
        base.base_type?.toLowerCase() === selectedType.toLowerCase()
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(base => 
        base.base_name?.toLowerCase().includes(query) ||
        base.base_number?.toLowerCase().includes(query) ||
        base.dba?.toLowerCase().includes(query) ||
        base.app_company_affiliation?.toLowerCase().includes(query)
      )
    }

    setFilteredBases(filtered)
  }, [searchQuery, selectedType, bases])

  const baseTypes = Array.from(new Set(bases.map(b => b.base_type).filter(Boolean)))
  const typeCount = (type: string) => bases.filter(b => b.base_type === type).length

  return (
    <div className="space-y-4">
      <Card className="p-5 border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Taxi size={24} weight="fill" className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] line-clamp-1">
                  NYC TLC Current Bases
                </h3>
                <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-1">
                  Live database of licensed TLC bases operating in NYC
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchBases}
              disabled={loading}
              className="flex-shrink-0"
            >
              <ArrowsClockwise size={16} weight={loading ? 'bold' : 'regular'} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>

          {lastUpdate && (
            <div className="flex items-center gap-2 text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
              <ListBullets size={14} />
              <span>{filteredBases.length} bases found</span>
              <span className="text-border">•</span>
              <span>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              placeholder="Search by name, base number, or affiliation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-[clamp(0.7rem,2vw,0.8rem)]">
                All ({bases.length})
              </TabsTrigger>
              {baseTypes.slice(0, 2).map(type => (
                <TabsTrigger 
                  key={type} 
                  value={type}
                  className="text-[clamp(0.7rem,2vw,0.8rem)] truncate"
                >
                  {type} ({typeCount(type)})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ArrowsClockwise size={32} weight="bold" className="text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading TLC base data...</p>
          </div>
        ) : filteredBases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Buildings size={48} weight="duotone" className="text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium text-foreground mb-1">No bases found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Try refreshing the data'}
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-3">
              {filteredBases.map((base, index) => (
                <Card 
                  key={`${base.base_number}-${index}`}
                  className="p-4 border-l-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: base.base_type === 'Black-Car' ? '#3b82f6' : '#10b981' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-[clamp(0.85rem,2.5vw,0.95rem)] truncate">
                            {base.base_name || base.dba || 'Unknown Base'}
                          </h4>
                          {base.base_type && (
                            <Badge variant="secondary" className="text-[clamp(0.65rem,2vw,0.7rem)] flex-shrink-0">
                              {base.base_type}
                            </Badge>
                          )}
                        </div>
                        
                        {base.dba && base.dba !== base.base_name && (
                          <p className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground mb-2">
                            DBA: {base.dba}
                          </p>
                        )}

                        {base.app_company_affiliation && (
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase size={14} className="text-primary flex-shrink-0" />
                            <span className="text-[clamp(0.7rem,2vw,0.75rem)] text-foreground font-medium">
                              {base.app_company_affiliation}
                            </span>
                          </div>
                        )}
                      </div>

                      <Badge 
                        variant="outline" 
                        className="text-[clamp(0.65rem,2vw,0.7rem)] font-mono flex-shrink-0"
                      >
                        {base.base_number}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-[clamp(0.7rem,2vw,0.75rem)]">
                      {base.base_address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={14} weight="fill" className="text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground break-words">{base.base_address}</span>
                        </div>
                      )}

                      {base.base_telephone_number && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                          <a 
                            href={`tel:${base.base_telephone_number}`}
                            className="text-primary hover:underline"
                          >
                            {base.base_telephone_number}
                          </a>
                        </div>
                      )}

                      {base.website && (
                        <div className="flex items-center gap-2">
                          <Globe size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                          <a 
                            href={base.website.startsWith('http') ? base.website : `https://${base.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {base.website}
                          </a>
                        </div>
                      )}

                      {base.veh && (
                        <div className="flex items-center gap-2">
                          <Taxi size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">{base.veh} vehicles</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Buildings size={20} weight="duotone" className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-[clamp(0.7rem,2vw,0.75rem)] text-muted-foreground">
            <p className="font-medium text-foreground mb-1">About TLC Bases</p>
            <p>
              This data is sourced from NYC Open Data and shows currently licensed TLC bases. 
              Bases are dispatch centers that coordinate trips for FHV (For-Hire Vehicle) and 
              black car drivers. Many bases are affiliated with major ride-hailing apps.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CalendarBlank,
  CheckCircle,
  Circle,
  Lightning,
  TrendUp
} from '@phosphor-icons/react'

interface PlatformOption {
  id: string
  name: string
  color: string
  icon: string
}

const PLATFORMS: PlatformOption[] = [
  { id: 'uber', name: 'Uber', color: '#000000', icon: '🚗' },
  { id: 'lyft', name: 'Lyft', color: '#FF00BF', icon: '🔮' },
  { id: 'curb', name: 'Curb', color: '#00B14F', icon: '🚕' },
  { id: 'revel', name: 'Revel', color: '#5B7FFF', icon: '⚡' },
  { id: 'via', name: 'Via', color: '#00D4AA', icon: '🚐' },
  { id: 'juno', name: 'Juno', color: '#6C5CE7', icon: '💜' }
]

export function DailyPlatformPlanner() {
  const [selectedPlatforms, setSelectedPlatforms] = useKV<string[]>('daily-platforms', [])
  const [lastDate, setLastDate] = useKV<string>('daily-platforms-date', new Date().toDateString())

  const currentDate = new Date().toDateString()

  if (currentDate !== lastDate) {
    setSelectedPlatforms([])
    setLastDate(currentDate)
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((current) => {
      const platforms = current || []
      if (platforms.includes(platformId)) {
        return platforms.filter(id => id !== platformId)
      } else {
        return [...platforms, platformId]
      }
    })
  }

  const selectAll = () => {
    setSelectedPlatforms(PLATFORMS.map(p => p.id))
  }

  const clearAll = () => {
    setSelectedPlatforms([])
  }

  const selectedCount = (selectedPlatforms || []).length

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 flex-shrink-0">
            <CalendarBlank size={20} className="text-primary" weight="fill" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.05rem)] line-clamp-1">
              Today's Platforms
            </h3>
            <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className="flex-shrink-0 font-mono text-[clamp(0.7rem,2vw,0.8rem)] px-2 py-1"
        >
          {selectedCount}/{PLATFORMS.length}
        </Badge>
      </div>

      {selectedCount > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendUp size={16} className="text-success flex-shrink-0" weight="bold" />
            <span className="font-semibold text-success text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">
              Multi-app strategy active
            </span>
          </div>
          <p className="text-foreground/70 text-[clamp(0.625rem,1.8vw,0.7rem)] leading-snug line-clamp-2">
            Running {selectedCount} platform{selectedCount !== 1 ? 's' : ''} increases ride opportunities and helps you reach your $500-$1000 daily goal
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {PLATFORMS.map(platform => {
          const isSelected = (selectedPlatforms || []).includes(platform.id)
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-primary bg-primary/10 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl flex-shrink-0">{platform.icon}</span>
                <span className="font-medium text-[clamp(0.7rem,2vw,0.8rem)] truncate flex-1 text-left">
                  {platform.name}
                </span>
                {isSelected ? (
                  <CheckCircle size={18} weight="fill" className="text-primary flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          className="flex-1 text-[clamp(0.7rem,2vw,0.8rem)] h-8"
        >
          <Lightning size={14} weight="fill" className="mr-1" />
          All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="flex-1 text-[clamp(0.7rem,2vw,0.8rem)] h-8"
        >
          Clear
        </Button>
      </div>

      {selectedCount === 0 && (
        <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-muted-foreground text-[clamp(0.65rem,2vw,0.75rem)] leading-snug">
            Select platforms you'll work with today to track your multi-app strategy
          </p>
        </div>
      )}
    </Card>
  )
}

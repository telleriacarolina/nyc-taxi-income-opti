import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Funnel, X } from '@phosphor-icons/react'

export interface RideFilterOptions {
  platforms: string[]
  dateFrom: string
  dateTo: string
  datePreset: 'all' | 'today' | 'week' | 'month' | 'custom'
}

interface RideFiltersProps {
  filters: RideFilterOptions
  onFiltersChange: (filters: RideFilterOptions) => void
  availablePlatforms: string[]
  activeFiltersCount: number
}

const getPresetDates = (preset: RideFilterOptions['datePreset']): { from: string; to: string } => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  switch (preset) {
    case 'today':
      return { from: todayStr, to: todayStr }
    case 'week': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { from: weekAgo.toISOString().split('T')[0], to: todayStr }
    }
    case 'month': {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return { from: monthAgo.toISOString().split('T')[0], to: todayStr }
    }
    default:
      return { from: '', to: '' }
  }
}

export function RideFilters({ filters, onFiltersChange, availablePlatforms, activeFiltersCount }: RideFiltersProps) {
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform]
    
    onFiltersChange({ ...filters, platforms: newPlatforms })
  }

  const handleDatePresetChange = (preset: RideFilterOptions['datePreset']) => {
    const dates = getPresetDates(preset)
    onFiltersChange({
      ...filters,
      datePreset: preset,
      dateFrom: dates.from,
      dateTo: dates.to
    })
  }

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({
      ...filters,
      datePreset: 'custom',
      dateFrom
    })
  }

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({
      ...filters,
      datePreset: 'custom',
      dateTo
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      platforms: [],
      dateFrom: '',
      dateTo: '',
      datePreset: 'all'
    })
  }

  const platformLabels: Record<string, string> = {
    uber: 'Uber',
    lyft: 'Lyft',
    via: 'Via',
    curb: 'Curb',
    revel: 'Revel',
    juno: 'Juno',
    other: 'Other'
  }

  return (
    <Card className="p-6 mb-6 border-2">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Funnel size={24} className="text-primary" weight="fill" />
          <h3 className="text-xl font-semibold">Filter Rides</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="font-mono">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={16} weight="bold" className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-semibold mb-3 block">Date Range</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            <Button
              variant={filters.datePreset === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDatePresetChange('all')}
              className="font-medium"
            >
              All Time
            </Button>
            <Button
              variant={filters.datePreset === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDatePresetChange('today')}
              className="font-medium"
            >
              Today
            </Button>
            <Button
              variant={filters.datePreset === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDatePresetChange('week')}
              className="font-medium"
            >
              Last 7 Days
            </Button>
            <Button
              variant={filters.datePreset === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDatePresetChange('month')}
              className="font-medium"
            >
              Last 30 Days
            </Button>
            <Button
              variant={filters.datePreset === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDatePresetChange('custom')}
              className="font-medium"
            >
              Custom
            </Button>
          </div>

          {(filters.datePreset === 'custom' || filters.dateFrom || filters.dateTo) && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label htmlFor="date-from" className="text-xs text-muted-foreground mb-1 block">
                  From Date
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  max={filters.dateTo || undefined}
                />
              </div>
              <div>
                <Label htmlFor="date-to" className="text-xs text-muted-foreground mb-1 block">
                  To Date
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  min={filters.dateFrom || undefined}
                />
              </div>
            </div>
          )}
        </div>

        {availablePlatforms.length > 0 && (
          <div>
            <Label className="text-sm font-semibold mb-3 block">Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map(platform => (
                <Badge
                  key={platform}
                  variant={filters.platforms.includes(platform) ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 text-sm font-medium transition-all hover:scale-105"
                  onClick={() => handlePlatformToggle(platform)}
                >
                  {platformLabels[platform] || platform}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

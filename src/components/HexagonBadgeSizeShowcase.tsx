import { HexagonBadge } from './HexagonBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CarProfile, 
  MapPin, 
  TrendUp, 
  Trophy, 
  Rocket,
  Check,
  Star,
  Lightning
} from '@phosphor-icons/react'

export function HexagonBadgeSizeShowcase() {
  const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  
  const sizeDescriptions = {
    xs: { 
      label: 'Extra Small', 
      dimensions: '28×32px',
      use: 'Inline badges, compact lists',
      icon: <Check />
    },
    sm: { 
      label: 'Small', 
      dimensions: '40×46px',
      use: 'Table cells, mobile views',
      icon: <Star />
    },
    md: { 
      label: 'Medium', 
      dimensions: '50×58px',
      use: 'Default cards, list items',
      icon: <CarProfile />
    },
    lg: { 
      label: 'Large', 
      dimensions: '60×69px',
      use: 'Feature cards, headers',
      icon: <MapPin />
    },
    xl: { 
      label: 'Extra Large', 
      dimensions: '80×92px',
      use: 'Hero sections, modals',
      icon: <TrendUp />
    },
    '2xl': { 
      label: '2X Large', 
      dimensions: '100×115px',
      use: 'Landing pages, showcases',
      icon: <Trophy />
    }
  }

  const gradientExamples = [
    {
      name: 'Electric Cyan',
      colors: ['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)'] as [string, string]
    },
    {
      name: 'Success Green',
      colors: ['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)'] as [string, string]
    },
    {
      name: 'Warning Amber',
      colors: ['oklch(0.75 0.18 75)', 'oklch(0.85 0.16 85)'] as [string, string]
    },
    {
      name: 'Alert Red',
      colors: ['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 35)'] as [string, string]
    }
  ]

  return (
    <div className="space-y-8">
      <Card className="border-2 border-primary/20 bg-card/50">
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-wider">HEXAGON BADGE SIZE VARIATIONS</CardTitle>
          <CardDescription>Six responsive size options for different UI contexts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="font-display text-lg tracking-wider text-primary">Size Reference Guide</h3>
            <div className="grid gap-6">
              {sizes.map((size) => (
                <div 
                  key={size}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg border border-border/50 bg-background/30"
                >
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <HexagonBadge
                      icon={sizeDescriptions[size].icon}
                      size={size}
                      gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
                      animated={true}
                    />
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-foreground uppercase tracking-wider">
                        {sizeDescriptions[size].label}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {sizeDescriptions[size].dimensions}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {sizeDescriptions[size].use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-lg tracking-wider text-primary">All Sizes Comparison</h3>
            <div className="flex flex-wrap items-end gap-6 p-6 rounded-lg border border-border/50 bg-background/30">
              {sizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <HexagonBadge
                    icon={<Lightning weight="duotone" />}
                    size={size}
                    gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.80 0.16 95)']}
                    animated={true}
                  />
                  <span className="text-xs font-mono text-muted-foreground uppercase">{size}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-lg tracking-wider text-primary">Gradient Color Examples</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {gradientExamples.map((example) => (
                <div 
                  key={example.name}
                  className="flex flex-col gap-4 p-4 rounded-lg border border-border/50 bg-background/30"
                >
                  <h4 className="font-display text-sm tracking-wider text-foreground">{example.name}</h4>
                  <div className="flex flex-wrap items-end gap-3">
                    <HexagonBadge
                      icon={<Rocket weight="duotone" />}
                      size="sm"
                      gradientColors={example.colors}
                      animated={true}
                    />
                    <HexagonBadge
                      icon={<Rocket weight="duotone" />}
                      size="md"
                      gradientColors={example.colors}
                      animated={true}
                    />
                    <HexagonBadge
                      icon={<Rocket weight="duotone" />}
                      size="lg"
                      gradientColors={example.colors}
                      animated={true}
                    />
                  </div>
                  <div className="flex gap-2 text-xs font-mono">
                    <code className="px-2 py-1 rounded bg-muted/50 text-muted-foreground truncate">
                      {example.colors[0]}
                    </code>
                    <code className="px-2 py-1 rounded bg-muted/50 text-muted-foreground truncate">
                      {example.colors[1]}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-lg tracking-wider text-primary">Responsive Layout Example</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-background/30">
                <div className="md:hidden">
                  <HexagonBadge
                    icon={<CarProfile weight="duotone" />}
                    size="sm"
                    gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
                  />
                </div>
                <div className="hidden md:block lg:hidden">
                  <HexagonBadge
                    icon={<CarProfile weight="duotone" />}
                    size="md"
                    gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
                  />
                </div>
                <div className="hidden lg:block">
                  <HexagonBadge
                    icon={<CarProfile weight="duotone" />}
                    size="lg"
                    gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-foreground">Responsive Badge</span>
                  <span className="text-xs text-muted-foreground">
                    <span className="md:hidden">Small on mobile</span>
                    <span className="hidden md:inline lg:hidden">Medium on tablet</span>
                    <span className="hidden lg:inline">Large on desktop</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-lg tracking-wider text-primary">Animation Toggle Examples</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4 p-4 rounded-lg border border-border/50 bg-background/30">
                <h4 className="font-display text-sm tracking-wider text-foreground">Animated (Default)</h4>
                <div className="flex items-end gap-3">
                  <HexagonBadge
                    icon={<Star weight="duotone" />}
                    size="md"
                    gradientColors={['oklch(0.80 0.16 95)', 'oklch(0.70 0.22 45)']}
                    animated={true}
                  />
                  <span className="text-xs text-muted-foreground">Hover for spring effect</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 rounded-lg border border-border/50 bg-background/30">
                <h4 className="font-display text-sm tracking-wider text-foreground">Static (Performance)</h4>
                <div className="flex items-end gap-3">
                  <HexagonBadge
                    icon={<Star weight="duotone" />}
                    size="md"
                    gradientColors={['oklch(0.80 0.16 95)', 'oklch(0.70 0.22 45)']}
                    animated={false}
                  />
                  <span className="text-xs text-muted-foreground">Best for dense lists</span>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

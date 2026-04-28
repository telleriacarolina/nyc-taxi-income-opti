import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Palette, Check } from '@phosphor-icons/react'
import { themes, applyTheme, getThemeByName } from '@/lib/themes'
import { cn } from '@/lib/utils'

export function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useKV<string>('app-theme', 'burgundy-taxi')
  const [open, setOpen] = useState(false)

  const handleThemeChange = (themeName: string) => {
    const theme = getThemeByName(themeName)
    if (theme) {
      applyTheme(theme)
      setSelectedTheme(themeName)
      setOpen(false)
    }
  }

  const currentTheme = selectedTheme ? getThemeByName(selectedTheme) : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border/60 bg-card/60 hover:bg-card shadow-sm"
        >
          <Palette size={16} weight="fill" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Palette size={24} weight="fill" />
            Choose Your Theme
          </DialogTitle>
          <DialogDescription>
            Select a color theme that matches your style. Changes apply instantly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme.name)}
              className={cn(
                'relative group rounded-lg border-2 p-4 text-left transition-all hover:scale-[1.02]',
                selectedTheme === theme.name
                  ? 'border-primary shadow-lg'
                  : 'border-border/40 hover:border-border'
              )}
            >
              {selectedTheme === theme.name && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                  <Check size={16} weight="bold" />
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-1">{theme.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.card }}
                    title="Card"
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.success }}
                    title="Success"
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
                    style={{ backgroundColor: theme.colors.warning }}
                    title="Warning"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {currentTheme && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Check size={18} weight="fill" />
              Current Theme: {currentTheme.displayName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentTheme.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

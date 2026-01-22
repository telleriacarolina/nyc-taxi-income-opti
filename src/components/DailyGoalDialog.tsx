import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Target, CurrencyDollar } from '@phosphor-icons/react'

interface DailyGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  minGoal: number
  maxGoal: number
  onSave: (minGoal: number, maxGoal: number) => void
}

export function DailyGoalDialog({ open, onOpenChange, minGoal, maxGoal, onSave }: DailyGoalDialogProps) {
  const [localMin, setLocalMin] = useState(minGoal)
  const [localMax, setLocalMax] = useState(maxGoal)

  useEffect(() => {
    setLocalMin(minGoal)
    setLocalMax(maxGoal)
  }, [minGoal, maxGoal])

  const handleSave = () => {
    if (localMin < 0 || localMax < 0) return
    if (localMin > localMax) return
    
    onSave(localMin, localMax)
    onOpenChange(false)
  }

  const presets = [
    { label: 'Starter', min: 200, max: 400 },
    { label: 'Standard', min: 300, max: 500 },
    { label: 'Aggressive', min: 500, max: 800 },
    { label: 'Premium', min: 800, max: 1200 },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-primary/20 p-2">
              <Target size={20} className="text-primary" weight="fill" />
            </div>
            <DialogTitle className="text-[clamp(1rem,3vw,1.25rem)]">Set Daily Goals</DialogTitle>
          </div>
          <DialogDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
            Customize your minimum and maximum daily earning targets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="min-goal" className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-medium flex items-center gap-2">
              <CurrencyDollar size={16} weight="fill" className="text-primary" />
              Minimum Daily Goal
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="min-goal"
                  type="number"
                  min="0"
                  step="50"
                  value={localMin}
                  onChange={(e) => setLocalMin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="pl-7 text-[clamp(0.85rem,2.5vw,1rem)]"
                />
              </div>
            </div>
            <Slider
              value={[localMin]}
              onValueChange={([value]) => setLocalMin(value)}
              min={0}
              max={2000}
              step={50}
              className="py-2"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="max-goal" className="text-[clamp(0.8rem,2.5vw,0.9rem)] font-medium flex items-center gap-2">
              <CurrencyDollar size={16} weight="fill" className="text-success" />
              Maximum Daily Goal
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="max-goal"
                  type="number"
                  min="0"
                  step="50"
                  value={localMax}
                  onChange={(e) => setLocalMax(Math.max(0, parseInt(e.target.value) || 0))}
                  className="pl-7 text-[clamp(0.85rem,2.5vw,1rem)]"
                />
              </div>
            </div>
            <Slider
              value={[localMax]}
              onValueChange={([value]) => setLocalMax(value)}
              min={0}
              max={2000}
              step={50}
              className="py-2"
            />
          </div>

          {localMin > localMax && (
            <div className="text-destructive text-[clamp(0.7rem,2.2vw,0.8rem)] bg-destructive/10 border border-destructive/30 rounded-md p-2">
              ⚠ Minimum goal cannot exceed maximum goal
            </div>
          )}

          <div>
            <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-medium mb-2 block">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLocalMin(preset.min)
                    setLocalMax(preset.max)
                  }}
                  className="text-[clamp(0.7rem,2vw,0.8rem)] h-auto py-2 flex flex-col items-start"
                >
                  <span className="font-semibold">{preset.label}</span>
                  <span className="text-muted-foreground text-[clamp(0.65rem,1.8vw,0.7rem)]">
                    ${preset.min} - ${preset.max}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="text-[clamp(0.7rem,2.2vw,0.8rem)] font-medium mb-2">Preview</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">Min Target</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-primary">${localMin}</div>
              </div>
              <div className="text-muted-foreground">→</div>
              <div>
                <div className="text-[clamp(0.65rem,2vw,0.75rem)] text-muted-foreground">Max Target</div>
                <div className="font-bold text-[clamp(1rem,3vw,1.2rem)] text-success">${localMax}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-[clamp(0.7rem,2vw,0.8rem)]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={localMin > localMax || localMin < 0 || localMax < 0}
            className="text-[clamp(0.7rem,2vw,0.8rem)]"
          >
            Save Goals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calculator,
  CarProfile,
  FirstAidKit,
  CurrencyDollar,
  TrendUp,
  Clock,
  Path,
  Percent,
  Lightning,
  Warning
} from '@phosphor-icons/react'

interface TripResult {
  grossPay: number
  platformFee: number
  netPay: number
  payPerMile: number
  payPerMinute: number
  hourlyRate: number
}

const rideshareRates = {
  uber: { baseFare: 2.55, perMile: 1.75, perMinute: 0.35, bookingFee: 2.75, commissionRate: 0.275 },
  lyft: { baseFare: 2.00, perMile: 1.79, perMinute: 0.33, bookingFee: 2.50, commissionRate: 0.28 },
  via: { baseFare: 2.75, perMile: 1.50, perMinute: 0.40, bookingFee: 2.25, commissionRate: 0.25 },
  curb: { baseFare: 3.00, perMile: 2.25, perMinute: 0.50, bookingFee: 0, commissionRate: 0.10 },
  revel: { baseFare: 2.50, perMile: 1.95, perMinute: 0.38, bookingFee: 2.00, commissionRate: 0.15 },
  juno: { baseFare: 2.50, perMile: 1.85, perMinute: 0.37, bookingFee: 2.00, commissionRate: 0.15 }
}

const medicalRates = {
  mtm: { flatRate: 35, bonusPerMile: 1.50, waitTime: 5, commissionRate: 0 },
  logisticare: { flatRate: 39, bonusPerMile: 1.75, waitTime: 7, commissionRate: 0 },
  access2care: { flatRate: 42, bonusPerMile: 2.00, waitTime: 8, commissionRate: 0 },
  ambulette: { flatRate: 60, bonusPerMile: 2.50, waitTime: 10, commissionRate: 0 },
  accessaride: { flatRate: 47, bonusPerMile: 1.80, waitTime: 6, commissionRate: 0 }
}

export function TripCalculator() {
  const [distance, setDistance] = useState('10')
  const [duration, setDuration] = useState('25')
  const [rideshareType, setRideshareType] = useState('uber')
  const [medicalType, setMedicalType] = useState('mtm')

  const parseNumber = (value: string): number => {
    const num = parseFloat(value)
    return isNaN(num) || num < 0 ? 0 : num
  }

  const calculateRideshare = (): TripResult => {
    const dist = parseNumber(distance)
    const dur = parseNumber(duration)
    const rates = rideshareRates[rideshareType as keyof typeof rideshareRates]

    const grossPay = rates.baseFare + (dist * rates.perMile) + (dur * rates.perMinute) + rates.bookingFee
    const platformFee = grossPay * rates.commissionRate
    const netPay = grossPay - platformFee

    return {
      grossPay,
      platformFee,
      netPay,
      payPerMile: dist > 0 ? netPay / dist : 0,
      payPerMinute: dur > 0 ? netPay / dur : 0,
      hourlyRate: dur > 0 ? (netPay / dur) * 60 : 0
    }
  }

  const calculateMedical = (): TripResult => {
    const dist = parseNumber(distance)
    const dur = parseNumber(duration)
    const rates = medicalRates[medicalType as keyof typeof medicalRates]

    const baseTrip = rates.flatRate + (dist * rates.bonusPerMile)
    const waitTimeBonus = rates.waitTime
    const grossPay = baseTrip + waitTimeBonus
    const platformFee = grossPay * rates.commissionRate
    const netPay = grossPay - platformFee

    return {
      grossPay,
      platformFee,
      netPay,
      payPerMile: dist > 0 ? netPay / dist : 0,
      payPerMinute: dur > 0 ? netPay / dur : 0,
      hourlyRate: dur > 0 ? (netPay / dur) * 60 : 0
    }
  }

  const rideshareResult = calculateRideshare()
  const medicalResult = calculateMedical()

  const difference = medicalResult.netPay - rideshareResult.netPay
  const percentDifference = rideshareResult.netPay > 0 
    ? (difference / rideshareResult.netPay) * 100 
    : 0

  const betterOption = difference > 0 ? 'medical' : 'rideshare'
  const dist = parseNumber(distance)
  const dur = parseNumber(duration)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-lg p-6 border">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
            <Calculator size={28} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Trip Income Calculator</h2>
            <p className="text-muted-foreground">
              Compare potential earnings from rideshare apps vs medical transport services for the same trip. 
              Enter trip details to see which option pays better.
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6 border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Path size={20} className="text-primary" weight="fill" />
          Trip Details
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm font-semibold">
              Distance (miles)
            </Label>
            <Input
              id="distance"
              type="number"
              min="0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="10"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-semibold">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="0"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="25"
              className="text-lg"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 border-2 hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CarProfile size={20} className="text-accent" weight="fill" />
              Rideshare
            </h3>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Platform Fee: {(rideshareRates[rideshareType as keyof typeof rideshareRates].commissionRate * 100).toFixed(0)}%
            </Badge>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="rideshare-platform" className="text-sm font-semibold">
                Platform
              </Label>
              <Select value={rideshareType} onValueChange={setRideshareType}>
                <SelectTrigger id="rideshare-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uber">Uber (27.5% fee)</SelectItem>
                  <SelectItem value="lyft">Lyft (28% fee)</SelectItem>
                  <SelectItem value="via">Via (25% fee)</SelectItem>
                  <SelectItem value="curb">Curb (10% fee)</SelectItem>
                  <SelectItem value="revel">Revel (15% fee)</SelectItem>
                  <SelectItem value="juno">Juno (15% fee)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Gross Pay</span>
              <span className="text-lg font-semibold font-mono">
                ${rideshareResult.grossPay.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-destructive">
              <span className="text-sm">Platform Fee</span>
              <span className="text-lg font-semibold font-mono">
                -${rideshareResult.platformFee.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2 bg-accent/10 rounded-lg px-3">
              <span className="text-sm font-semibold">Net Pay</span>
              <span className="text-2xl font-bold text-accent font-mono">
                ${rideshareResult.netPay.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/mile</div>
                <div className="text-sm font-bold font-mono">
                  ${rideshareResult.payPerMile.toFixed(2)}
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/min</div>
                <div className="text-sm font-bold font-mono">
                  ${rideshareResult.payPerMinute.toFixed(2)}
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/hour</div>
                <div className="text-sm font-bold font-mono">
                  ${rideshareResult.hourlyRate.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:border-success/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FirstAidKit size={20} className="text-success" weight="fill" />
              Medical Transport
            </h3>
            <Badge variant="secondary" className="bg-success/20 text-success">
              No Platform Fee
            </Badge>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="medical-platform" className="text-sm font-semibold">
                Provider
              </Label>
              <Select value={medicalType} onValueChange={setMedicalType}>
                <SelectTrigger id="medical-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtm">MTM ($35 base)</SelectItem>
                  <SelectItem value="logisticare">LogistiCare ($39 base)</SelectItem>
                  <SelectItem value="access2care">Access2Care ($42 base)</SelectItem>
                  <SelectItem value="ambulette">Ambulette WAV ($60 base)</SelectItem>
                  <SelectItem value="accessaride">Access-A-Ride ($47 base)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Gross Pay</span>
              <span className="text-lg font-semibold font-mono">
                ${medicalResult.grossPay.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-muted-foreground">
              <span className="text-sm">Platform Fee</span>
              <span className="text-lg font-semibold font-mono">
                -$0.00
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2 bg-success/10 rounded-lg px-3">
              <span className="text-sm font-semibold">Net Pay</span>
              <span className="text-2xl font-bold text-success font-mono">
                ${medicalResult.netPay.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/mile</div>
                <div className="text-sm font-bold font-mono">
                  ${medicalResult.payPerMile.toFixed(2)}
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/min</div>
                <div className="text-sm font-bold font-mono">
                  ${medicalResult.payPerMinute.toFixed(2)}
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">$/hour</div>
                <div className="text-sm font-bold font-mono">
                  ${medicalResult.hourlyRate.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {dist > 0 && dur > 0 && (
        <Card className={`p-6 border-2 ${
          betterOption === 'medical' 
            ? 'bg-gradient-to-br from-success/10 to-success/5 border-success/40' 
            : 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/40'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              betterOption === 'medical' ? 'bg-success/20' : 'bg-accent/20'
            }`}>
              {betterOption === 'medical' ? (
                <TrendUp size={28} className="text-success" weight="bold" />
              ) : (
                <Lightning size={28} className="text-accent" weight="fill" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {betterOption === 'medical' ? 'Medical Transport Pays More' : 'Rideshare is Faster'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-bold font-mono">
                    ${Math.abs(difference).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    {betterOption === 'medical' ? 'more' : 'less'} per trip
                  </span>
                  <Badge variant="secondary" className={`text-base ${
                    betterOption === 'medical' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'
                  }`}>
                    {percentDifference > 0 ? '+' : ''}{percentDifference.toFixed(1)}%
                  </Badge>
                </div>

                <div className="text-sm text-foreground/80">
                  {betterOption === 'medical' ? (
                    <>
                      <p className="mb-2">
                        <strong>Medical transport earns ${Math.abs(difference).toFixed(2)} more</strong> for this {dist.toFixed(1)} mile, {dur.toFixed(0)} minute trip.
                      </p>
                      <ul className="space-y-1 ml-5 list-disc">
                        <li>No platform fees mean you keep 100% of the fare</li>
                        <li>Flat rate pricing protects against traffic delays</li>
                        <li>Wait time is compensated (${medicalRates[medicalType as keyof typeof medicalRates].waitTime} included)</li>
                        <li>Trips are scheduled in advance - no waiting for rides</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="mb-2">
                        <strong>Rideshare earns ${Math.abs(difference).toFixed(2)} less</strong> for this trip, but offers advantages:
                      </p>
                      <ul className="space-y-1 ml-5 list-disc">
                        <li>Immediate trip availability - no scheduling required</li>
                        <li>Surge pricing can increase earnings during busy times</li>
                        <li>Tips can add 15-20% to base fare</li>
                        <li>Flexible - work whenever you want</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {dist > 0 && dur > 0 && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-warning/5 border-warning/30">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/20">
              <Warning size={24} className="text-warning" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Important Considerations</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Scheduling:</strong> Medical trips are pre-scheduled (know your route ahead) vs rideshare on-demand (more flexibility)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Payment timing:</strong> Medical providers pay weekly/bi-weekly vs rideshare instant/daily cashout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Requirements:</strong> Medical transport may require CPR certification and additional training</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Best strategy:</strong> Many drivers do both - medical trips during scheduled blocks, rideshare to fill gaps</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {dist === 0 || dur === 0 ? (
        <Card className="p-8 bg-muted/30 border-dashed">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                <Calculator size={32} className="text-primary" weight="fill" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enter Trip Details</h3>
            <p className="text-muted-foreground">
              Enter distance and duration above to compare rideshare vs medical transport earnings
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

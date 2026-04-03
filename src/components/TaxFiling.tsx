import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Receipt,
  CurrencyDollar,
  CalendarBlank,
  FileText,
  Info,
  ArrowSquareOut,
  Calculator,
  Warning,
  CheckCircle,
  CarProfile,
  Briefcase,
  Buildings,
  Bank,
} from '@phosphor-icons/react'
import {
  FilingStatus,
  TaxEstimateInput,
  TaxEstimateResult,
  estimateTaxes,
  FEDERAL_BRACKETS_2025,
  NYS_BRACKETS_SINGLE_2025,
  NYS_BRACKETS_MFJ_2025,
  NYC_LOCAL_BRACKETS_SINGLE_2025,
  NYC_LOCAL_BRACKETS_MFJ_2025,
  ESTIMATED_TAX_DEADLINES_2025,
  FEDERAL_TAX_FORMS,
  NYS_TAX_FORMS,
  DRIVER_DEDUCTIONS,
  FEDERAL_STANDARD_DEDUCTION_2025,
  NYS_STANDARD_DEDUCTION_2025,
  IRS_MILEAGE_RATE_2025,
  SE_TAX_NET_EARNINGS_THRESHOLD,
} from '@/lib/tax-utils'

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(2)}%`
}

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married_filing_jointly: 'Married Filing Jointly',
  married_filing_separately: 'Married Filing Separately',
  head_of_household: 'Head of Household',
}

// ─── Tax Calculator Section ───────────────────────────────────────────────────

function TaxCalculator() {
  const [savedInputs, setSavedInputs] = useKV<Partial<TaxEstimateInput>>('tax-calculator-inputs', {})

  const [grossIncome, setGrossIncome] = useState<string>(String(savedInputs?.grossSelfEmploymentIncome ?? ''))
  const [businessExpenses, setBusinessExpenses] = useState<string>(String(savedInputs?.businessExpenses ?? ''))
  const [businessMiles, setBusinessMiles] = useState<string>(String(savedInputs?.businessMiles ?? ''))
  const [healthInsurance, setHealthInsurance] = useState<string>(String(savedInputs?.selfEmployedHealthInsurance ?? ''))
  const [otherDeductions, setOtherDeductions] = useState<string>(String(savedInputs?.otherDeductions ?? ''))
  const [otherIncome, setOtherIncome] = useState<string>(String(savedInputs?.otherIncome ?? ''))
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(savedInputs?.filingStatus ?? 'single')
  const [liveInNYC, setLiveInNYC] = useState<boolean>(savedInputs?.liveInNYC ?? true)
  const [useStandardMileageRate, setUseStandardMileageRate] = useState<boolean>(savedInputs?.useStandardMileageRate ?? true)

  const [result, setResult] = useState<TaxEstimateResult | null>(null)

  function handleCalculate() {
    const input: TaxEstimateInput = {
      grossSelfEmploymentIncome: parseFloat(grossIncome) || 0,
      businessExpenses: parseFloat(businessExpenses) || 0,
      businessMiles: parseFloat(businessMiles) || 0,
      selfEmployedHealthInsurance: parseFloat(healthInsurance) || 0,
      otherDeductions: parseFloat(otherDeductions) || 0,
      otherIncome: parseFloat(otherIncome) || 0,
      filingStatus,
      liveInNYC,
      useStandardMileageRate,
    }
    setSavedInputs(input)
    setResult(estimateTaxes(input))
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)] flex items-center gap-2">
            <Calculator size={18} className="text-primary" weight="fill" />
            2025 Tax Estimator
          </CardTitle>
          <CardDescription className="text-[clamp(0.75rem,2.2vw,0.85rem)]">
            Estimate your federal, NY State, and NYC tax liability as a self-employed driver. Results are estimates — consult a tax professional for your actual filing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Filing Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-[clamp(0.75rem,2.2vw,0.85rem)]">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3 justify-end">
              <div className="flex items-center gap-2">
                <Switch id="nyc-resident" checked={liveInNYC} onCheckedChange={setLiveInNYC} />
                <Label htmlFor="nyc-resident" className="text-[clamp(0.75rem,2.2vw,0.85rem)] cursor-pointer">NYC resident (local tax applies)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="standard-mileage" checked={useStandardMileageRate} onCheckedChange={setUseStandardMileageRate} />
                <Label htmlFor="standard-mileage" className="text-[clamp(0.75rem,2.2vw,0.85rem)] cursor-pointer">Use standard mileage rate (${IRS_MILEAGE_RATE_2025}/mi)</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Income Inputs */}
          <div>
            <h3 className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold mb-3 flex items-center gap-1.5">
              <CurrencyDollar size={16} className="text-success" weight="fill" />
              Income
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Gross Self-Employment Income ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 60000"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(e.target.value)}
                  className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                />
                <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">Total earnings before platform fees/expenses (from 1099-K/NEC)</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Other Income ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 0"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(e.target.value)}
                  className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                />
                <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">W-2 wages, interest, dividends, etc.</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Expense Inputs */}
          <div>
            <h3 className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold mb-3 flex items-center gap-1.5">
              <Receipt size={16} className="text-warning" weight="fill" />
              Business Expenses &amp; Deductions
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">
                  {useStandardMileageRate ? 'Business Miles Driven' : 'Total Vehicle & Other Expenses ($)'}
                </Label>
                {useStandardMileageRate ? (
                  <>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 30000"
                      value={businessMiles}
                      onChange={(e) => setBusinessMiles(e.target.value)}
                      className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                    />
                    <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">
                      = {fmt((parseFloat(businessMiles) || 0) * IRS_MILEAGE_RATE_2025)} deduction at ${IRS_MILEAGE_RATE_2025}/mi
                    </p>
                  </>
                ) : (
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 8000"
                    value={businessExpenses}
                    onChange={(e) => setBusinessExpenses(e.target.value)}
                    className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                  />
                )}
              </div>
              {useStandardMileageRate && (
                <div className="space-y-1.5">
                  <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Other Business Expenses ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={businessExpenses}
                    onChange={(e) => setBusinessExpenses(e.target.value)}
                    className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                  />
                  <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">Phone, supplies, platform fees, tolls, etc.</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Self-Employed Health Insurance ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 3600"
                  value={healthInsurance}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                  className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                />
                <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">Premiums for health, dental, vision (reduces AGI)</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)]">Other Above-the-Line Deductions ($)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 0"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)]"
                />
                <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground">IRA contributions, student loan interest, etc.</p>
              </div>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full gap-2">
            <Calculator size={16} weight="bold" />
            Calculate Tax Estimate
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Net Profit', value: fmt(result.netProfit), color: 'text-success', icon: <CurrencyDollar size={16} weight="fill" /> },
              { label: 'SE Tax', value: fmt(result.seTax), color: 'text-warning', icon: <Briefcase size={16} weight="fill" /> },
              { label: 'Federal Income Tax', value: fmt(result.federalIncomeTax), color: 'text-destructive', icon: <Bank size={16} weight="fill" /> },
              { label: 'Total Tax Burden', value: fmt(result.totalTaxBurden), color: 'text-destructive font-bold', icon: <Receipt size={16} weight="fill" /> },
            ].map(({ label, value, color, icon }) => (
              <Card key={label} className="p-3 text-center">
                <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
                <p className="text-[clamp(0.65rem,1.8vw,0.75rem)] text-muted-foreground leading-tight">{label}</p>
                <p className={`text-[clamp(0.85rem,2.5vw,1rem)] font-bold ${color}`}>{value}</p>
              </Card>
            ))}
          </div>

          {/* Breakdown */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)]">Full Tax Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Income Calculation */}
                <div>
                  <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Income Calculation</h4>
                  <div className="space-y-1.5 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                    <Row label="Gross Self-Employment Income" value={fmt(result.grossIncome)} />
                    {result.mileageDeduction > 0 && <Row label={`Mileage Deduction (${parseFloat(businessMiles).toLocaleString()} mi × $${IRS_MILEAGE_RATE_2025})`} value={`− ${fmt(result.mileageDeduction)}`} valueClass="text-success" />}
                    {result.totalBusinessExpenses > result.mileageDeduction && <Row label="Other Business Expenses" value={`− ${fmt(result.totalBusinessExpenses - result.mileageDeduction)}`} valueClass="text-success" />}
                    <Row label="Net Profit (Schedule C)" value={fmt(result.netProfit)} bold />
                  </div>
                </div>
                <Separator />

                {/* Self-Employment Tax */}
                <div>
                  <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Self-Employment Tax (Schedule SE)</h4>
                  <div className="space-y-1.5 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                    <Row label="Net Earnings for SE (× 92.35%)" value={fmt(result.netProfit * 0.9235)} />
                    <Row label="SE Tax (15.3%)" value={fmt(result.seTax)} valueClass="text-warning" bold />
                    <Row label="Deductible Portion of SE Tax (50%)" value={`− ${fmt(result.seDeductionFromAGI)}`} valueClass="text-success" />
                  </div>
                </div>
                <Separator />

                {/* Federal Tax */}
                <div>
                  <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Federal Income Tax</h4>
                  <div className="space-y-1.5 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                    <Row label="Adjusted Gross Income (AGI)" value={fmt(result.adjustedGrossIncome)} />
                    <Row label="QBI Deduction (20% of net profit)" value={`− ${fmt(result.qbiDeduction)}`} valueClass="text-success" />
                    <Row label="Standard / Itemized Deduction" value={`− ${fmt(result.standardDeductionFederal)}`} valueClass="text-success" />
                    <Row label="Federal Taxable Income" value={fmt(result.federalTaxableIncome)} bold />
                    <Row label="Federal Income Tax" value={fmt(result.federalIncomeTax)} valueClass="text-destructive" bold />
                    <Row label="+ SE Tax" value={fmt(result.seTax)} />
                    <Row label="Total Federal Tax" value={fmt(result.totalFederalTax)} valueClass="text-destructive font-bold" bold />
                    <Row label="Effective Federal Rate" value={fmtPct(result.effectiveFederalRate)} />
                  </div>
                </div>
                <Separator />

                {/* State & Local Tax */}
                <div>
                  <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-muted-foreground uppercase tracking-wide mb-2">New York State &amp; City Tax</h4>
                  <div className="space-y-1.5 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                    <Row label="NYS Standard Deduction" value={`− ${fmt(result.nysStandardDeduction)}`} valueClass="text-success" />
                    <Row label="NYS Taxable Income" value={fmt(result.nysTaxableIncome)} />
                    <Row label="NYS Income Tax" value={fmt(result.nysIncomeTax)} valueClass="text-destructive" bold />
                    {result.nycLocalTax > 0 && <Row label="NYC Local Income Tax" value={fmt(result.nycLocalTax)} valueClass="text-destructive" bold />}
                    {result.mctmt > 0 && <Row label="MCTMT (Metro Commuter Tax)" value={fmt(result.mctmt)} valueClass="text-destructive" />}
                  </div>
                </div>
                <Separator />

                {/* Total & Quarterly */}
                <div>
                  <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Summary</h4>
                  <div className="space-y-1.5 text-[clamp(0.75rem,2.2vw,0.85rem)]">
                    <Row label="Total Tax Burden" value={fmt(result.totalTaxBurden)} valueClass="text-destructive font-bold text-base" bold />
                    <Row label="Effective Total Tax Rate" value={fmtPct(result.effectiveTotalRate)} />
                    <Row label="Quarterly Estimated Payment" value={fmt(result.quarterlyEstimatedPayment)} valueClass="text-warning font-semibold" bold />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <Warning size={16} className="text-warning mt-0.5 shrink-0" weight="fill" />
            <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-warning-foreground">
              This is an <strong>estimate only</strong>. Tax laws are complex and your situation may differ. Consult a licensed CPA or tax professional for accurate tax advice and filing assistance.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold, valueClass }: { label: string; value: string; bold?: boolean; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className={`text-muted-foreground ${bold ? 'font-semibold text-foreground' : ''}`}>{label}</span>
      <span className={`font-mono tabular-nums ${bold ? 'font-semibold' : ''} ${valueClass ?? ''}`}>{value}</span>
    </div>
  )
}

// ─── Tax Brackets Reference ────────────────────────────────────────────────────

function BracketTable({ brackets, title }: { brackets: Array<{ min: number; max: number | null; rate: number }>; title: string }) {
  return (
    <div>
      <h4 className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[clamp(0.7rem,2vw,0.8rem)]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1.5 pr-4 font-medium text-muted-foreground">Income Range</th>
              <th className="text-right py-1.5 font-medium text-muted-foreground">Rate</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((b, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-1.5 pr-4 font-mono">
                  {fmt(b.min)} – {b.max !== null ? fmt(b.max) : 'and above'}
                </td>
                <td className="py-1.5 text-right font-semibold text-primary">{fmtPct(b.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TaxBracketsTab() {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label className="text-[clamp(0.75rem,2.2vw,0.85rem)] shrink-0">Filing Status:</Label>
        <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
          <SelectTrigger className="h-9 text-[clamp(0.75rem,2.2vw,0.85rem)] max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-[clamp(0.75rem,2.2vw,0.85rem)]">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Federal Brackets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <Bank size={16} className="text-primary" weight="fill" />
            Federal Income Tax Brackets (2025)
          </CardTitle>
          <CardDescription className="text-[clamp(0.7rem,2vw,0.8rem)]">
            Standard deduction: <strong>{fmt(FEDERAL_STANDARD_DEDUCTION_2025[filingStatus])}</strong> · Self-employment tax: <strong>15.3%</strong> on net earnings above ${SE_TAX_NET_EARNINGS_THRESHOLD}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BracketTable brackets={FEDERAL_BRACKETS_2025[filingStatus]} title="" />
        </CardContent>
      </Card>

      {/* NYS Brackets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <Buildings size={16} className="text-primary" weight="fill" />
            New York State Income Tax Brackets (2025)
          </CardTitle>
          <CardDescription className="text-[clamp(0.7rem,2vw,0.8rem)]">
            NYS standard deduction: <strong>{fmt(NYS_STANDARD_DEDUCTION_2025[filingStatus])}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BracketTable
            brackets={filingStatus === 'married_filing_jointly' ? NYS_BRACKETS_MFJ_2025 : NYS_BRACKETS_SINGLE_2025}
            title=""
          />
        </CardContent>
      </Card>

      {/* NYC Local Tax */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <Buildings size={16} className="text-accent" weight="fill" />
            NYC Local Income Tax Brackets (2025)
          </CardTitle>
          <CardDescription className="text-[clamp(0.7rem,2vw,0.8rem)]">
            Applies to NYC residents only. Filed with your NYS return (IT-201).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BracketTable
            brackets={filingStatus === 'married_filing_jointly' ? NYC_LOCAL_BRACKETS_MFJ_2025 : NYC_LOCAL_BRACKETS_SINGLE_2025}
            title=""
          />
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Deductions Tab ────────────────────────────────────────────────────────────

function DeductionsTab() {
  return (
    <div className="space-y-4">
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <CarProfile size={18} className="text-success" weight="fill" />
            Common Deductions for Rideshare &amp; Delivery Drivers
          </CardTitle>
          <CardDescription className="text-[clamp(0.7rem,2vw,0.8rem)]">
            Keep records for all deductions. Use a mileage-tracking app year-round.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {DRIVER_DEDUCTIONS.map((deduction, i) => (
            <div key={i} className="p-3 bg-card rounded-lg border">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold">{deduction.name}</h4>
                {deduction.irsReference && (
                  <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.7rem)] shrink-0">{deduction.irsReference}</Badge>
                )}
              </div>
              <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] text-primary font-medium mb-1">{deduction.description}</p>
              <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">{deduction.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Rules */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <Info size={16} className="text-primary" weight="fill" />
            Key Rules &amp; Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-[clamp(0.75rem,2.2vw,0.85rem)]">
          {[
            'You CANNOT deduct both standard mileage AND actual vehicle expenses in the same tax year.',
            'If you use the standard mileage rate, you can still deduct tolls and parking separately.',
            'Keep a contemporaneous mileage log with dates, destinations, and business purposes.',
            'Platforms like Uber and Lyft report gross earnings on 1099-K — subtract their fees to get your actual income.',
            'You must pay self-employment tax even if your net profit is below the standard deduction threshold, as long as it exceeds $400.',
            'The QBI deduction (Sec. 199A) can reduce taxable income by up to 20% of qualified business income.',
            'MCTMT applies to NYC metro-area self-employed individuals with net earnings over $50,000.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle size={14} className="text-success mt-0.5 shrink-0" weight="fill" />
              <p>{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Forms & Deadlines Tab ─────────────────────────────────────────────────────

function FormsAndDeadlinesTab() {
  return (
    <div className="space-y-4">
      {/* Quarterly Deadlines */}
      <Card className="border-warning/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <CalendarBlank size={16} className="text-warning" weight="fill" />
            2025 Quarterly Estimated Tax Deadlines
          </CardTitle>
          <CardDescription className="text-[clamp(0.7rem,2vw,0.8rem)]">
            Self-employed drivers must pay estimated taxes quarterly if they expect to owe $1,000 or more for the year. Missing deadlines may result in underpayment penalties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {ESTIMATED_TAX_DEADLINES_2025.map((d) => (
              <div key={d.quarter} className="flex items-start gap-3 p-3 border rounded-lg bg-card">
                <div className="rounded-full bg-warning/20 p-2 shrink-0">
                  <CalendarBlank size={14} className="text-warning" weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold">{d.quarter}</span>
                    <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.7rem)]">{d.irsForm}</Badge>
                  </div>
                  <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">{d.period}</p>
                  <p className="text-[clamp(0.75rem,2.2vw,0.85rem)] font-semibold text-warning">Due: {d.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Federal Forms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <FileText size={16} className="text-primary" weight="fill" />
            Federal Tax Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {FEDERAL_TAX_FORMS.map((form) => (
            <div key={form.form} className="flex items-start justify-between gap-3 p-3 border rounded-lg hover:bg-muted/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold">{form.form}</span>
                  <span className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">— {form.title}</span>
                </div>
                <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">{form.purpose}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 gap-1 text-[clamp(0.7rem,2vw,0.8rem)]"
                onClick={() => window.open(form.url, '_blank', 'noopener,noreferrer')}
              >
                <ArrowSquareOut size={14} weight="bold" />
                IRS.gov
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NYS Forms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
            <FileText size={16} className="text-accent" weight="fill" />
            New York State Tax Forms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {NYS_TAX_FORMS.map((form) => (
            <div key={form.form} className="flex items-start justify-between gap-3 p-3 border rounded-lg hover:bg-muted/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[clamp(0.8rem,2.4vw,0.9rem)] font-semibold">{form.form}</span>
                  <span className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">— {form.title}</span>
                </div>
                <p className="text-[clamp(0.7rem,2vw,0.8rem)] text-muted-foreground">{form.purpose}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 gap-1 text-[clamp(0.7rem,2vw,0.8rem)]"
                onClick={() => window.open(form.url, '_blank', 'noopener,noreferrer')}
              >
                <ArrowSquareOut size={14} weight="bold" />
                NY.gov
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NYS Quarterly Deadlines Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2 text-[clamp(0.75rem,2.2vw,0.85rem)]">
            <Info size={16} className="text-primary mt-0.5 shrink-0" weight="fill" />
            <div className="space-y-1">
              <p className="font-semibold">New York State Estimated Tax (IT-2105)</p>
              <p className="text-muted-foreground">NYS quarterly estimated tax deadlines match the IRS schedule above. File Form IT-2105 for NYS estimated payments. NYC residents also pay NYC local tax through the same IT-201 annual return — no separate NYC quarterly filings required.</p>
              <Button
                variant="link"
                className="h-auto p-0 text-[clamp(0.75rem,2.2vw,0.85rem)] gap-1"
                onClick={() => window.open('https://www.tax.ny.gov/pit/estimated_tax/estimated_tax.htm', '_blank', 'noopener,noreferrer')}
              >
                NY State Estimated Tax Info
                <ArrowSquareOut size={12} weight="bold" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function TaxFiling() {
  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-[clamp(1rem,3vw,1.25rem)] line-clamp-1 flex items-center gap-2">
                <Receipt size={20} className="text-primary" weight="fill" />
                Tax Filing Hub
              </CardTitle>
              <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
                Federal &amp; New York State tax laws, deduction guides, and a tax estimator for self-employed rideshare and delivery drivers.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Badge variant="outline" className="text-[clamp(0.6rem,1.8vw,0.7rem)] justify-center">Tax Year 2025</Badge>
              <Badge className="text-[clamp(0.6rem,1.8vw,0.7rem)] justify-center bg-success/20 text-success border-success/30">Self-Employed</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="calculator" className="gap-1 text-[clamp(0.65rem,2vw,0.78rem)]">
            <Calculator size={14} weight="fill" className="flex-shrink-0" />
            <span className="truncate">Estimator</span>
          </TabsTrigger>
          <TabsTrigger value="brackets" className="gap-1 text-[clamp(0.65rem,2vw,0.78rem)]">
            <Bank size={14} weight="fill" className="flex-shrink-0" />
            <span className="truncate">Brackets</span>
          </TabsTrigger>
          <TabsTrigger value="deductions" className="gap-1 text-[clamp(0.65rem,2vw,0.78rem)]">
            <Receipt size={14} weight="fill" className="flex-shrink-0" />
            <span className="truncate">Deductions</span>
          </TabsTrigger>
          <TabsTrigger value="forms" className="gap-1 text-[clamp(0.65rem,2vw,0.78rem)]">
            <FileText size={14} weight="fill" className="flex-shrink-0" />
            <span className="truncate">Forms &amp; Dates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <TaxCalculator />
        </TabsContent>
        <TabsContent value="brackets">
          <TaxBracketsTab />
        </TabsContent>
        <TabsContent value="deductions">
          <DeductionsTab />
        </TabsContent>
        <TabsContent value="forms">
          <FormsAndDeadlinesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

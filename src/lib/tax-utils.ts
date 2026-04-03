// Tax year 2025 federal and New York State tax laws for self-employed rideshare/delivery drivers

// ─── Federal Tax Constants ────────────────────────────────────────────────────

/** Standard mileage rate for business driving (IRS 2025) */
export const IRS_MILEAGE_RATE_2025 = 0.70

/** Self-employment tax rate (Social Security 12.4% + Medicare 2.9%) */
export const SELF_EMPLOYMENT_TAX_RATE = 0.153

/** SE tax deductible portion (half of SE tax from gross income) */
export const SE_TAX_DEDUCTIBLE_FRACTION = 0.5

/** Threshold below which no SE tax is owed */
export const SE_TAX_NET_EARNINGS_THRESHOLD = 400

/** Social Security wage base for 2025 */
export const SS_WAGE_BASE_2025 = 176_100

/** Additional Medicare tax rate on earnings above threshold */
export const ADDITIONAL_MEDICARE_RATE = 0.009
export const ADDITIONAL_MEDICARE_THRESHOLD_SINGLE = 200_000
export const ADDITIONAL_MEDICARE_THRESHOLD_MFJ = 250_000

// ─── Federal Income Tax Brackets 2025 ────────────────────────────────────────

export type FilingStatus = 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household'

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
}

export const FEDERAL_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0,        max: 11_925,   rate: 0.10 },
    { min: 11_925,   max: 48_475,   rate: 0.12 },
    { min: 48_475,   max: 103_350,  rate: 0.22 },
    { min: 103_350,  max: 197_300,  rate: 0.24 },
    { min: 197_300,  max: 250_525,  rate: 0.32 },
    { min: 250_525,  max: 626_350,  rate: 0.35 },
    { min: 626_350,  max: null,     rate: 0.37 },
  ],
  married_filing_jointly: [
    { min: 0,        max: 23_850,   rate: 0.10 },
    { min: 23_850,   max: 96_950,   rate: 0.12 },
    { min: 96_950,   max: 206_700,  rate: 0.22 },
    { min: 206_700,  max: 394_600,  rate: 0.24 },
    { min: 394_600,  max: 501_050,  rate: 0.32 },
    { min: 501_050,  max: 751_600,  rate: 0.35 },
    { min: 751_600,  max: null,     rate: 0.37 },
  ],
  married_filing_separately: [
    { min: 0,        max: 11_925,   rate: 0.10 },
    { min: 11_925,   max: 48_475,   rate: 0.12 },
    { min: 48_475,   max: 103_350,  rate: 0.22 },
    { min: 103_350,  max: 197_300,  rate: 0.24 },
    { min: 197_300,  max: 250_525,  rate: 0.32 },
    { min: 250_525,  max: 375_800,  rate: 0.35 },
    { min: 375_800,  max: null,     rate: 0.37 },
  ],
  head_of_household: [
    { min: 0,        max: 17_000,   rate: 0.10 },
    { min: 17_000,   max: 64_850,   rate: 0.12 },
    { min: 64_850,   max: 103_350,  rate: 0.22 },
    { min: 103_350,  max: 197_300,  rate: 0.24 },
    { min: 197_300,  max: 250_500,  rate: 0.32 },
    { min: 250_500,  max: 626_350,  rate: 0.35 },
    { min: 626_350,  max: null,     rate: 0.37 },
  ],
}

export const FEDERAL_STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15_000,
  married_filing_jointly: 30_000,
  married_filing_separately: 15_000,
  head_of_household: 22_500,
}

// ─── Qualified Business Income (QBI) Deduction ───────────────────────────────

/** Up to 20% of qualified business income for pass-through/self-employed income (Sec. 199A) */
export const QBI_DEDUCTION_RATE = 0.20

// ─── New York State Tax Brackets 2025 ────────────────────────────────────────

/** NYS income tax brackets for 2025 (single filers) */
export const NYS_BRACKETS_SINGLE_2025: TaxBracket[] = [
  { min: 0,        max: 17_150,   rate: 0.04   },
  { min: 17_150,   max: 23_600,   rate: 0.045  },
  { min: 23_600,   max: 27_900,   rate: 0.0525 },
  { min: 27_900,   max: 161_550,  rate: 0.0585 },
  { min: 161_550,  max: 323_200,  rate: 0.0625 },
  { min: 323_200,  max: 2_155_350,rate: 0.0685 },
  { min: 2_155_350,max: 5_000_000,rate: 0.0965 },
  { min: 5_000_000,max: 25_000_000,rate: 0.103 },
  { min: 25_000_000,max: null,    rate: 0.109  },
]

/** NYS income tax brackets for 2025 (married filing jointly) */
export const NYS_BRACKETS_MFJ_2025: TaxBracket[] = [
  { min: 0,        max: 27_900,   rate: 0.04   },
  { min: 27_900,   max: 43_000,   rate: 0.045  },
  { min: 43_000,   max: 161_550,  rate: 0.0525 },
  { min: 161_550,  max: 323_200,  rate: 0.0585 },
  { min: 323_200,  max: 2_155_350,rate: 0.0625 },
  { min: 2_155_350,max: 5_000_000,rate: 0.0685 },
  { min: 5_000_000,max: 25_000_000,rate: 0.103 },
  { min: 25_000_000,max: null,    rate: 0.109  },
]

/** NYS standard deduction 2025 */
export const NYS_STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 8_000,
  married_filing_jointly: 16_050,
  married_filing_separately: 8_000,
  head_of_household: 11_200,
}

/** Metropolitan Commuter Transportation Mobility Tax (MCTMT) for self-employed in NYC metro area */
export const MCTMT_THRESHOLD = 50_000
export const MCTMT_RATE = 0.00341

// ─── New York City Local Tax Brackets 2025 ───────────────────────────────────

/** NYC local income tax brackets (single filers) */
export const NYC_LOCAL_BRACKETS_SINGLE_2025: TaxBracket[] = [
  { min: 0,       max: 12_000,  rate: 0.03078 },
  { min: 12_000,  max: 25_000,  rate: 0.03762 },
  { min: 25_000,  max: 50_000,  rate: 0.03819 },
  { min: 50_000,  max: null,    rate: 0.03876 },
]

/** NYC local income tax brackets (married filing jointly) */
export const NYC_LOCAL_BRACKETS_MFJ_2025: TaxBracket[] = [
  { min: 0,       max: 21_600,  rate: 0.03078 },
  { min: 21_600,  max: 45_000,  rate: 0.03762 },
  { min: 45_000,  max: 90_000,  rate: 0.03819 },
  { min: 90_000,  max: null,    rate: 0.03876 },
]

/** NYC School Tax Relief (STAR) credit amount for eligible homeowners */
export const NYC_STAR_BASIC = 293

// ─── Quarterly Estimated Tax Deadlines 2025 ──────────────────────────────────

export interface EstimatedTaxDeadline {
  quarter: string
  period: string
  dueDate: string
  irsForm: string
}

export const ESTIMATED_TAX_DEADLINES_2025: EstimatedTaxDeadline[] = [
  { quarter: 'Q1', period: 'Jan 1 – Mar 31, 2025', dueDate: 'April 15, 2025',     irsForm: 'Form 1040-ES' },
  { quarter: 'Q2', period: 'Apr 1 – May 31, 2025', dueDate: 'June 16, 2025',      irsForm: 'Form 1040-ES' },
  { quarter: 'Q3', period: 'Jun 1 – Aug 31, 2025', dueDate: 'September 15, 2025', irsForm: 'Form 1040-ES' },
  { quarter: 'Q4', period: 'Sep 1 – Dec 31, 2025', dueDate: 'January 15, 2026',   irsForm: 'Form 1040-ES' },
]

// ─── Tax Forms Reference ──────────────────────────────────────────────────────

export interface TaxFormInfo {
  form: string
  title: string
  purpose: string
  url: string
}

export const FEDERAL_TAX_FORMS: TaxFormInfo[] = [
  { form: 'Schedule C',  title: 'Profit or Loss from Business', purpose: 'Report self-employment income and expenses from rideshare/delivery work', url: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040' },
  { form: 'Schedule SE', title: 'Self-Employment Tax',          purpose: 'Calculate Social Security and Medicare taxes owed on net self-employment earnings', url: 'https://www.irs.gov/forms-pubs/about-schedule-se-form-1040' },
  { form: '1040-ES',     title: 'Estimated Tax for Individuals',purpose: 'Pay quarterly estimated federal income and SE taxes', url: 'https://www.irs.gov/forms-pubs/about-form-1040-es' },
  { form: '1099-K',      title: 'Payment Card and Third Party Network Transactions', purpose: 'Received from Uber/Lyft/DoorDash when gross payments exceed $5,000 (2024) or $600 (2025 threshold)', url: 'https://www.irs.gov/forms-pubs/about-form-1099-k' },
  { form: '1099-NEC',    title: 'Nonemployee Compensation',     purpose: 'Received from platforms for non-driving payments (referrals, incentives) over $600', url: 'https://www.irs.gov/forms-pubs/about-form-1099-nec' },
  { form: '4562',        title: 'Depreciation and Amortization',purpose: 'Deduct vehicle depreciation under actual-expense method', url: 'https://www.irs.gov/forms-pubs/about-form-4562' },
]

export const NYS_TAX_FORMS: TaxFormInfo[] = [
  { form: 'IT-201',  title: 'Resident Income Tax Return',         purpose: 'New York State, NYC, and Yonkers taxes for full-year residents', url: 'https://www.tax.ny.gov/forms/income_cur_forms.htm' },
  { form: 'IT-203',  title: 'Nonresident and Part-Year Resident Income Tax Return', purpose: 'For those who lived in NY only part of the year', url: 'https://www.tax.ny.gov/forms/income_cur_forms.htm' },
  { form: 'IT-2658', title: 'Estimated Tax for Nonresident Partners', purpose: 'NYS quarterly estimated tax payments', url: 'https://www.tax.ny.gov/forms/income_cur_forms.htm' },
  { form: 'TR-579', title: 'E-file Authorization',                 purpose: 'Required when a tax professional e-files your return', url: 'https://www.tax.ny.gov/forms/income_cur_forms.htm' },
]

// ─── Common Deductions for Rideshare/Delivery Drivers ────────────────────────

export interface DeductionCategory {
  name: string
  description: string
  notes: string
  irsReference?: string
}

export const DRIVER_DEDUCTIONS: DeductionCategory[] = [
  {
    name: 'Business Mileage',
    description: `IRS standard rate: $${IRS_MILEAGE_RATE_2025.toFixed(2)}/mile (2025)`,
    notes: 'Track every business mile driven. Cannot combine with actual vehicle expense deductions in the same year.',
    irsReference: 'IRS Publication 463',
  },
  {
    name: 'Actual Vehicle Expenses',
    description: 'Gas, oil, tires, repairs, insurance, registration, depreciation — prorated for business use %',
    notes: 'Alternative to standard mileage rate. Keep all receipts. Calculate business-use percentage from mileage log.',
    irsReference: 'IRS Publication 463',
  },
  {
    name: 'Phone & Data Plan',
    description: 'Percentage of phone bill used for business (navigation, app use)',
    notes: 'Deduct only the business-use percentage. Keep phone bills and estimate business-use hours.',
  },
  {
    name: 'Platform Fees & Commissions',
    description: 'Service fees taken by Uber, Lyft, DoorDash, etc.',
    notes: 'These reduce your net Schedule C income automatically if you report gross earnings from 1099-K.',
  },
  {
    name: 'Accessories & Supplies',
    description: 'Phone mounts, dash cams, car chargers, seat covers, cleaning supplies, water/snacks for passengers',
    notes: 'Keep receipts. Must be ordinary and necessary for business.',
  },
  {
    name: 'Self-Employed Health Insurance',
    description: 'Health, dental, and vision premiums for you, spouse, and dependents',
    notes: 'Deductible above-the-line (reduces AGI). Cannot exceed net self-employment income.',
    irsReference: 'IRC § 162(l)',
  },
  {
    name: 'Half of Self-Employment Tax',
    description: 'Deduct 50% of your SE tax',
    notes: 'Automatically deducted from gross income on Form 1040. Reduces adjusted gross income.',
    irsReference: 'IRC § 164(f)',
  },
  {
    name: 'Tolls & Parking',
    description: 'Tolls and parking fees paid during business trips',
    notes: 'Can be deducted even when using the standard mileage rate.',
  },
  {
    name: 'Bank & Payment Processing Fees',
    description: 'Fees associated with business bank accounts or payment transfers',
    notes: 'Ordinary and necessary business expense.',
  },
  {
    name: 'Professional Services',
    description: 'Tax preparation fees, accountant, legal fees for business matters',
    notes: 'Deductible as a business expense on Schedule C.',
  },
]

// ─── Calculation Functions ─────────────────────────────────────────────────────

/**
 * Calculate federal income tax using progressive brackets.
 */
export function calcFederalIncomeTax(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) return 0
  const brackets = FEDERAL_BRACKETS_2025[filingStatus]
  return calcProgressiveTax(taxableIncome, brackets)
}

/**
 * Calculate New York State income tax.
 */
export function calcNYSIncomeTax(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) return 0
  const brackets = filingStatus === 'married_filing_jointly'
    ? NYS_BRACKETS_MFJ_2025
    : NYS_BRACKETS_SINGLE_2025
  return calcProgressiveTax(taxableIncome, brackets)
}

/**
 * Calculate NYC local income tax.
 */
export function calcNYCLocalTax(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) return 0
  const brackets = filingStatus === 'married_filing_jointly'
    ? NYC_LOCAL_BRACKETS_MFJ_2025
    : NYC_LOCAL_BRACKETS_SINGLE_2025
  return calcProgressiveTax(taxableIncome, brackets)
}

/**
 * Calculate self-employment (SE) tax on net earnings.
 * Net earnings for SE = net profit × 0.9235 (92.35%) to account for employer-equivalent deduction.
 */
export function calcSETax(netProfit: number): number {
  if (netProfit <= SE_TAX_NET_EARNINGS_THRESHOLD) return 0
  const netEarningsForSE = netProfit * 0.9235
  // Social Security portion (12.4%) applies only up to wage base
  const ssTaxableEarnings = Math.min(netEarningsForSE, SS_WAGE_BASE_2025)
  const ssTax = ssTaxableEarnings * 0.124
  // Medicare portion (2.9%) applies to all net earnings
  const medicareTax = netEarningsForSE * 0.029
  return ssTax + medicareTax
}

/**
 * Calculate the MCTMT (self-employed commuter transportation tax) for NYC metro area drivers.
 */
export function calcMCTMT(netProfit: number): number {
  if (netProfit <= MCTMT_THRESHOLD) return 0
  return netProfit * MCTMT_RATE
}

/**
 * Calculate the QBI deduction (up to 20% of net self-employment income).
 * Simplified — no W-2 wage limitations applied here.
 */
export function calcQBIDeduction(netProfit: number): number {
  return Math.max(0, netProfit * QBI_DEDUCTION_RATE)
}

/**
 * Core progressive-bracket tax calculator.
 */
function calcProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0
  for (const bracket of brackets) {
    if (income <= bracket.min) break
    const taxableInBracket = bracket.max !== null
      ? Math.min(income, bracket.max) - bracket.min
      : income - bracket.min
    tax += taxableInBracket * bracket.rate
  }
  return tax
}

/**
 * Full tax estimation for a self-employed NYC rideshare/delivery driver.
 */
export interface TaxEstimateInput {
  grossSelfEmploymentIncome: number
  businessExpenses: number
  businessMiles: number
  selfEmployedHealthInsurance: number
  otherDeductions: number
  filingStatus: FilingStatus
  otherIncome: number
  liveInNYC: boolean
  useStandardMileageRate: boolean
}

export interface TaxEstimateResult {
  grossIncome: number
  mileageDeduction: number
  totalBusinessExpenses: number
  netProfit: number
  seTax: number
  seDeductionFromAGI: number
  qbiDeduction: number
  adjustedGrossIncome: number
  standardDeductionFederal: number
  federalTaxableIncome: number
  federalIncomeTax: number
  totalFederalTax: number
  nysStandardDeduction: number
  nysTaxableIncome: number
  nysIncomeTax: number
  nycLocalTax: number
  mctmt: number
  totalTaxBurden: number
  effectiveFederalRate: number
  effectiveTotalRate: number
  quarterlyEstimatedPayment: number
}

export function estimateTaxes(input: TaxEstimateInput): TaxEstimateResult {
  const mileageDeduction = input.useStandardMileageRate
    ? input.businessMiles * IRS_MILEAGE_RATE_2025
    : 0

  const totalBusinessExpenses = input.businessExpenses + mileageDeduction
  const netProfit = Math.max(0, input.grossSelfEmploymentIncome - totalBusinessExpenses)

  const seTax = calcSETax(netProfit)
  const seDeductionFromAGI = seTax * SE_TAX_DEDUCTIBLE_FRACTION

  const adjustedGrossIncome = netProfit
    - seDeductionFromAGI
    - input.selfEmployedHealthInsurance
    + input.otherIncome

  const qbiDeduction = calcQBIDeduction(netProfit)

  const federalStdDed = FEDERAL_STANDARD_DEDUCTION_2025[input.filingStatus]
  const federalItemized = qbiDeduction + input.otherDeductions
  const federalDeduction = Math.max(federalStdDed, federalItemized)
  const federalTaxableIncome = Math.max(0, adjustedGrossIncome - federalDeduction)

  const federalIncomeTax = calcFederalIncomeTax(federalTaxableIncome, input.filingStatus)
  const totalFederalTax = federalIncomeTax + seTax

  const nysStdDed = NYS_STANDARD_DEDUCTION_2025[input.filingStatus]
  const nysTaxableIncome = Math.max(0, adjustedGrossIncome - nysStdDed)
  const nysIncomeTax = calcNYSIncomeTax(nysTaxableIncome, input.filingStatus)

  const nycLocalTax = input.liveInNYC
    ? calcNYCLocalTax(nysTaxableIncome, input.filingStatus)
    : 0

  const mctmt = calcMCTMT(netProfit)

  const totalTaxBurden = totalFederalTax + nysIncomeTax + nycLocalTax + mctmt

  const effectiveFederalRate = adjustedGrossIncome > 0
    ? totalFederalTax / adjustedGrossIncome
    : 0
  const effectiveTotalRate = adjustedGrossIncome > 0
    ? totalTaxBurden / adjustedGrossIncome
    : 0

  const quarterlyEstimatedPayment = totalTaxBurden / 4

  return {
    grossIncome: input.grossSelfEmploymentIncome,
    mileageDeduction,
    totalBusinessExpenses,
    netProfit,
    seTax,
    seDeductionFromAGI,
    qbiDeduction,
    adjustedGrossIncome,
    standardDeductionFederal: federalDeduction,
    federalTaxableIncome,
    federalIncomeTax,
    totalFederalTax,
    nysStandardDeduction: nysStdDed,
    nysTaxableIncome,
    nysIncomeTax,
    nycLocalTax,
    mctmt,
    totalTaxBurden,
    effectiveFederalRate,
    effectiveTotalRate,
    quarterlyEstimatedPayment,
  }
}

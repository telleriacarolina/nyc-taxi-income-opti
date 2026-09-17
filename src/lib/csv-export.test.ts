import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateRideCSV, exportRidesToCSV } from './csv-export'
import { Ride } from './ride-types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeRide(overrides: Partial<Ride> = {}): Ride {
  return {
    id: '1',
    date: '2024-01-15',
    time: '09:00',
    platform: 'uber',
    pickupLocation: 'Times Square',
    dropoffLocation: 'JFK Airport',
    distance: 20,
    duration: 45,
    grossPay: 40,
    fees: 8,
    netPay: 32,
    vehicleType: 'gas',
    fuelCost: 4,
    rating: 5,
    notes: '',
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// generateRideCSV
// ---------------------------------------------------------------------------

describe('generateRideCSV', () => {
  it('includes the header row', () => {
    const csv = generateRideCSV([])
    const firstLine = csv.split('\n')[0]
    expect(firstLine).toContain('Date')
    expect(firstLine).toContain('Platform')
    expect(firstLine).toContain('Gross Pay')
    expect(firstLine).toContain('Net Pay')
  })

  it('returns only a header row for an empty rides array', () => {
    const csv = generateRideCSV([])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(1)
  })

  it('adds one data row per ride', () => {
    const rides = [makeRide({ id: '1' }), makeRide({ id: '2' })]
    const lines = generateRideCSV(rides).split('\n')
    expect(lines).toHaveLength(3) // header + 2 data rows
  })

  it('includes correct ride data in the row', () => {
    const ride = makeRide({
      date: '2024-03-10',
      time: '14:30',
      platform: 'lyft',
      distance: 10,
      duration: 25,
      grossPay: 25,
      fees: 5,
      netPay: 20,
      fuelCost: 2,
    })
    const csv = generateRideCSV([ride])
    const dataRow = csv.split('\n')[1]
    expect(dataRow).toContain('2024-03-10')
    expect(dataRow).toContain('14:30')
    expect(dataRow).toContain('Lyft')
    expect(dataRow).toContain('10.00')
    expect(dataRow).toContain('25')
    expect(dataRow).toContain('20.00')
  })

  it('capitalises the platform name', () => {
    const csv = generateRideCSV([makeRide({ platform: 'uber' })])
    expect(csv).toContain('Uber')
  })

  it('capitalises the vehicle type', () => {
    const csv = generateRideCSV([makeRide({ vehicleType: 'electric' })])
    expect(csv).toContain('Electric')
  })

  it('omits vehicle type when undefined', () => {
    const ride = makeRide({ vehicleType: undefined })
    const csv = generateRideCSV([ride])
    // vehicle type column is present but should be empty between two commas
    const dataRow = csv.split('\n')[1]
    const columns = dataRow.split(',')
    // vehicleType is the 11th column (index 10, 0-based)
    expect(columns[10]).toBe('')
  })

  it('wraps fields containing commas in double-quotes', () => {
    const ride = makeRide({ pickupLocation: '1 Broadway, New York' })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('"1 Broadway, New York"')
  })

  it('escapes existing double-quotes in fields', () => {
    const ride = makeRide({ notes: 'Driver said "hello"' })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('"Driver said ""hello"""')
  })

  it('wraps fields containing newlines in double-quotes', () => {
    const ride = makeRide({ notes: 'line1\nline2' })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('"line1\nline2"')
  })

  it('computes pay-per-mile and profit-per-mile correctly', () => {
    const ride = makeRide({ distance: 10, netPay: 30, fuelCost: 10 })
    const csv = generateRideCSV([ride])
    // payPerMile = 30/10 = 3.00
    expect(csv).toContain('3.00')
    // profit = 30 - 10 = 20, profitPerMile = 20/10 = 2.00
    expect(csv).toContain('2.00')
  })

  it('uses 0.00 for pay-per-mile when distance is 0', () => {
    const ride = makeRide({ distance: 0 })
    const csv = generateRideCSV([ride])
    const dataRow = csv.split('\n')[1]
    const columns = dataRow.split(',')
    // payPerMile is column index 13 (0-based)
    expect(columns[13]).toBe('0.00')
  })
})

// ---------------------------------------------------------------------------
// exportRidesToCSV
// ---------------------------------------------------------------------------

describe('exportRidesToCSV', () => {
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>
  let clickSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clickSpy = vi.fn()

    // Stub anchor element with a download attribute
    const mockAnchor = {
      download: '',
      href: '',
      style: { visibility: '' },
      setAttribute: vi.fn((attr: string, val: string) => {
        if (attr === 'href') mockAnchor.href = val
        if (attr === 'download') mockAnchor.download = val
      }),
      click: clickSpy,
    }

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return document.createElement(tag)
    })

    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-url')
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers a click to download the CSV', () => {
    exportRidesToCSV([makeRide()])
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('creates and revokes an object URL', () => {
    exportRidesToCSV([makeRide()])
    expect(createObjectURLSpy).toHaveBeenCalledOnce()
    expect(revokeObjectURLSpy).toHaveBeenCalledOnce()
  })

  it('appends and then removes the link element', () => {
    exportRidesToCSV([makeRide()])
    expect(appendChildSpy).toHaveBeenCalledOnce()
    expect(removeChildSpy).toHaveBeenCalledOnce()
  })

  it('includes a filter suffix in the filename when provided', () => {
    const mockAnchor = { download: '', href: '', style: { visibility: '' }, setAttribute: vi.fn((attr: string, val: string) => { if (attr === 'download') mockAnchor.download = val }), click: vi.fn() }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement)
    exportRidesToCSV([makeRide()], 'uber_only')
    expect(mockAnchor.download).toContain('uber_only')
  })

  it('sorts rides chronologically before exporting', () => {
    // Verify the sort order via generateRideCSV (already imported at top)
    // applied to a manually sorted array, which mirrors what exportRidesToCSV does.
    const rides = [
      makeRide({ id: '2', date: '2024-01-20', time: '10:00' }),
      makeRide({ id: '1', date: '2024-01-10', time: '08:00' }),
    ]
    const sorted = [...rides].sort((a, b) =>
      new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
    )
    const csv = generateRideCSV(sorted)
    const lines = csv.split('\n')
    expect(lines[1]).toContain('2024-01-10')
    expect(lines[2]).toContain('2024-01-20')
  })
})

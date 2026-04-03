import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateRideCSV, exportRidesToCSV } from './csv-export'
import { Ride } from './ride-types'

const makeRide = (overrides: Partial<Ride> = {}): Ride => ({
  id: '1',
  date: '2024-03-04',
  time: '10:00',
  platform: 'uber',
  pickupLocation: 'JFK Airport',
  dropoffLocation: 'Times Square',
  distance: 20,
  duration: 45,
  grossPay: 35,
  fees: 5,
  netPay: 30,
  ...overrides,
})

describe('generateRideCSV', () => {
  it('generates a CSV with headers as the first row', () => {
    const csv = generateRideCSV([])
    const firstLine = csv.split('\n')[0]
    expect(firstLine).toContain('Date')
    expect(firstLine).toContain('Platform')
    expect(firstLine).toContain('Distance (miles)')
    expect(firstLine).toContain('Net Pay')
  })

  it('returns only header row for empty rides array', () => {
    const csv = generateRideCSV([])
    const lines = csv.trim().split('\n')
    expect(lines.length).toBe(1)
  })

  it('generates correct row data for a single ride', () => {
    const ride = makeRide({
      date: '2024-03-04',
      time: '10:00',
      platform: 'uber',
      distance: 20,
      duration: 45,
      grossPay: 35,
      fees: 5,
      netPay: 30,
    })
    const csv = generateRideCSV([ride])
    const dataRow = csv.split('\n')[1]
    expect(dataRow).toContain('2024-03-04')
    expect(dataRow).toContain('Uber')
    expect(dataRow).toContain('20.00')
    expect(dataRow).toContain('30.00')
  })

  it('capitalizes platform names', () => {
    const csv = generateRideCSV([makeRide({ platform: 'lyft' })])
    const dataRow = csv.split('\n')[1]
    expect(dataRow).toContain('Lyft')
  })

  it('handles optional fuelCost defaulting to 0', () => {
    const ride = makeRide({ fuelCost: undefined })
    const csv = generateRideCSV([ride])
    const dataRow = csv.split('\n')[1]
    expect(dataRow).toContain('0.00')
  })

  it('handles optional rating', () => {
    const ride = makeRide({ rating: 5 })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('5')
  })

  it('wraps fields with commas in double quotes', () => {
    const ride = makeRide({ pickupLocation: 'Terminal 4, JFK Airport' })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('"Terminal 4, JFK Airport"')
  })

  it('escapes double quotes inside CSV fields', () => {
    const ride = makeRide({ notes: 'said "hello"' })
    const csv = generateRideCSV([ride])
    expect(csv).toContain('""hello""')
  })

  it('generates a row per ride', () => {
    const rides = [makeRide(), makeRide({ id: '2' }), makeRide({ id: '3' })]
    const csv = generateRideCSV(rides)
    const lines = csv.split('\n')
    expect(lines.length).toBe(4) // header + 3 data rows
  })

  it('calculates profit correctly as netPay minus fuelCost', () => {
    const ride = makeRide({ netPay: 30, fuelCost: 5 })
    const csv = generateRideCSV([ride])
    const dataRow = csv.split('\n')[1]
    const fields = dataRow.split(',')
    const profitIndex = 12 // 'Profit' column index
    expect(parseFloat(fields[profitIndex])).toBe(25)
  })
})

describe('exportRidesToCSV', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls downloadCSV with sorted rides and a filename', () => {
    const mockCreateObjectURL = vi.fn(() => 'blob:mock')
    const mockRevokeObjectURL = vi.fn()
    const mockAppendChild = vi.fn()
    const mockRemoveChild = vi.fn()
    const mockClick = vi.fn()

    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    const mockLink = {
      setAttribute: vi.fn(),
      click: mockClick,
      style: { visibility: '' },
      download: 'test',
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)

    const rides = [
      makeRide({ date: '2024-03-05', time: '12:00' }),
      makeRide({ id: '2', date: '2024-03-04', time: '10:00' }),
    ]

    exportRidesToCSV(rides)

    expect(mockClick).toHaveBeenCalled()
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('tlc_rides_'))
  })

  it('includes filterDescription in filename when provided', () => {
    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: { visibility: '' },
      download: 'test',
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(vi.fn())
    vi.spyOn(document.body, 'removeChild').mockImplementation(vi.fn())
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    global.URL.revokeObjectURL = vi.fn()

    exportRidesToCSV([makeRide()], 'uber_only')

    const downloadCall = mockLink.setAttribute.mock.calls.find(c => c[0] === 'download')
    expect(downloadCall?.[1]).toContain('uber_only')
  })
})

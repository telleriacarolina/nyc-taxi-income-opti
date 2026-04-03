import { describe, it, expect, vi, afterEach } from 'vitest'
import { exportToCSV, exportInsightsToPDF, exportInsightsAsJSON } from './report-export'

const makeStats = () => ({
  totalEarnings: 1000,
  totalExpenses: 100,
  netEarnings: 900,
  totalHours: 40,
  averageHourlyRate: 25,
  totalTrips: 50,
  averageTripEarnings: 20,
  totalTips: 80,
})

const makeShift = () => ({
  id: '1',
  date: '2024-03-04',
  startTime: '08:00',
  endTime: '16:00',
  platform: 'uber',
  earnings: 200,
  trips: 10,
  tips: 20,
  expenses: 15,
  startLocation: 'JFK Airport',
})

function setupDownloadMocks() {
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
  return mockLink
}

describe('exportToCSV', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers a download', () => {
    const mockLink = setupDownloadMocks()
    exportToCSV([makeShift()], makeStats())
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('generates a CSV filename with .csv extension', () => {
    const mockLink = setupDownloadMocks()
    exportToCSV([makeShift()], makeStats())
    const downloadCall = mockLink.setAttribute.mock.calls.find(c => c[0] === 'download')
    expect(downloadCall?.[1]).toMatch(/\.csv$/)
  })

  it('sets href attribute to a blob URL', () => {
    const mockLink = setupDownloadMocks()
    exportToCSV([makeShift()], makeStats())
    const hrefCall = mockLink.setAttribute.mock.calls.find(c => c[0] === 'href')
    expect(hrefCall?.[1]).toBe('blob:mock')
  })
})

describe('exportInsightsToPDF', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers a download', () => {
    const mockLink = setupDownloadMocks()
    exportInsightsToPDF([makeShift()], makeStats())
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('generates a .txt filename', () => {
    const mockLink = setupDownloadMocks()
    exportInsightsToPDF([makeShift()], makeStats())
    const downloadCall = mockLink.setAttribute.mock.calls.find(c => c[0] === 'download')
    expect(downloadCall?.[1]).toMatch(/\.txt$/)
  })

  it('includes AI insight section when provided', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    exportInsightsToPDF([makeShift()], makeStats(), {
      type: 'performance',
      title: 'Great job!',
      content: 'You are doing well.'
    })

    const allContent = blobContents.join('\n')
    expect(allContent).toContain('PERSONALIZED AI INSIGHT')
    expect(allContent).toContain('Great job!')

    global.Blob = OrigBlob
  })

  it('includes location insights when provided', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    exportInsightsToPDF([makeShift()], makeStats(), undefined, [
      { location: 'Times Square', timeOfDay: 'Evening', reason: 'High demand', expectedEarnings: '$30-$50' }
    ])

    const allContent = blobContents.join('\n')
    expect(allContent).toContain('OPTIMAL TIMES & LOCATIONS')
    expect(allContent).toContain('Times Square')

    global.Blob = OrigBlob
  })

  it('includes seasonal insights when provided', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    exportInsightsToPDF([makeShift()], makeStats(), undefined, undefined, [
      { period: 'Summer', locations: ['Central Park', 'Beaches'], strategy: 'Focus on tourist areas' }
    ])

    const allContent = blobContents.join('\n')
    expect(allContent).toContain('SEASONAL STRATEGIES')
    expect(allContent).toContain('Summer')

    global.Blob = OrigBlob
  })
})

describe('exportInsightsAsJSON', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers a download', () => {
    const mockLink = setupDownloadMocks()
    exportInsightsAsJSON([makeShift()], makeStats())
    expect(mockLink.click).toHaveBeenCalled()
  })

  it('generates a .json filename', () => {
    const mockLink = setupDownloadMocks()
    exportInsightsAsJSON([makeShift()], makeStats())
    const downloadCall = mockLink.setAttribute.mock.calls.find(c => c[0] === 'download')
    expect(downloadCall?.[1]).toMatch(/\.json$/)
  })

  it('produces valid JSON content', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    exportInsightsAsJSON([makeShift()], makeStats())

    const jsonString = blobContents.join('')
    expect(() => JSON.parse(jsonString)).not.toThrow()

    global.Blob = OrigBlob
  })

  it('includes summary, target2025, insights, and shifts in JSON', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    exportInsightsAsJSON([makeShift()], makeStats(), undefined, undefined, undefined)

    const data = JSON.parse(blobContents.join(''))
    expect(data).toHaveProperty('summary')
    expect(data).toHaveProperty('target2025')
    expect(data).toHaveProperty('insights')
    expect(data).toHaveProperty('shifts')
    expect(data).toHaveProperty('generatedAt')

    global.Blob = OrigBlob
  })

  it('includes correct stats in summary', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    const stats = makeStats()
    exportInsightsAsJSON([], stats)

    const data = JSON.parse(blobContents.join(''))
    expect(data.summary.totalEarnings).toBe(stats.totalEarnings)
    expect(data.summary.netEarnings).toBe(stats.netEarnings)
    expect(data.summary.totalTrips).toBe(stats.totalTrips)

    global.Blob = OrigBlob
  })

  it('includes AI insight when provided', () => {
    const blobContents: string[] = []
    const OrigBlob = global.Blob
    global.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContents.push(...parts)
      }
    } as unknown as typeof Blob

    setupDownloadMocks()
    const aiInsight = { type: 'performance', title: 'Keep it up!', content: 'Details here.' }
    exportInsightsAsJSON([], makeStats(), aiInsight)

    const data = JSON.parse(blobContents.join(''))
    expect(data.insights.personal).toEqual(aiInsight)

    global.Blob = OrigBlob
  })
})

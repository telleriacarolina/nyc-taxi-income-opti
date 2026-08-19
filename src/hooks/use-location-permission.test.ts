import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocationPermission } from './use-location-permission'

function mockGeolocation(options: {
  available?: boolean
  permissionState?: PermissionState
  successPosition?: GeolocationPosition
  permissionsAvailable?: boolean
}) {
  const {
    available = true,
    permissionState = 'prompt',
    successPosition,
    permissionsAvailable = true,
  } = options

  if (!available) {
    vi.stubGlobal('navigator', { geolocation: undefined, permissions: undefined })
    return
  }

  const permResult = {
    state: permissionState,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  const geolocation = {
    getCurrentPosition: vi.fn((successCb: PositionCallback, errorCb: PositionErrorCallback) => {
      if (successPosition) {
        successCb(successPosition)
      } else {
        const error = { code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError
        errorCb(error)
      }
    }),
  }

  const permissions = permissionsAvailable
    ? { query: vi.fn().mockResolvedValue(permResult) }
    : undefined

  vi.stubGlobal('navigator', { geolocation, permissions })

  return permResult
}

describe('useLocationPermission', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('starts with "checking" state', () => {
    mockGeolocation({ available: true, permissionState: 'prompt' })
    const { result } = renderHook(() => useLocationPermission())
    expect(result.current.isChecking).toBe(true)
    expect(result.current.state).toBe('checking')
  })

  it('transitions to "prompt" when permissions API is unavailable', async () => {
    mockGeolocation({ available: true, permissionsAvailable: false })
    const { result } = renderHook(() => useLocationPermission())
    await waitFor(() => {
      expect(result.current.state).toBe('prompt')
    })
    expect(result.current.isPrompt).toBe(true)
  })

  it('transitions to "unavailable" when geolocation is not supported', async () => {
    mockGeolocation({ available: false })
    const { result } = renderHook(() => useLocationPermission())
    await waitFor(() => {
      expect(result.current.state).toBe('unavailable')
    })
    expect(result.current.isUnavailable).toBe(true)
  })

  it('transitions to permission state from permissions API', async () => {
    mockGeolocation({ available: true, permissionState: 'granted' })
    const { result } = renderHook(() => useLocationPermission())
    await waitFor(() => {
      expect(result.current.state).toBe('granted')
    })
    expect(result.current.isGranted).toBe(true)
  })

  it('transitions to "denied" state from permissions API', async () => {
    mockGeolocation({ available: true, permissionState: 'denied' })
    const { result } = renderHook(() => useLocationPermission())
    await waitFor(() => {
      expect(result.current.state).toBe('denied')
    })
    expect(result.current.isDenied).toBe(true)
  })

  it('request() returns false and sets unavailable when geolocation missing', async () => {
    mockGeolocation({ available: false })
    const { result } = renderHook(() => useLocationPermission())
    await waitFor(() => expect(result.current.state).toBe('unavailable'))

    let requestResult: boolean | undefined
    await act(async () => {
      requestResult = await result.current.request()
    })
    expect(requestResult).toBe(false)
    expect(result.current.state).toBe('unavailable')
  })

  it('request() returns true and sets granted on success', async () => {
    mockGeolocation({
      available: true,
      permissionState: 'prompt',
      successPosition: {} as GeolocationPosition,
    })
    const { result } = renderHook(() => useLocationPermission())
    // Wait for the initial checkPermission to complete so its promise doesn't race with request()
    await waitFor(() => expect(result.current.state).not.toBe('checking'))

    let requestResult: boolean | undefined
    await act(async () => {
      requestResult = await result.current.request()
    })
    expect(requestResult).toBe(true)
    await waitFor(() => {
      expect(result.current.state).toBe('granted')
    })
  })

  it('request() returns false and sets denied on permission error', async () => {
    mockGeolocation({ available: true, permissionState: 'prompt' }) // no successPosition → triggers error cb
    const { result } = renderHook(() => useLocationPermission())
    // Wait for the initial checkPermission to complete so its promise doesn't race with request()
    await waitFor(() => expect(result.current.state).not.toBe('checking'))

    let requestResult: boolean | undefined
    await act(async () => {
      requestResult = await result.current.request()
    })
    expect(requestResult).toBe(false)
    await waitFor(() => {
      expect(result.current.state).toBe('denied')
    })
  })
})

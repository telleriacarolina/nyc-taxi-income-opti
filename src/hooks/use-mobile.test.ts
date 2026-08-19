import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

describe('useIsMobile', () => {
  const mockMatchMedia = (matches: boolean) => {
    const listeners: Array<() => void> = []
    const mql = {
      matches,
      addEventListener: vi.fn((_: string, cb: () => void) => {
        listeners.push(cb)
      }),
      removeEventListener: vi.fn(),
      _trigger: () => listeners.forEach(l => l()),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mql))
    return mql
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when window width is >= 768px', () => {
    mockMatchMedia(false)
    vi.stubGlobal('innerWidth', 1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when window width is < 768px', () => {
    mockMatchMedia(true)
    vi.stubGlobal('innerWidth', 375)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('updates when window resizes below breakpoint', () => {
    const mql = mockMatchMedia(false)
    vi.stubGlobal('innerWidth', 1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      vi.stubGlobal('innerWidth', 375)
      mql._trigger()
    })

    expect(result.current).toBe(true)
  })

  it('removes the event listener on unmount', () => {
    const mql = mockMatchMedia(false)
    vi.stubGlobal('innerWidth', 1024)
    const { unmount } = renderHook(() => useIsMobile())
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalled()
  })
})

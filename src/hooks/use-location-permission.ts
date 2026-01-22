import { useState, useEffect } from 'react'

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking'

interface LocationPermissionResult {
  state: LocationPermissionState
  isGranted: boolean
  isDenied: boolean
  isPrompt: boolean
  isUnavailable: boolean
  isChecking: boolean
  request: () => Promise<boolean>
  refresh: () => Promise<void>
}

export function useLocationPermission(): LocationPermissionResult {
  const [state, setState] = useState<LocationPermissionState>('checking')

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      setState('unavailable')
      return
    }

    if (!navigator.permissions) {
      setState('prompt')
      return
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      setState(result.state as LocationPermissionState)
      
      result.addEventListener('change', () => {
        setState(result.state as LocationPermissionState)
      })
    } catch (error) {
      setState('prompt')
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setState('unavailable')
      return false
    }

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setState('granted')
          resolve(true)
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setState('denied')
          }
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  useEffect(() => {
    checkPermission()
  }, [])

  return {
    state,
    isGranted: state === 'granted',
    isDenied: state === 'denied',
    isPrompt: state === 'prompt',
    isUnavailable: state === 'unavailable',
    isChecking: state === 'checking',
    request: requestPermission,
    refresh: checkPermission
  }
}

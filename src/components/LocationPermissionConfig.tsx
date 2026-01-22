import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Warning,
  Info,
  Crosshair,
  ShieldCheck,
  ArrowsClockwise
} from '@phosphor-icons/react'

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking'

interface LocationPermissionConfigProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
  showInstructions?: boolean
}

export function LocationPermissionConfig({ 
  onPermissionGranted, 
  onPermissionDenied,
  showInstructions = true 
}: LocationPermissionConfigProps) {
  const [permissionState, setPermissionState] = useState<PermissionState>('checking')
  const [isRequesting, setIsRequesting] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<string>('')

  useEffect(() => {
    checkLocationPermission()
    detectBrowser()
  }, [])

  const detectBrowser = () => {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) setBrowserInfo('Chrome')
    else if (ua.includes('Firefox')) setBrowserInfo('Firefox')
    else if (ua.includes('Safari')) setBrowserInfo('Safari')
    else if (ua.includes('Edge')) setBrowserInfo('Edge')
    else setBrowserInfo('Unknown')
  }

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable')
      return
    }

    if (!navigator.permissions) {
      setPermissionState('prompt')
      return
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      setPermissionState(result.state as PermissionState)
      
      result.addEventListener('change', () => {
        setPermissionState(result.state as PermissionState)
        if (result.state === 'granted') {
          onPermissionGranted?.()
        } else if (result.state === 'denied') {
          onPermissionDenied?.()
        }
      })
    } catch (error) {
      setPermissionState('prompt')
    }
  }

  const requestLocationPermission = async () => {
    setIsRequesting(true)
    
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionState('granted')
            onPermissionGranted?.()
            resolve()
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setPermissionState('denied')
              onPermissionDenied?.()
            }
            reject(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        )
      })
    } catch (error) {
      console.error('Location permission error:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  const getStatusIcon = () => {
    switch (permissionState) {
      case 'granted':
        return <CheckCircle className="text-success" size={24} weight="fill" />
      case 'denied':
        return <XCircle className="text-destructive" size={24} weight="fill" />
      case 'prompt':
        return <Warning className="text-warning" size={24} weight="fill" />
      case 'unavailable':
        return <XCircle className="text-muted-foreground" size={24} weight="fill" />
      case 'checking':
        return <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (permissionState) {
      case 'granted':
        return 'bg-success/10 text-success border-success/20'
      case 'denied':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'prompt':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'unavailable':
        return 'bg-muted text-muted-foreground border-muted'
      case 'checking':
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const getStatusText = () => {
    switch (permissionState) {
      case 'granted':
        return 'Location Access Enabled'
      case 'denied':
        return 'Location Access Denied'
      case 'prompt':
        return 'Location Permission Required'
      case 'unavailable':
        return 'Location Not Available'
      case 'checking':
        return 'Checking Permissions...'
    }
  }

  const getBrowserInstructions = () => {
    switch (browserInfo) {
      case 'Chrome':
        return {
          steps: [
            'Click the lock icon or info icon in the address bar',
            'Find "Location" in the permissions list',
            'Change it to "Allow"',
            'Reload the page'
          ]
        }
      case 'Firefox':
        return {
          steps: [
            'Click the lock icon in the address bar',
            'Click "Connection secure" > "More information"',
            'Go to "Permissions" tab',
            'Uncheck "Use default" for Location and select "Allow"',
            'Close and reload the page'
          ]
        }
      case 'Safari':
        return {
          steps: [
            'Open Safari Preferences (Safari menu > Preferences)',
            'Go to "Websites" tab',
            'Select "Location" in the sidebar',
            'Find this website and change to "Allow"',
            'Reload the page'
          ]
        }
      case 'Edge':
        return {
          steps: [
            'Click the lock icon in the address bar',
            'Click "Permissions for this site"',
            'Find "Location" and change to "Allow"',
            'Reload the page'
          ]
        }
      default:
        return {
          steps: [
            'Look for a location/permissions icon in your browser address bar',
            'Enable location access for this site',
            'Reload the page if needed'
          ]
        }
    }
  }

  const instructions = getBrowserInstructions()

  return (
    <div className="space-y-4">
      <Card className={`p-6 ${getStatusColor()}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">{getStatusText()}</h3>
            {permissionState === 'granted' && (
              <p className="text-sm opacity-90">
                Your location is being used to generate optimized routes and provide real-time insights.
              </p>
            )}
            {permissionState === 'denied' && (
              <p className="text-sm opacity-90">
                Location access is blocked. Enable it in your browser settings to use location-based features.
              </p>
            )}
            {permissionState === 'prompt' && (
              <p className="text-sm opacity-90">
                Allow location access to generate routes from your current position and get real-time earning insights.
              </p>
            )}
            {permissionState === 'unavailable' && (
              <p className="text-sm opacity-90">
                Your browser or device doesn't support location services.
              </p>
            )}
            {permissionState === 'checking' && (
              <p className="text-sm opacity-90">
                Verifying location permissions...
              </p>
            )}
          </div>
        </div>

        {permissionState === 'prompt' && (
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={requestLocationPermission}
              disabled={isRequesting}
              className="gap-2"
            >
              {isRequesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <MapPin size={16} weight="fill" />
                  Enable Location Access
                </>
              )}
            </Button>
          </div>
        )}

        {permissionState === 'granted' && (
          <div className="mt-4">
            <Button 
              onClick={checkLocationPermission}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowsClockwise size={14} />
              Refresh Status
            </Button>
          </div>
        )}
      </Card>

      {showInstructions && permissionState === 'denied' && (
        <Card className="p-6 border-2">
          <div className="flex items-start gap-3 mb-4">
            <Info className="text-primary mt-1" size={20} weight="fill" />
            <div>
              <h4 className="font-semibold mb-1">How to Enable Location in {browserInfo}</h4>
              <p className="text-sm text-muted-foreground">
                Follow these steps to allow location access:
              </p>
            </div>
          </div>

          <ol className="space-y-2 ml-8">
            {instructions.steps.map((step, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-semibold text-primary">{idx + 1}.</span> {step}
              </li>
            ))}
          </ol>

          <Alert className="mt-4 bg-primary/5 border-primary/20">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Privacy & Security</AlertTitle>
            <AlertDescription className="text-xs">
              Your location data is only used to generate optimized routes and never stored on external servers. 
              All location processing happens in your browser.
            </AlertDescription>
          </Alert>
        </Card>
      )}

      {showInstructions && permissionState === 'unavailable' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Location Services Unavailable</AlertTitle>
          <AlertDescription>
            Your browser or device does not support geolocation. Try:
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Using a modern browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Enabling location services in your device settings</li>
              <li>Ensuring you are using HTTPS (secure connection)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {permissionState === 'granted' && (
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Crosshair className="text-primary mt-1" size={20} weight="fill" />
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Location Features Available</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={16} weight="fill" />
                  <span>Generate optimized routes from your current position</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={16} weight="fill" />
                  <span>Get real-time insights based on your location</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={16} weight="fill" />
                  <span>View nearby demand hotspots and earning opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={16} weight="fill" />
                  <span>Receive location-aware traffic alerts and notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

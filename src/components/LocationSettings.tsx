import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Gear, 
  MapPin, 
  CheckCircle,
  Lightning,
  Info,
  ShieldCheck
} from '@phosphor-icons/react'
import { LocationPermissionConfig } from '@/components/LocationPermissionConfig'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface LocationSettings {
  enableHighAccuracy: boolean
  enableBackgroundLocation: boolean
  cacheLocation: boolean
  locationTimeout: number
  maxLocationAge: number
}

export function LocationSettings() {
  const [settings, setSettings] = useKV<LocationSettings>('location-settings', {
    enableHighAccuracy: true,
    enableBackgroundLocation: false,
    cacheLocation: true,
    locationTimeout: 10000,
    maxLocationAge: 60000
  })

  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [isTestingLocation, setIsTestingLocation] = useState(false)

  const currentSettings = settings || {
    enableHighAccuracy: true,
    enableBackgroundLocation: false,
    cacheLocation: true,
    locationTimeout: 10000,
    maxLocationAge: 60000
  }

  const handleSettingChange = (key: keyof LocationSettings, value: boolean | number) => {
    setSettings((prev) => {
      const current = prev || currentSettings
      return {
        ...current,
        [key]: value
      }
    })
    toast.success('Setting updated')
  }

  const testLocationAccess = async () => {
    setIsTestingLocation(true)
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: currentSettings.enableHighAccuracy,
            timeout: currentSettings.locationTimeout,
            maximumAge: currentSettings.maxLocationAge
          }
        )
      })
      
      setCurrentPosition(position)
      toast.success('Location test successful')
    } catch (error: any) {
      let message = 'Location test failed'
      
      if (error.code === 1) {
        message = 'Permission denied'
      } else if (error.code === 2) {
        message = 'Position unavailable'
      } else if (error.code === 3) {
        message = 'Request timeout'
      }
      
      toast.error(message)
    } finally {
      setIsTestingLocation(false)
    }
  }

  const clearLocationCache = () => {
    setCurrentPosition(null)
    toast.success('Location cache cleared')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gear className="text-primary" size={24} weight="fill" />
        </div>
        <div>
          <h2 className="font-bold text-2xl">Location Settings</h2>
          <p className="text-sm text-muted-foreground">Configure location permissions and preferences</p>
        </div>
      </div>

      <LocationPermissionConfig 
        onPermissionGranted={() => toast.success('Location access enabled')}
        onPermissionDenied={() => toast.error('Location access denied')}
      />

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightning className="text-primary" size={20} weight="fill" />
          <h3 className="font-semibold text-lg">Location Accuracy</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="high-accuracy" className="font-semibold">
                High Accuracy Mode
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Uses GPS for precise location (may use more battery)
              </p>
            </div>
            <Switch
              id="high-accuracy"
              checked={currentSettings.enableHighAccuracy}
              onCheckedChange={(checked) => handleSettingChange('enableHighAccuracy', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="cache-location" className="font-semibold">
                Cache Location Data
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Temporarily store location to reduce battery usage
              </p>
            </div>
            <Switch
              id="cache-location"
              checked={currentSettings.cacheLocation}
              onCheckedChange={(checked) => handleSettingChange('cacheLocation', checked)}
            />
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <Label className="font-semibold">Location Timeout</Label>
            <p className="text-sm text-muted-foreground">
              Maximum time to wait for location (seconds)
            </p>
            <div className="flex gap-2">
              {[5, 10, 15, 30].map((seconds) => (
                <Button
                  key={seconds}
                  variant={currentSettings.locationTimeout === seconds * 1000 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('locationTimeout', seconds * 1000)}
                >
                  {seconds}s
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <Label className="font-semibold">Maximum Location Age</Label>
            <p className="text-sm text-muted-foreground">
              Accept cached location if newer than (seconds)
            </p>
            <div className="flex gap-2">
              {[0, 30, 60, 300].map((seconds) => (
                <Button
                  key={seconds}
                  variant={currentSettings.maxLocationAge === seconds * 1000 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('maxLocationAge', seconds * 1000)}
                >
                  {seconds === 0 ? 'None' : `${seconds}s`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-primary" size={20} weight="fill" />
          <h3 className="font-semibold text-lg">Test Location Access</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Verify your location settings are working correctly
        </p>

        <div className="flex gap-2 mb-4">
          <Button 
            onClick={testLocationAccess}
            disabled={isTestingLocation}
            className="gap-2"
          >
            {isTestingLocation ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <MapPin size={16} weight="fill" />
                Test Location
              </>
            )}
          </Button>
          
          {currentPosition && (
            <Button 
              variant="outline"
              onClick={clearLocationCache}
            >
              Clear Cache
            </Button>
          )}
        </div>

        {currentPosition && (
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-success mt-1" size={20} weight="fill" />
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Location Retrieved Successfully</h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Latitude:</span>
                    <p className="font-mono font-semibold">{currentPosition.coords.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Longitude:</span>
                    <p className="font-mono font-semibold">{currentPosition.coords.longitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <p className="font-semibold">{currentPosition.coords.accuracy.toFixed(0)}m</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp:</span>
                    <p className="font-semibold">{new Date(currentPosition.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {currentPosition.coords.altitude && (
                    <div>
                      <span className="text-muted-foreground">Altitude:</span>
                      <p className="font-semibold">{currentPosition.coords.altitude.toFixed(0)}m</p>
                    </div>
                  )}
                  {currentPosition.coords.speed && (
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <p className="font-semibold">{(currentPosition.coords.speed * 2.237).toFixed(1)} mph</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="text-primary mt-1" size={20} weight="fill" />
          <div>
            <h4 className="font-semibold mb-2">About Location Data</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ShieldCheck className="flex-shrink-0 mt-0.5" size={16} />
                <span>Location data is processed locally in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="flex-shrink-0 mt-0.5" size={16} />
                <span>Your location is never stored on external servers</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="flex-shrink-0 mt-0.5" size={16} />
                <span>Used only to generate optimized routes and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="flex-shrink-0 mt-0.5" size={16} />
                <span>You can revoke location access at any time</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

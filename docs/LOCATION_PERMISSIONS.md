# Location Permission Configuration

This document explains how location permissions are configured and managed in the TLC Driver Hub application.

## Overview

The TLC Driver Hub requires location access to provide location-based features such as:
- **Route generation** from your current position
- **Real-time insights** based on your location
- **Nearby demand hotspots** and earning opportunities
- **Location-aware traffic alerts** and notifications

## Implementation Components

### 1. HTML Meta Tags

The `index.html` includes proper permissions policy configuration:

```html
<meta http-equiv="Permissions-Policy" content="geolocation=(self)" />
```

This declares that the application requires geolocation access and limits it to the same origin for security.

### 2. LocationPermissionConfig Component

**Location:** `src/components/LocationPermissionConfig.tsx`

A comprehensive UI component that:
- Checks current permission state
- Displays permission status with visual indicators
- Provides a button to request location access
- Shows browser-specific instructions for enabling location
- Explains privacy and security implications

**Usage:**
```tsx
import { LocationPermissionConfig } from '@/components/LocationPermissionConfig'

<LocationPermissionConfig 
  onPermissionGranted={() => console.log('Location enabled')}
  onPermissionDenied={() => console.log('Location denied')}
  showInstructions={true}
/>
```

### 3. useLocationPermission Hook

**Location:** `src/hooks/use-location-permission.ts`

A React hook for managing location permissions programmatically:

```tsx
import { useLocationPermission } from '@/hooks/use-location-permission'

function MyComponent() {
  const { 
    state,           // 'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking'
    isGranted,       // boolean
    isDenied,        // boolean
    isPrompt,        // boolean
    isUnavailable,   // boolean
    isChecking,      // boolean
    request,         // () => Promise<boolean>
    refresh          // () => Promise<void>
  } = useLocationPermission()

  if (isGranted) {
    // Use location features
  }
}
```

### 4. LocationSettings Component

**Location:** `src/components/LocationSettings.tsx`

A full settings page for configuring location preferences:
- High accuracy mode toggle
- Location caching options
- Timeout configuration
- Maximum age settings
- Location test functionality
- Privacy information

**Features:**
- Adjust GPS accuracy (high accuracy vs. battery saving)
- Configure timeout for location requests (5s - 30s)
- Set maximum age for cached locations (0s - 5min)
- Test location access with detailed results
- View current coordinates, accuracy, speed, etc.

### 5. CurrentLocationRouter Integration

**Location:** `src/components/CurrentLocationRouter.tsx`

Uses location permissions to generate optimized routes:
- Automatically requests location on mount
- Displays clear error messages if permission denied
- Shows browser-specific instructions
- Generates AI-powered routes based on current position

## Permission States

The application handles five permission states:

### 1. Checking
Initial state while verifying permissions.

### 2. Prompt
Location permission has not been requested yet. Shows a button to request access.

### 3. Granted
Location access is enabled. All location features are available.

### 4. Denied
User has blocked location access. Shows instructions for enabling in browser settings.

### 5. Unavailable
Browser or device doesn't support geolocation API.

## Browser-Specific Instructions

The application provides tailored instructions for each major browser:

### Chrome
1. Click the lock icon in the address bar
2. Find "Location" in the permissions list
3. Change it to "Allow"
4. Reload the page

### Firefox
1. Click the lock icon in the address bar
2. Click "Connection secure" > "More information"
3. Go to "Permissions" tab
4. Uncheck "Use default" for Location and select "Allow"
5. Close and reload the page

### Safari
1. Open Safari Preferences
2. Go to "Websites" tab
3. Select "Location" in the sidebar
4. Find this website and change to "Allow"
5. Reload the page

### Edge
1. Click the lock icon in the address bar
2. Click "Permissions for this site"
3. Find "Location" and change to "Allow"
4. Reload the page

## Geolocation API Configuration

The application uses the following configuration for location requests:

```javascript
navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback,
  {
    enableHighAccuracy: true,  // Use GPS for precise location
    timeout: 10000,             // Wait up to 10 seconds
    maximumAge: 0               // Don't use cached location
  }
)
```

These settings can be customized in the **Settings** tab.

## Privacy & Security

### Data Processing
- All location data is processed **locally in your browser**
- Location information is **never stored on external servers**
- Only used to generate routes and insights
- No tracking or persistent storage of your movements

### Security Measures
- HTTPS-only to ensure secure location transmission
- Permissions Policy limits geolocation to same-origin
- Users can revoke location access at any time
- Clear error messages and privacy explanations

### Best Practices
1. **Only request when needed**: Location is requested only when user accesses location-based features
2. **Clear explanations**: Users are told why location is needed and how it's used
3. **Graceful degradation**: App functions without location (some features unavailable)
4. **User control**: Settings page gives users full control over location preferences

## Error Handling

The application handles all geolocation errors gracefully:

### Permission Denied (Error Code 1)
User denied location access. Shows instructions to enable in settings.

### Position Unavailable (Error Code 2)
Device cannot determine location. May be due to:
- No GPS signal
- Indoor location with poor satellite visibility
- Location services disabled at OS level

### Timeout (Error Code 3)
Location request took too long. User can:
- Increase timeout in settings
- Try again in a location with better signal
- Check device location services

## Testing Location Access

The **Settings** tab includes a location test feature:

1. Navigate to Settings tab
2. Click "Test Location"
3. View detailed location data:
   - Latitude & Longitude
   - Accuracy (in meters)
   - Timestamp
   - Altitude (if available)
   - Speed (if available)

This helps diagnose location issues and verify settings are working correctly.

## Troubleshooting

### Location Not Working?

1. **Check browser permissions**
   - Look for location icon in address bar
   - Verify location is set to "Allow"

2. **Check device settings**
   - Ensure location services are enabled at OS level
   - Check that browser has permission to access location

3. **Check connection**
   - Ensure you're using HTTPS (required for geolocation)
   - Verify no firewall blocking location services

4. **Try clearing cache**
   - Clear browser cache and cookies
   - Reload the page

5. **Test location access**
   - Use the test feature in Settings tab
   - Review error messages for specific issues

### Common Issues

**"Location permission denied"**
- User blocked access → Follow browser instructions to enable
- Never asked for permission → Click "Enable Location Access" button

**"Location information unavailable"**
- Poor GPS signal → Move to an area with better signal
- Location services off → Enable in device settings

**"Location request timed out"**
- Increase timeout in Settings
- Check GPS signal strength
- Try again in better conditions

## API Reference

### useLocationPermission Hook

```typescript
interface LocationPermissionResult {
  state: 'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking'
  isGranted: boolean
  isDenied: boolean
  isPrompt: boolean
  isUnavailable: boolean
  isChecking: boolean
  request: () => Promise<boolean>
  refresh: () => Promise<void>
}
```

### LocationPermissionConfig Props

```typescript
interface LocationPermissionConfigProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
  showInstructions?: boolean  // Default: true
}
```

### LocationSettings Storage

Settings are persisted using `useKV` hook:

```typescript
interface LocationSettings {
  enableHighAccuracy: boolean      // Default: true
  enableBackgroundLocation: boolean // Default: false
  cacheLocation: boolean           // Default: true
  locationTimeout: number          // Default: 10000 (10s)
  maxLocationAge: number           // Default: 60000 (1min)
}

// Stored in: 'location-settings' key
```

## Future Enhancements

Potential improvements for location functionality:

1. **Watch Position**: Continuous location tracking during active routes
2. **Geofencing**: Alerts when entering/leaving high-demand zones
3. **Location History**: Anonymous heatmap of your past driving locations
4. **Offline Support**: Cache last known location for offline use
5. **Background Location**: Track location when app is in background (requires additional permissions)

## Related Documentation

- [OpenFreeMap Integration](./OPENFREEMAP.md) - Map visualization
- [AI Insights](./AI_INSIGHTS_DATABASE.md) - Location-based insights
- [Security](./SECURITY.md) - Security and privacy practices

---

**Last Updated**: January 2026
**Version**: 1.0.0

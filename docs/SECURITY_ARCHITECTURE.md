# Security Architecture - NYC TLC Driver Hub

## Overview

The NYC TLC Driver Hub is a privacy-first, browser-based application designed to help taxi and rideshare drivers manage compliance, optimize earnings, and maintain professional networks while protecting sensitive personal and financial information.

## Architecture Constraints

This application operates within the **Spark Runtime Environment**, which has specific architectural characteristics:

- **Client-Side Only**: No traditional backend server; all processing occurs in the browser
- **Spark KV Storage**: Persistent data storage via `spark.kv` API (browser-local, not shared across devices)
- **Spark LLM API**: AI features powered by `spark.llm()` with prompts processed server-side
- **No External Databases**: All driver data stored locally in browser via KV store
- **NYC Open Data APIs**: Read-only access to public TLC and traffic data

## Security Model

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Sandbox                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              NYC TLC Driver Hub (React)                │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │ UI Components│  │ Business     │  │  Data Layer │ │  │
│  │  │              │  │ Logic        │  │             │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │  │
│  │         │                 │                  │        │  │
│  │         └─────────────────┴──────────────────┘        │  │
│  │                           │                           │  │
│  │         ┌─────────────────┴─────────────────┐         │  │
│  │         │                                     │         │  │
│  │         ▼                                     ▼         │  │
│  │  ┌──────────────┐                   ┌────────────────┐│  │
│  │  │  Spark KV    │                   │  Spark LLM API ││  │
│  │  │  (Local)     │                   │  (Server-Side) ││  │
│  │  └──────────────┘                   └────────────────┘│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
┌──────────────────┐            ┌──────────────────────┐
│  NYC Open Data   │            │  Browser Geolocation │
│  APIs (Public)   │            │  API (Permission Req)│
└──────────────────┘            └──────────────────────┘
```

### Data Classification

| Data Type | Sensitivity | Storage | Encryption | Retention |
|-----------|------------|---------|------------|-----------|
| Driver License # | **HIGH** | KV Store | At-Rest¹ | User-Controlled |
| TLC License # | **HIGH** | KV Store | At-Rest¹ | User-Controlled |
| Earnings Data | **MEDIUM** | KV Store | At-Rest¹ | User-Controlled |
| Trip Locations | **MEDIUM** | KV Store | At-Rest¹ | User-Controlled |
| GPS Coordinates | **HIGH** | Temporary² | In-Memory | Session Only |
| Chat Messages | **LOW** | KV Store | At-Rest¹ | User-Controlled |
| User Preferences | **LOW** | KV Store | At-Rest¹ | User-Controlled |

**Notes:**
1. At-Rest encryption provided by browser's IndexedDB (used by Spark KV)
2. GPS never persisted to KV store; processed in-memory for route generation only

## Privacy-by-Design Implementation

### Data Minimization

**What We Collect:**
- License expiration dates (for renewal reminders)
- Shift earnings data (date, platform, gross/net earnings, trips, hours)
- Optional start location (neighborhood name only, never precise GPS)
- Trip statistics (distance, duration, pay - no passenger details)
- User preferences (notification settings, favorite platforms)

**What We DON'T Collect:**
- Passenger names, addresses, or contact information
- Precise GPS coordinates (latitude/longitude not stored)
- Complete trip histories with routes
- Payment card numbers or bank account details
- Biometric data
- Social Security Numbers

### User Data Controls

All drivers have the following rights, implemented in the Settings UI:

1. **View All Data**: Export complete data snapshot
2. **Delete Specific Data**: Remove shifts, rides, documents, messages
3. **Delete All Data**: Complete account data wipeout
4. **Export Data**: Download JSON/CSV for portability
5. **Opt-Out of Location**: Disable GPS features entirely

### Masking & Tokenization

**License Numbers:**
- Display: `TLC-****1234` (last 4 digits visible)
- Storage: Full number (required for user reference)
- Never transmitted to external services

**Phone Numbers (SMS Reminders):**
- Display: `(***) ***-1234`
- Storage: Full number (required for reminder functionality)
- Never transmitted; reminders simulated client-side

### GPS Location Handling

**Current Location (for Route Generation):**
```typescript
// GPS coordinates obtained via browser geolocation API
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords
  
  // ✅ Used immediately for route calculation
  generateRoute(latitude, longitude)
  
  // ❌ NEVER stored in KV
  // ❌ NEVER logged
  // ❌ NEVER transmitted to external services
  
  // Coordinates discarded after route generation
})
```

**Start Location (User-Entered for Shifts):**
- User enters neighborhood name (e.g., "Midtown Manhattan", "JFK Airport")
- Stored as plain text string, not coordinates
- Used for earnings pattern analysis only

## Security Controls

### Frontend Security

#### Input Validation

All user inputs validated before processing:

```typescript
// Example: Earnings validation
function validateEarnings(earnings: number): boolean {
  if (typeof earnings !== 'number') return false
  if (isNaN(earnings)) return false
  if (earnings < 0 || earnings > 10000) return false // $10k daily cap
  return true
}

// Example: Date validation
function validateDate(dateString: string): boolean {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return false
  if (date > new Date()) return false // No future dates
  return true
}

// Example: License number sanitization
function sanitizeLicenseNumber(input: string): string {
  return input.replace(/[^A-Z0-9-]/gi, '').toUpperCase()
}
```

#### XSS Prevention

- All user inputs rendered via React (automatic escaping)
- No `dangerouslySetInnerHTML` usage
- Content Security Policy headers recommended for production deployment

#### Data Sanitization

```typescript
// Remove HTML tags from text inputs
function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

// Sanitize before storing in KV
function sanitizeShiftData(shift: Shift): Shift {
  return {
    ...shift,
    notes: sanitizeText(shift.notes),
    location: sanitizeText(shift.location)
  }
}
```

### API Security

#### NYC Open Data APIs

- **Read-Only**: No write operations; cannot modify TLC databases
- **Rate Limiting**: Respect API rate limits (1000 requests/hour typical)
- **Error Handling**: Graceful degradation if APIs unavailable
- **No Authentication**: Public data; no API keys exposed

```typescript
async function fetchTLCBases() {
  try {
    const response = await fetch(
      'https://data.cityofnewyork.us/resource/eccv-9dzr.json?$limit=1000',
      { signal: AbortSignal.timeout(10000) } // 10s timeout
    )
    if (!response.ok) throw new Error('API unavailable')
    return await response.json()
  } catch (error) {
    console.error('TLC API error:', error)
    return [] // Graceful degradation
  }
}
```

#### Spark LLM API

- **Prompt Injection Protection**: All prompts constructed via `spark.llmPrompt` template tag
- **No User Data in Prompts**: Only aggregated statistics sent (never raw license numbers)
- **Output Sanitization**: AI responses sanitized before display

```typescript
// ✅ SAFE: Template prevents injection
const prompt = spark.llmPrompt`Analyze this earnings data: ${JSON.stringify(stats)}`

// ❌ UNSAFE: Direct string concatenation (NOT USED)
// const prompt = "Analyze: " + userInput
```

### Storage Security

#### Spark KV Encryption

- **Browser Storage**: Data stored in IndexedDB (Spark KV backend)
- **At-Rest Encryption**: Provided by browser storage layer
- **Same-Origin Policy**: Data isolated per origin; not accessible to other sites
- **No Cross-Device Sync**: Data remains on single device

#### Sensitive Data Handling

```typescript
// License data stored with minimal exposure
interface LicenseData {
  number: string        // Full number (needed for user reference)
  expirationDate: string
  type: 'TLC' | 'DMV'
}

// Display masked version in UI
function maskLicenseNumber(number: string): string {
  if (number.length < 4) return '****'
  return `${number.slice(0, -4).replace(/./g, '*')}${number.slice(-4)}`
}
```

### Authentication & Authorization

**Current State (Single-User, Local-Only):**
- No authentication required (local-only app, single device)
- Data stored locally; no shared access
- Browser provides isolation between users

**Future Considerations (If Multi-User):**
- Implement Spark User API (`spark.user()`)
- Role-based access control (Driver, Admin, Support)
- OAuth2/OpenID Connect for authentication
- Multi-factor authentication for sensitive operations

## Compliance & Privacy

### GDPR Compliance

**Right to Access:**
- Export feature provides complete data snapshot (JSON/CSV)

**Right to Rectification:**
- All data editable via UI; instant updates

**Right to Erasure:**
- "Delete All Data" button wipes KV store completely
- Individual item deletion supported

**Right to Data Portability:**
- Export formats: JSON (complete), CSV (tabular data)

**Right to Object:**
- Users can disable location features
- SMS/email notifications opt-in only

### CCPA Compliance

**Do Not Sell My Personal Information:**
- No data sharing with third parties
- No advertising or tracking
- No data sales

**Disclosure:**
- Privacy policy clearly states data storage location (local device only)
- No external data processing except Spark LLM (anonymized)

### Data Retention Policy

**Default Retention:**
- User-controlled: Data persists until manually deleted
- No automatic expiration

**Recommended Retention:**
- Tax Records: 7 years (shifts, rides for IRS)
- License History: Until license expires
- Chat Messages: 90 days (implement auto-cleanup)

## Threat Model

### Threats & Mitigations

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|-----------|------------|
| **XSS via User Input** | HIGH | LOW | React auto-escaping, input sanitization |
| **Data Theft via Malware** | HIGH | MEDIUM | Browser sandbox, HTTPS only |
| **Phishing (Fake Site)** | MEDIUM | MEDIUM | HTTPS, subdomain verification education |
| **License Number Exposure** | HIGH | LOW | Display masking, no external transmission |
| **GPS Tracking** | HIGH | LOW | No GPS storage, user permission required |
| **API Key Exposure** | N/A | N/A | No API keys (public APIs only) |
| **Session Hijacking** | N/A | N/A | No sessions (local-only app) |
| **CSRF** | N/A | N/A | No server-side state changes |
| **SQL Injection** | N/A | N/A | No SQL database |
| **Brute Force** | N/A | N/A | No authentication mechanism |

### Out-of-Scope Threats

Due to architecture constraints, the following are not applicable:
- Server-side vulnerabilities (no server)
- Database breaches (no remote database)
- Network interception of stored data (local-only)
- Account takeover (no accounts)

## Incident Response

### Security Vulnerability Reporting

**Contact:**
- Email: `security@[your-domain].com`
- Response Time: 48 hours for acknowledgment
- PGP Key: [Link to public key]

**Process:**
1. Report received and acknowledged
2. Vulnerability validated and assessed
3. Fix developed and tested
4. Security advisory published
5. Update deployed to production

### Data Breach Response

**In Case of Device Theft/Loss:**
1. Driver should assume local data compromised
2. Change TLC account passwords immediately
3. Monitor bank statements for fraudulent charges
4. Report to TLC if license information exposed

**No Remote Wipe:**
- Local-only architecture prevents remote data deletion
- Drivers should enable device encryption (OS-level)

## Deployment Security

### HTTPS Enforcement

**Production Deployment:**
- HTTPS required (TLS 1.3+ recommended)
- HTTP Strict Transport Security (HSTS) header
- Secure cookies (if future authentication added)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Content Security Policy

**Recommended CSP Headers:**

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://tiles.openfreemap.org;
  connect-src 'self' https://data.cityofnewyork.us;
  frame-ancestors 'none';
```

### Security Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), notifications=(self)
```

### Environment Configuration

**Production `.env` Example:**

```bash
# Application
VITE_APP_NAME="NYC TLC Driver Hub"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT="production"

# Feature Flags
VITE_ENABLE_GPS_FEATURES=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_CHATROOM=true

# API Endpoints (Public APIs - No Keys Required)
VITE_TLC_BASES_API="https://data.cityofnewyork.us/resource/eccv-9dzr.json"
VITE_TLC_TRIPS_API="https://data.cityofnewyork.us/resource/8wbx-tsch.json"

# Security
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_ANALYTICS=false

# Data Retention (days)
VITE_CHAT_MESSAGE_RETENTION=90
VITE_SHIFT_DATA_RETENTION=2555  # 7 years for tax records
```

**Development `.env.local` Example:**

```bash
VITE_APP_NAME="NYC TLC Driver Hub (Dev)"
VITE_ENVIRONMENT="development"
VITE_ENABLE_DEBUG_LOGS=true
```

## Audit Logging

### Current Implementation

**Client-Side Logging:**
- Console logs for development only (disabled in production)
- No persistent audit logs (privacy consideration)

**User Activity Tracking:**
- None implemented (privacy-first approach)
- No analytics or telemetry

### Future Considerations

**If Multi-User System:**
- Log compliance-related actions (license updates, document changes)
- Log authentication events (login, logout, failed attempts)
- Log data exports and deletions
- Retain logs for 1 year

## Dependencies Security

### Dependency Management

**Current Approach:**
```bash
# Check for known vulnerabilities
npm audit

# Update dependencies (with testing)
npm update

# Review security advisories
npm audit report
```

**Automated Security:**
- GitHub Dependabot (recommended)
- Snyk or similar scanning (optional)
- Pre-commit hooks for vulnerability checks

### Supply Chain Security

**Package Integrity:**
- Use `package-lock.json` for reproducible builds
- Verify package signatures (npm v7+)
- Review dependency changes in PRs

**Trusted Sources:**
- Official packages from npm registry only
- Verify maintainer identities for critical packages
- Avoid unmaintained packages

## Secure Development Practices

### Code Review Checklist

- [ ] All user inputs validated and sanitized
- [ ] No sensitive data in console.log() statements
- [ ] No hardcoded secrets or API keys
- [ ] GPS coordinates never stored in KV
- [ ] License numbers masked in UI
- [ ] Error messages don't expose system internals
- [ ] External API calls have timeout and error handling
- [ ] React components don't use dangerouslySetInnerHTML
- [ ] Date/time inputs validated for reasonable ranges

### Testing Security

```typescript
// Example: Security-focused unit test
describe('License Number Security', () => {
  it('should mask license numbers in UI', () => {
    const fullNumber = 'TLC12345678'
    const masked = maskLicenseNumber(fullNumber)
    expect(masked).toBe('TLC*****678')
  })
  
  it('should never log full license numbers', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    processLicense('TLC12345678')
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('TLC12345678')
    )
  })
})
```

## Security Roadmap

### Phase 1: Current (✅ Implemented)
- Client-side input validation
- React XSS protection
- KV storage encryption (browser-level)
- GPS data not persisted
- License number masking in UI

### Phase 2: Near-Term (🔄 Planned)
- Comprehensive input sanitization library
- CSP headers in production
- Data export/delete features in UI
- Privacy policy component
- Security audit of all components

### Phase 3: Future (📋 Backlog)
- Spark User API integration for authentication
- Role-based access control (if multi-user)
- End-to-end encryption for chat (if cloud-synced)
- Security logging for compliance actions
- Penetration testing

---

**Last Updated:** January 2025  
**Maintainer:** NYC TLC Driver Hub Security Team  
**Next Review:** July 2025

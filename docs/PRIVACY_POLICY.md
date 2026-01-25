# Privacy Policy & Data Handling

## NYC TLC Driver Hub - Privacy Policy

**Effective Date:** January 2025  
**Last Updated:** January 2025

---

## Introduction

The NYC TLC Driver Hub ("we", "our", "the App") is committed to protecting your privacy and handling your data with transparency and care. This privacy policy explains what data we collect, how we use it, how we protect it, and your rights regarding your personal information.

**Key Principle:** Your data stays on YOUR device. We are a privacy-first, local-only application.

---

## What Data We Collect

### License & Compliance Information
- **TLC License Number** (stored locally, masked in display)
- **DMV License Number** (stored locally, masked in display)
- **License Expiration Dates**
- **Document Expiration Dates** (drug test, insurance, vehicle inspection)

**Purpose:** Provide renewal reminders and help you avoid compliance penalties.

### Earnings & Financial Data
- **Shift Earnings** (gross pay, net pay, tips)
- **Platform Selection** (Uber, Lyft, Via, etc.)
- **Trip Statistics** (count, duration, distance)
- **Expenses** (optional, for profit calculation)

**Purpose:** Analyze earnings patterns and provide optimization recommendations.

### Location Data

#### Start Locations (Optional, User-Entered)
- **Neighborhood Names** (e.g., "Midtown Manhattan", "JFK Airport")
- **NOT Precise GPS Coordinates**

**Purpose:** Analyze which starting locations correlate with higher earnings.

#### Current Location (Temporary, GPS)
- **Precise GPS Coordinates** (latitude/longitude)
- **Obtained with explicit permission** via browser geolocation API
- **NEVER STORED** - Used immediately for route generation, then discarded
- **Processed entirely in-memory**

**Purpose:** Generate optimal routes from your current position.

### Communication Data
- **Chat Messages** (in-app chatroom)
- **Fellow Driver List** (names you add to your network)

**Purpose:** Enable driver community features and professional networking.

### User Preferences
- **Notification Settings** (SMS, email, in-app preferences)
- **Phone Number** (if SMS reminders enabled)
- **Favorite Platforms** (starred apps)
- **Daily Goal Targets** ($500-$1000 range)

**Purpose:** Personalize your experience and send requested reminders.

---

## What Data We DON'T Collect

We are committed to data minimization. We explicitly **DO NOT** collect:

❌ **Passenger Information** (names, addresses, phone numbers)  
❌ **Precise GPS History** (no location tracking or coordinate storage)  
❌ **Payment Card Numbers** (no financial account access)  
❌ **Bank Account Details**  
❌ **Social Security Numbers**  
❌ **Biometric Data** (fingerprints, facial recognition)  
❌ **Complete Trip Routes** (only aggregated statistics)  
❌ **Browsing History or Cookies** (beyond essential app functionality)  
❌ **Third-Party Tracking Data**

---

## How We Use Your Data

### 1. Compliance Management
- Calculate days until license/document expiration
- Send reminder notifications at configured intervals
- Display color-coded status indicators (current/expiring/expired)

### 2. Earnings Optimization
- Analyze your shift patterns to identify peak earning times
- Compare performance across different platforms
- Recommend optimal locations and schedules based on YOUR historical data

### 3. AI-Powered Insights
- Generate personalized recommendations using anonymized statistics
- Compare your performance to NYC TLC market averages (from public APIs)
- Suggest route optimizations based on traffic and demand patterns

**Note:** When using AI features, we send ONLY anonymized, aggregated statistics to the Spark LLM API. We NEVER send:
- Your license numbers
- Your phone number
- Your exact GPS coordinates
- Passenger details (we don't have any)

Example of what IS sent to AI:
```json
{
  "avgEarningsPerTrip": 28.50,
  "totalShifts": 45,
  "topPlatform": "Platform A",
  "avgHourlyRate": 35.00
}
```

### 4. NYC TLC & Traffic Data Integration
- Fetch public TLC trip data and base listings from NYC Open Data APIs
- Display real-time traffic information from NYC DOT feeds
- **These are READ-ONLY public APIs** - we never submit your data to them

---

## Where Your Data Is Stored

### Local Storage Only

**All your personal data is stored EXCLUSIVELY on your device** using browser storage (IndexedDB via Spark KV API).

✅ **Data stays on your device**  
✅ **No cloud sync**  
✅ **No remote servers storing your info**  
✅ **No cross-device sharing**  

**What This Means:**
- If you switch devices, your data does NOT transfer automatically
- If you clear browser data, your app data is erased
- Other users on the same device cannot access your data (browser isolation)
- If your device is lost/stolen, data is only accessible to someone with device access

### Data Storage Specifics

| Data Type | Storage Location | Accessible By |
|-----------|-----------------|---------------|
| License Info | Browser IndexedDB (Spark KV) | Only this app on this device |
| Earnings Data | Browser IndexedDB (Spark KV) | Only this app on this device |
| Chat Messages | Browser IndexedDB (Spark KV) | Only this app on this device |
| GPS Coordinates | Temporary memory (RAM) | Discarded after use |
| User Preferences | Browser IndexedDB (Spark KV) | Only this app on this device |

---

## Data Security

### Encryption

**At-Rest Encryption:**
- Browser storage (IndexedDB) provides platform-level encryption
- Data encrypted by your operating system (if device encryption enabled)

**In-Transit Encryption:**
- All external API calls use HTTPS (TLS 1.3)
- No unencrypted data transmission

### Access Control

**Single-User, Local-Only:**
- No authentication required (your device access controls this)
- Browser same-origin policy isolates data from other websites
- Operating system user accounts prevent cross-user access

### Data Masking

**License Numbers:**
- Displayed as `TLC-****1234` (last 4 digits visible)
- Full number stored for your reference only

**Phone Numbers:**
- Displayed as `(***) ***-1234`
- Full number stored for reminder functionality only

---

## Your Data Rights

You have complete control over your data. We provide the following rights and tools:

### 1. Right to Access
**Export Your Data:**
- Download complete data snapshot in JSON format
- Export shifts and rides to CSV for tax records
- Export heatmap data for analysis

**Location:** Settings → Data Management → Export Data

### 2. Right to Rectification
**Edit Your Data:**
- All stored data is editable via the UI
- Changes take effect immediately
- No approval required

### 3. Right to Erasure ("Right to be Forgotten")
**Delete Your Data:**
- Delete individual shifts, rides, documents, or messages
- Delete all data with "Clear All Data" button
- Deletion is immediate and irreversible

**Location:** Settings → Data Management → Delete All Data

### 4. Right to Data Portability
**Take Your Data Elsewhere:**
- Export formats: JSON (complete) and CSV (tabular)
- Standard formats readable by Excel, Google Sheets, accounting software
- No proprietary lock-in

### 5. Right to Object
**Opt-Out of Features:**
- Disable GPS/location features entirely
- Turn off SMS notifications
- Disable AI insights
- Use app in "local-only mode"

**Location:** Settings → Privacy Controls

---

## Third-Party Data Sharing

### We Do NOT Share Your Data

**No Data Sales:**
- We do not sell, rent, or trade your personal information
- We do not share data with advertisers
- We do not participate in ad networks

**No External Processors:**
- No cloud storage providers
- No analytics companies (no Google Analytics, etc.)
- No third-party databases

### Limited External Services

**Spark LLM API (AI Features):**
- **What's sent:** Anonymized, aggregated statistics only
- **What's NOT sent:** License numbers, GPS coordinates, passenger details
- **Purpose:** Generate personalized recommendations
- **Opt-out:** Disable AI features in Settings

**NYC Open Data APIs (Public Data):**
- **What we access:** Public TLC base listings, trip statistics, traffic data
- **What we send:** API queries only (no personal data)
- **Purpose:** Provide market benchmarks and traffic intelligence
- **Provider:** NYC.gov (official city data)

**Browser Geolocation API:**
- **What's accessed:** Your device GPS coordinates (with permission)
- **What's stored:** Nothing - coordinates used in-memory only
- **Purpose:** Generate routes from current location
- **Opt-out:** Deny browser permission or disable GPS features

---

## Data Retention

### User-Controlled Retention

**Default:** Data persists until you delete it (no automatic expiration).

**Recommended Retention Periods:**
- **Tax Records (Shifts/Rides):** 7 years (IRS requirement)
- **License History:** Until license expires + 1 year
- **Chat Messages:** 90 days (automatic cleanup planned)
- **GPS Data:** Never stored (immediate discard)

**How to Delete Old Data:**
- Manually delete individual items via UI
- Use date filters to export + delete bulk data
- "Delete All Data" button for complete wipe

---

## Children's Privacy

The NYC TLC Driver Hub is intended for professional use by licensed drivers (age 18+). We do not knowingly collect data from children under 13. If you believe a child has used this app, please contact us immediately.

---

## Changes to This Privacy Policy

We may update this privacy policy periodically to reflect:
- New features or functionality
- Changes in data handling practices
- Legal or regulatory requirements

**How You'll Be Notified:**
- In-app notification banner
- Privacy policy version displayed in Settings
- Effective date updated at top of policy

**Your Continued Use:** By continuing to use the app after policy updates, you accept the revised terms.

---

## Geographic Scope

This app is designed for drivers operating in **New York City** and collects data relevant to NYC TLC regulations. However, our privacy practices apply regardless of your location.

**International Users:**
- EU/EEA: GDPR rights apply (access, rectification, erasure, portability)
- California: CCPA rights apply (disclosure, opt-out, deletion)
- Other regions: Contact us for specific rights

---

## Legal Compliance

### GDPR (EU General Data Protection Regulation)

**Legal Basis for Processing:**
- **Contract Performance:** Compliance tracking and earnings optimization
- **Legitimate Interest:** AI insights and traffic data integration
- **Consent:** GPS location access (explicit permission required)

**Your GDPR Rights:**
- ✅ Right to Access (Export Data)
- ✅ Right to Rectification (Edit Data)
- ✅ Right to Erasure (Delete Data)
- ✅ Right to Data Portability (Export JSON/CSV)
- ✅ Right to Object (Disable Features)
- ✅ Right to Restriction (Granular Controls)

### CCPA (California Consumer Privacy Act)

**California Residents' Rights:**
- ✅ Right to Know (this privacy policy + data export)
- ✅ Right to Delete (delete all data feature)
- ✅ Right to Opt-Out of Sale (N/A - we don't sell data)
- ✅ Right to Non-Discrimination (no penalties for exercising rights)

**"Do Not Sell My Personal Information":**  
We do not sell personal information, so there is nothing to opt out of.

---

## Cookies & Tracking

### Essential Functionality Only

**We use browser storage for:**
- Saving your data (KV store via IndexedDB)
- Maintaining app state (active tab, preferences)
- Caching NYC TLC data (reduce API calls)

**We do NOT use:**
- ❌ Advertising cookies
- ❌ Analytics tracking (no Google Analytics)
- ❌ Social media pixels
- ❌ Cross-site tracking
- ❌ Fingerprinting techniques

---

## Security Practices

### How We Protect Your Data

**Technical Measures:**
- HTTPS encryption for all external requests
- Input validation and sanitization
- XSS protection (React framework)
- Browser same-origin policy enforcement
- No plain-text secrets in code

**Best Practices:**
- Regular security audits
- Dependency vulnerability scanning
- Secure development lifecycle
- Incident response plan

### What You Can Do

**Protect Your Device:**
- Enable device encryption (iOS: on by default, Android: Settings → Security)
- Use strong device passcode/biometric lock
- Keep browser and OS updated
- Be cautious with browser extensions (they can access app data)

**If Your Device Is Lost/Stolen:**
- Your app data is only as secure as your device access
- Consider using device tracking/remote wipe features (Find My iPhone, Android Device Manager)
- Change your TLC account passwords as a precaution

---

## Contact Us

### Privacy Questions or Concerns

**Email:** privacy@[your-domain].com  
**Subject Line:** "Privacy Inquiry - NYC TLC Driver Hub"  
**Response Time:** 5 business days

### Data Subject Requests

To exercise your rights (access, deletion, export):
- Use in-app features (Settings → Data Management)
- Or email: data-requests@[your-domain].com

### Security Vulnerabilities

**Report security issues:** security@[your-domain].com  
**Response Time:** 48 hours  
**See also:** `/docs/SECURITY_ARCHITECTURE.md`

---

## Transparency Reports

We believe in transparency. We will publish annual reports detailing:
- Number of data subject requests (access, deletion)
- Security incidents (if any)
- Policy updates and rationale

**Available at:** [your-domain]/transparency

---

## Acknowledgments

**Privacy Principles Inspired By:**
- GDPR (EU data protection)
- CCPA (California privacy law)
- Privacy by Design framework
- NYC TLC data handling requirements

**Open Source Commitments:**
- OpenFreeMap (privacy-respecting maps)
- NYC Open Data (public information access)
- Client-side processing (data sovereignty)

---

**Your Privacy Matters.** If you have any questions or concerns about how we handle your data, please don't hesitate to contact us. We're here to help drivers earn more while protecting their privacy.

---

**Effective Date:** January 2025  
**Version:** 1.0.0  
**Last Updated:** January 2025  
**Next Review:** July 2025

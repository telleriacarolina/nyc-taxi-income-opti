# Planning Guide

A comprehensive driver management hub for NYC TLC (Taxi and Limousine Commission) drivers to track their license renewals, required documents, compliance deadlines, and optimize their earnings through data-driven insights.

**Experience Qualities**: 
1. **Professional** - Clean, organized interface that inspires confidence and trust for managing critical licensing and earnings information
2. **Empowering** - Data-driven insights that help drivers maximize earnings and stay compliant with their licensing requirements
3. **Actionable** - Clear visual indicators and recommendations that guide drivers to make better decisions about when and where to drive

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a multi-view application with document tracking, deadline management, shift logging, earnings analytics, pattern recognition, and personalized insights requiring sophisticated state management and data analysis.

## Essential Features

### Tabbed Navigation
- **Functionality**: Switch between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, and Trip Calculator views with persistent tab state
- **Purpose**: Organize distinct driver needs into focused, purpose-built interfaces
- **Trigger**: Click tab buttons in header
- **Progression**: User clicks tab → View switches → State persists → Returns to last used tab on app reload
- **Success criteria**: Driver can seamlessly navigate between compliance tracking, earnings optimization, ride comparison, platform information, and trip income calculator

### License Status Dashboard
- **Functionality**: Display current TLC license status with expiration date, license number, and visual status indicator
- **Purpose**: Provide at-a-glance awareness of license validity to prevent driving with expired credentials
- **Trigger**: Automatically loads on License Manager tab
- **Progression**: Tab opens → License card displays with color-coded status (active/expiring soon/expired) → Shows days remaining until expiration
- **Success criteria**: Driver can immediately see if their license is current and when action is needed

### Document Tracker
- **Functionality**: Track multiple required documents (DMV license, defensive driving certificate, drug test, vehicle inspection, insurance)
- **Purpose**: Ensure all required documentation stays current to maintain TLC compliance
- **Trigger**: View on License Manager tab, add/edit via modal dialog
- **Progression**: Dashboard shows document list → Click document to edit → Update expiration date and notes → Save changes → Status updates with visual indicator
- **Success criteria**: All required documents are tracked with expiration dates and status indicators

### Renewal Reminders
- **Functionality**: Visual alerts for items expiring within 30 days or already expired
- **Purpose**: Prevent lapses in compliance that could result in fines or inability to work
- **Trigger**: Automatic based on current date vs. expiration dates
- **Progression**: System checks dates → Items within 30 days show warning badge → Expired items show alert badge → Driver reviews and takes action
- **Success criteria**: Driver receives clear visual warnings before documents expire

### Shift Logger
- **Functionality**: Log individual driving shifts with date, time, platform, earnings, trips, tips, and expenses
- **Purpose**: Build a comprehensive earnings history to enable pattern analysis and optimization recommendations
- **Trigger**: Click "Add Shift" button on Earnings Optimizer tab
- **Progression**: Click add → Modal opens → Enter shift details (platform, time, earnings, trips, expenses) → Save → Shift added to history with calculated hourly rate
- **Success criteria**: Driver can log a complete shift in under 60 seconds

### Platform-Specific Earnings Tracking
- **Functionality**: Track and compare earnings performance across all rideshare platforms (Uber, Lyft, Via, Curb, Revel, Juno, Other)
- **Purpose**: Identify which platforms are most profitable for individual driver patterns and optimize multi-apping strategy
- **Trigger**: Automatically generated after logging shifts on different platforms
- **Progression**: Log shifts on multiple platforms → System aggregates earnings by platform → Displays comparison chart showing total earnings, hourly rate, trips, and earning share per platform → Shows performance insights highlighting top earner and rate differences
- **Success criteria**: Driver can see at a glance which platforms generate the most income and highest hourly rates for their driving pattern

### Earnings Analytics Dashboard
- **Functionality**: Display key metrics including net earnings, average hourly rate, total trips, and tips
- **Purpose**: Provide clear overview of financial performance across all logged shifts
- **Trigger**: Automatically calculates from logged shifts on Earnings Optimizer tab
- **Progression**: View opens → Cards display metrics → Updates in real-time as shifts are added
- **Success criteria**: Driver can see total earnings, hourly rate, trip count, and tips at a glance

### Peak Performance Insights
- **Functionality**: Analyze shift data to identify best earning hours, days, and platforms with personalized recommendations
- **Purpose**: Guide drivers to work during their most profitable times and on their best-performing platforms
- **Trigger**: Automatically generated after 3+ shifts are logged
- **Progression**: System analyzes patterns → Identifies peak hours, best days, top platforms → Displays insights with actionable recommendations → Updates as more data is added
- **Success criteria**: Driver receives specific, data-backed recommendations on when and where to drive for maximum earnings

### Quick Actions
- **Functionality**: Fast access buttons to update license info, add documents, and log shifts
- **Trigger**: Click action buttons on cards or in tab views
- **Progression**: Click action button → Modal opens with form → Enter/update information → Confirm → Data persists and UI updates
- **Success criteria**: Driver can update any information or log a shift in under 30 seconds

### Ride Share Platform Directory
- **Functionality**: Comprehensive directory of NYC ride-sharing apps including Uber, Lyft, Curb, Revel, Via, and Juno with key details
- **Purpose**: Help drivers understand commission rates, features, and best use cases for each platform to optimize multi-apping strategy
- **Trigger**: Navigate to Ride Share Apps tab
- **Progression**: View opens → Platform cards display with icon, description, commission rates, features, and market share → Star favorites for quick reference
- **Success criteria**: Driver can compare all major platforms at a glance and mark preferred apps

### Platform Comparison
- **Functionality**: Side-by-side comparison of commission rates, features, and best use cases for each ride-share platform
- **Purpose**: Enable informed decisions about which apps to prioritize based on commission structure and earning potential
- **Trigger**: View Ride Share Apps tab
- **Progression**: Cards display key metrics → Compare commission rates → Review features and best-use scenarios → Star favorites
- **Success criteria**: Driver understands commission differences and can choose optimal platforms for their strategy

### Multi-Apping Tips
- **Functionality**: Curated advice on running multiple apps simultaneously to maximize earnings and minimize downtime
- **Purpose**: Educate drivers on best practices for using multiple platforms effectively
- **Trigger**: Displayed at bottom of Ride Share Apps tab
- **Progression**: Tips card shows → Driver reads strategies for multi-apping → Applies knowledge to daily driving routine
- **Success criteria**: Driver learns actionable strategies to improve earnings through platform diversification

### Individual Ride Tracking
- **Functionality**: Log individual rides with pickup/dropoff locations, distance, duration, gross pay, fees, and net pay
- **Purpose**: Enable granular comparison of ride quality and profitability beyond aggregate shift data
- **Trigger**: Click "Add Ride" button on Rides tab
- **Progression**: Click add → Modal opens → Enter ride details (platform, locations, distance, time, earnings, fees) → Save → Ride added to comparison view with efficiency score
- **Success criteria**: Driver can log a complete ride in under 45 seconds with automatic net pay calculation

### Ride Efficiency Rating
- **Functionality**: Automatically calculate and display a 1-5 star efficiency rating for each ride based on pay per mile and pay per minute
- **Purpose**: Provide quick visual feedback on ride quality to help identify patterns in profitable rides
- **Trigger**: Automatically calculated when ride is saved
- **Progression**: Ride saved → System calculates pay per mile and pay per minute → Normalizes against benchmarks → Displays 1-5 star rating on ride card
- **Success criteria**: Each ride has a clear visual efficiency indicator that correlates with actual profitability

### Platform Ride Performance Comparison
- **Functionality**: Compare rides across platforms showing average pay per mile, pay per minute, and fee percentages
- **Purpose**: Identify which platforms consistently offer the best value rides, not just overall earnings
- **Trigger**: Automatically displayed when rides from multiple platforms are logged
- **Progression**: Multiple rides logged → System aggregates by platform → Shows comparison with progress bars → Highlights best performer → Shows fee impact per platform
- **Success criteria**: Driver can see which platform gives best value per mile and lowest fees for individual rides

### Best and Worst Ride Insights
- **Functionality**: Automatically identify and highlight the best value ride (highest $/mile) and worst ride to show earning patterns
- **Purpose**: Help drivers recognize what types of rides to accept and which to avoid
- **Trigger**: Displayed after 3+ rides are logged on Rides tab
- **Progression**: 3+ rides logged → System identifies best and worst by pay per mile → Displays in insight card with route details → Provides actionable tips
- **Success criteria**: Driver receives specific guidance on ride types to prioritize based on their actual logged data

### Ride Data CSV Export
- **Functionality**: Export ride data to CSV format for tax records, accounting, or external analysis
- **Purpose**: Enable drivers to maintain official records for tax purposes and integrate ride data with external accounting systems
- **Trigger**: Click "Export CSV" button on Rides tab
- **Progression**: Click export → System generates CSV with all filtered ride data → Downloads file with date-stamped filename → Shows success toast with ride count → File includes date, time, platform, locations, distance, duration, gross pay, fees, net pay, pay per mile, pay per minute, rating, and notes
- **Success criteria**: Driver receives a properly formatted CSV file containing all visible rides with complete financial data suitable for tax filing and accounting software import

### Trip Income Calculator
- **Functionality**: Interactive calculator comparing potential earnings between rideshare platforms and medical transport services for identical trips
- **Purpose**: Help drivers make informed decisions about which types of trips to prioritize based on actual earning potential
- **Trigger**: Navigate to Calculator tab, enter trip distance and duration
- **Progression**: Enter distance and duration → Select rideshare platform (Uber/Lyft/Via/Curb/Revel/Juno) and medical provider (MTM/LogistiCare/Access2Care/Ambulette/Access-A-Ride) → System calculates gross pay, platform fees, net pay, pay per mile, pay per minute, and hourly rate for both options → Displays side-by-side comparison with difference amount and percentage → Shows recommendation with detailed breakdown of pros/cons
- **Success criteria**: Driver can instantly compare income potential between rideshare and medical transport for any trip and understand which option pays better and why

## Edge Case Handling
- **No License Entered**: Display empty state with prominent call-to-action to add license information
- **All Documents Current**: Show success state with encouraging message and next expiration date
- **Multiple Expired Items**: Prioritize display by expiration date (most urgent first)
- **Invalid Dates**: Validate that expiration dates are in the future when adding new documents
- **First-Time User (License Tab)**: Show helpful onboarding hints about what documents are required
- **No Shifts Logged**: Display empty state on Earnings tab with clear explanation of benefits and CTA to log first shift
- **Insufficient Data for Insights**: Show message that 3+ shifts are needed for pattern analysis
- **Single Platform Usage**: Platform comparison displays one platform with encouragement to try multi-apping
- **No Platform Data**: Platform comparison hidden until at least one shift is logged
- **Overlapping Shifts**: Allow entry but highlight in UI for driver to review
- **Zero or Negative Earnings**: Allow entry for tracking purposes (bad days happen)
- **Missing Expense Data**: Optional field, calculations work with or without it
- **No Favorite Apps**: Apps tab displays all platforms equally without favorites filter
- **Single Platform Driver**: Tips section still valuable for learning about alternatives
- **No Rides Logged**: Display empty state on Rides tab encouraging user to track individual rides
- **Insufficient Ride Data**: Show ride insights after 3+ rides are logged
- **Single Ride Platform**: Platform comparison hidden until rides from 2+ platforms exist
- **Automatic Net Pay Calculation**: Net pay automatically calculated from gross pay minus fees
- **Invalid Ride Values**: Validate distance > 0, duration > 0, gross pay > 0 before allowing save
- **Zero Distance/Duration**: Prevent save and show validation error
- **High Fee Percentage**: Display fee percentage on each ride to highlight commission differences
- **No Rides to Export**: Show error toast when export is clicked with no rides logged or all rides filtered out
- **Filtered Export**: CSV export respects active filters, exports only visible rides with descriptive filename indicating filters applied
- **Empty CSV Fields**: Optional fields (rating, notes) export as empty cells when not provided
- **Calculator Zero Values**: Show empty state message when distance or duration is zero
- **Calculator with Valid Input**: Display full comparison results with side-by-side earnings breakdown
- **Medical Transport Always Wins**: Handle cases where medical transport consistently pays more and explain platform fee impact
- **Rideshare Competitive**: Handle cases where rideshare (especially low-fee Curb) competes well with medical transport
- **Very Short Trips**: Medical flat rates may significantly exceed rideshare for short trips
- **Very Long Trips**: Rideshare per-mile rates may accumulate to compete with medical bonuses

## Design Direction
The design should evoke confidence, empowerment, and professionalism - like having a compliance assistant, business advisor, and platform expert. It should feel official yet data-forward, with clear status indicators for compliance and compelling visualizations that reveal earning patterns and opportunities. The Earnings Optimizer should feel energizing and opportunity-focused, while the License Manager maintains urgency around deadlines. The Ride Share Apps section should feel informative and comparative, helping drivers make strategic decisions about platform usage. The Ride Comparison view should feel analytical and detail-oriented, empowering drivers with granular insights into ride-by-ride profitability to make better decisions about which rides to accept. The Trip Calculator should feel powerful and decisive, presenting clear financial comparisons that help drivers choose between rideshare and medical transport opportunities with confidence.

## Color Selection
A professional palette with strong status indicators inspired by official transportation signage and traffic signals.

- **Primary Color**: Deep Blue (oklch(0.35 0.08 250)) - Conveys authority, professionalism, and trustworthiness like official NYC TLC branding
- **Secondary Colors**: 
  - Slate Gray (oklch(0.45 0.02 250)) for supporting elements and subtle backgrounds
  - Light Blue (oklch(0.92 0.03 250)) for card backgrounds and secondary surfaces
- **Accent Color**: Vibrant Yellow (oklch(0.85 0.15 90)) - Attention-grabbing for call-to-action buttons and important updates, inspired by NYC taxi yellow
- **Status Colors**:
  - Success Green (oklch(0.65 0.15 145)) for current/valid documents
  - Warning Orange (oklch(0.70 0.15 50)) for items expiring within 30 days
  - Alert Red (oklch(0.60 0.20 25)) for expired items
- **Foreground/Background Pairings**:
  - Background (Light Blue #EEF2F6): Dark text oklch(0.25 0.02 250) - Ratio 9.2:1 ✓
  - Primary (Deep Blue): White text oklch(0.98 0 0) - Ratio 8.5:1 ✓
  - Accent (Vibrant Yellow #F5D547): Dark text oklch(0.25 0.02 250) - Ratio 12.1:1 ✓
  - Success: White text oklch(0.98 0 0) - Ratio 4.6:1 ✓
  - Warning: Dark text oklch(0.25 0.02 250) - Ratio 9.8:1 ✓
  - Alert: White text oklch(0.98 0 0) - Ratio 5.2:1 ✓

## Font Selection
Typography should convey clarity and officialdom while remaining highly readable for quick scanning of dates and status information.

- **Primary Font**: Space Grotesk - A technical, geometric sans-serif that balances professionalism with approachability
- **Secondary Font**: JetBrains Mono - For license numbers, dates, and data fields requiring precision

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk Semibold/24px/normal letter spacing
  - H3 (Card Titles): Space Grotesk Medium/18px/normal letter spacing
  - Body (General Text): Space Grotesk Regular/16px/relaxed line height (1.6)
  - Data Fields (Dates, License Numbers): JetBrains Mono Medium/14px/monospace spacing
  - Labels: Space Grotesk Medium/14px/uppercase with wide letter spacing (0.05em)

## Animations
Animations should provide clear feedback for status changes and guide attention to urgent items without being distracting during critical compliance reviews.

- **Status transitions**: Smooth color fade when document status changes from current to expiring (300ms ease)
- **Card interactions**: Subtle lift and shadow on hover (200ms) to indicate interactivity
- **Modal entry**: Slide up with backdrop fade (250ms) for adding/editing documents
- **Badge pulses**: Gentle attention pulse on expired items (2s loop) to draw eye without overwhelming
- **Success confirmations**: Quick scale bounce (400ms) when items are updated successfully

## Component Selection

- **Components**:
  - **Tabs**: Primary navigation between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, and Trip Calculator views
  - **Card**: Primary container for license info, document groups, shift entries, ride entries, stat displays, platform details, and calculator results
  - **Badge**: Status indicators (Current, Expiring, Expired) with color variants, efficiency ratings, platform badges, fee percentages
  - **Dialog**: Modal for adding/editing license, documents, shift information, and individual rides
  - **Button**: Primary actions (yellow accent), secondary (outline), and icon buttons for quick actions
  - **Input**: Text fields for license numbers, document names, earnings amounts, shift details, ride locations, distances, times, pay amounts, and calculator inputs
  - **Select**: Dropdown for platform selection (Uber, Lyft, Via, Curb, Revel, Juno, Other), document types, rideshare platforms, and medical providers in calculator
  - **Textarea**: Notes fields for documents, shifts, and rides
  - **Alert**: Prominent warnings for expired items and insights callouts for earnings opportunities
  - **Progress**: Visual bars showing relative earnings performance between platforms and ride comparisons
  - **Separator**: Dividers between document groups, shift groups, and calculator sections
  - **Scroll Area**: For long lists of documents, shifts, and rides on mobile

- **Customizations**:
  - Custom colored borders on Cards based on status (green/orange/red for compliance, gradient for earnings)
  - Badge variants with status-specific colors and icons
  - Custom stat cards with large numbers and icon accents
  - Platform badges with brand colors (black for Uber, pink for Lyft, teal for Via, green for Curb, blue for Revel, purple for Juno)
  - Platform cards with color-coded left borders matching brand identity
  - Platform comparison cards showing earnings breakdown with progress bars and percentage of total earnings
  - Insight cards with gradient backgrounds to draw attention to optimization recommendations
  - Custom date display showing "X days remaining" countdown
  - Hourly rate calculation display showing $/hr alongside shift totals
  - Favorite/star toggle button for marking preferred platforms
  - Commission rate comparison display with visual emphasis
  - Platform performance metrics showing earnings share, hourly rate, trip count, and earnings per trip
  - Ride cards with route visualization (pickup → dropoff with arrow)
  - Efficiency star rating (1-5 stars) automatically calculated and displayed on ride cards
  - Net pay auto-calculation from gross pay minus fees
  - Pay per mile and pay per minute metrics prominently displayed
  - Fee percentage displayed to highlight commission impact
  - Best/worst ride comparison cards with visual indicators
  - Calculator comparison cards with side-by-side rideshare vs medical transport results
  - Real-time calculation updates as trip parameters change
  - Difference badge showing absolute dollar amount and percentage variance
  - Contextual recommendations based on which option pays more
  - Provider-specific rates and fee structures displayed in selectors

- **States**:
  - Buttons: Solid yellow accent for primary, subtle hover lift, pressed state with slight scale
  - Cards: Neutral default, colored left border on hover, full colored border for expired items
  - Tabs: Clear active state with icon and text, subtle inactive state
  - Inputs: Subtle focus ring in primary blue, error state in alert red
  - Badges: Static for current, animated pulse for expired
  - Shift cards: Hover shadow lift, edit/delete buttons appear on hover

- **Icon Selection**:
  - IdentificationCard: License/ID card representation, License Manager tab
  - ChartBar: Earnings analytics, Earnings Optimizer tab
  - CarProfile: Ride share vehicles, Apps tab
  - MapTrifold: Individual rides, Ride Comparison tab
  - Calculator: Trip income calculator, Calculator tab
  - FileText: Document tracking
  - CalendarBlank: Date/expiration displays
  - Clock: Time and duration displays
  - CurrencyDollar: Earnings and financial metrics
  - Car: Trip counts and ride metrics
  - TrendUp: Performance improvements and best rates, best rides
  - TrendDown: Lowest value rides
  - Lightbulb: Insights and recommendations
  - Lightning: Quick features and fast pay, rideshare advantages
  - Star: Favorite/preferred platforms, ride ratings
  - Users: Multi-apping tips
  - Globe: Platform availability
  - MapPin: Location markers for pickup/dropoff
  - Path: Distance metrics, trip details
  - ArrowRight: Route direction indicator
  - Warning/WarningCircle: Expiring/expired alerts, important considerations
  - CheckCircle: Current/valid status
  - Plus: Add new document, shift, or ride
  - PencilSimple: Edit existing entries
  - Trash: Delete shifts or rides
  - DownloadSimple: CSV export for tax records
  - FirstAidKit: Medical transport icon
  - Percent: Platform fees and commission rates

- **Spacing**:
  - Page padding: px-6 py-8 (mobile), px-8 py-12 (desktop)
  - Card padding: p-5 for shifts, p-6 for license/documents
  - Stat cards: p-5 with generous spacing for large numbers
  - Section gaps: gap-6 for card grids, gap-4 for metric grids
  - Element gaps: gap-4 within cards, gap-2 for inline elements
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Tabs span full width with clear touch targets, 5-column grid on larger screens wrapping as needed
  - Stat grid collapses to 2 columns on mobile
  - Platform cards stack in single column on mobile
  - Ride cards stack in single column on mobile, 2-column grid on desktop
  - Calculator comparison cards stack vertically on mobile, side-by-side on desktop
  - Larger touch targets (min 44px) for all interactive elements
  - Bottom sheet dialog variant for forms on mobile
  - Sticky tab navigation at top
  - Collapsible sections to reduce scroll length

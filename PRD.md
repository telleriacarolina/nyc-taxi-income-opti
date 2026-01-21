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
- **Functionality**: Switch between License Manager and Earnings Optimizer views with persistent tab state
- **Purpose**: Organize distinct driver needs into focused, purpose-built interfaces
- **Trigger**: Click tab buttons in header
- **Progression**: User clicks tab → View switches → State persists → Returns to last used tab on app reload
- **Success criteria**: Driver can seamlessly navigate between compliance tracking and earnings optimization

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

## Edge Case Handling
- **No License Entered**: Display empty state with prominent call-to-action to add license information
- **All Documents Current**: Show success state with encouraging message and next expiration date
- **Multiple Expired Items**: Prioritize display by expiration date (most urgent first)
- **Invalid Dates**: Validate that expiration dates are in the future when adding new documents
- **First-Time User (License Tab)**: Show helpful onboarding hints about what documents are required
- **No Shifts Logged**: Display empty state on Earnings tab with clear explanation of benefits and CTA to log first shift
- **Insufficient Data for Insights**: Show message that 3+ shifts are needed for pattern analysis
- **Overlapping Shifts**: Allow entry but highlight in UI for driver to review
- **Zero or Negative Earnings**: Allow entry for tracking purposes (bad days happen)
- **Missing Expense Data**: Optional field, calculations work with or without it

## Design Direction
The design should evoke confidence, empowerment, and professionalism - like having both a compliance assistant and a business advisor. It should feel official yet data-forward, with clear status indicators for compliance and compelling visualizations that reveal earning patterns and opportunities. The Earnings Optimizer should feel energizing and opportunity-focused, while the License Manager maintains urgency around deadlines.

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
  - **Tabs**: Primary navigation between License Manager and Earnings Optimizer views
  - **Card**: Primary container for license info, document groups, shift entries, and stat displays
  - **Badge**: Status indicators (Current, Expiring, Expired) with color variants
  - **Dialog**: Modal for adding/editing license, documents, and shift information
  - **Button**: Primary actions (yellow accent), secondary (outline), and icon buttons for quick actions
  - **Input**: Text fields for license numbers, document names, earnings amounts, and shift details
  - **Select**: Dropdown for platform selection (Uber, Lyft, Via, Other) and document types
  - **Textarea**: Notes fields for documents and shifts
  - **Alert**: Prominent warnings for expired items and insights callouts for earnings opportunities
  - **Separator**: Dividers between document and shift groups
  - **Scroll Area**: For long lists of documents and shifts on mobile

- **Customizations**:
  - Custom colored borders on Cards based on status (green/orange/red for compliance, gradient for earnings)
  - Badge variants with status-specific colors and icons
  - Custom stat cards with large numbers and icon accents
  - Platform badges with brand colors (black for Uber, pink for Lyft, teal for Via)
  - Insight cards with gradient backgrounds to draw attention to optimization recommendations
  - Custom date display showing "X days remaining" countdown
  - Hourly rate calculation display showing $/hr alongside shift totals

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
  - FileText: Document tracking
  - CalendarBlank: Date/expiration displays
  - Clock: Time and duration displays
  - CurrencyDollar: Earnings and financial metrics
  - Car: Trip counts and ride metrics
  - TrendUp: Performance improvements and best rates
  - Lightbulb: Insights and recommendations
  - Warning/WarningCircle: Expiring/expired alerts
  - CheckCircle: Current/valid status
  - Plus: Add new document or shift
  - PencilSimple: Edit existing entries
  - Trash: Delete shifts

- **Spacing**:
  - Page padding: px-6 py-8 (mobile), px-8 py-12 (desktop)
  - Card padding: p-5 for shifts, p-6 for license/documents
  - Stat cards: p-5 with generous spacing for large numbers
  - Section gaps: gap-6 for card grids, gap-4 for metric grids
  - Element gaps: gap-4 within cards, gap-2 for inline elements
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Tabs span full width with clear touch targets
  - Stat grid collapses to 2 columns on mobile
  - Larger touch targets (min 44px) for all interactive elements
  - Bottom sheet dialog variant for forms on mobile
  - Sticky tab navigation at top
  - Collapsible sections to reduce scroll length

# Planning Guide

A comprehensive driver management application for NYC TLC (Taxi and Limousine Commission) drivers to track their license renewals, required documents, and compliance deadlines.

**Experience Qualities**: 
1. **Professional** - Clean, organized interface that inspires confidence and trust for managing critical licensing information
2. **Urgent** - Clear visual indicators for approaching deadlines and expired items that demand attention
3. **Empowering** - Intuitive tools that help drivers stay compliant and in control of their licensing requirements

**Complexity Level**: Light Application (multiple features with basic state)
This is a multi-feature application with document tracking, deadline management, and status monitoring, but doesn't require complex backend integrations or multi-view navigation systems.

## Essential Features

### License Status Dashboard
- **Functionality**: Display current TLC license status with expiration date, license number, and visual status indicator
- **Purpose**: Provide at-a-glance awareness of license validity to prevent driving with expired credentials
- **Trigger**: Automatically loads on app launch
- **Progression**: App opens → License card displays with color-coded status (active/expiring soon/expired) → Shows days remaining until expiration
- **Success criteria**: Driver can immediately see if their license is current and when action is needed

### Document Tracker
- **Functionality**: Track multiple required documents (DMV license, defensive driving certificate, drug test, vehicle inspection, insurance)
- **Purpose**: Ensure all required documentation stays current to maintain TLC compliance
- **Trigger**: View on dashboard, add/edit via modal dialog
- **Progression**: Dashboard shows document list → Click document to edit → Update expiration date and upload reference → Save changes → Status updates with visual indicator
- **Success criteria**: All required documents are tracked with expiration dates and status indicators

### Renewal Reminders
- **Functionality**: Visual alerts for items expiring within 30 days or already expired
- **Purpose**: Prevent lapses in compliance that could result in fines or inability to work
- **Trigger**: Automatic based on current date vs. expiration dates
- **Progression**: System checks dates → Items within 30 days show warning badge → Expired items show alert badge → Driver reviews and takes action
- **Success criteria**: Driver receives clear visual warnings before documents expire

### Quick Actions
- **Functionality**: Fast access buttons to update license info, add documents, and mark items as renewed
- **Trigger**: Click action buttons on cards or floating action button
- **Progression**: Click action button → Modal opens with pre-filled form → Update information → Confirm → Data persists and UI updates
- **Success criteria**: Driver can update any document in under 30 seconds

## Edge Case Handling
- **No License Entered**: Display empty state with prominent call-to-action to add license information
- **All Documents Current**: Show success state with encouraging message and next expiration date
- **Multiple Expired Items**: Prioritize display by expiration date (most urgent first)
- **Invalid Dates**: Validate that expiration dates are in the future when adding new documents
- **First-Time User**: Show helpful onboarding hints about what documents are required

## Design Direction
The design should evoke confidence, urgency, and professionalism - like a reliable assistant that keeps you compliant. It should feel official but approachable, with clear status indicators that make complex compliance requirements immediately understandable.

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
  - **Card**: Primary container for license info and document groups with custom borders for status indication
  - **Badge**: Status indicators (Current, Expiring, Expired) with color variants
  - **Dialog**: Modal for adding/editing license and document information
  - **Button**: Primary actions (yellow accent), secondary (outline), and icon buttons for quick actions
  - **Input**: Text fields for license numbers and document names
  - **Calendar** (via date picker): Date selection for expiration dates
  - **Progress**: Visual indicator for time remaining until expiration
  - **Alert**: Prominent warnings for expired or soon-to-expire items
  - **Separator**: Dividers between document groups
  - **Scroll Area**: For long lists of documents on mobile

- **Customizations**:
  - Custom colored borders on Cards based on status (green/orange/red)
  - Badge variants with status-specific colors and icons
  - Floating Action Button component for quick "Add Document" access
  - Custom date display component showing "X days remaining" with countdown
  - Status indicator dots with animation for expired items

- **States**:
  - Buttons: Solid yellow accent for primary, subtle hover lift, pressed state with slight scale
  - Cards: Neutral default, colored left border on hover, full colored border for expired items
  - Inputs: Subtle focus ring in primary blue, error state in alert red
  - Badges: Static for current, animated pulse for expired

- **Icon Selection**:
  - IdentificationCard: License/ID card representation
  - FileText: Document tracking
  - CalendarBlank: Date/expiration displays
  - Warning: Expiring soon indicators
  - WarningCircle: Expired/urgent alerts
  - CheckCircle: Current/valid status
  - Plus: Add new document
  - PencilSimple: Edit existing entries
  - ClockCounterClockwise: Renewal history

- **Spacing**:
  - Page padding: px-6 py-8 (mobile), px-8 py-12 (desktop)
  - Card padding: p-6
  - Section gaps: gap-6 for card grids
  - Element gaps: gap-4 within cards, gap-2 for inline elements
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Sticky header with page title and quick add button
  - Bottom sheet dialog variant for forms on mobile
  - Larger touch targets (min 44px) for all interactive elements
  - Collapsible document sections to reduce scroll length
  - Floating action button fixed at bottom-right for quick access

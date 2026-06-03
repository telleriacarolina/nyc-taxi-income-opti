# Hexagon Badge Integration Examples

This guide shows how to integrate the new size variations into existing components throughout the NYC Driver Hub.

## 1. Platform Cards - Current Medium, Add Small for Mobile

### Before (RideShareApps.tsx, DeliveryPlatforms.tsx, PackageDeliveryWork.tsx)
```tsx
<HexagonBadge
  icon={<CarProfile weight="duotone" />}
  size="md"
  gradientColors={[...]}
/>
```

### After - Responsive Sizing
```tsx
{/* Mobile: sm, Tablet+: md */}
<div className="md:hidden">
  <HexagonBadge
    icon={<CarProfile weight="duotone" />}
    size="sm"
    gradientColors={[...]}
  />
</div>
<div className="hidden md:block">
  <HexagonBadge
    icon={<CarProfile weight="duotone" />}
    size="md"
    gradientColors={[...]}
  />
</div>
```

## 2. Status Indicators - Use Extra Small

### LicenseCard.tsx - Compliance Status
```tsx
{/* Add inline status badges */}
<div className="flex items-center gap-2">
  <span className="text-sm">TLC License</span>
  <HexagonBadge
    icon={<Check weight="bold" />}
    size="xs"
    gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)']}
    animated={false}
  />
</div>
```

### ShiftCard.tsx - Platform Status
```tsx
{/* Inline platform indicator */}
<div className="flex items-center gap-1.5">
  <HexagonBadge
    icon={platformIcon}
    size="xs"
    gradientColors={platformColors}
    animated={false}
  />
  <span className="text-xs">{platform.name}</span>
</div>
```

## 3. List Views - Compact Small Badges

### CurrentBases.tsx - Base List Items
```tsx
{bases.map((base) => (
  <div key={base.id} className="flex items-center gap-3 p-3 border-b">
    <HexagonBadge
      icon={<Buildings weight="duotone" />}
      size="sm"
      gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
      animated={false}
    />
    <div className="flex-1">
      <h4 className="font-display text-sm">{base.name}</h4>
      <p className="text-xs text-muted-foreground">{base.address}</p>
    </div>
  </div>
))}
```

### NotificationHistory.tsx - Notification Types
```tsx
{notifications.map((notif) => (
  <div className="flex items-start gap-2 p-2">
    <HexagonBadge
      icon={notif.icon}
      size="xs"
      gradientColors={notif.statusColors}
      animated={false}
    />
    <div className="flex-1 text-xs">
      <p>{notif.message}</p>
    </div>
  </div>
))}
```

## 4. Hero Sections - Large and Extra Large

### MTMEnrollmentWalkthrough.tsx - Step Headers
```tsx
{steps.map((step, index) => (
  <div className="flex flex-col items-center gap-4 p-6">
    <HexagonBadge
      icon={step.icon}
      size="xl"
      gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
      animated={true}
    />
    <h3 className="font-display text-xl">{step.title}</h3>
    <p className="text-sm text-muted-foreground">{step.description}</p>
  </div>
))}
```

### Empty States - 2XL
```tsx
{/* When no data is available */}
<div className="flex flex-col items-center justify-center gap-6 py-16">
  <HexagonBadge
    icon={<Inbox weight="duotone" />}
    size="2xl"
    gradientColors={['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 35)']}
    animated={true}
  />
  <div className="text-center">
    <h3 className="font-display text-lg">No Rides Yet</h3>
    <p className="text-sm text-muted-foreground">Start tracking your earnings</p>
  </div>
</div>
```

## 5. Tab Icons - Enhanced with Medium to Large

### App.tsx - Main Navigation (Optional Enhancement)
```tsx
{/* Desktop: use larger badges for impact */}
<TabsTrigger value="license" className="...">
  <div className="lg:hidden">
    <IdentificationCard size={20} weight="duotone" />
  </div>
  <div className="hidden lg:flex">
    <HexagonBadge
      icon={<IdentificationCard weight="duotone" />}
      size="sm"
      gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
      animated={false}
    />
  </div>
  <span>License</span>
</TabsTrigger>
```

## 6. Modal Headers - Large

### RideDialog.tsx, ShiftDialog.tsx, LicenseDialog.tsx
```tsx
<DialogHeader>
  <div className="flex items-center gap-4 pb-4 border-b">
    <HexagonBadge
      icon={<CarProfile weight="duotone" />}
      size="lg"
      gradientColors={platformGradient}
      animated={true}
    />
    <div>
      <DialogTitle className="font-display text-xl">Ride Details</DialogTitle>
      <DialogDescription>View and edit ride information</DialogDescription>
    </div>
  </div>
</DialogHeader>
```

## 7. Dashboard Widgets - Responsive Sizing

### EarningsOptimizer.tsx - Metric Cards
```tsx
<Card className="p-4">
  <div className="flex items-center gap-3 mb-4">
    {/* Mobile: sm, Desktop: md */}
    <HexagonBadge
      icon={<TrendUp weight="duotone" />}
      size={isMobile ? "sm" : "md"}
      gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.80 0.16 95)']}
      animated={true}
    />
    <div className="flex-1">
      <h3 className="font-display text-sm uppercase">Daily Earnings</h3>
      <p className="text-2xl font-bold font-mono">$342.50</p>
    </div>
  </div>
</Card>
```

## 8. Comparison Views - Consistent Small Sizing

### CrossPlatformComparison.tsx
```tsx
<div className="grid grid-cols-4 gap-2">
  {platforms.map((platform) => (
    <div key={platform.id} className="flex flex-col items-center gap-2 p-3 border rounded">
      <HexagonBadge
        icon={platform.icon}
        size="sm"
        gradientColors={platform.colors}
        animated={false}
      />
      <span className="text-xs font-display text-center">{platform.name}</span>
      <span className="text-sm font-mono font-bold">${platform.earnings}</span>
    </div>
  ))}
</div>
```

## 9. Feature Highlights - Extra Large

### Landing/Welcome Screen (if created)
```tsx
<div className="grid md:grid-cols-3 gap-8 py-12">
  {features.map((feature) => (
    <div key={feature.id} className="flex flex-col items-center gap-4 text-center">
      <HexagonBadge
        icon={feature.icon}
        size="xl"
        gradientColors={feature.colors}
        animated={true}
      />
      <h3 className="font-display text-lg">{feature.title}</h3>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
    </div>
  ))}
</div>
```

## 10. Achievement/Milestone Celebrations - 2XL

### Future: Achievement System
```tsx
<Dialog>
  <DialogContent className="text-center">
    <HexagonBadge
      icon={<Trophy weight="duotone" />}
      size="2xl"
      gradientColors={['oklch(0.80 0.16 95)', 'oklch(0.70 0.22 45)']}
      animated={true}
    />
    <DialogTitle className="font-display text-2xl mt-6">
      1000 Rides Completed!
    </DialogTitle>
    <DialogDescription>
      You've reached a major milestone
    </DialogDescription>
  </DialogContent>
</Dialog>
```

## Performance Tips

1. **Dense Lists**: Use `xs` or `sm` with `animated={false}`
   - NotificationHistory
   - CurrentBases list
   - Compact ride history

2. **Cards & Widgets**: Use `sm` or `md` with `animated={true}`
   - Platform cards
   - Dashboard metrics
   - Feature cards

3. **Hero Sections**: Use `xl` or `2xl` with `animated={true}`
   - Empty states
   - Onboarding screens
   - Achievement modals

4. **Responsive Pattern**:
```tsx
const size = isMobile ? 'sm' : isTablet ? 'md' : 'lg'
<HexagonBadge icon={icon} size={size} />
```

## Color Consistency

Always use the established gradient patterns:
- **Primary/Electric**: `['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']`
- **Success**: `['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)']`
- **Warning**: `['oklch(0.75 0.18 75)', 'oklch(0.85 0.16 85)']`
- **Alert**: `['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 35)']`
- **Platform-specific**: Match brand colors from existing implementations

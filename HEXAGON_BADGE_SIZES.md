# Hexagon Badge Size Variations Guide

## Available Sizes

The `HexagonBadge` component now supports 6 size variations to fit different UI contexts:

### Size Reference

| Size | Width | Height | Icon Size | Best Used For |
|------|-------|--------|-----------|---------------|
| `xs` | 28px | 32px | 14px | Inline text badges, compact lists, mini indicators |
| `sm` | 40px | 46px | 20px | Table cells, dense grids, mobile compact views |
| `md` | 50px | 58px | 24px | Default cards, standard list items, platform icons |
| `lg` | 60px | 69px | 28px | Feature cards, emphasis elements, section headers |
| `xl` | 80px | 92px | 36px | Hero sections, onboarding screens, modal headers |
| `2xl` | 100px | 115px | 48px | Landing pages, empty states, showcase elements |

## Usage Examples

### Extra Small (xs) - Inline Indicators
```tsx
<HexagonBadge 
  icon={<Check />} 
  size="xs"
  gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)']}
/>
```
**Use Cases:**
- Status indicators in dense tables
- Inline platform badges in text
- Mini achievement icons
- Compact notification badges

### Small (sm) - Compact Views
```tsx
<HexagonBadge 
  icon={<CarProfile />} 
  size="sm"
  gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
/>
```
**Use Cases:**
- Mobile list item icons
- Sidebar navigation icons
- Dense grid layouts
- Secondary action buttons

### Medium (md) - Default Standard
```tsx
<HexagonBadge 
  icon={<MapPin />} 
  size="md"
  gradientColors={['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 35)']}
/>
```
**Use Cases:**
- Platform cards (current implementation)
- Standard list items
- Dashboard widgets
- Tab icons (enhanced view)

### Large (lg) - Feature Emphasis
```tsx
<HexagonBadge 
  icon={<TrendUp />} 
  size="lg"
  gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)']}
/>
```
**Use Cases:**
- Feature highlight cards
- Section headers
- Category selectors
- Premium tier indicators

### Extra Large (xl) - Hero Elements
```tsx
<HexagonBadge 
  icon={<Rocket />} 
  size="xl"
  gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
  animated={true}
/>
```
**Use Cases:**
- Onboarding welcome screens
- Modal dialog headers
- Achievement showcases
- Tutorial highlights

### 2X Large (2xl) - Showcase Features
```tsx
<HexagonBadge 
  icon={<Trophy />} 
  size="2xl"
  gradientColors={['oklch(0.80 0.16 95)', 'oklch(0.70 0.22 45)']}
  animated={true}
/>
```
**Use Cases:**
- Landing page heroes
- Empty state illustrations
- Milestone celebrations
- Marketing showcase sections

## Responsive Patterns

### Mobile-First Sizing
```tsx
<div className="flex items-center gap-2">
  <HexagonBadge 
    icon={<CarProfile />} 
    size="sm"
    className="md:hidden"
  />
  <HexagonBadge 
    icon={<CarProfile />} 
    size="md"
    className="hidden md:block lg:hidden"
  />
  <HexagonBadge 
    icon={<CarProfile />} 
    size="lg"
    className="hidden lg:block"
  />
</div>
```

### Context-Adaptive Sizing
```tsx
{/* Compact list view */}
<div className="space-y-1">
  {platforms.map(platform => (
    <div className="flex items-center gap-2 p-2">
      <HexagonBadge icon={platform.icon} size="xs" />
      <span>{platform.name}</span>
    </div>
  ))}
</div>

{/* Grid card view */}
<div className="grid grid-cols-3 gap-4">
  {platforms.map(platform => (
    <Card className="p-4 flex flex-col items-center gap-2">
      <HexagonBadge icon={platform.icon} size="lg" />
      <span>{platform.name}</span>
    </Card>
  ))}
</div>
```

## Animation Guidelines

- **xs, sm**: Set `animated={false}` for performance in dense lists
- **md, lg**: Default animations work well
- **xl, 2xl**: Enhanced animations create impact on hero elements

## Color Gradient Examples by Context

### Platform Branding (Current Usage)
```tsx
// Uber
gradientColors={['oklch(0.15 0 0)', 'oklch(0.25 0 0)']}

// Lyft
gradientColors={['oklch(0.50 0.15 330)', 'oklch(0.60 0.18 340)']}

// DoorDash
gradientColors={['oklch(0.55 0.20 25)', 'oklch(0.65 0.22 30)']}
```

### Status Indicators
```tsx
// Success/Active
gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.75 0.18 155)']}

// Warning/Pending
gradientColors={['oklch(0.75 0.18 75)', 'oklch(0.85 0.16 85)']}

// Error/Inactive
gradientColors={['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 35)']}

// Info/Neutral
gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.68 0.27 330)']}
```

### Feature Categories
```tsx
// Earnings/Financial
gradientColors={['oklch(0.65 0.20 145)', 'oklch(0.80 0.16 95)']}

// Navigation/Location
gradientColors={['oklch(0.70 0.19 195)', 'oklch(0.72 0.17 180)']}

// Communication/Social
gradientColors={['oklch(0.68 0.27 330)', 'oklch(0.65 0.24 290)']}

// Compliance/Legal
gradientColors={['oklch(0.60 0.25 25)', 'oklch(0.70 0.22 45)']}
```

## Performance Considerations

1. **Large Lists**: Use `xs` or `sm` with `animated={false}`
2. **Hero Sections**: Use `xl` or `2xl` with full animations
3. **Mobile Views**: Prefer smaller sizes (xs, sm, md) for better tap targets
4. **Desktop Views**: Larger sizes (lg, xl) create visual hierarchy

## Accessibility

- All sizes maintain 1:1 aspect ratio for predictable layout
- Icon sizes scale proportionally for consistent visual weight
- Gradient combinations maintain WCAG contrast requirements
- Touch targets: Ensure parent containers meet 44x44px minimum for xs/sm sizes

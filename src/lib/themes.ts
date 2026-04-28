export interface Theme {
  name: string
  displayName: string
  description: string
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    success: string
    successForeground: string
    warning: string
    warningForeground: string
    border: string
    input: string
    ring: string
  }
}

export const themes: Theme[] = [
  {
    name: 'burgundy-taxi',
    displayName: 'NYC Burgundy',
    description: 'Deep burgundy with taxi yellow accents',
    colors: {
      background: 'oklch(0.22 0.12 25)',
      foreground: 'oklch(0.94 0.03 15)',
      card: 'oklch(0.30 0.13 22)',
      cardForeground: 'oklch(0.92 0.04 15)',
      popover: 'oklch(0.26 0.12 24)',
      popoverForeground: 'oklch(0.94 0.03 15)',
      primary: 'oklch(0.85 0.15 90)',
      primaryForeground: 'oklch(0.15 0.02 25)',
      secondary: 'oklch(0.38 0.12 22)',
      secondaryForeground: 'oklch(0.92 0.05 15)',
      muted: 'oklch(0.35 0.08 20)',
      mutedForeground: 'oklch(0.68 0.07 18)',
      accent: 'oklch(0.72 0.18 15)',
      accentForeground: 'oklch(0.12 0.02 25)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.96 0.02 15)',
      success: 'oklch(0.68 0.17 145)',
      successForeground: 'oklch(0.12 0.02 145)',
      warning: 'oklch(0.70 0.20 45)',
      warningForeground: 'oklch(0.12 0.02 25)',
      border: 'oklch(0.42 0.11 22)',
      input: 'oklch(0.36 0.11 24)',
      ring: 'oklch(0.85 0.15 90)',
    },
  },
  {
    name: 'midnight-yellow',
    displayName: 'Midnight Taxi',
    description: 'Deep midnight blue with electric yellow',
    colors: {
      background: 'oklch(0.18 0.08 250)',
      foreground: 'oklch(0.96 0.02 90)',
      card: 'oklch(0.24 0.09 250)',
      cardForeground: 'oklch(0.94 0.03 90)',
      popover: 'oklch(0.20 0.08 250)',
      popoverForeground: 'oklch(0.96 0.02 90)',
      primary: 'oklch(0.88 0.18 95)',
      primaryForeground: 'oklch(0.18 0.08 250)',
      secondary: 'oklch(0.32 0.10 250)',
      secondaryForeground: 'oklch(0.94 0.03 90)',
      muted: 'oklch(0.28 0.06 250)',
      mutedForeground: 'oklch(0.70 0.05 250)',
      accent: 'oklch(0.75 0.20 190)',
      accentForeground: 'oklch(0.18 0.08 250)',
      destructive: 'oklch(0.60 0.25 25)',
      destructiveForeground: 'oklch(0.96 0.02 90)',
      success: 'oklch(0.65 0.18 150)',
      successForeground: 'oklch(0.12 0.02 150)',
      warning: 'oklch(0.72 0.22 50)',
      warningForeground: 'oklch(0.12 0.02 50)',
      border: 'oklch(0.38 0.08 250)',
      input: 'oklch(0.32 0.08 250)',
      ring: 'oklch(0.88 0.18 95)',
    },
  },
  {
    name: 'emerald-city',
    displayName: 'Emerald Professional',
    description: 'Deep emerald green with gold accents',
    colors: {
      background: 'oklch(0.20 0.10 160)',
      foreground: 'oklch(0.95 0.03 120)',
      card: 'oklch(0.28 0.12 160)',
      cardForeground: 'oklch(0.93 0.04 120)',
      popover: 'oklch(0.24 0.11 160)',
      popoverForeground: 'oklch(0.95 0.03 120)',
      primary: 'oklch(0.80 0.16 80)',
      primaryForeground: 'oklch(0.15 0.02 160)',
      secondary: 'oklch(0.36 0.12 160)',
      secondaryForeground: 'oklch(0.93 0.04 120)',
      muted: 'oklch(0.32 0.08 160)',
      mutedForeground: 'oklch(0.68 0.07 160)',
      accent: 'oklch(0.70 0.18 140)',
      accentForeground: 'oklch(0.12 0.02 160)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.96 0.02 120)',
      success: 'oklch(0.65 0.18 150)',
      successForeground: 'oklch(0.12 0.02 150)',
      warning: 'oklch(0.75 0.20 60)',
      warningForeground: 'oklch(0.12 0.02 60)',
      border: 'oklch(0.40 0.10 160)',
      input: 'oklch(0.34 0.10 160)',
      ring: 'oklch(0.80 0.16 80)',
    },
  },
  {
    name: 'sunset-drive',
    displayName: 'Sunset Drive',
    description: 'Warm sunset oranges and purples',
    colors: {
      background: 'oklch(0.22 0.10 30)',
      foreground: 'oklch(0.96 0.02 50)',
      card: 'oklch(0.30 0.12 30)',
      cardForeground: 'oklch(0.94 0.03 50)',
      popover: 'oklch(0.26 0.11 30)',
      popoverForeground: 'oklch(0.96 0.02 50)',
      primary: 'oklch(0.75 0.22 40)',
      primaryForeground: 'oklch(0.15 0.02 30)',
      secondary: 'oklch(0.38 0.12 30)',
      secondaryForeground: 'oklch(0.94 0.03 50)',
      muted: 'oklch(0.34 0.08 30)',
      mutedForeground: 'oklch(0.68 0.07 30)',
      accent: 'oklch(0.65 0.20 300)',
      accentForeground: 'oklch(0.98 0.01 300)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.96 0.02 50)',
      success: 'oklch(0.68 0.17 145)',
      successForeground: 'oklch(0.12 0.02 145)',
      warning: 'oklch(0.78 0.22 50)',
      warningForeground: 'oklch(0.12 0.02 50)',
      border: 'oklch(0.42 0.10 30)',
      input: 'oklch(0.36 0.10 30)',
      ring: 'oklch(0.75 0.22 40)',
    },
  },
  {
    name: 'neon-night',
    displayName: 'Neon Night',
    description: 'Dark cyberpunk with neon cyan',
    colors: {
      background: 'oklch(0.15 0.05 280)',
      foreground: 'oklch(0.97 0.02 180)',
      card: 'oklch(0.22 0.06 280)',
      cardForeground: 'oklch(0.95 0.03 180)',
      popover: 'oklch(0.18 0.05 280)',
      popoverForeground: 'oklch(0.97 0.02 180)',
      primary: 'oklch(0.78 0.20 190)',
      primaryForeground: 'oklch(0.15 0.05 280)',
      secondary: 'oklch(0.30 0.07 280)',
      secondaryForeground: 'oklch(0.95 0.03 180)',
      muted: 'oklch(0.26 0.05 280)',
      mutedForeground: 'oklch(0.65 0.05 280)',
      accent: 'oklch(0.72 0.22 320)',
      accentForeground: 'oklch(0.98 0.01 320)',
      destructive: 'oklch(0.62 0.26 25)',
      destructiveForeground: 'oklch(0.97 0.02 180)',
      success: 'oklch(0.68 0.18 160)',
      successForeground: 'oklch(0.12 0.02 160)',
      warning: 'oklch(0.75 0.22 80)',
      warningForeground: 'oklch(0.12 0.02 80)',
      border: 'oklch(0.35 0.06 280)',
      input: 'oklch(0.28 0.06 280)',
      ring: 'oklch(0.78 0.20 190)',
    },
  },
  {
    name: 'ocean-breeze',
    displayName: 'Ocean Breeze',
    description: 'Cool ocean blues with coral accents',
    colors: {
      background: 'oklch(0.20 0.08 220)',
      foreground: 'oklch(0.96 0.02 200)',
      card: 'oklch(0.28 0.10 220)',
      cardForeground: 'oklch(0.94 0.03 200)',
      popover: 'oklch(0.24 0.09 220)',
      popoverForeground: 'oklch(0.96 0.02 200)',
      primary: 'oklch(0.70 0.18 200)',
      primaryForeground: 'oklch(0.98 0.01 200)',
      secondary: 'oklch(0.36 0.10 220)',
      secondaryForeground: 'oklch(0.94 0.03 200)',
      muted: 'oklch(0.32 0.07 220)',
      mutedForeground: 'oklch(0.68 0.06 220)',
      accent: 'oklch(0.72 0.20 20)',
      accentForeground: 'oklch(0.15 0.02 220)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.96 0.02 200)',
      success: 'oklch(0.68 0.17 145)',
      successForeground: 'oklch(0.12 0.02 145)',
      warning: 'oklch(0.70 0.20 45)',
      warningForeground: 'oklch(0.12 0.02 45)',
      border: 'oklch(0.40 0.08 220)',
      input: 'oklch(0.34 0.08 220)',
      ring: 'oklch(0.70 0.18 200)',
    },
  },
  {
    name: 'royal-purple',
    displayName: 'Royal Purple',
    description: 'Regal purple with gold highlights',
    colors: {
      background: 'oklch(0.18 0.10 290)',
      foreground: 'oklch(0.96 0.02 70)',
      card: 'oklch(0.26 0.12 290)',
      cardForeground: 'oklch(0.94 0.03 70)',
      popover: 'oklch(0.22 0.11 290)',
      popoverForeground: 'oklch(0.96 0.02 70)',
      primary: 'oklch(0.78 0.18 75)',
      primaryForeground: 'oklch(0.15 0.02 290)',
      secondary: 'oklch(0.34 0.12 290)',
      secondaryForeground: 'oklch(0.94 0.03 70)',
      muted: 'oklch(0.30 0.08 290)',
      mutedForeground: 'oklch(0.68 0.07 290)',
      accent: 'oklch(0.68 0.20 310)',
      accentForeground: 'oklch(0.98 0.01 310)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.96 0.02 70)',
      success: 'oklch(0.68 0.17 145)',
      successForeground: 'oklch(0.12 0.02 145)',
      warning: 'oklch(0.75 0.20 60)',
      warningForeground: 'oklch(0.12 0.02 60)',
      border: 'oklch(0.38 0.10 290)',
      input: 'oklch(0.32 0.10 290)',
      ring: 'oklch(0.78 0.18 75)',
    },
  },
  {
    name: 'forest-moss',
    displayName: 'Forest Moss',
    description: 'Natural green tones with earthy accents',
    colors: {
      background: 'oklch(0.22 0.08 140)',
      foreground: 'oklch(0.95 0.03 100)',
      card: 'oklch(0.30 0.10 140)',
      cardForeground: 'oklch(0.93 0.04 100)',
      popover: 'oklch(0.26 0.09 140)',
      popoverForeground: 'oklch(0.95 0.03 100)',
      primary: 'oklch(0.75 0.18 130)',
      primaryForeground: 'oklch(0.15 0.02 140)',
      secondary: 'oklch(0.38 0.10 140)',
      secondaryForeground: 'oklch(0.93 0.04 100)',
      muted: 'oklch(0.34 0.07 140)',
      mutedForeground: 'oklch(0.68 0.06 140)',
      accent: 'oklch(0.70 0.16 60)',
      accentForeground: 'oklch(0.12 0.02 140)',
      destructive: 'oklch(0.58 0.24 27)',
      destructiveForeground: 'oklch(0.95 0.03 100)',
      success: 'oklch(0.68 0.17 145)',
      successForeground: 'oklch(0.12 0.02 145)',
      warning: 'oklch(0.72 0.20 55)',
      warningForeground: 'oklch(0.12 0.02 55)',
      border: 'oklch(0.42 0.08 140)',
      input: 'oklch(0.36 0.08 140)',
      ring: 'oklch(0.75 0.18 130)',
    },
  },
]

export function applyTheme(theme: Theme) {
  const root = document.documentElement

  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVarName}`, value)
  })
}

export function getThemeByName(name: string): Theme | undefined {
  return themes.find((t) => t.name === name)
}

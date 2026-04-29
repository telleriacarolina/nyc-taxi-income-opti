export const PLATFORM_GRADIENTS: Record<string, [string, string]> = {
  uber: ['#000000', '#5F5F5F'],
  lyft: ['#FF00BF', '#FF4081'],
  via: ['#00A896', '#00D4AA'],
  curb: ['#FFD700', '#FFA500'],
  revel: ['#5D5FEF', '#8B8DFF'],
  juno: ['#4834D4', '#6C5CE7'],
  
  ubereats: ['#06C167', '#00E676'],
  doordash: ['#EB1700', '#FF6B6B'],
  grubhub: ['#F63440', '#FF6057'],
  postmates: ['#000000', '#FFB800'],
  instacart: ['#43B02A', '#76C945'],
  amazonflex: ['#FF9900', '#FFB84D'],
  relay: ['#4F46E5', '#6366F1'],
  gopuff: ['#00C2E8', '#00E5FF'],
  
  'amazon-flex': ['#FF9900', '#FFB84D'],
  'ups-pvd': ['#351C15', '#664B3D'],
  'ontrac-laser': ['#0066CC', '#4DA6FF'],
  
  mtm: ['#0066CC', '#4DA6FF'],
  logisticare: ['#FF6B35', '#FF8C5A'],
  ambulette: ['#7C3AED', '#8B5CF6'],
  accessaride: ['#003DA5', '#0066FF'],
  
  default: ['oklch(0.22 0.020 265)', 'oklch(0.70 0.19 195)']
}

export function getPlatformGradient(platformId: string): [string, string] | undefined {
  return PLATFORM_GRADIENTS[platformId]
}

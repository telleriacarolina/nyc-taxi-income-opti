import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowSquareOut, 
  MagnifyingGlass,
  IdentificationCard,
  Certificate,
  CarProfile,
  FileText,
  CalendarBlank,
  Gavel,
  Warning,
  CreditCard,
  Flask,
  GraduationCap,
  ClipboardText,
  Phone
} from '@phosphor-icons/react'

interface TLCResource {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon: any
  tags: string[]
  featured?: boolean
}

const tlcResources: TLCResource[] = [
  {
    id: 'lars',
    title: 'LARS - License Portal',
    description: 'Online licensing and renewal system for all TLC licenses',
    url: 'https://a856-ars.nyc.gov/licensing/HomePage',
    category: 'licensing',
    icon: IdentificationCard,
    tags: ['license', 'renewal', 'online', 'application'],
    featured: true
  },
  {
    id: 'license-status',
    title: 'Check License Status',
    description: 'Verify current status of your TLC driver or vehicle license',
    url: 'https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page',
    category: 'licensing',
    icon: ClipboardText,
    tags: ['license', 'status', 'verification'],
    featured: true
  },
  {
    id: 'driver-education',
    title: 'Driver Education',
    description: 'Required training courses and educational resources',
    url: 'https://www1.nyc.gov/site/tlc/drivers/driver-education.page',
    category: 'education',
    icon: GraduationCap,
    tags: ['training', 'courses', 'education', 'defensive driving']
  },
  {
    id: 'vehicle-inspections',
    title: 'Vehicle Inspections',
    description: 'Schedule and complete required TLC vehicle inspections',
    url: 'https://www1.nyc.gov/site/tlc/vehicles/inspections.page',
    category: 'inspections',
    icon: CarProfile,
    tags: ['inspection', 'vehicle', 'safety', 'dmv']
  },
  {
    id: 'scheduling',
    title: 'TLC Appointments',
    description: 'Book appointments for licensing, inspections, and services',
    url: 'https://www1.nyc.gov/site/tlc/about/contact-tlc.page',
    category: 'appointments',
    icon: CalendarBlank,
    tags: ['appointment', 'schedule', 'booking'],
    featured: true
  },
  {
    id: 'drug-testing',
    title: 'Drug Testing Information',
    description: 'Annual drug testing requirements and approved facilities',
    url: 'https://www1.nyc.gov/site/tlc/drivers/drug-testing.page',
    category: 'testing',
    icon: Flask,
    tags: ['drug test', 'annual', 'compliance', 'medical']
  },
  {
    id: 'forms',
    title: 'Official Forms',
    description: 'Download TLC forms, applications, and required documents',
    url: 'https://www1.nyc.gov/site/tlc/about/forms.page',
    category: 'renewals',
    icon: FileText,
    tags: ['forms', 'applications', 'documents', 'download']
  },
  {
    id: 'violations',
    title: 'Violations & Summons',
    description: 'View violations, pay fines, and schedule hearings',
    url: 'https://www1.nyc.gov/site/tlc/about/violations.page',
    category: 'violations',
    icon: Warning,
    tags: ['violations', 'summons', 'tickets', 'fines']
  },
  {
    id: 'hearings',
    title: 'TLC Hearings',
    description: 'Schedule and prepare for TLC administrative hearings',
    url: 'https://www1.nyc.gov/site/oath/hearings/tlc-hearings.page',
    category: 'hearings',
    icon: Gavel,
    tags: ['hearings', 'oath', 'appeals', 'legal']
  },
  {
    id: 'payments',
    title: 'Online Payments',
    description: 'Pay license fees, fines, and other TLC charges online',
    url: 'https://www1.nyc.gov/site/tlc/businesses/pay-online.page',
    category: 'payments',
    icon: CreditCard,
    tags: ['payments', 'fees', 'fines', 'online']
  },
  {
    id: 'license-renewals',
    title: 'License Renewals',
    description: 'Renew your TLC driver or vehicle license before expiration',
    url: 'https://www1.nyc.gov/site/tlc/drivers/driver-licenses-and-renewals.page',
    category: 'renewals',
    icon: Certificate,
    tags: ['renewal', 'license', 'expiration', 'driver'],
    featured: true
  },
  {
    id: 'contact',
    title: 'Contact TLC',
    description: '311, email, and office locations for TLC assistance',
    url: 'https://www.nyc.gov/site/tlc/about/contact-tlc.page',
    category: 'support',
    icon: Phone,
    tags: ['contact', 'support', '311', 'help']
  }
]

const categories = [
  { id: 'all', label: 'All Resources', icon: ClipboardText },
  { id: 'licensing', label: 'Licensing', icon: IdentificationCard },
  { id: 'renewals', label: 'Renewals', icon: Certificate },
  { id: 'inspections', label: 'Inspections', icon: CarProfile },
  { id: 'testing', label: 'Drug Testing', icon: Flask },
  { id: 'appointments', label: 'Appointments', icon: CalendarBlank },
  { id: 'hearings', label: 'Hearings', icon: Gavel },
  { id: 'violations', label: 'Violations', icon: Warning },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'support', label: 'Support', icon: Phone }
]

export function TLCResourceDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = tlcResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredResources = tlcResources.filter(r => r.featured)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-[clamp(0.95rem,2.8vw,1.15rem)]">
            Official TLC Resources
          </CardTitle>
          <CardDescription className="text-[clamp(0.75rem,2.4vw,0.875rem)]">
            Direct access to NYC TLC systems, forms, and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <MagnifyingGlass 
              size={18} 
              weight="bold" 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              placeholder="Search resources, forms, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-[clamp(0.75rem,2.4vw,0.875rem)]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon
              const count = category.id === 'all' 
                ? tlcResources.length 
                : tlcResources.filter(r => r.category === category.id).length
              
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-8 gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)]"
                >
                  <Icon size={14} weight="fill" />
                  <span className="truncate">{category.label}</span>
                  <Badge 
                    variant={selectedCategory === category.id ? 'secondary' : 'outline'}
                    className="ml-1 h-4 min-w-4 px-1 text-[10px]"
                  >
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedCategory === 'all' && searchQuery === '' && featuredResources.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)] flex items-center gap-2">
              <span>Quick Access</span>
              <Badge variant="secondary" className="text-[10px]">Most Used</Badge>
            </CardTitle>
            <CardDescription className="text-[clamp(0.7rem,2.2vw,0.8rem)]">
              Frequently accessed TLC systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredResources.map(resource => {
                const Icon = resource.icon
                return (
                  <Button
                    key={resource.id}
                    variant="outline"
                    onClick={() => window.open(resource.url, '_blank')}
                    className="h-auto p-4 justify-start items-start text-left hover:bg-primary/5 hover:border-primary/30"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <Icon size={20} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[clamp(0.8rem,2.5vw,0.95rem)] line-clamp-1">
                            {resource.title}
                          </h3>
                          <ArrowSquareOut size={16} weight="bold" className="text-primary flex-shrink-0" />
                        </div>
                        <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-2 leading-snug">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-[clamp(0.9rem,2.6vw,1.05rem)]">
            {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.label}
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredResources.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <MagnifyingGlass size={32} weight="duotone" className="mx-auto text-muted-foreground" />
              <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)]">
                No resources found matching your search
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredResources.map(resource => {
                const Icon = resource.icon
                return (
                  <Card key={resource.id} className="border-muted hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                          <Icon size={20} weight="fill" className="text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-[clamp(0.85rem,2.6vw,1rem)] line-clamp-1">
                              {resource.title}
                            </h3>
                            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.85rem)] line-clamp-2 leading-snug">
                              {resource.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {resource.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-[10px] h-5 px-1.5"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                            className="h-8 gap-1.5 text-[clamp(0.7rem,2.2vw,0.8rem)]"
                          >
                            <ArrowSquareOut size={14} weight="bold" />
                            Open in TLC Website
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-muted bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Phone size={18} weight="fill" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-semibold text-[clamp(0.8rem,2.5vw,0.95rem)]">
                Need Help?
              </h3>
              <p className="text-muted-foreground text-[clamp(0.7rem,2.2vw,0.8rem)] line-clamp-2 leading-snug">
                Call 311 or visit TLC's contact page for assistance with any TLC services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

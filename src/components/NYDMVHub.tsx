import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  IdentificationCard, 
  CarProfile, 
  FileText, 
  CreditCard, 
  Warning, 
  CurrencyDollar,
  CalendarBlank,
  MagnifyingGlass,
  ArrowSquareOut,
  Bell,
  ListBullets,
  MapPin,
  Clock,
  Plus,
  Trash,
  PencilSimple
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

interface DMVService {
  id: string
  name: string
  description: string
  category: string
  url: string
  icon: 'license' | 'registration' | 'title' | 'id' | 'violations' | 'payment' | 'appointment'
  featured?: boolean
}

interface DMVAppointment {
  id: string
  title: string
  type: string
  date: string
  time?: string
  location?: string
  confirmationNumber?: string
  serviceUrl?: string
  notes?: string
  createdAt: string
}

interface DMVReminder {
  id: string
  title: string
  type: string
  targetDate: string
  intervals: number[]
  enabled: boolean
  notificationMethods: string[]
  createdAt: string
}

const DMV_SERVICES: DMVService[] = [
  {
    id: 'license-renewal',
    name: 'Driver License Renewal',
    description: 'Renew your NY driver license online or find renewal requirements',
    category: 'Driver License',
    url: 'https://dmv.ny.gov/driver-license/renew-license',
    icon: 'license',
    featured: true
  },
  {
    id: 'license-replacement',
    name: 'Replace Lost/Stolen License',
    description: 'Order a replacement license if yours is lost, stolen, or damaged',
    category: 'Driver License',
    url: 'https://dmv.ny.gov/driver-license/replace-your-license',
    icon: 'license'
  },
  {
    id: 'license-status',
    name: 'Check License Status',
    description: 'Verify your driver license status and driving record',
    category: 'Driver License',
    url: 'https://dmv.ny.gov/driver-license/my-license-record-online',
    icon: 'license',
    featured: true
  },
  {
    id: 'address-change',
    name: 'Change Address',
    description: 'Update your address on file with NY DMV',
    category: 'Driver License',
    url: 'https://dmv.ny.gov/driver-license/change-your-address',
    icon: 'license',
    featured: true
  },
  {
    id: 'real-id',
    name: 'REAL ID Information',
    description: 'Learn about REAL ID requirements and application process',
    category: 'ID Services',
    url: 'https://dmv.ny.gov/driver-license/get-real-id',
    icon: 'id',
    featured: true
  },
  {
    id: 'enhanced-id',
    name: 'Enhanced ID',
    description: 'Apply for an Enhanced Driver License for border crossings',
    category: 'ID Services',
    url: 'https://dmv.ny.gov/driver-license/get-enhanced-driver-license',
    icon: 'id'
  },
  {
    id: 'registration-renewal',
    name: 'Vehicle Registration Renewal',
    description: 'Renew your vehicle registration online',
    category: 'Vehicle Registration',
    url: 'https://dmv.ny.gov/registration/renew-your-registration',
    icon: 'registration',
    featured: true
  },
  {
    id: 'registration-replacement',
    name: 'Replace Registration',
    description: 'Order a replacement registration document',
    category: 'Vehicle Registration',
    url: 'https://dmv.ny.gov/registration/replace-your-registration',
    icon: 'registration'
  },
  {
    id: 'registration-status',
    name: 'Check Registration Status',
    description: 'Verify your vehicle registration status',
    category: 'Vehicle Registration',
    url: 'https://dmv.ny.gov/registration/check-your-registration-status',
    icon: 'registration'
  },
  {
    id: 'title-transfer',
    name: 'Transfer Vehicle Title',
    description: 'Transfer a vehicle title when buying or selling',
    category: 'Titles',
    url: 'https://dmv.ny.gov/registration/transfer-ownership-and-acceptable-proofs-ownership',
    icon: 'title'
  },
  {
    id: 'title-replacement',
    name: 'Replace Vehicle Title',
    description: 'Get a duplicate title certificate',
    category: 'Titles',
    url: 'https://dmv.ny.gov/registration/get-duplicate-title-certificate',
    icon: 'title'
  },
  {
    id: 'traffic-violations',
    name: 'Traffic Violations & Tickets',
    description: 'View and pay traffic tickets online',
    category: 'Violations & Points',
    url: 'https://dmv.ny.gov/tickets',
    icon: 'violations'
  },
  {
    id: 'points-system',
    name: 'Point System & Record',
    description: 'Check your driving record points',
    category: 'Violations & Points',
    url: 'https://dmv.ny.gov/tickets/about-nys-driver-point-system',
    icon: 'violations'
  },
  {
    id: 'pay-tickets',
    name: 'Pay Traffic Tickets',
    description: 'Pay your traffic tickets and fines online',
    category: 'Payments',
    url: 'https://www.nycourts.gov/apps/roadinfo/',
    icon: 'payment'
  },
  {
    id: 'pay-fees',
    name: 'Pay DMV Fees',
    description: 'Pay DMV fees and surcharges',
    category: 'Payments',
    url: 'https://dmv.ny.gov/dmv-records-and-transactions-fees',
    icon: 'payment'
  },
  {
    id: 'dmv-appointments',
    name: 'Schedule DMV Appointment',
    description: 'Book an appointment at a DMV office for license, registration, or ID services',
    category: 'Appointments',
    url: 'https://dmv.ny.gov/offices/make-reservation-dmv-office',
    icon: 'appointment',
    featured: true
  },
  {
    id: 'find-office',
    name: 'Find DMV Office',
    description: 'Locate DMV offices near you and check current wait times',
    category: 'Appointments',
    url: 'https://dmv.ny.gov/offices',
    icon: 'appointment'
  },
  {
    id: 'road-test-appointment',
    name: 'Schedule Road Test',
    description: 'Book your driving skills test appointment',
    category: 'Appointments',
    url: 'https://dmv.ny.gov/schedule-road-test',
    icon: 'appointment'
  },
  {
    id: 'reschedule-appointment',
    name: 'Manage Existing Appointment',
    description: 'Reschedule or cancel your DMV appointment',
    category: 'Appointments',
    url: 'https://dmv.ny.gov/offices/make-reservation-dmv-office',
    icon: 'appointment'
  },
  {
    id: 'dmv-forms',
    name: 'DMV Forms',
    description: 'Download and print DMV forms',
    category: 'Driver License',
    url: 'https://dmv.ny.gov/forms',
    icon: 'license'
  },
  {
    id: 'inspection',
    name: 'Vehicle Inspection',
    description: 'Find inspection stations and requirements',
    category: 'Vehicle Registration',
    url: 'https://dmv.ny.gov/inspection/inspection-overview',
    icon: 'registration'
  },
  {
    id: 'insurance-info',
    name: 'Insurance Requirements',
    description: 'Learn about NY vehicle insurance requirements',
    category: 'Vehicle Registration',
    url: 'https://dmv.ny.gov/insurance',
    icon: 'registration'
  }
]

const CATEGORIES = [
  'All Services',
  'Driver License',
  'Vehicle Registration',
  'Titles',
  'ID Services',
  'Violations & Points',
  'Payments',
  'Appointments'
]

const APPOINTMENT_TYPES = [
  'License Service',
  'Registration Service',
  'Title Service',
  'ID Service',
  'Road Test',
  'Inspection',
  'Other'
]

const REMINDER_TYPES = [
  'Driver License Expiration',
  'Vehicle Registration Expiration',
  'Inspection Due',
  'Points Review',
  'Custom DMV Task'
]

const REMINDER_INTERVALS = [
  { value: 1, label: '1 day before' },
  { value: 3, label: '3 days before' },
  { value: 7, label: '1 week before' },
  { value: 14, label: '2 weeks before' },
  { value: 30, label: '1 month before' },
  { value: 60, label: '2 months before' },
  { value: 90, label: '3 months before' }
]

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'license':
      return <IdentificationCard size={20} weight="fill" className="text-primary" />
    case 'registration':
      return <CarProfile size={20} weight="fill" className="text-primary" />
    case 'title':
      return <FileText size={20} weight="fill" className="text-primary" />
    case 'id':
      return <CreditCard size={20} weight="fill" className="text-primary" />
    case 'violations':
      return <Warning size={20} weight="fill" className="text-primary" />
    case 'payment':
      return <CurrencyDollar size={20} weight="fill" className="text-primary" />
    case 'appointment':
      return <CalendarBlank size={20} weight="fill" className="text-primary" />
    default:
      return <FileText size={20} weight="fill" className="text-primary" />
  }
}

const getDaysUntil = (dateString: string): number => {
  const target = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function NYDMVHub() {
  const [activeTab, setActiveTab] = useState('services')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Services')
  const [appointments, setAppointments] = useKV<DMVAppointment[]>('dmv-appointments', [])
  const [reminders, setReminders] = useKV<DMVReminder[]>('dmv-reminders', [])
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<DMVAppointment | null>(null)
  const [editingReminder, setEditingReminder] = useState<DMVReminder | null>(null)

  const filteredServices = DMV_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredServices = DMV_SERVICES.filter(s => s.featured)

  const upcomingAppointments = (appointments || [])
    .filter(apt => getDaysUntil(apt.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastAppointments = (appointments || [])
    .filter(apt => getDaysUntil(apt.date) < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const activeReminders = (reminders || []).filter(r => r.enabled)

  const handleAddAppointment = (formData: Partial<DMVAppointment>) => {
    const newAppointment: DMVAppointment = {
      id: Date.now().toString(),
      title: formData.title || '',
      type: formData.type || 'Other',
      date: formData.date || '',
      time: formData.time,
      location: formData.location,
      confirmationNumber: formData.confirmationNumber,
      serviceUrl: formData.serviceUrl,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    }
    setAppointments(current => [...(current || []), newAppointment])
    setIsAddAppointmentOpen(false)
    toast.success('DMV appointment added')
  }

  const handleUpdateAppointment = (id: string, formData: Partial<DMVAppointment>) => {
    setAppointments(current => (current || []).map(apt =>
      apt.id === id ? { ...apt, ...formData } : apt
    ))
    setEditingAppointment(null)
    toast.success('DMV appointment updated')
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(current => (current || []).filter(apt => apt.id !== id))
    toast.success('DMV appointment deleted')
  }

  const handleAddReminder = (formData: Partial<DMVReminder>) => {
    const newReminder: DMVReminder = {
      id: Date.now().toString(),
      title: formData.title || '',
      type: formData.type || 'Custom DMV Task',
      targetDate: formData.targetDate || '',
      intervals: formData.intervals || [7, 30],
      enabled: true,
      notificationMethods: formData.notificationMethods || ['in-app'],
      createdAt: new Date().toISOString()
    }
    setReminders(current => [...(current || []), newReminder])
    setIsAddReminderOpen(false)
    toast.success('DMV reminder created')
  }

  const handleUpdateReminder = (id: string, updates: Partial<DMVReminder>) => {
    setReminders(current => (current || []).map(rem =>
      rem.id === id ? { ...rem, ...updates } : rem
    ))
    if (editingReminder && editingReminder.id === id) {
      setEditingReminder(null)
      toast.success('DMV reminder updated')
    }
  }

  const handleDeleteReminder = (id: string) => {
    setReminders(current => (current || []).filter(rem => rem.id !== id))
    toast.success('DMV reminder deleted')
  }

  const toggleReminder = (id: string, enabled: boolean) => {
    handleUpdateReminder(id, { enabled })
    toast.success(enabled ? 'Reminder enabled' : 'Reminder disabled')
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <IdentificationCard size={28} weight="fill" className="text-primary" />
                NY DMV Hub
              </CardTitle>
              <CardDescription>
                Manage driver license, vehicle registration, and DMV compliance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CalendarBlank size={20} weight="fill" className="text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                    <div className="text-sm text-muted-foreground">Upcoming Appointments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success/10 p-2">
                    <Bell size={20} weight="fill" className="text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{activeReminders.length}</div>
                    <div className="text-sm text-muted-foreground">Active Reminders</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-accent/10 p-2">
                    <ListBullets size={20} weight="fill" className="text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{DMV_SERVICES.length}</div>
                    <div className="text-sm text-muted-foreground">DMV Services</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Service Directory</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarBlank size={24} weight="fill" className="text-primary" />
                Schedule DMV Appointments
              </CardTitle>
              <CardDescription>
                Book appointments online to avoid long wait times at DMV offices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <a
                  href="https://dmv.ny.gov/offices/make-reservation-dmv-office"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="border-primary/30 transition-all hover:border-primary hover:shadow-lg">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-full bg-primary/15 p-2.5">
                        <CalendarBlank size={22} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold group-hover:text-primary">Schedule Office Visit</div>
                        <div className="text-sm text-muted-foreground">License, registration, ID services</div>
                      </div>
                      <ArrowSquareOut size={20} weight="bold" className="text-muted-foreground group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </a>
                <a
                  href="https://dmv.ny.gov/schedule-road-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="border-primary/30 transition-all hover:border-primary hover:shadow-lg">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-full bg-primary/15 p-2.5">
                        <CarProfile size={22} weight="fill" className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold group-hover:text-primary">Schedule Road Test</div>
                        <div className="text-sm text-muted-foreground">Book your driving skills test</div>
                      </div>
                      <ArrowSquareOut size={20} weight="bold" className="text-muted-foreground group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </a>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} weight="fill" className="mt-0.5 text-primary" />
                  <div>
                    <span className="font-medium">Find your nearest office:</span>{' '}
                    <a 
                      href="https://dmv.ny.gov/offices" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View all DMV locations
                      <ArrowSquareOut size={12} className="ml-1 inline" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Most commonly used DMV services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {featuredServices.map(service => (
                  <a
                    key={service.id}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="transition-all hover:border-primary hover:shadow-md">
                      <CardContent className="flex items-center gap-3 pt-4">
                        {getIcon(service.icon)}
                        <div className="flex-1">
                          <div className="font-medium group-hover:text-primary">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                        <ArrowSquareOut size={18} className="text-muted-foreground group-hover:text-primary" />
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All DMV Services</CardTitle>
              <CardDescription>Browse and search all available DMV portals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredServices.map(service => (
                    <a
                      key={service.id}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="transition-all hover:border-primary hover:shadow-sm">
                        <CardContent className="flex items-start gap-3 p-4">
                          {getIcon(service.icon)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium group-hover:text-primary">{service.name}</div>
                              <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{service.description}</div>
                          </div>
                          <ArrowSquareOut size={16} className="text-muted-foreground group-hover:text-primary" />
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                  {filteredServices.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      No services found matching your search
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DMV Appointments</CardTitle>
                  <CardDescription>Track your DMV appointment schedule</CardDescription>
                </div>
                <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={18} weight="bold" />
                      Add Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add DMV Appointment</DialogTitle>
                      <DialogDescription>
                        Track appointments scheduled through official DMV portals
                      </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                      <div className="mb-2 font-medium">Need to schedule an appointment?</div>
                      <div className="space-y-2">
                        <a
                          href="https://dmv.ny.gov/offices/make-reservation-dmv-office"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <CalendarBlank size={16} weight="fill" />
                          Schedule Office Visit (License, Registration, ID)
                          <ArrowSquareOut size={14} />
                        </a>
                        <a
                          href="https://dmv.ny.gov/schedule-road-test"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <CarProfile size={16} weight="fill" />
                          Schedule Road Test
                          <ArrowSquareOut size={14} />
                        </a>
                      </div>
                    </div>
                    <AppointmentForm onSubmit={handleAddAppointment} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Upcoming</h3>
                  {upcomingAppointments.map(apt => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onEdit={setEditingAppointment}
                      onDelete={handleDeleteAppointment}
                    />
                  ))}
                </div>
              )}
              
              {pastAppointments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-muted-foreground">Past</h3>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {pastAppointments.map(apt => (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          onEdit={setEditingAppointment}
                          onDelete={handleDeleteAppointment}
                          isPast
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {appointments && appointments.length === 0 && (
                <div className="py-12 text-center">
                  <CalendarBlank size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No DMV appointments tracked yet</p>
                  <p className="text-sm text-muted-foreground">Add appointments after scheduling through DMV portals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {editingAppointment && (
            <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit DMV Appointment</DialogTitle>
                </DialogHeader>
                <AppointmentForm
                  appointment={editingAppointment}
                  onSubmit={(data) => handleUpdateAppointment(editingAppointment.id, data)}
                />
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DMV Reminders</CardTitle>
                  <CardDescription>Set alerts for license and registration renewals</CardDescription>
                </div>
                <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={18} weight="bold" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create DMV Reminder</DialogTitle>
                      <DialogDescription>
                        Get notified before credentials expire
                      </DialogDescription>
                    </DialogHeader>
                    <ReminderForm onSubmit={handleAddReminder} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {reminders && reminders.map(reminder => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onToggle={toggleReminder}
                      onEdit={setEditingReminder}
                      onDelete={handleDeleteReminder}
                    />
                  ))}
                  {reminders && reminders.length === 0 && (
                    <div className="py-12 text-center">
                      <Bell size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No DMV reminders set</p>
                      <p className="text-sm text-muted-foreground">Create reminders for license and registration renewals</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {editingReminder && (
            <Dialog open={!!editingReminder} onOpenChange={() => setEditingReminder(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit DMV Reminder</DialogTitle>
                </DialogHeader>
                <ReminderForm
                  reminder={editingReminder}
                  onSubmit={(data) => handleUpdateReminder(editingReminder.id, data)}
                />
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentCard({ 
  appointment, 
  onEdit, 
  onDelete, 
  isPast = false 
}: { 
  appointment: DMVAppointment
  onEdit: (apt: DMVAppointment) => void
  onDelete: (id: string) => void
  isPast?: boolean
}) {
  const daysUntil = getDaysUntil(appointment.date)
  const dateObj = new Date(appointment.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Card className={isPast ? 'opacity-60' : ''}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="rounded-full bg-primary/10 p-2">
          <CalendarBlank size={20} weight="fill" className="text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{appointment.title}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{appointment.type}</Badge>
                {appointment.time && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {appointment.time}
                  </span>
                )}
              </div>
            </div>
            {!isPast && daysUntil >= 0 && (
              <Badge variant={daysUntil <= 7 ? 'default' : 'secondary'}>
                {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarBlank size={14} />
              {formattedDate}
            </div>
            {appointment.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                {appointment.location}
              </div>
            )}
            {appointment.confirmationNumber && (
              <div className="text-muted-foreground">
                Confirmation: <span className="font-mono">{appointment.confirmationNumber}</span>
              </div>
            )}
            {appointment.serviceUrl && (
              <a
                href={appointment.serviceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                View service
                <ArrowSquareOut size={14} />
              </a>
            )}
            {appointment.notes && (
              <p className="text-muted-foreground">{appointment.notes}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(appointment)}>
              <PencilSimple size={14} />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(appointment.id)}>
              <Trash size={14} />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ReminderCard({
  reminder,
  onToggle,
  onEdit,
  onDelete
}: {
  reminder: DMVReminder
  onToggle: (id: string, enabled: boolean) => void
  onEdit: (rem: DMVReminder) => void
  onDelete: (id: string) => void
}) {
  const daysUntil = getDaysUntil(reminder.targetDate)
  const dateObj = new Date(reminder.targetDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const nextAlert = reminder.intervals.sort((a, b) => b - a).find(interval => daysUntil <= interval)

  return (
    <Card className={!reminder.enabled ? 'opacity-60' : ''}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="rounded-full bg-success/10 p-2">
          <Bell size={20} weight="fill" className="text-success" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{reminder.title}</div>
              <Badge variant="secondary" className="text-xs">{reminder.type}</Badge>
            </div>
            <Switch
              checked={reminder.enabled}
              onCheckedChange={(checked) => onToggle(reminder.id, checked)}
            />
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarBlank size={14} />
              Target: {formattedDate}
            </div>
            {daysUntil >= 0 && (
              <div className="text-muted-foreground">
                {daysUntil === 0 ? 'Due today' : `${daysUntil} days remaining`}
              </div>
            )}
            {daysUntil < 0 && (
              <div className="text-destructive">
                Overdue by {Math.abs(daysUntil)} days
              </div>
            )}
            {nextAlert && reminder.enabled && (
              <div className="text-success">
                Next alert: {nextAlert} days before
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {reminder.intervals.sort((a, b) => a - b).map(interval => (
                <Badge key={interval} variant="outline" className="text-xs">
                  {interval}d
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(reminder)}>
              <PencilSimple size={14} />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(reminder.id)}>
              <Trash size={14} />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AppointmentForm({ 
  appointment, 
  onSubmit 
}: { 
  appointment?: DMVAppointment
  onSubmit: (data: Partial<DMVAppointment>) => void 
}) {
  const [formData, setFormData] = useState<Partial<DMVAppointment>>(
    appointment || {
      title: '',
      type: 'Other',
      date: '',
      time: '',
      location: '',
      confirmationNumber: '',
      serviceUrl: '',
      notes: ''
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.date) {
      toast.error('Title and date are required')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apt-title">Title *</Label>
        <Input
          id="apt-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Driver License Renewal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger id="apt-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPOINTMENT_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="apt-date">Date *</Label>
          <Input
            id="apt-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt-time">Time</Label>
          <Input
            id="apt-time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-location">Location</Label>
        <Input
          id="apt-location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="DMV office location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-confirmation">Confirmation Number</Label>
        <Input
          id="apt-confirmation"
          value={formData.confirmationNumber}
          onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
          placeholder="e.g., APT-123456"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-url">Related DMV Service URL</Label>
        <Input
          id="apt-url"
          type="url"
          value={formData.serviceUrl}
          onChange={(e) => setFormData({ ...formData, serviceUrl: e.target.value })}
          placeholder="https://dmv.ny.gov/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-notes">Notes</Label>
        <Textarea
          id="apt-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {appointment ? 'Update' : 'Add'} Appointment
      </Button>
    </form>
  )
}

function ReminderForm({
  reminder,
  onSubmit
}: {
  reminder?: DMVReminder
  onSubmit: (data: Partial<DMVReminder>) => void
}) {
  const [formData, setFormData] = useState<Partial<DMVReminder>>(
    reminder || {
      title: '',
      type: 'Custom DMV Task',
      targetDate: '',
      intervals: [7, 30],
      notificationMethods: ['in-app']
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.targetDate) {
      toast.error('Title and target date are required')
      return
    }
    if (!formData.intervals || formData.intervals.length === 0) {
      toast.error('Select at least one reminder interval')
      return
    }
    onSubmit(formData)
  }

  const toggleInterval = (value: number) => {
    const current = formData.intervals || []
    if (current.includes(value)) {
      setFormData({ ...formData, intervals: current.filter(i => i !== value) })
    } else {
      setFormData({ ...formData, intervals: [...current, value] })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rem-title">Title *</Label>
        <Input
          id="rem-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Driver License Expiration"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rem-type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger id="rem-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REMINDER_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rem-date">Target Date *</Label>
        <Input
          id="rem-date"
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Reminder Intervals *</Label>
        <div className="space-y-2">
          {REMINDER_INTERVALS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={`interval-${value}`}
                checked={formData.intervals?.includes(value)}
                onCheckedChange={() => toggleInterval(value)}
              />
              <Label htmlFor={`interval-${value}`} className="cursor-pointer font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {reminder ? 'Update' : 'Create'} Reminder
      </Button>
    </form>
  )
}

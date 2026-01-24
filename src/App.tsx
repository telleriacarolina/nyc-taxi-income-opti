import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LicenseManager } from '@/components/LicenseManager'
import { EarningsOptimizer } from '@/components/EarningsOptimizer'
import { RideShareApps } from '@/components/RideShareApps'
import { RideComparison } from '@/components/RideComparison'
import { TripCalculator } from '@/components/TripCalculator'
import { Chatroom } from '@/components/Chatroom'
import { AIAssistant } from '@/components/AIAssistant'
import { CurrentLocationRouter } from '@/components/CurrentLocationRouter'
import { LocationSettings } from '@/components/LocationSettings'
import { DeliveryPlatforms } from '@/components/DeliveryPlatforms'
import { PackageDeliveryWork } from '@/components/PackageDeliveryWork'
import { ContactTLC } from '@/components/ContactTLC'
import { NYCTLCHub } from '@/components/NYCTLCHub'
import { NYDMVHub } from '@/components/NYDMVHub'
import { IdentificationCard, ChartBar, CarProfile, MapTrifold, Calculator, ChatCircleDots, Gear, Phone, Buildings, CarSimple } from '@phosphor-icons/react'
import { Toaster } from 'sonner'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'license')

  return (
    <>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-3xl" />
          <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-gradient-to-br from-success/20 via-accent/10 to-transparent blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gradient-to-br from-warning/20 via-secondary/10 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="rounded-2xl border bg-card/80 shadow-xl ring-1 ring-border/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur p-5 md:p-6">
            <header className="mb-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="px-2.5 py-1 rounded-full border bg-muted/80 text-foreground/80">Live NYC Ops</span>
                <span className="px-2.5 py-1 rounded-full border bg-primary/10 text-primary">Driver Success</span>
                <span className="px-2.5 py-1 rounded-full border bg-success/10 text-success">Compliance Ready</span>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold tracking-tight leading-tight text-[clamp(1.35rem,3vw,1.7rem)]">
                  TLC Driver Hub
                </h1>
                <p className="text-muted-foreground text-[clamp(0.8rem,2.4vw,0.95rem)]">
                  Smart compliance, earnings coaching, and daily routing in one place.
                </p>
              </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-10 max-w-6xl h-10 rounded-lg border bg-card/70 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur">
              <TabsTrigger value="license" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <IdentificationCard size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">License</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <ChartBar size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="rides" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <MapTrifold size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Rides</span>
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <CarProfile size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <Calculator size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Calc</span>
              </TabsTrigger>
              <TabsTrigger value="chatroom" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <ChatCircleDots size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="nyctlc" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <Buildings size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">NYC TLC</span>
              </TabsTrigger>
              <TabsTrigger value="dmv" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <CarSimple size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">DMV</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <Phone size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 text-[clamp(0.65rem,2vw,0.75rem)] px-2">
                <Gear size={16} weight="fill" className="flex-shrink-0" />
                <span className="truncate">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="license" className="space-y-4">
              <LicenseManager />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <EarningsOptimizer />
            </TabsContent>

            <TabsContent value="rides" className="space-y-4">
              <CurrentLocationRouter />
              <RideComparison />
            </TabsContent>

            <TabsContent value="apps" className="space-y-4">
              <Tabs defaultValue="rideshare" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="rideshare">Rideshare</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="rideshare" className="space-y-4">
                  <RideShareApps />
                </TabsContent>
                
                <TabsContent value="delivery" className="space-y-4">
                  <DeliveryPlatforms />
                </TabsContent>
                
                <TabsContent value="packages" className="space-y-4">
                  <PackageDeliveryWork />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <TripCalculator />
            </TabsContent>
            <TabsContent value="chatroom" className="space-y-4">
              <Chatroom />
            </TabsContent>
            <TabsContent value="nyctlc" className="space-y-4">
              <NYCTLCHub />
            </TabsContent>
            <TabsContent value="dmv" className="space-y-4">
              <NYDMVHub />
            </TabsContent>
            <TabsContent value="contact" className="space-y-4">
              <ContactTLC />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <LocationSettings />
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>

      <AIAssistant />
      <Toaster position="top-center" />
    </>
  )
}

export default App
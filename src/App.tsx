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
import { NotificationPermissions } from '@/components/NotificationPermissions'
import { NotificationHistory } from '@/components/NotificationHistory'
import { PrivacyDataManagement } from '@/components/PrivacyDataManagement'
import { ThemeSelector } from '@/components/ThemeSelector'
import { IdentificationCard, ChartBar, CarProfile, MapTrifold, Calculator, ChatCircleDots, Gear, Phone, Buildings, CarSimple } from '@phosphor-icons/react'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { initNotificationService } from '@/lib/notificationService'
import { applyTheme, getThemeByName } from '@/lib/themes'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'license')
  const [selectedTheme] = useKV<string>('app-theme', 'burgundy-taxi')

  useEffect(() => {
    initNotificationService()
  }, [])

  useEffect(() => {
    const theme = getThemeByName(selectedTheme || 'burgundy-taxi')
    if (theme) {
      applyTheme(theme)
    }
  }, [selectedTheme])

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="relative max-w-7xl mx-auto">
          <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm">
                  TLC
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-sm md:text-base leading-none tracking-tight">
                    NYC Driver Hub
                  </h1>
                  <p className="text-[11px] text-muted-foreground hidden md:block">
                    Compliance & Earnings Optimizer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-medium border border-success/20">
                    Active
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                    Live
                  </span>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </header>

          <div className="px-4 py-5 md:px-6 md:py-6">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm p-4 md:p-6">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 h-auto md:h-9 rounded-xl border border-border/50 bg-muted/40 p-1 gap-0.5">
              <TabsTrigger value="license" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <IdentificationCard size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">License</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ChartBar size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="rides" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <MapTrifold size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Rides</span>
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <CarProfile size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Calculator size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="chatroom" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ChatCircleDots size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="nyctlc" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Buildings size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">TLC</span>
              </TabsTrigger>
              <TabsTrigger value="dmv" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <CarSimple size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">DMV</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Phone size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 text-xs px-2 py-2 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Gear size={16} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs">Settings</span>
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
              <PrivacyDataManagement />
              <NotificationPermissions />
              <NotificationHistory />
              <LocationSettings />
            </TabsContent>
          </Tabs>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant />
      <Toaster position="top-center" />
    </>
  )
}

export default App
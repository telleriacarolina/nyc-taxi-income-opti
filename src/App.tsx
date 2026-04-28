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
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-2xl supports-[backdrop-filter]:backdrop-blur-2xl shadow-sm">
            <div className="flex h-16 items-center justify-between px-6 md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-base shadow-lg shadow-primary/25">
                  TLC
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-base md:text-lg leading-none tracking-tight text-foreground">
                    NYC Driver Hub
                  </h1>
                  <p className="text-xs text-muted-foreground hidden md:block mt-0.5">
                    Compliance & Earnings Optimizer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-full bg-success/10 text-success font-semibold border border-success/20">
                    Active
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    Live
                  </span>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </header>

          <div className="px-6 py-6 md:px-8 md:py-8">
            <div className="rounded-3xl border border-border/40 bg-card shadow-lg shadow-black/5 p-6 md:p-8">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 h-auto md:h-11 rounded-2xl border border-border/30 bg-muted/30 p-1.5 gap-1">
              <TabsTrigger value="license" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <IdentificationCard size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">License</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <ChartBar size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="rides" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <MapTrifold size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Rides</span>
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <CarProfile size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <Calculator size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="chatroom" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <ChatCircleDots size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="nyctlc" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <Buildings size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">TLC</span>
              </TabsTrigger>
              <TabsTrigger value="dmv" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <CarSimple size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">DMV</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <Phone size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all">
                <Gear size={18} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[11px] md:text-xs font-medium">Settings</span>
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
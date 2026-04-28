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
import { motion, AnimatePresence } from 'framer-motion'

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
          <header className="sticky top-0 z-50 w-full border-b-2 border-primary/30 bg-card/90 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex h-20 items-center justify-between px-6 md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground font-display font-black text-xl shadow-lg border-2 border-primary/50 border-glow">
                  TLC
                </div>
                <div className="flex flex-col">
                  <h1 className="font-display font-bold text-xl md:text-2xl leading-none tracking-widest text-foreground text-glow">
                    NYC DRIVER HUB
                  </h1>
                  <p className="text-xs text-primary font-bold hidden md:block mt-1 tracking-wider uppercase">
                    Performance Dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-xs font-bold">
                  <span className="px-3 py-2 rounded-md bg-success/20 text-success font-display uppercase tracking-wider border border-success/40 shadow-[0_0_10px_rgba(0,255,100,0.3)]">
                    Active
                  </span>
                  <span className="px-3 py-2 rounded-md bg-primary/20 text-primary font-display uppercase tracking-wider border border-primary/40 shadow-[0_0_10px_rgba(0,200,255,0.3)]">
                    Live
                  </span>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">
            <div className="rounded-lg border-2 border-primary/20 bg-card shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(0,200,255,0.15)] p-4 md:p-8 card-scan">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 h-auto md:h-12 rounded-lg border-2 border-border bg-background/50 p-1.5 gap-1">
              <TabsTrigger value="license" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <IdentificationCard size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">License</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <ChartBar size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="rides" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <MapTrifold size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Rides</span>
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <CarProfile size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <Calculator size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Calc</span>
              </TabsTrigger>
              <TabsTrigger value="chatroom" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <ChatCircleDots size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="nyctlc" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <Buildings size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">TLC</span>
              </TabsTrigger>
              <TabsTrigger value="dmv" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <CarSimple size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">DMV</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <Phone size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 text-xs px-3 py-2.5 md:py-0 flex-col md:flex-row h-auto md:h-auto rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_15px_rgba(0,200,255,0.5)] transition-all font-bold uppercase tracking-wider spring-interactive">
                <Gear size={20} weight="duotone" className="flex-shrink-0" />
                <span className="truncate text-[10px] md:text-xs font-display">Settings</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="license" className="space-y-4" key="license">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <LicenseManager />
                </motion.div>
              </TabsContent>

              <TabsContent value="earnings" className="space-y-4" key="earnings">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <EarningsOptimizer />
                </motion.div>
              </TabsContent>

              <TabsContent value="rides" className="space-y-4" key="rides">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <CurrentLocationRouter />
                  <RideComparison />
                </motion.div>
              </TabsContent>

              <TabsContent value="apps" className="space-y-4" key="apps">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Tabs defaultValue="rideshare" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-background/50 border-2 border-border">
                      <TabsTrigger value="rideshare" className="font-display uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Rideshare</TabsTrigger>
                      <TabsTrigger value="delivery" className="font-display uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Delivery</TabsTrigger>
                      <TabsTrigger value="packages" className="font-display uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Packages</TabsTrigger>
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
                </motion.div>
              </TabsContent>

              <TabsContent value="calculator" className="space-y-4" key="calculator">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <TripCalculator />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="chatroom" className="space-y-4" key="chatroom">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Chatroom />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="nyctlc" className="space-y-4" key="nyctlc">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <NYCTLCHub />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="dmv" className="space-y-4" key="dmv">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <NYDMVHub />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4" key="contact">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ContactTLC />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4" key="settings">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <PrivacyDataManagement />
                  <NotificationPermissions />
                  <NotificationHistory />
                  <LocationSettings />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
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
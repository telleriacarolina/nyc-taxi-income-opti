import { useState } from 'react'
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
import { IdentificationCard, ChartBar, CarProfile, MapTrifold, Calculator, ChatCircleDots } from '@phosphor-icons/react'
import { Toaster } from 'sonner'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'license')

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <header className="mb-6">
            <h1 className="font-bold tracking-tight leading-tight mb-1 text-[clamp(1.25rem,3vw,1.5rem)]">
              TLC Driver Hub
            </h1>
            <p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-1">
              Compliance & earnings tracking
            </p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 max-w-5xl h-9">
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
              <RideShareApps />
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <TripCalculator />
            </TabsContent>

            <TabsContent value="chatroom" className="space-y-4">
              <Chatroom />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AIAssistant />
      <Toaster position="top-center" />
    </>
  )
}

export default App
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LicenseManager } from '@/components/LicenseManager'
import { EarningsOptimizer } from '@/components/EarningsOptimizer'
import { RideShareApps } from '@/components/RideShareApps'
import { RideComparison } from '@/components/RideComparison'
import { TripCalculator } from '@/components/TripCalculator'
import { IdentificationCard, ChartBar, CarProfile, MapTrifold, Calculator } from '@phosphor-icons/react'
import { Toaster } from 'sonner'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'license')

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight leading-tight mb-1">
              TLC Driver Hub
            </h1>
            <p className="text-muted-foreground text-sm">
              Compliance & earnings tracking
            </p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 max-w-4xl h-9">
              <TabsTrigger value="license" className="gap-1.5 text-xs">
                <IdentificationCard size={16} weight="fill" />
                License
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-1.5 text-xs">
                <ChartBar size={16} weight="fill" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="rides" className="gap-1.5 text-xs">
                <MapTrifold size={16} weight="fill" />
                Rides
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-1.5 text-xs">
                <CarProfile size={16} weight="fill" />
                Apps
              </TabsTrigger>
              <TabsTrigger value="calculator" className="gap-1.5 text-xs">
                <Calculator size={16} weight="fill" />
                Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="license" className="space-y-4">
              <LicenseManager />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <EarningsOptimizer />
            </TabsContent>

            <TabsContent value="rides" className="space-y-4">
              <RideComparison />
            </TabsContent>

            <TabsContent value="apps" className="space-y-4">
              <RideShareApps />
            </TabsContent>

            <TabsContent value="calculator" className="space-y-4">
              <TripCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  )
}

export default App
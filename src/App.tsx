import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LicenseManager } from '@/components/LicenseManager'
import { EarningsOptimizer } from '@/components/EarningsOptimizer'
import { IdentificationCard, ChartBar } from '@phosphor-icons/react'
import { Toaster } from 'sonner'

function App() {
  const [activeTab, setActiveTab] = useKV<string>('active-tab', 'license')

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8 md:px-8 md:py-12">
          <header className="mb-8">
            <h1 className="text-[32px] font-bold tracking-tight leading-tight mb-2">
              TLC Driver Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay compliant and optimize your NYC TLC earnings
            </p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="license" className="gap-2">
                <IdentificationCard size={20} weight="fill" />
                License Manager
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2">
                <ChartBar size={20} weight="fill" />
                Earnings Optimizer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="license" className="space-y-6">
              <LicenseManager />
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              <EarningsOptimizer />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  )
}

export default App
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Brain, PaperPlaneRight, Sparkle, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shifts] = useKV<any[]>('driver-shifts', [])
  const [rides] = useKV<any[]>('driver-rides', [])
  const [license] = useKV<any>('driver-license', null)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const context = {
        shiftsCount: shifts?.length || 0,
        ridesCount: rides?.length || 0,
        totalEarnings: shifts?.reduce((sum, s) => sum + (s.earnings || 0), 0) || 0,
        platforms: [...new Set(shifts?.map(s => s.platform) || [])],
        hasLicense: !!license,
        licenseExpiry: license?.expiryDate,
        startLocations: [...new Set(shifts?.map(s => s.startLocation).filter(Boolean) || [])]
      }

      const hvfhApiUrl = 'https://data.cityofnewyork.us/resource/8wbx-tsch.json'
      const baseAggregateUrl = 'https://data.cityofnewyork.us/resource/2v9c-2k7f.json'
      
      const currentDate = new Date()
      const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1)
      const dateFilter = threeMonthsAgo.toISOString().split('T')[0]

      let hvfhData: any[] = []
      let baseAggregateData: any[] = []

      try {
        const hvfhParams = new URLSearchParams({
          '$limit': '3000',
          '$where': `pickup_datetime >= '${dateFilter}'`,
          '$select': 'hvfhs_license_num,PULocationID,driver_pay,tips,pickup_datetime',
          '$order': 'driver_pay DESC'
        })
        const hvfhResponse = await fetch(`${hvfhApiUrl}?${hvfhParams}`)
        if (hvfhResponse.ok) {
          hvfhData = await hvfhResponse.json()
        }
      } catch (error) {
        console.warn('HVFH data fetch failed:', error)
      }

      try {
        const baseParams = new URLSearchParams({
          '$limit': '300',
          '$where': `month >= '${dateFilter}'`,
          '$select': 'base_number,base_name,total_dispatched_trips,unique_dispatched_drivers',
          '$order': 'month DESC'
        })
        const baseResponse = await fetch(`${baseAggregateUrl}?${baseParams}`)
        if (baseResponse.ok) {
          baseAggregateData = await baseResponse.json()
        }
      } catch (error) {
        console.warn('Base aggregate data fetch failed:', error)
      }

      let marketIntel = ''

      if (hvfhData.length > 0) {
        const avgDriverPay = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.driver_pay) || 0), 0) / hvfhData.length
        const avgTips = hvfhData.reduce((sum: number, trip: any) => 
          sum + (parseFloat(trip.tips) || 0), 0) / hvfhData.length

        marketIntel += `\nREAL TLC DATABASE STATS (Last 3 Months):\n`
        marketIntel += `- Market avg driver pay: $${avgDriverPay.toFixed(2)}/trip\n`
        marketIntel += `- Market avg tips: $${avgTips.toFixed(2)}/trip\n`
        marketIntel += `- Data from ${hvfhData.length} recent trips\n`
      }

      if (baseAggregateData.length > 0) {
        const platformMap: Record<string, string[]> = {
          'Uber': ['B02764', 'B02617', 'B02598', 'B02682', 'B02765'],
          'Lyft': ['B02510', 'B02844'],
          'Via': ['B03136', 'B02800'],
          'Juno': ['B02914', 'B02907', 'B02835', 'B02864']
        }

        const platformStats: Record<string, { trips: number, drivers: number }> = {}
        
        baseAggregateData.forEach((record: any) => {
          for (const [platform, bases] of Object.entries(platformMap)) {
            if (bases.includes(record.base_number)) {
              if (!platformStats[platform]) {
                platformStats[platform] = { trips: 0, drivers: 0 }
              }
              platformStats[platform].trips += parseInt(record.total_dispatched_trips || 0)
              platformStats[platform].drivers += parseInt(record.unique_dispatched_drivers || 0)
            }
          }
        })

        marketIntel += `\nPLATFORM PERFORMANCE (TLC Database):\n`
        for (const [platform, stats] of Object.entries(platformStats)) {
          const tripsPerDriver = stats.drivers > 0 ? stats.trips / stats.drivers : 0
          marketIntel += `- ${platform}: ${tripsPerDriver.toFixed(1)} trips/driver avg\n`
        }
      }

      const prompt = spark.llmPrompt`You are an AI assistant for NYC TLC drivers helping them optimize their rideshare business using REAL NYC TLC DATABASE INTELLIGENCE.

${marketIntel}

You have access to LIVE NYC TLC Open Data APIs:
- HVFH Trip Records API: Real trip-level data with driver_pay, tips, pickup zones (https://data.cityofnewyork.us/resource/8wbx-tsch.json)
- FHV Base Aggregate API: Platform statistics, trips per driver (https://data.cityofnewyork.us/resource/2v9c-2k7f.json)
- NYC DOT Real-Time Feeds: Traffic speeds, construction alerts, events

Context about this driver:
- Total shifts logged: ${context.shiftsCount}
- Total rides logged: ${context.ridesCount}
- Total earnings: $${context.totalEarnings.toFixed(2)}
- Platforms used: ${context.platforms.join(', ') || 'None'}
- License status: ${context.hasLicense ? `Active until ${context.licenseExpiry}` : 'Not set'}
- Start locations used: ${context.startLocations.length > 0 ? context.startLocations.join(', ') : 'Not specified'}

2025 Earnings Target: $300 per day with 7-10 quality rides (approx $35/trip)

Top Earning Pickup Zones from TLC Data:
- Manhattan Core (Zone 161-163, 237): Midtown, Times Square
- Financial District (Zone 87): Morning rush premium
- Airports: JFK (Zone 132), LGA (Zone 138)
- Hotel Districts: Theater District (Zone 161)
- Entertainment: Williamsburg (Zone 265), LES (Zone 79)

Driver's question: ${userMessage.content}

**CRITICAL**: Use the REAL DATABASE STATS above when answering. Reference actual numbers from the market intel. Provide helpful, actionable advice specific to NYC TLC drivers. Be concise (2-3 paragraphs max). Focus on practical tips about earnings optimization, compliance, multi-apping strategies, shift planning, or leveraging database patterns.`

      const response = await spark.llm(prompt, 'gpt-4o-mini')

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "How do my earnings compare to market averages?",
    "Which platform has the best trips per driver?",
    "What are the top earning pickup zones right now?",
    "Should I switch platforms based on TLC data?"
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[400px] max-h-[600px]"
          >
            <Card className="flex flex-col h-full shadow-2xl border-2 border-primary/20">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-2">
                  <Brain weight="fill" className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold text-sm">AI Driver Assistant</h3>
                    <p className="text-xs text-muted-foreground">Ask me anything</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <Sparkle size={48} weight="fill" className="mx-auto text-primary/30 mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask me about earnings optimization, compliance, or driving strategies
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground px-2">Suggested questions:</p>
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(q)}
                          className="w-full text-left text-sm p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain weight="fill" size={16} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 max-w-[85%] text-sm",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain weight="fill" size={16} className="text-primary" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-secondary">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about earnings, compliance, or strategies..."
                    className="min-h-[60px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-[60px] w-[60px] flex-shrink-0"
                  >
                    <PaperPlaneRight size={20} weight="fill" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-4 right-4 md:right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isOpen ? <X size={24} weight="bold" /> : <Brain size={24} weight="fill" />}
        </Button>
      </motion.div>
    </>
  )
}

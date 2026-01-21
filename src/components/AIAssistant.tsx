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

      const promptText = `You are an AI assistant for NYC TLC drivers helping them optimize their rideshare business.

You have access to insights from NYC TLC Trip Record Data (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page), which contains millions of historical trip records organized by taxi zones including:
- **Pickup location performance**: Which neighborhoods/zones have the highest average fares
- **Top earning pickup zones**: Manhattan Core (Midtown, Times Square $45-65), Financial District ($50+), Airports (JFK/LGA $55-75+)
- **Time-of-day patterns by zone**: When each neighborhood produces the best fares
- Trip distances, durations, and fare amounts by pickup location
- Payment types and tip percentages by area
- High-demand locations and surge patterns
- Seasonal variations by neighborhood
- Average trip statistics by borough and specific taxi zones

You also have knowledge of NYC DOT real-time data feeds (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml):
- Traffic Speed Data (XML feed with real-time speeds)
- Real-Time Traffic Advisories (construction, incidents, closures)
- Planned Events Data (events affecting traffic)
- Parking Regulations
- @NYC_DOT Twitter for live updates

Context about this driver:
- Total shifts logged: ${context.shiftsCount}
- Total rides logged: ${context.ridesCount}
- Total earnings: $${context.totalEarnings.toFixed(2)}
- Platforms used: ${context.platforms.join(', ') || 'None'}
- License status: ${context.hasLicense ? `Active until ${context.licenseExpiry}` : 'Not set'}
- Start locations used: ${context.startLocations.length > 0 ? context.startLocations.join(', ') : 'Not specified'}

2025 Earnings Target: $300 per day with 7-10 quality rides (approx $35/trip)

Known patterns from TLC Trip Record Data by PICKUP LOCATION:
- **Manhattan Core zones** (morning 7-9am): High demand to other Manhattan areas, airports - avg $45-65/pickup
- **Residential neighborhoods** (morning rush): UES, UWS, Astoria, Park Slope to Manhattan business districts
- **Financial District** (lunch 12-2pm): Short trips within FiDi/downtown - high turnover
- **Manhattan business districts** (evening 5-8pm): High demand leaving Manhattan to outer boroughs - avg $40-55
- **Entertainment districts** (late night 10pm-2am): Williamsburg, LES, Meatpacking - premium weekend fares $40-60
- **Airport staging**: JFK, LGA pickups = 2.5x longer trips, 45% higher earnings per trip
- **Hotel districts**: Theater District, Garment District - 20% higher tip rates

**IMPORTANT**: When the driver mentions or asks about locations, refer to the "Start locations used" field above showing where they've been starting their shifts. Provide insights comparing their location choices to TLC Trip Record Data showing which zones/neighborhoods have the best pickup performance.

Driver's question: ${userMessage.content}

Provide helpful, actionable advice specific to NYC TLC drivers. Be concise (2-3 paragraphs max). Focus on practical tips about earnings optimization, compliance, multi-apping strategies, shift planning, or leveraging TLC Trip Record Data patterns (especially pickup location strategies) and NYC DOT real-time feeds for better positioning. When relevant, reference specific neighborhoods, times, or location-based patterns from TLC records and compare to the driver's start location history.`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini')

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
    "What locations have the best fares?",
    "When should I drive for $35+ trips?",
    "How do I use TLC trip data patterns?",
    "Should I focus on airport runs?"
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

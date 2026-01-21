import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  PaperPlaneRight, 
  UserPlus, 
  UserMinus,
  Users,
  ChatCircleDots,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
}

interface Driver {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  addedAt: number
}

export function Chatroom() {
  const [messages, setMessages, deleteMessages] = useKV<Message[]>('chatroom-messages', [])
  const [fellowDrivers, setFellowDrivers, deleteFellowDrivers] = useKV<Driver[]>('fellow-drivers', [])
  const [messageInput, setMessageInput] = useState('')
  const [driverNameInput, setDriverNameInput] = useState('')
  const [currentUser] = useKV<Driver | null>('current-user', null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [, setCurrentUser] = useKV<Driver | null>('current-user', null)

  useEffect(() => {
    const initializeUser = async () => {
      if (!currentUser) {
        const user = await spark.user()
        const newUser: Driver = {
          id: user?.id ? String(user.id) : 'driver-' + Date.now(),
          name: user?.login || 'Anonymous Driver',
          avatar: user?.avatarUrl || '',
          status: 'online',
          addedAt: Date.now()
        }
        setCurrentUser(newUser)
      }
    }
    initializeUser()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!messageInput.trim() || !currentUser) return

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageInput.trim(),
      timestamp: Date.now()
    }

    setMessages((current) => [...(current || []), newMessage])
    setMessageInput('')
    toast.success('Message sent')
  }

  const addFellowDriver = () => {
    if (!driverNameInput.trim()) {
      toast.error('Please enter a driver name')
      return
    }

    const existingDriver = (fellowDrivers || []).find(
      d => d.name.toLowerCase() === driverNameInput.trim().toLowerCase()
    )

    if (existingDriver) {
      toast.error('Driver already in your list')
      return
    }

    const newDriver: Driver = {
      id: 'driver-' + Date.now(),
      name: driverNameInput.trim(),
      avatar: '',
      status: Math.random() > 0.5 ? 'online' : 'offline',
      addedAt: Date.now()
    }

    setFellowDrivers((current) => [...(current || []), newDriver])
    setDriverNameInput('')
    toast.success(`${newDriver.name} added to fellow drivers`)
  }

  const removeFellowDriver = (driverId: string) => {
    const driver = (fellowDrivers || []).find(d => d.id === driverId)
    setFellowDrivers((current) => (current || []).filter(d => d.id !== driverId))
    toast.success(`${driver?.name} removed from fellow drivers`)
  }

  const formatMessageTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return format(timestamp, 'h:mm a')
    return format(timestamp, 'MMM d, h:mm a')
  }

  const onlineCount = (fellowDrivers || []).filter(d => d.status === 'online').length

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary rounded-lg">
            <ChatCircleDots size={24} weight="fill" className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">The Chatroom</h2>
            <p className="text-sm text-muted-foreground">Connect with fellow TLC drivers</p>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <Users size={14} weight="fill" />
            {onlineCount} online
          </Badge>
        </div>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="chat" className="gap-2">
            <ChatCircleDots size={18} weight="fill" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-2">
            <Users size={18} weight="fill" />
            Fellow Drivers ({(fellowDrivers || []).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">General Chat</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(messages || []).length} messages
                </span>
              </div>
            </div>

            <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {(messages || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[360px] text-center">
                    <div className="p-4 bg-muted/50 rounded-full mb-3">
                      <ChatCircleDots size={32} weight="duotone" className="text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">No messages yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Be the first to start a conversation with fellow drivers
                    </p>
                  </div>
                ) : (
                  (messages || []).map((message) => {
                    const isCurrentUser = currentUser && message.senderId === currentUser.id
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <div className={`h-full w-full flex items-center justify-center text-xs font-medium ${
                            isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {message.senderName.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>
                        <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                              {isCurrentUser ? 'You' : message.senderName}
                            </span>
                            <span className={`text-xs text-muted-foreground flex items-center gap-1 ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                              <Clock size={12} />
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                          <div className={`px-4 py-2.5 rounded-2xl ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                              : 'bg-muted text-foreground rounded-tl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  id="message-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!messageInput.trim()}
                  className="gap-2"
                >
                  <PaperPlaneRight size={18} weight="fill" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-2 mb-4">
              <Input
                id="driver-name-input"
                value={driverNameInput}
                onChange={(e) => setDriverNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFellowDriver()}
                placeholder="Enter driver name..."
                className="flex-1"
              />
              <Button 
                onClick={addFellowDriver}
                disabled={!driverNameInput.trim()}
                className="gap-2"
              >
                <UserPlus size={18} weight="fill" />
                Add
              </Button>
            </div>

            {(fellowDrivers || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-muted/50 rounded-full mb-3">
                  <Users size={32} weight="duotone" className="text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No fellow drivers yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Add drivers to your list to keep track of your network
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {(fellowDrivers || []).map((driver) => (
                    <Card key={driver.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                            {driver.name.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium truncate">{driver.name}</h3>
                            <Badge 
                              variant={driver.status === 'online' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {driver.status === 'online' ? (
                                <span className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                                  Online
                                </span>
                              ) : (
                                'Offline'
                              )}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Added {format(driver.addedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFellowDriver(driver.id)}
                          className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <UserMinus size={16} weight="fill" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

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
  Clock,
  ArrowLeft,
  Chats,
  Paperclip,
  Image as ImageIcon,
  File,
  X,
  DownloadSimple
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Attachment {
  id: string
  name: string
  type: 'image' | 'document'
  url: string
  size: number
}

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
  attachments?: Attachment[]
}

interface DirectMessage {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  text: string
  timestamp: number
  read: boolean
  attachments?: Attachment[]
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
  const [directMessages, setDirectMessages] = useKV<DirectMessage[]>('direct-messages', [])
  const [fellowDrivers, setFellowDrivers, deleteFellowDrivers] = useKV<Driver[]>('fellow-drivers', [])
  const [messageInput, setMessageInput] = useState('')
  const [driverNameInput, setDriverNameInput] = useState('')
  const [currentUser] = useKV<Driver | null>('current-user', null)
  const [activeDM, setActiveDM] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  }, [messages, activeDM, directMessages])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const maxSize = 10 * 1024 * 1024
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB.`)
        return
      }

      const isImage = allowedImageTypes.includes(file.type)
      const isDocument = allowedDocTypes.includes(file.type)

      if (!isImage && !isDocument) {
        toast.error(`${file.name} is not a supported file type.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: 'attach-' + Date.now() + '-' + Math.random(),
          name: file.name,
          type: isImage ? 'image' : 'document',
          url: e.target?.result as string,
          size: file.size
        }
        setAttachments((current) => [...current, newAttachment])
        toast.success(`${file.name} attached`)
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter(a => a.id !== attachmentId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const sendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return
    if (!currentUser) return

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: messageInput.trim(),
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setMessages((current) => [...(current || []), newMessage])
    setMessageInput('')
    setAttachments([])
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

  const sendDirectMessage = (recipientId: string) => {
    if (!messageInput.trim() && attachments.length === 0) return
    if (!currentUser) return

    const recipient = (fellowDrivers || []).find(d => d.id === recipientId)
    if (!recipient) return

    const newDM: DirectMessage = {
      id: 'dm-' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      text: messageInput.trim(),
      timestamp: Date.now(),
      read: false,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setDirectMessages((current) => [...(current || []), newDM])
    setMessageInput('')
    setAttachments([])
    toast.success('Message sent')
  }

  const openDirectMessage = (driverId: string) => {
    setActiveDM(driverId)
    
    setDirectMessages((current) => 
      (current || []).map(dm => 
        dm.recipientId === currentUser?.id && dm.senderId === driverId
          ? { ...dm, read: true }
          : dm
      )
    )
    
    const tabs = document.querySelector('[role="tablist"]')
    const directTab = tabs?.querySelector('[value="direct"]') as HTMLElement
    directTab?.click()
  }

  const getConversationMessages = (driverId: string) => {
    if (!currentUser) return []
    
    return (directMessages || [])
      .filter(dm => 
        (dm.senderId === currentUser.id && dm.recipientId === driverId) ||
        (dm.senderId === driverId && dm.recipientId === currentUser.id)
      )
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  const getUnreadCount = (driverId: string) => {
    if (!currentUser) return 0
    
    return (directMessages || []).filter(dm => 
      dm.senderId === driverId && 
      dm.recipientId === currentUser.id && 
      !dm.read
    ).length
  }

  const getTotalUnreadCount = () => {
    if (!currentUser) return 0
    
    return (directMessages || []).filter(dm => 
      dm.recipientId === currentUser.id && 
      !dm.read
    ).length
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
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="chat" className="gap-2">
            <ChatCircleDots size={18} weight="fill" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="direct" className="gap-2 relative">
            <Chats size={18} weight="fill" />
            Direct Messages
            {getTotalUnreadCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              >
                {getTotalUnreadCount()}
              </Badge>
            )}
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
                            {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className={`space-y-2 ${message.text ? 'mt-2' : ''}`}>
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id}>
                                    {attachment.type === 'image' ? (
                                      <div className="rounded-lg overflow-hidden border border-border/20">
                                        <img 
                                          src={attachment.url} 
                                          alt={attachment.name}
                                          className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() => window.open(attachment.url, '_blank')}
                                        />
                                        <div className={`px-2 py-1.5 text-xs flex items-center justify-between ${
                                          isCurrentUser ? 'bg-primary-foreground/10' : 'bg-background/50'
                                        }`}>
                                          <span className="truncate flex-1">{attachment.name}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 ml-2"
                                            onClick={() => {
                                              const link = document.createElement('a')
                                              link.href = attachment.url
                                              link.download = attachment.name
                                              link.click()
                                            }}
                                          >
                                            <DownloadSimple size={14} weight="bold" />
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                                        isCurrentUser 
                                          ? 'border-primary-foreground/20 bg-primary-foreground/10' 
                                          : 'border-border bg-background/50'
                                      }`}>
                                        <div className={`p-2 rounded ${
                                          isCurrentUser ? 'bg-primary-foreground/20' : 'bg-muted'
                                        }`}>
                                          <File size={20} weight="fill" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">{attachment.name}</p>
                                          <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => {
                                            const link = document.createElement('a')
                                            link.href = attachment.url
                                            link.download = attachment.name
                                            link.click()
                                          }}
                                        >
                                          <DownloadSimple size={16} weight="bold" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
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
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="relative group"
                    >
                      {attachment.type === 'image' ? (
                        <div className="relative">
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="h-16 w-16 object-cover rounded-lg border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAttachment(attachment.id)}
                          >
                            <X size={12} weight="bold" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted">
                          <File size={16} weight="fill" />
                          <div className="flex flex-col">
                            <span className="text-xs font-medium truncate max-w-[120px]">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAttachment(attachment.id)}
                          >
                            <X size={12} weight="bold" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Paperclip size={18} weight="bold" />
                </Button>
                <Input
                  id="message-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!messageInput.trim() && attachments.length === 0}
                  className="gap-2"
                >
                  <PaperPlaneRight size={18} weight="fill" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="direct" className="space-y-4">
          {activeDM ? (
            <Card className="p-0 overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveDM(null)}
                    className="gap-2"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Back
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Avatar className="h-7 w-7">
                    <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium">
                      {(fellowDrivers || []).find(d => d.id === activeDM)?.name.charAt(0).toUpperCase()}
                    </div>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">
                      {(fellowDrivers || []).find(d => d.id === activeDM)?.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        (fellowDrivers || []).find(d => d.id === activeDM)?.status === 'online' 
                          ? 'bg-success animate-pulse' 
                          : 'bg-muted-foreground'
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {(fellowDrivers || []).find(d => d.id === activeDM)?.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {getConversationMessages(activeDM).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[360px] text-center">
                      <div className="p-4 bg-muted/50 rounded-full mb-3">
                        <Chats size={32} weight="duotone" className="text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">No messages yet</h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Start a conversation with {(fellowDrivers || []).find(d => d.id === activeDM)?.name}
                      </p>
                    </div>
                  ) : (
                    getConversationMessages(activeDM).map((dm) => {
                      const isCurrentUser = currentUser && dm.senderId === currentUser.id
                      
                      return (
                        <div
                          key={dm.id}
                          className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <div className={`h-full w-full flex items-center justify-center text-xs font-medium ${
                              isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {dm.senderName.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                          <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                {isCurrentUser ? 'You' : dm.senderName}
                              </span>
                              <span className={`text-xs text-muted-foreground flex items-center gap-1 ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                                <Clock size={12} />
                                {formatMessageTime(dm.timestamp)}
                              </span>
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl ${
                              isCurrentUser 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                : 'bg-muted text-foreground rounded-tl-sm'
                            }`}>
                              {dm.text && <p className="text-sm leading-relaxed">{dm.text}</p>}
                              {dm.attachments && dm.attachments.length > 0 && (
                                <div className={`space-y-2 ${dm.text ? 'mt-2' : ''}`}>
                                  {dm.attachments.map((attachment) => (
                                    <div key={attachment.id}>
                                      {attachment.type === 'image' ? (
                                        <div className="rounded-lg overflow-hidden border border-border/20">
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.name}
                                            className="max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                          />
                                          <div className={`px-2 py-1.5 text-xs flex items-center justify-between ${
                                            isCurrentUser ? 'bg-primary-foreground/10' : 'bg-background/50'
                                          }`}>
                                            <span className="truncate flex-1">{attachment.name}</span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0 ml-2"
                                              onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = attachment.url
                                                link.download = attachment.name
                                                link.click()
                                              }}
                                            >
                                              <DownloadSimple size={14} weight="bold" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                                          isCurrentUser 
                                            ? 'border-primary-foreground/20 bg-primary-foreground/10' 
                                            : 'border-border bg-background/50'
                                        }`}>
                                          <div className={`p-2 rounded ${
                                            isCurrentUser ? 'bg-primary-foreground/20' : 'bg-muted'
                                          }`}>
                                            <File size={20} weight="fill" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{attachment.name}</p>
                                            <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                              const link = document.createElement('a')
                                              link.href = attachment.url
                                              link.download = attachment.name
                                              link.click()
                                            }}
                                          >
                                            <DownloadSimple size={16} weight="bold" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
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
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="relative group"
                      >
                        {attachment.type === 'image' ? (
                          <div className="relative">
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="h-16 w-16 object-cover rounded-lg border border-border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              <X size={12} weight="bold" />
                            </Button>
                          </div>
                        ) : (
                          <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted">
                            <File size={16} weight="fill" />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium truncate max-w-[120px]">{attachment.name}</span>
                              <span className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</span>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeAttachment(attachment.id)}
                            >
                              <X size={12} weight="bold" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Paperclip size={18} weight="bold" />
                  </Button>
                  <Input
                    id="dm-input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendDirectMessage(activeDM)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => sendDirectMessage(activeDM)} 
                    disabled={!messageInput.trim() && attachments.length === 0}
                    className="gap-2"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4">
              {(fellowDrivers || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-muted/50 rounded-full mb-3">
                    <Chats size={32} weight="duotone" className="text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-4">
                    Add fellow drivers to start private conversations
                  </p>
                  <Button variant="outline" onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]')
                    const driversTab = tabs?.querySelector('[value="drivers"]') as HTMLElement
                    driversTab?.click()
                  }}>
                    <UserPlus size={16} weight="fill" className="mr-2" />
                    Add Fellow Drivers
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    {(fellowDrivers || []).map((driver) => {
                      const lastMessage = getConversationMessages(driver.id).slice(-1)[0]
                      const unreadCount = getUnreadCount(driver.id)
                      
                      return (
                        <Card 
                          key={driver.id} 
                          className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => openDirectMessage(driver.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                                  {driver.name.charAt(0).toUpperCase()}
                                </div>
                              </Avatar>
                              {driver.status === 'online' && (
                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">{driver.name}</h3>
                                {lastMessage && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatMessageTime(lastMessage.timestamp)}
                                  </span>
                                )}
                              </div>
                              {lastMessage ? (
                                <div className="flex items-center gap-1.5">
                                  {lastMessage.attachments && lastMessage.attachments.length > 0 && (
                                    <>
                                      {lastMessage.attachments[0].type === 'image' ? (
                                        <ImageIcon size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                                      ) : (
                                        <File size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                                      )}
                                    </>
                                  )}
                                  <p className="text-sm text-muted-foreground truncate">
                                    {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                                    {lastMessage.text || (lastMessage.attachments && lastMessage.attachments.length > 0 
                                      ? `${lastMessage.attachments[0].type === 'image' ? 'Photo' : 'Document'}`
                                      : '')}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">
                                  No messages yet
                                </p>
                              )}
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="h-6 min-w-6 px-2 flex items-center justify-center">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </Card>
          )}
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
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirectMessage(driver.id)}
                            className="gap-1.5"
                          >
                            <Chats size={16} weight="fill" />
                            Message
                          </Button>
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

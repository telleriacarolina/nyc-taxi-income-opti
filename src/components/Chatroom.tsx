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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MessageBubble } from '@/components/MessageBubble'
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
  DownloadSimple,
  Microphone,
  Stop,
  Waveform,
  ImagesSquare,
  ArrowBendUpLeft
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'voice'
  url: string
  size: number
  duration?: number
}

interface Reaction {
  emoji: string
  userId: string
  userName: string
}

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
  attachments?: Attachment[]
  reactions?: Reaction[]
  isEdited?: boolean
  replyToId?: string
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
  reactions?: Reaction[]
  isEdited?: boolean
  replyToId?: string
}

interface Driver {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  addedAt: number
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥']

export function Chatroom() {
  const [messages, setMessages, deleteMessages] = useKV<Message[]>('chatroom-messages', [])
  const [directMessages, setDirectMessages] = useKV<DirectMessage[]>('direct-messages', [])
  const [fellowDrivers, setFellowDrivers, deleteFellowDrivers] = useKV<Driver[]>('fellow-drivers', [])
  const [messageInput, setMessageInput] = useState('')
  const [driverNameInput, setDriverNameInput] = useState('')
  const [currentUser] = useKV<Driver | null>('current-user', null)
  const [activeDM, setActiveDM] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedGalleryTab, setSelectedGalleryTab] = useState<'images' | 'files'>('images')
  const [replyToMessage, setReplyToMessage] = useState<Message | DirectMessage | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())

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

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      audioElementsRef.current.forEach(audio => {
        audio.pause()
        audio.src = ''
      })
      audioElementsRef.current.clear()
    }
  }, [])

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const newAttachment: Attachment = {
          id: 'voice-' + Date.now(),
          name: `Voice message ${format(Date.now(), 'h:mm a')}`,
          type: 'voice',
          url: audioUrl,
          size: audioBlob.size,
          duration: recordingTime
        }
        
        setAttachments((current) => [...current, newAttachment])
        toast.success('Voice message recorded')
        
        stream.getTracks().forEach(track => track.stop())
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      toast.error('Could not access microphone')
      console.error('Recording error:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const playVoiceMessage = (voiceId: string, url: string) => {
    if (playingVoiceId === voiceId) {
      const audio = audioElementsRef.current.get(voiceId)
      if (audio) {
        audio.pause()
        setPlayingVoiceId(null)
      }
      return
    }

    audioElementsRef.current.forEach((audio, id) => {
      if (id !== voiceId) {
        audio.pause()
      }
    })

    let audio = audioElementsRef.current.get(voiceId)
    if (!audio) {
      audio = new Audio(url)
      audio.onended = () => setPlayingVoiceId(null)
      audioElementsRef.current.set(voiceId, audio)
    }

    audio.play()
    setPlayingVoiceId(voiceId)
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addReaction = (messageId: string, emoji: string, isDM: boolean = false) => {
    if (!currentUser) return

    if (isDM) {
      setDirectMessages((current) => 
        (current || []).map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || []
            const existingReaction = reactions.find(r => r.userId === currentUser.id && r.emoji === emoji)
            
            if (existingReaction) {
              return {
                ...msg,
                reactions: reactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji))
              }
            } else {
              return {
                ...msg,
                reactions: [...reactions, { emoji, userId: currentUser.id, userName: currentUser.name }]
              }
            }
          }
          return msg
        })
      )
    } else {
      setMessages((current) => 
        (current || []).map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || []
            const existingReaction = reactions.find(r => r.userId === currentUser.id && r.emoji === emoji)
            
            if (existingReaction) {
              return {
                ...msg,
                reactions: reactions.filter(r => !(r.userId === currentUser.id && r.emoji === emoji))
              }
            } else {
              return {
                ...msg,
                reactions: [...reactions, { emoji, userId: currentUser.id, userName: currentUser.name }]
              }
            }
          }
          return msg
        })
      )
    }
  }

  const editMessage = (messageId: string, newText: string) => {
    setMessages((current) =>
      (current || []).map(msg =>
        msg.id === messageId
          ? { ...msg, text: newText, isEdited: true }
          : msg
      )
    )
    toast.success('Message edited')
  }

  const editDirectMessage = (messageId: string, newText: string) => {
    setDirectMessages((current) =>
      (current || []).map(msg =>
        msg.id === messageId
          ? { ...msg, text: newText, isEdited: true }
          : msg
      )
    )
    toast.success('Message edited')
  }

  const deleteMessage = (messageId: string) => {
    setMessages((current) => (current || []).filter(msg => msg.id !== messageId))
    toast.success('Message deleted')
  }

  const deleteDirectMessage = (messageId: string) => {
    setDirectMessages((current) => (current || []).filter(msg => msg.id !== messageId))
    toast.success('Message deleted')
  }

  const getReactionCounts = (reactions?: Reaction[]) => {
    if (!reactions || reactions.length === 0) return []
    
    const counts = new Map<string, { emoji: string; count: number; users: string[] }>()
    
    reactions.forEach(r => {
      if (counts.has(r.emoji)) {
        const existing = counts.get(r.emoji)!
        existing.count++
        existing.users.push(r.userName)
      } else {
        counts.set(r.emoji, { emoji: r.emoji, count: 1, users: [r.userName] })
      }
    })
    
    return Array.from(counts.values())
  }

  const getAllMedia = () => {
    const allMessages = [...(messages || []), ...(directMessages || [])]
    const allAttachments: (Attachment & { messageId: string; senderName: string; timestamp: number })[] = []
    
    allMessages.forEach(msg => {
      if (msg.attachments) {
        msg.attachments.forEach(att => {
          allAttachments.push({
            ...att,
            messageId: msg.id,
            senderName: msg.senderName,
            timestamp: msg.timestamp
          })
        })
      }
    })
    
    return allAttachments.sort((a, b) => b.timestamp - a.timestamp)
  }

  const getImages = () => getAllMedia().filter(m => m.type === 'image')
  const getFiles = () => getAllMedia().filter(m => m.type === 'document' || m.type === 'voice')

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
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      reactions: [],
      replyToId: replyToMessage?.id
    }

    setMessages((current) => [...(current || []), newMessage])
    setMessageInput('')
    setAttachments([])
    setReplyToMessage(null)
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
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      reactions: [],
      replyToId: replyToMessage?.id
    }

    setDirectMessages((current) => [...(current || []), newDM])
    setMessageInput('')
    setAttachments([])
    setReplyToMessage(null)
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

  const getReplies = (messageId: string, isDM: boolean = false): (Message | DirectMessage)[] => {
    if (isDM) {
      return (directMessages || []).filter(msg => msg.replyToId === messageId)
    }
    return (messages || []).filter(msg => msg.replyToId === messageId)
  }

  const getReplyCount = (messageId: string, isDM: boolean = false): number => {
    return getReplies(messageId, isDM).length
  }

  const findMessageById = (messageId: string, isDM: boolean = false): Message | DirectMessage | null => {
    if (isDM) {
      return (directMessages || []).find(msg => msg.id === messageId) || null
    }
    return (messages || []).find(msg => msg.id === messageId) || null
  }

  const handleReply = (message: Message | DirectMessage) => {
    setReplyToMessage(message)
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
          <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ImagesSquare size={18} weight="fill" />
                <span className="hidden sm:inline">Gallery</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Media Gallery</DialogTitle>
              </DialogHeader>
              <Tabs value={selectedGalleryTab} onValueChange={(v) => setSelectedGalleryTab(v as 'images' | 'files')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="images" className="gap-2">
                    <ImageIcon size={16} weight="fill" />
                    Photos ({getImages().length})
                  </TabsTrigger>
                  <TabsTrigger value="files" className="gap-2">
                    <File size={16} weight="fill" />
                    Files ({getFiles().length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="images" className="mt-4">
                  <ScrollArea className="h-[500px] pr-4">
                    {getImages().length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-muted/50 rounded-full mb-3">
                          <ImageIcon size={32} weight="duotone" className="text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">No photos yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Shared photos will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {getImages().map((item) => (
                          <div key={item.id} className="group relative">
                            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                              <img 
                                src={item.url} 
                                alt={item.name}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(item.url, '_blank')}
                              />
                            </div>
                            <div className="mt-2">
                              <p className="text-xs font-medium truncate">{item.name}</p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                <span>{item.senderName}</span>
                                <span>{format(item.timestamp, 'MMM d')}</span>
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = item.url
                                link.download = item.name
                                link.click()
                              }}
                            >
                              <DownloadSimple size={16} weight="bold" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="files" className="mt-4">
                  <ScrollArea className="h-[500px] pr-4">
                    {getFiles().length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-muted/50 rounded-full mb-3">
                          <File size={32} weight="duotone" className="text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">No files yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Shared documents and voice messages will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getFiles().map((item) => (
                          <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                {item.type === 'voice' ? (
                                  <Waveform size={24} weight="fill" className="text-primary" />
                                ) : (
                                  <File size={24} weight="fill" className="text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>{item.senderName}</span>
                                  <span>•</span>
                                  <span>{format(item.timestamp, 'MMM d, h:mm a')}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(item.size)}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = item.url
                                  link.download = item.name
                                  link.click()
                                }}
                              >
                                <DownloadSimple size={16} weight="bold" />
                                Download
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
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
                    const replyTo = message.replyToId ? findMessageById(message.replyToId, false) : null
                    
                    return (
                      <MessageBubble
                        key={message.id}
                        messageId={message.id}
                        senderName={message.senderName}
                        text={message.text}
                        timestamp={message.timestamp}
                        isCurrentUser={message.senderId === currentUser?.id}
                        attachments={message.attachments}
                        reactions={message.reactions}
                        formatMessageTime={formatMessageTime}
                        formatFileSize={formatFileSize}
                        formatDuration={formatDuration}
                        playingVoiceId={playingVoiceId}
                        playVoiceMessage={playVoiceMessage}
                        addReaction={addReaction}
                        onEdit={editMessage}
                        onReply={() => handleReply(message)}
                        isDM={false}
                        emojis={EMOJIS}
                        replyToId={message.replyToId}
                        replyToMessage={replyTo ? {
                          senderName: replyTo.senderName,
                          text: replyTo.text,
                          attachments: replyTo.attachments
                        } : null}
                        replyCount={getReplyCount(message.id, false)}
                      />
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
                      ) : attachment.type === 'voice' ? (
                        <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted min-w-[140px]">
                          <Waveform size={20} weight="fill" className="text-primary" />
                          <div className="flex flex-col flex-1">
                            <span className="text-xs font-medium">Voice message</span>
                            <span className="text-xs text-muted-foreground">{attachment.duration ? formatDuration(attachment.duration) : '0:00'}</span>
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
              {replyToMessage && (
                <div className="mb-3 p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ArrowBendUpLeft size={14} weight="bold" className="text-primary" />
                      <span className="text-xs font-medium text-primary">Replying to {replyToMessage.senderName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {replyToMessage.text || (replyToMessage.attachments && replyToMessage.attachments.length > 0 
                        ? `${replyToMessage.attachments[0].type === 'image' ? '📷 Photo' : replyToMessage.attachments[0].type === 'voice' ? '🎤 Voice message' : '📄 Document'}`
                        : '')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setReplyToMessage(null)}
                  >
                    <X size={14} weight="bold" />
                  </Button>
                </div>
              )}
              {isRecording && (
                <div className="mb-3 p-3 rounded-lg border border-destructive bg-destructive/10 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Recording...</span>
                    <span className="text-sm text-muted-foreground ml-2">{formatDuration(recordingTime)}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopRecording}
                    className="gap-2"
                  >
                    <Stop size={16} weight="fill" />
                    Stop
                  </Button>
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
                  disabled={isRecording}
                >
                  <Paperclip size={18} weight="bold" />
                </Button>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={attachments.length > 0 || messageInput.trim().length > 0}
                >
                  {isRecording ? <Stop size={18} weight="fill" /> : <Microphone size={18} weight="fill" />}
                </Button>
                <Input
                  id="message-input"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isRecording}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={(!messageInput.trim() && attachments.length === 0) || isRecording}
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
                      const replyTo = dm.replyToId ? findMessageById(dm.replyToId, true) : null
                      
                      return (
                        <MessageBubble
                          key={dm.id}
                          messageId={dm.id}
                          senderName={dm.senderName}
                          text={dm.text}
                          timestamp={dm.timestamp}
                          isCurrentUser={!!isCurrentUser}
                          attachments={dm.attachments}
                          reactions={dm.reactions}
                          formatMessageTime={formatMessageTime}
                          formatFileSize={formatFileSize}
                          formatDuration={formatDuration}
                          playingVoiceId={playingVoiceId}
                          playVoiceMessage={playVoiceMessage}
                          addReaction={addReaction}
                          onEdit={editDirectMessage}
                          onDelete={deleteDirectMessage}
                          onReply={() => handleReply(dm)}
                          isDM={true}
                          emojis={EMOJIS}
                          isEdited={dm.isEdited}
                          replyToId={dm.replyToId}
                          replyToMessage={replyTo ? {
                            senderName: replyTo.senderName,
                            text: replyTo.text,
                            attachments: replyTo.attachments
                          } : null}
                          replyCount={getReplyCount(dm.id, true)}
                        />
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
                        ) : attachment.type === 'voice' ? (
                          <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted min-w-[140px]">
                            <Waveform size={20} weight="fill" className="text-primary" />
                            <div className="flex flex-col flex-1">
                              <span className="text-xs font-medium">Voice message</span>
                              <span className="text-xs text-muted-foreground">{attachment.duration ? formatDuration(attachment.duration) : '0:00'}</span>
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
                {replyToMessage && (
                  <div className="mb-3 p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ArrowBendUpLeft size={14} weight="bold" className="text-primary" />
                        <span className="text-xs font-medium text-primary">Replying to {replyToMessage.senderName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {replyToMessage.text || (replyToMessage.attachments && replyToMessage.attachments.length > 0 
                          ? `${replyToMessage.attachments[0].type === 'image' ? '📷 Photo' : replyToMessage.attachments[0].type === 'voice' ? '🎤 Voice message' : '📄 Document'}`
                          : '')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setReplyToMessage(null)}
                    >
                      <X size={14} weight="bold" />
                    </Button>
                  </div>
                )}
                {isRecording && (
                  <div className="mb-3 p-3 rounded-lg border border-destructive bg-destructive/10 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Recording...</span>
                      <span className="text-sm text-muted-foreground ml-2">{formatDuration(recordingTime)}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={stopRecording}
                      className="gap-2"
                    >
                      <Stop size={16} weight="fill" />
                      Stop
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isRecording}
                  >
                    <Paperclip size={18} weight="bold" />
                  </Button>
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={attachments.length > 0 || messageInput.trim().length > 0}
                  >
                    {isRecording ? <Stop size={18} weight="fill" /> : <Microphone size={18} weight="fill" />}
                  </Button>
                  <Input
                    id="dm-input"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendDirectMessage(activeDM)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isRecording}
                  />
                  <Button 
                    onClick={() => sendDirectMessage(activeDM)} 
                    disabled={(!messageInput.trim() && attachments.length === 0) || isRecording}
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
                                      ) : lastMessage.attachments[0].type === 'voice' ? (
                                        <Waveform size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                                      ) : (
                                        <File size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />
                                      )}
                                    </>
                                  )}
                                  <p className="text-sm text-muted-foreground truncate">
                                    {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                                    {lastMessage.text || (lastMessage.attachments && lastMessage.attachments.length > 0 
                                      ? `${lastMessage.attachments[0].type === 'image' ? 'Photo' : lastMessage.attachments[0].type === 'voice' ? 'Voice message' : 'Document'}`
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

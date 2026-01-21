import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { 
  Clock, 
  DownloadSimple, 
  File, 
  Play, 
  Pause, 
  Waveform,
  Smiley,
  DotsThree,
  Pencil,
  Trash,
  Check,
  X
} from '@phosphor-icons/react'
import { useState } from 'react'

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

interface MessageBubbleProps {
  messageId: string
  senderName: string
  text: string
  timestamp: number
  isCurrentUser: boolean
  attachments?: Attachment[]
  reactions?: Reaction[]
  formatMessageTime: (timestamp: number) => string
  formatFileSize: (bytes: number) => string
  formatDuration: (seconds: number) => string
  playingVoiceId: string | null
  playVoiceMessage: (voiceId: string, url: string) => void
  addReaction: (messageId: string, emoji: string, isDM: boolean) => void
  onEdit?: (messageId: string, newText: string) => void
  onDelete?: (messageId: string) => void
  isDM?: boolean
  emojis: string[]
  isEdited?: boolean
}

export function MessageBubble({
  messageId,
  senderName,
  text,
  timestamp,
  isCurrentUser,
  attachments,
  reactions,
  formatMessageTime,
  formatFileSize,
  formatDuration,
  playingVoiceId,
  playVoiceMessage,
  addReaction,
  onEdit,
  onDelete,
  isDM = false,
  emojis,
  isEdited = false
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)

  const handleSaveEdit = () => {
    if (editedText.trim() && editedText !== text && onEdit) {
      onEdit(messageId, editedText.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedText(text)
    setIsEditing(false)
  }

  const getReactionCounts = () => {
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

  const reactionCounts = getReactionCounts()

  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <div className={`h-full w-full flex items-center justify-center text-xs font-medium ${
          isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          {senderName.charAt(0).toUpperCase()}
        </div>
      </Avatar>
      <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${isCurrentUser ? 'order-2' : 'order-1'}`}>
            {isCurrentUser ? 'You' : senderName}
          </span>
          <span className={`text-xs text-muted-foreground flex items-center gap-1 ${isCurrentUser ? 'order-1' : 'order-2'}`}>
            <Clock size={12} />
            {formatMessageTime(timestamp)}
            {isEdited && <span className="italic ml-1">(edited)</span>}
          </span>
        </div>
        <div className="relative group w-full">
          {isEditing ? (
            <div className="w-full">
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSaveEdit()
                  }
                  if (e.key === 'Escape') {
                    handleCancelEdit()
                  }
                }}
                className="w-full mb-2"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="gap-1 h-7"
                >
                  <X size={14} weight="bold" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editedText.trim() || editedText === text}
                  className="gap-1 h-7"
                >
                  <Check size={14} weight="bold" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={`px-4 py-2.5 rounded-2xl ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-muted text-foreground rounded-tl-sm'
              }`}>
                {text && <p className="text-sm leading-relaxed">{text}</p>}
                {attachments && attachments.length > 0 && (
                  <div className={`space-y-2 ${text ? 'mt-2' : ''}`}>
                    {attachments.map((attachment) => (
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
                        ) : attachment.type === 'voice' ? (
                          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                            isCurrentUser 
                              ? 'border-primary-foreground/20 bg-primary-foreground/10' 
                              : 'border-border bg-background/50'
                          }`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 rounded-full"
                              onClick={() => playVoiceMessage(attachment.id, attachment.url)}
                            >
                              {playingVoiceId === attachment.id ? (
                                <Pause size={20} weight="fill" />
                              ) : (
                                <Play size={20} weight="fill" />
                              )}
                            </Button>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                              <Waveform size={20} weight="fill" />
                              <span className="text-xs font-medium">
                                {attachment.duration ? formatDuration(attachment.duration) : '0:00'}
                              </span>
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
              
              <div className={`absolute -bottom-2 ${isCurrentUser ? 'left-0' : 'right-0'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full bg-background border border-border shadow-sm"
                    >
                      <Smiley size={14} weight="fill" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align={isCurrentUser ? 'start' : 'end'}>
                    <div className="flex gap-1">
                      {emojis.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                          onClick={() => addReaction(messageId, emoji, isDM)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {isCurrentUser && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full bg-background border border-border shadow-sm"
                      >
                        <DotsThree size={14} weight="bold" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1" align={isCurrentUser ? 'start' : 'end'}>
                      <div className="flex flex-col gap-1">
                        {text && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2 justify-start h-8"
                          >
                            <Pencil size={14} weight="fill" />
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(messageId)}
                          className="gap-2 justify-start h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash size={14} weight="fill" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && reactionCounts.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reactionCounts.map((reaction) => (
              <TooltipProvider key={reaction.emoji}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => addReaction(messageId, reaction.emoji, isDM)}
                    >
                      <span>{reaction.emoji}</span>
                      <span className="ml-1 text-[10px]">{reaction.count}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{reaction.users.join(', ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

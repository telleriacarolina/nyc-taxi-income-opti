import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, DeviceMobile, EnvelopeSimple, ClockCounterClockwise } from '@phosphor-icons/react'
import { NotificationService } from '@/lib/notificationService'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function NotificationHistory() {
  const [smsHistory, setSmsHistory] = useState<any[]>([])
  const [emailHistory, setEmailHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const [sms, email] = await Promise.all([
        NotificationService.getSMSReminderHistory(),
        NotificationService.getEmailReminderHistory(),
      ])
      setSmsHistory(sms)
      setEmailHistory(email)
    } catch (error) {
      toast.error('Failed to load notification history')
    } finally {
      setIsLoading(false)
    }
  }

  const exportSMSHistory = () => {
    if (smsHistory.length === 0) {
      toast.error('No SMS history to export')
      return
    }

    const csv = [
      'Timestamp,Phone Number,Message,Status',
      ...smsHistory.map(item =>
        `"${new Date(item.timestamp).toLocaleString()}","${item.phoneNumber}","${item.message}","${item.status}"`
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sms-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('SMS history exported')
  }

  const exportEmailHistory = () => {
    if (emailHistory.length === 0) {
      toast.error('No email history to export')
      return
    }

    const csv = [
      'Timestamp,Email,Subject,Body,Status',
      ...emailHistory.map(item =>
        `"${new Date(item.timestamp).toLocaleString()}","${item.email}","${item.subject}","${item.body}","${item.status}"`
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Email history exported')
  }

  const exportAllHistory = async () => {
    const reminderCsv = await NotificationService.exportReminderHistory()
    
    if (!reminderCsv && smsHistory.length === 0 && emailHistory.length === 0) {
      toast.error('No history to export')
      return
    }

    const blob = new Blob([reminderCsv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all-reminders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('All reminder history exported')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClockCounterClockwise size={24} weight="fill" className="text-muted-foreground" />
              Notification History
            </CardTitle>
            <CardDescription>
              View and export your notification and reminder history
            </CardDescription>
          </div>
          <Button
            onClick={exportAllHistory}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download size={16} />
            Export All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sms" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sms" className="gap-2">
              <DeviceMobile size={16} weight="fill" />
              SMS History ({smsHistory.length})
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <EnvelopeSimple size={16} weight="fill" />
              Email History ({emailHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={exportSMSHistory}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={smsHistory.length === 0}
              >
                <Download size={16} />
                Export SMS
              </Button>
            </div>
            
            {smsHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No SMS reminders sent yet
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smsHistory.slice().reverse().map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {item.phoneNumber}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate">
                          {item.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'sent' ? 'default' : 'destructive'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={exportEmailHistory}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={emailHistory.length === 0}
              >
                <Download size={16} />
                Export Email
              </Button>
            </div>
            
            {emailHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No email reminders sent yet
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailHistory.slice().reverse().map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {item.email}
                        </TableCell>
                        <TableCell className="text-xs max-w-xs truncate">
                          {item.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'sent' ? 'default' : 'destructive'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface NotificationSettings {
  pushEnabled: boolean
  smsEnabled: boolean
  emailEnabled: boolean
  phoneNumber: string
  email: string
  reminderIntervals: {
    days30: boolean
    days14: boolean
    days7: boolean
    days1: boolean
  }
  notificationTypes: {
    licenseExpiration: boolean
    appointmentReminders: boolean
    vehicleRegistration: boolean
    complianceDeadlines: boolean
    earningsAlerts: boolean
    trafficAlerts: boolean
  }
}

type NotificationType = keyof NotificationSettings['notificationTypes']

interface NotificationPayload {
  title: string
  body: string
  type: NotificationType
  data?: Record<string, any>
  tag?: string
}

export class NotificationService {
  private static async getSettings(): Promise<NotificationSettings | undefined> {
    try {
      return await spark.kv.get<NotificationSettings>('notification-settings')
    } catch {
      return undefined
    }
  }

  static async sendNotification(payload: NotificationPayload): Promise<void> {
    const settings = await this.getSettings()
    
    if (!settings) {
      return
    }

    if (!settings.notificationTypes[payload.type]) {
      return
    }

    if (settings.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      await this.sendPushNotification(payload)
    }
  }

  private static async sendPushNotification(payload: NotificationPayload): Promise<void> {
    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: '/icon-192.png',
        tag: payload.tag || `notification-${Date.now()}`,
        badge: '/icon-badge.png',
        data: payload.data,
        requireInteraction: false,
        silent: false,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    } catch (error) {
      console.error('Failed to send push notification:', error)
    }
  }

  static async scheduleReminder(
    date: Date,
    title: string,
    body: string,
    type: NotificationType,
    tag?: string
  ): Promise<void> {
    const settings = await this.getSettings()
    
    if (!settings || !settings.notificationTypes[type]) {
      return
    }

    const now = new Date()
    const targetDate = new Date(date)
    const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const reminders: { days: number; enabled: boolean }[] = [
      { days: 30, enabled: settings.reminderIntervals.days30 },
      { days: 14, enabled: settings.reminderIntervals.days14 },
      { days: 7, enabled: settings.reminderIntervals.days7 },
      { days: 1, enabled: settings.reminderIntervals.days1 },
    ]

    for (const reminder of reminders) {
      if (reminder.enabled && daysUntil <= reminder.days) {
        const reminderDate = new Date(targetDate)
        reminderDate.setDate(reminderDate.getDate() - reminder.days)

        if (reminderDate > now) {
          await this.storeScheduledReminder({
            date: reminderDate,
            title: `${title} - ${reminder.days} day${reminder.days > 1 ? 's' : ''} away`,
            body,
            type,
            tag: tag ? `${tag}-${reminder.days}d` : undefined,
          })
        }
      }
    }
  }

  private static async storeScheduledReminder(reminder: {
    date: Date
    title: string
    body: string
    type: NotificationType
    tag?: string
  }): Promise<void> {
    try {
      const reminders = (await spark.kv.get<any[]>('scheduled-reminders')) || []
      reminders.push({
        ...reminder,
        id: `reminder-${Date.now()}-${Math.random()}`,
        created: new Date().toISOString(),
      })
      await spark.kv.set('scheduled-reminders', reminders)
    } catch (error) {
      console.error('Failed to store scheduled reminder:', error)
    }
  }

  static async checkScheduledReminders(): Promise<void> {
    try {
      const reminders = (await spark.kv.get<any[]>('scheduled-reminders')) || []
      const now = new Date()
      const pendingReminders: any[] = []

      for (const reminder of reminders) {
        const reminderDate = new Date(reminder.date)
        
        if (reminderDate <= now) {
          await this.sendNotification({
            title: reminder.title,
            body: reminder.body,
            type: reminder.type,
            tag: reminder.tag,
          })
        } else {
          pendingReminders.push(reminder)
        }
      }

      await spark.kv.set('scheduled-reminders', pendingReminders)
    } catch (error) {
      console.error('Failed to check scheduled reminders:', error)
    }
  }

  static async notifyLicenseExpiration(expirationDate: Date, licenseType: string): Promise<void> {
    await this.scheduleReminder(
      expirationDate,
      `${licenseType} Expiring Soon`,
      `Your ${licenseType} expires on ${expirationDate.toLocaleDateString()}. Renew now to avoid penalties.`,
      'licenseExpiration',
      `license-${licenseType.toLowerCase().replace(/\s+/g, '-')}`
    )
  }

  static async notifyAppointment(
    appointmentDate: Date,
    appointmentType: string,
    location?: string
  ): Promise<void> {
    const locationText = location ? ` at ${location}` : ''
    await this.scheduleReminder(
      appointmentDate,
      `${appointmentType} Appointment`,
      `You have a ${appointmentType} appointment${locationText} on ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      'appointmentReminders',
      `appointment-${appointmentType.toLowerCase().replace(/\s+/g, '-')}`
    )
  }

  static async notifyVehicleRegistration(expirationDate: Date, vehicleInfo: string): Promise<void> {
    await this.scheduleReminder(
      expirationDate,
      'Vehicle Registration Expiring',
      `Registration for ${vehicleInfo} expires on ${expirationDate.toLocaleDateString()}. Renew to stay compliant.`,
      'vehicleRegistration',
      `vehicle-${vehicleInfo.toLowerCase().replace(/\s+/g, '-')}`
    )
  }

  static async notifyComplianceDeadline(
    deadlineDate: Date,
    complianceType: string,
    details?: string
  ): Promise<void> {
    const detailsText = details ? ` ${details}` : ''
    await this.scheduleReminder(
      deadlineDate,
      `${complianceType} Deadline`,
      `${complianceType} is due on ${deadlineDate.toLocaleDateString()}.${detailsText}`,
      'complianceDeadlines',
      `compliance-${complianceType.toLowerCase().replace(/\s+/g, '-')}`
    )
  }

  static async notifyEarningsAlert(message: string): Promise<void> {
    await this.sendNotification({
      title: 'Earnings Alert',
      body: message,
      type: 'earningsAlerts',
      tag: 'earnings-alert',
    })
  }

  static async notifyTrafficAlert(message: string, location?: string): Promise<void> {
    const locationText = location ? ` near ${location}` : ''
    await this.sendNotification({
      title: 'Traffic Alert',
      body: `${message}${locationText}`,
      type: 'trafficAlerts',
      tag: 'traffic-alert',
    })
  }

  static async exportReminderHistory(): Promise<string> {
    try {
      const reminders = (await spark.kv.get<any[]>('scheduled-reminders')) || []
      
      const csv = [
        'Date,Title,Body,Type,Tag,Created',
        ...reminders.map(r => 
          `"${new Date(r.date).toLocaleString()}","${r.title}","${r.body}","${r.type}","${r.tag || ''}","${new Date(r.created).toLocaleString()}"`
        )
      ].join('\n')

      return csv
    } catch (error) {
      console.error('Failed to export reminder history:', error)
      return ''
    }
  }

  static async getSMSReminderHistory(): Promise<any[]> {
    try {
      return (await spark.kv.get<any[]>('sms-reminder-history')) || []
    } catch {
      return []
    }
  }

  static async getEmailReminderHistory(): Promise<any[]> {
    try {
      return (await spark.kv.get<any[]>('email-reminder-history')) || []
    } catch {
      return []
    }
  }

  static async logSMSReminder(phoneNumber: string, message: string, timestamp: Date): Promise<void> {
    try {
      const history = await this.getSMSReminderHistory()
      history.push({
        id: `sms-${Date.now()}-${Math.random()}`,
        phoneNumber,
        message,
        timestamp: timestamp.toISOString(),
        status: 'sent',
      })
      await spark.kv.set('sms-reminder-history', history)
    } catch (error) {
      console.error('Failed to log SMS reminder:', error)
    }
  }

  static async logEmailReminder(email: string, subject: string, body: string, timestamp: Date): Promise<void> {
    try {
      const history = await this.getEmailReminderHistory()
      history.push({
        id: `email-${Date.now()}-${Math.random()}`,
        email,
        subject,
        body,
        timestamp: timestamp.toISOString(),
        status: 'sent',
      })
      await spark.kv.set('email-reminder-history', history)
    } catch (error) {
      console.error('Failed to log email reminder:', error)
    }
  }
}

export async function initNotificationService(): Promise<void> {
  setInterval(() => {
    NotificationService.checkScheduledReminders()
  }, 60000)

  await NotificationService.checkScheduledReminders()
}

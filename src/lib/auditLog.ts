export interface AuditLogEntry {
  timestamp: string
  action: string
  category: 'compliance' | 'earnings' | 'data-management' | 'privacy' | 'security'
  details?: Record<string, unknown>
  userId?: string
}

export interface AuditLog {
  entries: AuditLogEntry[]
  lastUpdated: string
}

const MAX_LOG_ENTRIES = 1000
const AUDIT_LOG_KEY = 'audit-log'

export async function logAuditEvent(
  action: string,
  category: AuditLogEntry['category'],
  details?: Record<string, unknown>
): Promise<void> {
  if (import.meta.env.VITE_ENABLE_AUDIT_LOGGING !== 'true') {
    return
  }

  try {
    const existingLog = await spark.kv.get<AuditLog>(AUDIT_LOG_KEY)
    
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      category,
      details: sanitizeAuditDetails(details),
      userId: await getCurrentUserId()
    }
    
    const entries = existingLog?.entries || []
    entries.push(entry)
    
    if (entries.length > MAX_LOG_ENTRIES) {
      entries.shift()
    }
    
    const updatedLog: AuditLog = {
      entries,
      lastUpdated: new Date().toISOString()
    }
    
    await spark.kv.set(AUDIT_LOG_KEY, updatedLog)
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}

function sanitizeAuditDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined
  
  const sanitized: Record<string, unknown> = {}
  const sensitiveKeys = [
    'password',
    'licenseNumber',
    'ssn',
    'socialSecurity',
    'phoneNumber',
    'email',
    'bankAccount',
    'creditCard',
    'apiKey',
    'token',
    'secret'
  ]
  
  for (const [key, value] of Object.entries(details)) {
    const lowerKey = key.toLowerCase()
    
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'string' && value.length > 200) {
      sanitized[key] = value.substring(0, 200) + '...'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[OBJECT]'
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

async function getCurrentUserId(): Promise<string | undefined> {
  try {
    const user = await spark.user()
    return user?.id?.toString()
  } catch {
    return undefined
  }
}

export async function getAuditLog(
  category?: AuditLogEntry['category'],
  startDate?: string,
  endDate?: string
): Promise<AuditLogEntry[]> {
  try {
    const log = await spark.kv.get<AuditLog>(AUDIT_LOG_KEY)
    
    if (!log || !log.entries) {
      return []
    }
    
    let entries = log.entries
    
    if (category) {
      entries = entries.filter(e => e.category === category)
    }
    
    if (startDate) {
      entries = entries.filter(e => e.timestamp >= startDate)
    }
    
    if (endDate) {
      entries = entries.filter(e => e.timestamp <= endDate)
    }
    
    return entries
  } catch (error) {
    console.error('Failed to retrieve audit log:', error)
    return []
  }
}

export async function exportAuditLog(): Promise<Blob> {
  const entries = await getAuditLog()
  
  const logData = {
    exportDate: new Date().toISOString(),
    totalEntries: entries.length,
    entries
  }
  
  const jsonString = JSON.stringify(logData, null, 2)
  return new Blob([jsonString], { type: 'application/json' })
}

export async function clearAuditLog(): Promise<void> {
  try {
    await spark.kv.delete(AUDIT_LOG_KEY)
  } catch (error) {
    console.error('Failed to clear audit log:', error)
    throw error
  }
}

export const AUDIT_ACTIONS = {
  LICENSE_UPDATED: 'License information updated',
  LICENSE_DELETED: 'License information deleted',
  DOCUMENT_ADDED: 'Document added',
  DOCUMENT_UPDATED: 'Document updated',
  DOCUMENT_DELETED: 'Document deleted',
  SHIFT_LOGGED: 'Shift logged',
  SHIFT_UPDATED: 'Shift updated',
  SHIFT_DELETED: 'Shift deleted',
  RIDE_LOGGED: 'Ride logged',
  RIDE_UPDATED: 'Ride updated',
  RIDE_DELETED: 'Ride deleted',
  DATA_EXPORTED: 'Data exported',
  DATA_DELETED: 'All data deleted',
  PRIVACY_MODE_ENABLED: 'Privacy mode enabled',
  PRIVACY_MODE_DISABLED: 'Privacy mode disabled',
  LOCATION_PERMISSION_GRANTED: 'Location permission granted',
  LOCATION_PERMISSION_DENIED: 'Location permission denied',
  NOTIFICATION_PERMISSION_GRANTED: 'Notification permission granted',
  NOTIFICATION_PERMISSION_DENIED: 'Notification permission denied',
  SMS_REMINDER_SCHEDULED: 'SMS reminder scheduled',
  EMAIL_REMINDER_SCHEDULED: 'Email reminder scheduled',
  TLC_APPOINTMENT_ADDED: 'TLC appointment added',
  TLC_APPOINTMENT_UPDATED: 'TLC appointment updated',
  TLC_APPOINTMENT_DELETED: 'TLC appointment deleted',
  DMV_APPOINTMENT_ADDED: 'DMV appointment added',
  DMV_APPOINTMENT_UPDATED: 'DMV appointment updated',
  DMV_APPOINTMENT_DELETED: 'DMV appointment deleted',
  AI_INSIGHT_GENERATED: 'AI insight generated',
  ROUTE_GENERATED: 'Route generated from current location'
} as const

export function useAuditLogging() {
  return {
    log: logAuditEvent,
    getLog: getAuditLog,
    exportLog: exportAuditLog,
    clearLog: clearAuditLog,
    actions: AUDIT_ACTIONS
  }
}

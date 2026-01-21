import { differenceInDays, parseISO, format, isAfter, isBefore } from 'date-fns'
import { DocumentStatus } from './types'

export function getDaysRemaining(expirationDate: string): number {
  const expDate = parseISO(expirationDate)
  const today = new Date()
  return differenceInDays(expDate, today)
}

export function getDocumentStatus(expirationDate: string): DocumentStatus {
  const daysRemaining = getDaysRemaining(expirationDate)
  
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining <= 30) return 'expiring'
  return 'current'
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy')
}

export function formatDateInput(dateString: string): string {
  return format(parseISO(dateString), 'yyyy-MM-dd')
}

export function isValidFutureDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString)
    const today = new Date()
    return isAfter(date, today)
  } catch {
    return false
  }
}

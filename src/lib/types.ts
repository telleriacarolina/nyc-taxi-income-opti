export interface TLCLicense {
  licenseNumber: string
  expirationDate: string
  issueDate: string
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  expirationDate: string
  issuedDate?: string
  notes?: string
}

export type DocumentType = 
  | 'dmv-license'
  | 'defensive-driving'
  | 'drug-test'
  | 'vehicle-inspection'
  | 'insurance'
  | 'other'

export type DocumentStatus = 'current' | 'expiring' | 'expired'

export interface DocumentWithStatus extends Document {
  status: DocumentStatus
  daysRemaining: number
}

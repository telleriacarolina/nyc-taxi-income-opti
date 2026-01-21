import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { TLCLicense, Document, DocumentWithStatus } from '@/lib/types'
import { getDocumentStatus, getDaysRemaining } from '@/lib/date-utils'
import { LicenseCard } from '@/components/LicenseCard'
import { DocumentCard } from '@/components/DocumentCard'
import { LicenseDialog } from '@/components/LicenseDialog'
import { DocumentDialog } from '@/components/DocumentDialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, WarningCircle, CheckCircle, ArrowSquareOut, Link as LinkIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function LicenseManager() {
  const [license, setLicense] = useKV<TLCLicense | null>('tlc-license', null)
  const [documents, setDocuments] = useKV<Document[]>('tlc-documents', [])
  
  const [isLicenseDialogOpen, setIsLicenseDialogOpen] = useState(false)
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const documentsWithStatus = useMemo<DocumentWithStatus[]>(() => {
    return (documents || []).map(doc => ({
      ...doc,
      status: getDocumentStatus(doc.expirationDate),
      daysRemaining: getDaysRemaining(doc.expirationDate)
    })).sort((a, b) => {
      if (a.status === 'expired' && b.status !== 'expired') return -1
      if (a.status !== 'expired' && b.status === 'expired') return 1
      if (a.status === 'expiring' && b.status === 'current') return -1
      if (a.status === 'current' && b.status === 'expiring') return 1
      return a.daysRemaining - b.daysRemaining
    })
  }, [documents])

  const expiredCount = documentsWithStatus.filter(d => d.status === 'expired').length
  const expiringCount = documentsWithStatus.filter(d => d.status === 'expiring').length
  const licenseStatus = license ? getDocumentStatus(license.expirationDate) : null

  const handleSaveLicense = (newLicense: TLCLicense) => {
    setLicense(newLicense)
    toast.success('TLC License saved successfully!')
  }

  const handleSaveDocument = (document: Document) => {
    setDocuments((currentDocs) => {
      const docs = currentDocs || []
      const existing = docs.find(d => d.id === document.id)
      if (existing) {
        toast.success('Document updated successfully!')
        return docs.map(d => d.id === document.id ? document : d)
      } else {
        toast.success('Document added successfully!')
        return [...docs, document]
      }
    })
    setEditingDocument(null)
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setIsDocumentDialogOpen(true)
  }

  const handleAddDocument = () => {
    setEditingDocument(null)
    setIsDocumentDialogOpen(true)
  }

  return (
    <>
      {(licenseStatus === 'expired' || expiredCount > 0 || expiringCount > 0) && (
        <Alert className="mb-4 border-warning bg-warning/5 py-3">
          <WarningCircle size={18} className="text-warning flex-shrink-0" weight="fill" />
          <AlertTitle className="font-semibold text-[clamp(0.75rem,2.5vw,0.875rem)] line-clamp-1">Action Required</AlertTitle>
          <AlertDescription className="text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-2 leading-snug">
            {licenseStatus === 'expired' && 'TLC license expired. '}
            {expiredCount > 0 && `${expiredCount} doc${expiredCount > 1 ? 's' : ''} expired. `}
            {expiringCount > 0 && `${expiringCount} doc${expiringCount > 1 ? 's' : ''} expiring.`}
          </AlertDescription>
        </Alert>
      )}

      {license && documentsWithStatus.length > 0 && 
       licenseStatus === 'current' && 
       expiredCount === 0 && 
       expiringCount === 0 && (
        <Alert className="mb-4 border-success bg-success/5 py-3">
          <CheckCircle size={18} className="text-success flex-shrink-0" weight="fill" />
          <AlertTitle className="font-semibold text-[clamp(0.75rem,2.5vw,0.875rem)] line-clamp-1">All Current</AlertTitle>
          <AlertDescription className="text-[clamp(0.65rem,2vw,0.75rem)] line-clamp-1">
            All documents up to date
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-4 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <LinkIcon size={18} weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1 mb-0">TLC Resources</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-1">
            <a
              href="https://apps.nyc.gov/lars/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/20 border border-border hover:border-accent transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)] text-foreground line-clamp-1">
                  LARS - Appointments
                </div>
              </div>
              <ArrowSquareOut size={16} className="text-muted-foreground group-hover:text-accent ml-4 flex-shrink-0" weight="bold" />
            </a>

            <a
              href="https://a156-nauf.nyc.gov/tlcup/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/20 border border-border hover:border-accent transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)] text-foreground line-clamp-1">
                  License Status Portal
                </div>
              </div>
              <ArrowSquareOut size={16} className="text-muted-foreground group-hover:text-accent ml-4 flex-shrink-0" weight="bold" />
            </a>

            <a
              href="https://www.nyc.gov/site/tlc/tlc-online/licensing-standards-appointment-scheduling.page"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/20 border border-border hover:border-accent transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[clamp(0.75rem,2.4vw,0.875rem)] text-foreground line-clamp-1">
                  Standards & Requirements
                </div>
              </div>
              <ArrowSquareOut size={16} className="text-muted-foreground group-hover:text-accent ml-4 flex-shrink-0" weight="bold" />
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <section>
          <LicenseCard 
            license={license || null} 
            onEdit={() => setIsLicenseDialogOpen(true)} 
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[clamp(1rem,2.8vw,1.125rem)] line-clamp-1">Documents</h2>
            <Button 
              onClick={handleAddDocument}
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
            >
              <Plus size={18} weight="bold" className="mr-1 flex-shrink-0" />
              <span className="truncate">Add</span>
            </Button>
          </div>

          {(documents || []).length === 0 ? (
            <div className="text-center py-8 bg-card rounded-lg border-2 border-dashed">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-3">
                <Plus size={24} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1 text-[clamp(0.9rem,2.8vw,1rem)] line-clamp-1">No Documents</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto text-[clamp(0.75rem,2.4vw,0.875rem)] line-clamp-2 leading-snug px-4">
                Track DMV license, insurance, vehicle inspection
              </p>
              <Button 
                onClick={handleAddDocument}
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-8 px-3 text-[clamp(0.7rem,2vw,0.8rem)]"
              >
                <Plus size={18} weight="bold" className="mr-1 flex-shrink-0" />
                <span className="truncate">Add Document</span>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {documentsWithStatus.map(doc => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  onEdit={handleEditDocument}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <LicenseDialog
        open={isLicenseDialogOpen}
        onOpenChange={setIsLicenseDialogOpen}
        license={license || null}
        onSave={handleSaveLicense}
      />

      <DocumentDialog
        open={isDocumentDialogOpen}
        onOpenChange={(open) => {
          setIsDocumentDialogOpen(open)
          if (!open) setEditingDocument(null)
        }}
        document={editingDocument}
        onSave={handleSaveDocument}
      />
    </>
  )
}

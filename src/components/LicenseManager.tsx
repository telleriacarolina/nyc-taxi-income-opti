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
import { Plus, WarningCircle, CheckCircle } from '@phosphor-icons/react'
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
        <Alert className="mb-6 border-warning bg-warning/5">
          <WarningCircle size={20} className="text-warning" weight="fill" />
          <AlertTitle className="font-semibold">Action Required</AlertTitle>
          <AlertDescription>
            {licenseStatus === 'expired' && 'Your TLC license has expired. '}
            {expiredCount > 0 && `${expiredCount} document${expiredCount > 1 ? 's' : ''} expired. `}
            {expiringCount > 0 && `${expiringCount} document${expiringCount > 1 ? 's' : ''} expiring soon.`}
          </AlertDescription>
        </Alert>
      )}

      {license && documentsWithStatus.length > 0 && 
       licenseStatus === 'current' && 
       expiredCount === 0 && 
       expiringCount === 0 && (
        <Alert className="mb-6 border-success bg-success/5">
          <CheckCircle size={20} className="text-success" weight="fill" />
          <AlertTitle className="font-semibold">All Current</AlertTitle>
          <AlertDescription>
            Your license and all documents are up to date. Great job staying compliant!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <section>
          <LicenseCard 
            license={license || null} 
            onEdit={() => setIsLicenseDialogOpen(true)} 
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Required Documents</h2>
            <Button 
              onClick={handleAddDocument}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Add Document
            </Button>
          </div>

          {(documents || []).length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Plus size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Documents Added</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start tracking your required documents like DMV license, insurance, and vehicle inspection
              </p>
              <Button 
                onClick={handleAddDocument}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Add Your First Document
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
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

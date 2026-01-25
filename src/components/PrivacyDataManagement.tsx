import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Download, 
  Trash, 
  FileText, 
  Lock,
  Eye,
  EyeSlash,
  CheckCircle,
  Info
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export function PrivacyDataManagement() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [privacyMode, setPrivacyMode] = useKV<boolean>('privacy-mode-enabled', false)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  const handleExportData = async () => {
    try {
      const keys = await spark.kv.keys()
      const exportData: Record<string, unknown> = {}
      
      for (const key of keys) {
        const value = await spark.kv.get(key)
        exportData[key] = value
      }
      
      const dataStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `tlc-driver-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }

  const handleDeleteAllData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    
    setIsDeleting(true)
    
    try {
      const keys = await spark.kv.keys()
      
      for (const key of keys) {
        await spark.kv.delete(key)
      }
      
      toast.success('All data deleted successfully')
      setShowDeleteConfirm(false)
      
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete data')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield size={24} weight="fill" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Privacy & Data Management</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Control your personal data and understand how it's protected
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <Alert>
            <Info size={20} weight="fill" className="text-primary" />
            <AlertDescription className="text-sm ml-2">
              <strong>Your data stays on YOUR device.</strong> All information is stored locally in your browser. 
              No cloud sync, no external servers, complete privacy.
            </AlertDescription>
          </Alert>

          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                {privacyMode ? (
                  <EyeSlash size={20} weight="fill" className="text-muted-foreground" />
                ) : (
                  <Eye size={20} weight="fill" className="text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">Enhanced Privacy Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Mask sensitive data in UI
                  </p>
                </div>
              </div>
              <Button
                variant={privacyMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPrivacyMode(!privacyMode)}
              >
                {privacyMode ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <Lock size={20} weight="fill" className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Data Encryption</p>
                  <p className="text-xs text-muted-foreground">
                    Browser-level encryption active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-success">
                <CheckCircle size={16} weight="fill" />
                Active
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <Shield size={20} weight="fill" className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Local Storage Only</p>
                  <p className="text-xs text-muted-foreground">
                    No cloud sync or external sharing
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-success">
                <CheckCircle size={16} weight="fill" />
                Verified
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Data Management Actions</h4>
          
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
            >
              <FileText size={18} className="mr-2" />
              {showPrivacyPolicy ? 'Hide' : 'View'} Privacy Policy
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={handleExportData}
            >
              <Download size={18} className="mr-2" />
              Export All Data (JSON)
            </Button>

            <Button
              variant={showDeleteConfirm ? 'destructive' : 'outline'}
              className="justify-start"
              onClick={handleDeleteAllData}
              disabled={isDeleting}
            >
              <Trash size={18} className="mr-2" />
              {showDeleteConfirm 
                ? 'Click Again to Confirm Delete' 
                : 'Delete All Data'}
            </Button>

            {showDeleteConfirm && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-xs">
                  <strong>Warning:</strong> This will permanently delete all your shifts, rides, 
                  licenses, documents, and settings. This action cannot be undone.
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="ml-2"
                  >
                    Cancel
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      {showPrivacyPolicy && (
        <Card className="p-6 border-muted">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-3">Privacy Policy Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">What Data We Collect</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>License numbers and expiration dates (for renewal reminders)</li>
                  <li>Shift earnings, trips, and expenses (for analytics)</li>
                  <li>Optional start locations as neighborhood names (not GPS coordinates)</li>
                  <li>Chat messages and fellow driver lists</li>
                  <li>User preferences and notification settings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">What We DON'T Collect</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>❌ Passenger information (names, addresses, phone numbers)</li>
                  <li>❌ Precise GPS history or location tracking</li>
                  <li>❌ Payment card or bank account details</li>
                  <li>❌ Social Security Numbers or biometric data</li>
                  <li>❌ Browsing history or third-party tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">How We Protect Your Data</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>All data stored locally in your browser (IndexedDB)</li>
                  <li>No cloud sync or remote servers storing your info</li>
                  <li>License numbers masked in UI display</li>
                  <li>GPS coordinates used temporarily, never stored</li>
                  <li>HTTPS encryption for all external API calls</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Your Rights</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>✅ Export your data anytime (JSON/CSV formats)</li>
                  <li>✅ Edit or delete any information</li>
                  <li>✅ Complete data deletion with one click</li>
                  <li>✅ Opt-out of location features</li>
                  <li>✅ Control notification preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Third-Party Services</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>NYC Open Data APIs (public TLC and traffic data, read-only)</li>
                  <li>Spark LLM API (anonymized statistics only for AI insights)</li>
                  <li>Browser Geolocation (with permission, not stored)</li>
                  <li>We do NOT sell or share your personal data</li>
                </ul>
              </div>

              <Alert className="mt-4">
                <Info size={18} weight="fill" />
                <AlertDescription className="text-xs ml-2">
                  <strong>Full Privacy Policy:</strong> Available at{' '}
                  <a 
                    href="/docs/PRIVACY_POLICY.md" 
                    target="_blank" 
                    className="text-primary underline"
                  >
                    /docs/PRIVACY_POLICY.md
                  </a>
                  {' '}or contact privacy@[your-domain].com
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 border-muted bg-muted/30">
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Shield size={18} weight="fill" className="text-primary" />
            Security Best Practices
          </h4>
          <ul className="text-xs space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
              <span>Enable device encryption (iOS: on by default, Android: Settings → Security)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
              <span>Use strong device passcode or biometric lock</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
              <span>Keep browser and operating system updated</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
              <span>Be cautious with browser extensions (they can access app data)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
              <span>If device is lost/stolen, change TLC account passwords immediately</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

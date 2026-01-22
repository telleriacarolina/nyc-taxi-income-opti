import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Phone,
  IdentificationCard,
  Car,
  FirstAidKit,
  DeviceMobile,
  Clock,
  CurrencyDollar,
  Lightbulb,
  Warning,
  Star,
  CaretRight
} from '@phosphor-icons/react'

interface EnrollmentStep {
  id: string
  title: string
  description: string
  duration: string
  items: {
    text: string
    detail?: string
    link?: string
  }[]
  tips?: string[]
  warning?: string
}

const ENROLLMENT_STEPS: EnrollmentStep[] = [
  {
    id: 'verify-requirements',
    title: 'Verify Your Requirements',
    description: 'Ensure you meet all basic eligibility requirements before starting the application process',
    duration: '5 minutes',
    items: [
      {
        text: 'Active TLC Driver License',
        detail: 'Must be current and in good standing'
      },
      {
        text: 'TLC Base Affiliation',
        detail: 'Must be affiliated with a licensed TLC base'
      },
      {
        text: 'Clean Driving Record',
        detail: 'No major violations in past 3 years'
      },
      {
        text: 'Valid Commercial Insurance',
        detail: 'Minimum $100,000/$300,000 liability coverage'
      },
      {
        text: 'Smartphone with Data Plan',
        detail: 'Required for MTM dispatch app (iOS 13+ or Android 8+)'
      }
    ],
    tips: [
      'Request a copy of your TLC driving abstract before starting',
      'Have your insurance declarations page ready',
      'Verify your base provides medical transport services'
    ],
    warning: 'Applications are rejected if any requirement is not met. Double-check before proceeding.'
  },
  {
    id: 'gather-documents',
    title: 'Gather Required Documents',
    description: 'Collect all necessary documents to complete your application in one session',
    duration: '15 minutes',
    items: [
      {
        text: 'TLC Driver License (front & back)',
        detail: 'Clear, legible photos or scans'
      },
      {
        text: 'TLC Base Letter',
        detail: 'Affiliation letter on base letterhead (dated within 30 days)'
      },
      {
        text: 'DMV Driver License',
        detail: 'Valid NY State driver license'
      },
      {
        text: 'Social Security Card or Tax ID',
        detail: 'For payment and tax purposes'
      },
      {
        text: 'Vehicle Registration',
        detail: 'Current registration for your TLC vehicle'
      },
      {
        text: 'Insurance Certificate',
        detail: 'Commercial insurance with MTM listed as certificate holder'
      },
      {
        text: 'W-9 Form',
        detail: 'Completed IRS Form W-9',
        link: 'https://www.irs.gov/pub/irs-pdf/fw9.pdf'
      },
      {
        text: 'Banking Information',
        detail: 'Voided check or bank letter for direct deposit'
      }
    ],
    tips: [
      'Scan all documents at 300 DPI or higher',
      'Save files as PDF format (max 5MB each)',
      'Name files clearly: "TLC_License_Front.pdf"',
      'Keep digital copies in a secure folder'
    ]
  },
  {
    id: 'create-account',
    title: 'Create MTM Provider Account',
    description: 'Register online through the MTM provider portal to begin your application',
    duration: '10 minutes',
    items: [
      {
        text: 'Visit MTM Provider Portal',
        detail: 'Go to mtmproviderportal.com',
        link: 'https://mtmproviderportal.com'
      },
      {
        text: 'Click "New Provider Registration"',
        detail: 'Select "Individual Driver" as provider type'
      },
      {
        text: 'Enter Basic Information',
        detail: 'Name, contact info, TLC license number'
      },
      {
        text: 'Select Service Area',
        detail: 'Choose "New York City - All Boroughs"'
      },
      {
        text: 'Create Login Credentials',
        detail: 'Strong password with 2-factor authentication recommended'
      },
      {
        text: 'Verify Email Address',
        detail: 'Check spam folder if verification email doesn\'t arrive'
      }
    ],
    tips: [
      'Use a professional email address (not temporary)',
      'Write down your login credentials securely',
      'Enable text/email notifications for trip alerts'
    ]
  },
  {
    id: 'submit-application',
    title: 'Complete Online Application',
    description: 'Fill out the comprehensive provider application with all required information',
    duration: '30 minutes',
    items: [
      {
        text: 'Personal Information Section',
        detail: 'Name, DOB, SSN, contact details, emergency contact'
      },
      {
        text: 'Professional Licenses',
        detail: 'TLC license #, expiration date, base affiliation details'
      },
      {
        text: 'Vehicle Information',
        detail: 'Make, model, year, VIN, plate #, inspection dates'
      },
      {
        text: 'Insurance Details',
        detail: 'Policy #, carrier, coverage amounts, expiration date'
      },
      {
        text: 'Service Capabilities',
        detail: 'Check: Ambulatory, Wheelchair accessible (if applicable)'
      },
      {
        text: 'Availability Schedule',
        detail: 'Days and hours you\'re available for trips'
      },
      {
        text: 'Upload All Documents',
        detail: 'Attach scanned copies prepared in Step 2'
      },
      {
        text: 'Sign Electronic Agreement',
        detail: 'Review and sign MTM provider agreement'
      }
    ],
    tips: [
      'Save your progress frequently',
      'Application timeout after 30 min of inactivity',
      'Be precise with vehicle details - they must match registration',
      'Indicate accurate availability - affects trip assignments'
    ],
    warning: 'Incomplete applications are automatically rejected after 14 days. Complete all sections.'
  },
  {
    id: 'background-check',
    title: 'Complete Background Check',
    description: 'Authorize and complete the required background screening process',
    duration: '3-5 business days',
    items: [
      {
        text: 'Authorize Background Check',
        detail: 'Sign consent form during application'
      },
      {
        text: 'Receive Email from Screening Partner',
        detail: 'Check email within 24 hours of application submission'
      },
      {
        text: 'Complete Additional Forms',
        detail: 'May require additional info or fingerprinting'
      },
      {
        text: 'Wait for Results',
        detail: 'Typically 3-5 business days for completion'
      },
      {
        text: 'Review Your Status',
        detail: 'Check application status in MTM provider portal'
      }
    ],
    tips: [
      'Respond to screening requests within 48 hours',
      'Disclose any past violations upfront',
      'Contact MTM if background check exceeds 7 days'
    ]
  },
  {
    id: 'training-certification',
    title: 'Complete Required Training',
    description: 'Attend mandatory training sessions and obtain necessary certifications',
    duration: '4-6 hours + certification time',
    items: [
      {
        text: 'MTM Provider Orientation',
        detail: 'Virtual session covering policies, procedures, and dispatch app (2 hours)'
      },
      {
        text: 'Accessible Dispatch App Training',
        detail: 'Learn to use the driver app for trip acceptance and navigation (1 hour)'
      },
      {
        text: 'Customer Service Training',
        detail: 'Working with medical passengers, sensitivity, communication (1 hour)'
      },
      {
        text: 'CPR/First Aid Certification',
        detail: 'Recommended but not required - increases trip opportunities'
      },
      {
        text: 'Wheelchair Assistance Training',
        detail: 'Required only if providing wheelchair-accessible service'
      },
      {
        text: 'Complete Training Quiz',
        detail: 'Pass 80% or higher on final assessment'
      }
    ],
    tips: [
      'Training is typically offered 2-3 times per week',
      'Virtual training available for flexibility',
      'CPR certification adds $5-10 per trip premium',
      'Take notes during training for future reference'
    ]
  },
  {
    id: 'app-setup',
    title: 'Install & Configure Driver App',
    description: 'Download the MTM driver app and complete your profile setup',
    duration: '15 minutes',
    items: [
      {
        text: 'Download MTM Driver App',
        detail: 'Available on iOS App Store or Google Play Store'
      },
      {
        text: 'Login with Portal Credentials',
        detail: 'Use same email/password from provider portal'
      },
      {
        text: 'Allow Location Permissions',
        detail: 'Enable "Always Allow" for optimal trip matching'
      },
      {
        text: 'Enable Push Notifications',
        detail: 'Critical for receiving real-time trip alerts'
      },
      {
        text: 'Complete Driver Profile',
        detail: 'Upload profile photo, vehicle photo, verify phone number'
      },
      {
        text: 'Set Your Availability',
        detail: 'Toggle "Available" when ready to accept trips'
      },
      {
        text: 'Review Trip Acceptance Settings',
        detail: 'Set preferences for trip distance, types, neighborhoods'
      }
    ],
    tips: [
      'Keep app updated to latest version',
      'Enable battery optimization exceptions',
      'Test app navigation before first trip',
      'Familiarize yourself with trip acceptance workflow'
    ]
  },
  {
    id: 'insurance-update',
    title: 'Update Insurance Certificate',
    description: 'Add MTM as certificate holder on your commercial insurance policy',
    duration: '1-2 business days',
    items: [
      {
        text: 'Contact Your Insurance Agent',
        detail: 'Request to add additional certificate holder'
      },
      {
        text: 'Provide MTM Certificate Details',
        detail: 'MTM, Inc. / ModivCare Solutions, 110 W Hubbard St, Suite 200, Chicago, IL 60654'
      },
      {
        text: 'Receive Updated Certificate',
        detail: 'Should include MTM as certificate holder'
      },
      {
        text: 'Upload to Provider Portal',
        detail: 'Submit updated certificate in "Insurance Documents" section'
      },
      {
        text: 'Wait for Verification',
        detail: 'MTM verifies certificate within 24-48 hours'
      }
    ],
    tips: [
      'This is often the slowest step - start early',
      'Some insurers charge a small fee for certificate changes',
      'Verify MTM name and address are correct on certificate',
      'Keep a copy for your records'
    ],
    warning: 'You cannot accept trips until insurance verification is complete.'
  },
  {
    id: 'approval-activation',
    title: 'Receive Approval & Activation',
    description: 'Final review and activation of your provider account',
    duration: '2-3 business days',
    items: [
      {
        text: 'Application Final Review',
        detail: 'MTM reviews all documents and training completion'
      },
      {
        text: 'Receive Approval Email',
        detail: 'Notification sent when approved (check spam folder)'
      },
      {
        text: 'Complete Direct Deposit Setup',
        detail: 'Add bank account in provider portal for payment'
      },
      {
        text: 'Schedule Orientation Call',
        detail: 'Optional 15-min call with onboarding specialist'
      },
      {
        text: 'Account Activation',
        detail: 'Profile goes live in dispatch system'
      },
      {
        text: 'Receive First Trip Assignment',
        detail: 'Turn on "Available" status in app to receive trips'
      }
    ],
    tips: [
      'Log in to app daily to check for scheduled trips',
      'Respond quickly to trip offers (30-second timer)',
      'First week may have fewer trips as system learns your patterns',
      'Contact driver support with any questions: 1-866-527-9933'
    ]
  },
  {
    id: 'first-trip-success',
    title: 'Complete Your First Trip',
    description: 'Best practices for a successful first MTM trip experience',
    duration: '45-90 minutes',
    items: [
      {
        text: 'Accept Your First Trip',
        detail: 'Start with short, familiar routes if possible'
      },
      {
        text: 'Review Trip Details',
        detail: 'Pickup location, passenger name, destination, special needs'
      },
      {
        text: 'Arrive 10 Minutes Early',
        detail: 'Medical appointments are time-sensitive'
      },
      {
        text: 'Call Passenger When Arriving',
        detail: 'Use in-app call feature to notify passenger'
      },
      {
        text: 'Verify Passenger Identity',
        detail: 'Confirm name and destination before departure'
      },
      {
        text: 'Assist as Needed',
        detail: 'Help with doors, bags, mobility devices (if trained)'
      },
      {
        text: 'Use App Navigation',
        detail: 'Follow MTM app GPS for optimal routing'
      },
      {
        text: 'Mark Trip Status Updates',
        detail: 'Tap "Arrived", "Picked Up", "Dropped Off" in app'
      },
      {
        text: 'Collect Signature',
        detail: 'Have passenger sign on your phone to complete trip'
      },
      {
        text: 'Rate Your Experience',
        detail: 'Provide feedback in app after completion'
      }
    ],
    tips: [
      'Be patient - medical passengers may move slowly',
      'Keep vehicle clean and comfortable',
      'Maintain professional, friendly demeanor',
      'Document any issues immediately in app notes'
    ]
  }
]

export function MTMEnrollmentWalkthrough() {
  const [currentStep, setCurrentStep] = useKV<number>('mtm-enrollment-step', 0)
  const [completedSteps, setCompletedSteps] = useKV<string[]>('mtm-completed-steps', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const stepIndex = currentStep ?? 0
  const step = ENROLLMENT_STEPS[stepIndex]
  const progress = ((stepIndex + 1) / ENROLLMENT_STEPS.length) * 100

  const toggleStepComplete = (stepId: string) => {
    setCompletedSteps((current) => {
      const completed = current || []
      if (completed.includes(stepId)) {
        return completed.filter(id => id !== stepId)
      } else {
        return [...completed, stepId]
      }
    })
  }

  const isStepCompleted = (stepId: string) => {
    return (completedSteps || []).includes(stepId)
  }

  const nextStep = () => {
    const current = currentStep ?? 0
    if (current < ENROLLMENT_STEPS.length - 1) {
      setCurrentStep(current + 1)
    }
  }

  const prevStep = () => {
    const current = currentStep ?? 0
    if (current > 0) {
      setCurrentStep(current - 1)
    }
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full gap-2">
          <Star size={18} weight="fill" />
          MTM Enrollment Walkthrough
          <ArrowRight size={16} weight="bold" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <FirstAidKit size={22} weight="fill" className="text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold">MTM Enrollment Guide</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">
                Step {stepIndex + 1} of {ENROLLMENT_STEPS.length}: {step.title}
              </div>
            </div>
          </DialogTitle>
          <div className="pt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-48 border-r bg-muted/30 overflow-y-auto">
            <div className="p-3 space-y-1">
              {ENROLLMENT_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToStep(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                    stepIndex === idx
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : isStepCompleted(s.id)
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isStepCompleted(s.id) ? (
                      <CheckCircle size={14} weight="fill" className="flex-shrink-0" />
                    ) : (
                      <Circle size={14} weight={stepIndex === idx ? 'fill' : 'regular'} className="flex-shrink-0" />
                    )}
                    <span className="line-clamp-2">{s.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="gap-1.5">
                        <Clock size={12} weight="fill" />
                        {step.duration}
                      </Badge>
                      <Button
                        variant={isStepCompleted(step.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleStepComplete(step.id)}
                        className="gap-1.5 h-7"
                      >
                        <CheckCircle size={14} weight={isStepCompleted(step.id) ? 'fill' : 'regular'} />
                        {isStepCompleted(step.id) ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                {step.warning && (
                  <Card className="p-3 mb-4 bg-destructive/10 border-destructive/30">
                    <div className="flex items-start gap-2">
                      <Warning size={18} className="text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <div className="text-xs font-semibold text-destructive mb-1">Important Warning</div>
                        <div className="text-xs text-foreground/80">{step.warning}</div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-4 mb-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Action Items
                  </div>
                  <div className="space-y-3">
                    {step.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{item.text}</div>
                          {item.detail && (
                            <div className="text-xs text-muted-foreground">{item.detail}</div>
                          )}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                            >
                              Visit Link
                              <CaretRight size={12} weight="bold" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {step.tips && step.tips.length > 0 && (
                  <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/30">
                    <div className="flex items-start gap-3">
                      <Lightbulb size={20} className="text-blue-600 flex-shrink-0" weight="fill" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">
                          Pro Tips
                        </div>
                        <ul className="space-y-2">
                          {step.tips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-foreground/80 flex items-start gap-2">
                              <span className="text-blue-600 font-bold">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="gap-2"
            >
              <ArrowLeft size={16} weight="bold" />
              Previous
            </Button>
            <div className="text-xs text-muted-foreground">
              {completedSteps?.length || 0} of {ENROLLMENT_STEPS.length} steps completed
            </div>
            {stepIndex < ENROLLMENT_STEPS.length - 1 ? (
              <Button
                variant="default"
                onClick={nextStep}
                className="gap-2"
              >
                Next Step
                <ArrowRight size={16} weight="bold" />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => setIsDialogOpen(false)}
                className="gap-2"
              >
                <CheckCircle size={16} weight="fill" />
                Finish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

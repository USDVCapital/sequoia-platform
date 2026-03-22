'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ClipboardList,
  Building2,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Lock,
  Phone,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import { submitApplication } from '@/lib/supabase/actions'

// ─── Zod Schemas ────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(/^[\d\s\-\(\)\+]+$/, 'Phone must contain only numbers'),
  businessName: z.string().min(1, 'Business name is required'),
})

const step2Schema = z.object({
  fundingType: z.string().min(1, 'Please select a solution type'),
  estimatedAmount: z.string().min(1, 'Please select an estimated amount'),
  description: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

// ─── Constants ─────────────────────────────────────────────────────────────────

const FUNDING_TYPES = [
  { group: 'Real Estate Loans', options: [
    '1–4 Unit Investment Property',
    'Fix & Flip',
    'Multi-Family 5+ Units',
    'Mixed Use',
    'Commercial Real Estate',
    'Land',
    'Construction',
  ]},
  { group: 'Business Funding', options: [
    'Equipment Funding',
    'Truck & Heavy Equipment',
    'Working Capital',
    'Term Loan',
    'Business Acquisition',
    'AR / Invoice Funding',
    'Gap Funding / NINA',
    'Retirement Account Rollover (ROBS)',
  ]},
  { group: 'Business Services', options: [
    'Employee Wellness Program (EHMP)',
    'Property Restoration',
    'Cost Segregation',
    'Tax Appeal',
    'Credit Services',
  ]},
  { group: 'Clean Energy', options: [
    'Commercial Solar',
    'EV Charging Stations',
  ]},
]

const AMOUNT_RANGES = [
  'Under $100,000',
  '$100,000 – $250,000',
  '$250,000 – $500,000',
  '$500,000 – $1,000,000',
  '$1,000,000 – $5,000,000',
  '$5,000,000 – $25,000,000',
  '$25,000,000+',
  'Not sure yet',
]

const STEPS = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Tell us about your project',
    description: "Share what you're working on and what kind of solution you need.",
  },
  {
    number: 2,
    icon: Building2,
    title: 'Tell us about your business',
    description: 'Basic details so we can route you to the right advisor.',
  },
  {
    number: 3,
    icon: Sparkles,
    title: 'Get matched',
    description: 'A Sequoia advisor will reach out within one business day.',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start gap-0 mb-10">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        const isComplete = currentStep > step.number
        const isActive = currentStep === step.number
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.number} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isComplete
                    ? 'border-sequoia-600 bg-sequoia-600 text-white'
                    : isActive
                    ? 'border-sequoia-700 bg-sequoia-700 text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Icon className="size-4.5" />
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={`text-xs font-semibold ${
                    isActive ? 'text-sequoia-900' : isComplete ? 'text-sequoia-700' : 'text-gray-400'
                  }`}
                >
                  Step {step.number}
                </p>
                <p
                  className={`text-xs max-w-[100px] leading-tight ${
                    isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mt-5 mx-2 transition-colors duration-200 ${
                  isComplete ? 'bg-sequoia-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
  error?: string
}

function Field({ label, required, children, hint, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-gold-700 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Apply for Commercial Funding — Sequoia Enterprise Solutions'
  }, [])

  // Step 1 form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', businessName: '' },
  })

  // Step 2 form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onBlur',
    defaultValues: { fundingType: '', estimatedAmount: '', description: '' },
  })

  const s1 = step1Form.formState
  const s2 = step2Form.formState

  function handleNext() {
    step1Form.handleSubmit(() => {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })()
  }

  function handleBack() {
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault()
    step2Form.handleSubmit(async (step2Data) => {
      const step1Data = step1Form.getValues()
      await submitApplication({
        firstName: step1Data.firstName,
        lastName: step1Data.lastName,
        email: step1Data.email,
        phone: step1Data.phone,
        businessName: step1Data.businessName,
        fundingType: step2Data.fundingType,
        estimatedAmount: step2Data.estimatedAmount,
        description: step2Data.description,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })()
  }

  if (submitted) {
    const firstName = step1Form.getValues('firstName')

    return (
      <div className="min-h-screen bg-gradient-section flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-sequoia-900 mb-4">
            You&apos;re all set, {firstName}.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            A Sequoia advisor will contact you within one business day.
          </p>

          <Button href="/solutions" variant="primary" size="lg">
            Explore Our Solutions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Page Hero ── */}
      <section className="relative overflow-hidden py-16">
        <HeroVideo />

        <div className="container-brand relative z-10 text-center">
          <span className="badge-dark mb-4 inline-flex">Concierge Intake</span>
          <h1 className="text-display-md sm:text-display-lg font-extrabold tracking-tight text-white">
            Let&apos;s Find the Right Solution for You
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            This isn&apos;t a loan application — it&apos;s a conversation starter. Share a little about
            your goals, and we&apos;ll match you with the right advisor.
          </p>
        </div>
      </section>

      {/* ── How it Works strip ── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="container-brand">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="icon-box-sequoia shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                      Step {step.number}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="size-4 text-gray-300 hidden sm:block mt-1 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="mx-auto max-w-2xl">
            {/* Progress */}
            <ProgressSteps currentStep={currentStep} />

            <form
              onSubmit={handleFinalSubmit}
              noValidate
              className="rounded-2xl bg-white border border-gray-100 shadow-brand-md p-8 sm:p-10"
            >
              {/* ── Step 1: Contact Info ── */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-sequoia-900">About You</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Basic contact info so we can reach you. We&apos;ll never sell your information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="First Name" required error={s1.errors.firstName?.message}>
                      <input
                        type="text"
                        className={`input-brand ${s1.errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Jane"
                        autoComplete="given-name"
                        {...step1Form.register('firstName')}
                      />
                    </Field>

                    <Field label="Last Name" required error={s1.errors.lastName?.message}>
                      <input
                        type="text"
                        className={`input-brand ${s1.errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Smith"
                        autoComplete="family-name"
                        {...step1Form.register('lastName')}
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" required error={s1.errors.email?.message}>
                    <input
                      type="email"
                      className={`input-brand ${s1.errors.email ? 'border-red-500' : ''}`}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      {...step1Form.register('email')}
                    />
                  </Field>

                  <Field
                    label="Phone Number"
                    required
                    hint="A Sequoia advisor may call to discuss your inquiry."
                    error={s1.errors.phone?.message}
                  >
                    <input
                      type="tel"
                      className={`input-brand ${s1.errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                      {...step1Form.register('phone')}
                    />
                  </Field>

                  <Field
                    label="Business or Company Name"
                    required
                    error={s1.errors.businessName?.message}
                  >
                    <input
                      type="text"
                      className={`input-brand ${s1.errors.businessName ? 'border-red-500' : ''}`}
                      placeholder="Acme Holdings LLC"
                      autoComplete="organization"
                      {...step1Form.register('businessName')}
                    />
                  </Field>

                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="primary" size="lg" onClick={handleNext}>
                      Continue
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Project Info ── */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-sequoia-900">About Your Project</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Help us match you with the right solution and advisor.
                    </p>
                  </div>

                  <Field label="What type of solution are you looking for?" required error={s2.errors.fundingType?.message}>
                    <select
                      className={`input-brand ${s2.errors.fundingType ? 'border-red-500' : ''}`}
                      {...step2Form.register('fundingType')}
                    >
                      <option value="">Select a solution type...</option>
                      {FUNDING_TYPES.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </Field>

                  <Field label="Estimated Amount Needed" required error={s2.errors.estimatedAmount?.message}>
                    <select
                      className={`input-brand ${s2.errors.estimatedAmount ? 'border-red-500' : ''}`}
                      {...step2Form.register('estimatedAmount')}
                    >
                      <option value="">Select a range...</option>
                      {AMOUNT_RANGES.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Brief Description"
                    hint="Optional but helpful. 2–3 sentences is plenty."
                  >
                    <textarea
                      className="input-brand resize-none"
                      rows={4}
                      placeholder="e.g. I'm looking to acquire a 12-unit apartment building in Phoenix and need bridge financing while I wait on a conventional loan approval..."
                      {...step2Form.register('description')}
                    />
                  </Field>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      &larr; Back
                    </button>
                    <Button type="submit" variant="secondary" size="lg">
                      Submit Inquiry
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* Trust signals */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-sequoia-400" />
                Your information is encrypted and never sold
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-sequoia-400" />
                Response within one business day
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-sequoia-400" />
                No commitment required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sidebar reassurance panel ── */}
      <section className="bg-sequoia-50 border-t border-sequoia-100 py-12">
        <div className="container-brand">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-700 mb-3">
              What Happens Next
            </p>
            <h2 className="text-2xl font-bold text-sequoia-900">A concierge experience, not a call center</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 max-w-lg mx-auto">
              When you submit your inquiry, a real Sequoia advisor reviews it personally. We don&apos;t
              blast your information to a hundred lenders — we thoughtfully match you with the
              right solution and walk with you through the process.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: CheckCircle2, text: 'Personal advisor assigned within 24 hours' },
                { icon: CheckCircle2, text: 'No hard credit pull without your consent' },
                { icon: CheckCircle2, text: 'Access to 500+ vetted lending partners' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2 rounded-xl bg-white border border-sequoia-100 p-4"
                >
                  <Icon className="size-4 text-sequoia-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

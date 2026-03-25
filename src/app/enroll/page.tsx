'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle2,
  Users,
  Layers,
  Zap,
  BookOpen,
  Play,
  Globe,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CircleCheck,
} from 'lucide-react'
import HeroVideo from '@/components/HeroVideo'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import { submitEnrollment } from '@/lib/supabase/actions'

// ─── Zod Schema ─────────────────────────────────────────────────────────────────

const enrollSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(/^[\d\s\-\(\)\+]+$/, 'Phone must contain only numbers'),
  background: z.string().min(1, 'Please select your professional background'),
  referralCode: z.string().optional(),
  agreeToTerms: z.literal(true, { message: 'You must agree to the Terms of Service' }),
})

type EnrollFormData = z.infer<typeof enrollSchema>

// ─── Constants ──────────────────────────────────────────────────────────────────

const valueItems = [
  { icon: <Users size={17} />, text: 'Access to 500+ vetted lending partners' },
  { icon: <Layers size={17} />, text: 'Full product suite: Real Estate, Business Funding, Services, Clean Energy' },
  { icon: <Zap size={17} />, text: 'SEA AI Assistant for instant product guidance' },
  { icon: <BookOpen size={17} />, text: 'Weekly live training — Wednesdays 8 PM ET' },
  { icon: <Play size={17} />, text: '190+ on-demand training videos' },
  { icon: <Globe size={17} />, text: 'Personal replicated website' },
  { icon: <BarChart3 size={17} />, text: 'Back office with real-time deal tracking' },
]

const backgrounds = [
  'Real Estate Agent / Broker',
  'Loan Officer / Mortgage Professional',
  'Insurance Agent / Broker',
  'CPA / Accountant',
  'Financial Advisor / Planner',
  'Business Consultant',
  'Other',
]

export default function EnrollPage() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Join the Sequoia Consultant Network — $29.99/Month'
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      background: '',
      referralCode: '',
      agreeToTerms: false as unknown as true,
    },
  })

  async function onSubmit(data: EnrollFormData) {
    await submitEnrollment({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      background: data.background,
    })
    setSubmitted(true)
  }

  return (
    <div className="bg-background">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16">
        <HeroVideo />

        <div className="container-brand text-center relative z-10">
          <span className="badge-dark mb-5 inline-flex">
            <ShieldCheck size={12} />
            Secure Enrollment
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Become a Sequoia Consultant
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            One flat monthly fee. Full platform access. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Left — Value Recap */}
            <FadeIn direction="left" className="lg:col-span-2">
              <div>
                {/* Pricing callout */}
                <div className="rounded-2xl bg-gradient-sequoia p-8 text-center mb-8">
                  <p className="text-white/80 text-sm uppercase tracking-widest font-semibold mb-2">
                    Consultant Membership
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">$29</span>
                    <span className="text-xl font-bold text-white/70 mb-1">.99</span>
                    <span className="text-white/70 mb-1">/month</span>
                  </div>
                  <p className="text-white/70 text-xs mt-2">Cancel anytime. No contracts.</p>
                </div>

                {/* What's included */}
                <h2 className="text-xl font-bold text-gray-900 mb-5">What You Get</h2>
                <ul className="space-y-4">
                  {valueItems.map((item) => (
                    <li key={item.text} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sequoia-100 text-sequoia-700 flex items-center justify-center mt-0.5">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider-gold my-8" />

                {/* Trust signals */}
                <div className="space-y-3">
                  {[
                    'No license required to refer clients',
                    'Weekly live support and training',
                    'Real people, real deals — 500+ funded',
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                      <CircleCheck size={16} className="text-sequoia-600 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — Enrollment Form */}
            <FadeIn direction="right" className="lg:col-span-3">
              <div>
                {submitted ? (
                  <SuccessState name={`${getValues('firstName')} ${getValues('lastName')}`} email={getValues('email')} />
                ) : (
                  <div className="card-sequoia p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h2>
                    <p className="text-gray-500 text-sm mb-7">
                      Complete the form below to start your Sequoia consultant membership.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                      {/* First & Last Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-semibold text-gray-700 mb-1.5"
                          >
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            autoComplete="given-name"
                            placeholder="Jane"
                            className={`input-brand ${errors.firstName ? 'border-red-500' : ''}`}
                            {...register('firstName')}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-semibold text-gray-700 mb-1.5"
                          >
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            autoComplete="family-name"
                            placeholder="Smith"
                            className={`input-brand ${errors.lastName ? 'border-red-500' : ''}`}
                            {...register('lastName')}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-1.5"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          className={`input-brand ${errors.email ? 'border-red-500' : ''}`}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-1.5"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 000-0000"
                          className={`input-brand ${errors.phone ? 'border-red-500' : ''}`}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Professional Background */}
                      <div>
                        <label
                          htmlFor="background"
                          className="block text-sm font-semibold text-gray-700 mb-1.5"
                        >
                          Professional Background <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="background"
                          className={`input-brand ${errors.background ? 'border-red-500' : ''}`}
                          {...register('background')}
                        >
                          <option value="">Select your background...</option>
                          {backgrounds.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        {errors.background && (
                          <p className="mt-1 text-xs text-red-500">{errors.background.message}</p>
                        )}
                      </div>

                      {/* Referral Code */}
                      <div>
                        <label
                          htmlFor="referralCode"
                          className="block text-sm font-semibold text-gray-700 mb-1.5"
                        >
                          Referral Code{' '}
                          <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          id="referralCode"
                          type="text"
                          placeholder="Enter referral code if you have one"
                          className="input-brand"
                          {...register('referralCode')}
                        />
                      </div>

                      {/* Pricing reminder */}
                      <div className="rounded-lg bg-sequoia-50 border border-sequoia-200 p-4 flex items-center justify-between">
                        <span className="text-sequoia-800 font-semibold text-sm">
                          Consultant Membership
                        </span>
                        <span className="text-sequoia-900 font-black text-xl">
                          $29.99<span className="text-sm font-normal text-sequoia-700">/mo</span>
                        </span>
                      </div>

                      {/* Agree to terms */}
                      <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-sequoia-600 focus:ring-sequoia-500"
                            {...register('agreeToTerms')}
                          />
                          <span className="text-sm text-gray-600 leading-relaxed">
                            I agree to the{' '}
                            <a href="/terms" className="font-semibold text-sequoia-700 hover:text-sequoia-800 underline underline-offset-2">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="font-semibold text-sequoia-700 hover:text-sequoia-800 underline underline-offset-2">
                              Privacy Policy
                            </a>
                            . <span className="text-red-500">*</span>
                          </span>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn-gold w-full justify-center text-base py-4"
                      >
                        Complete Enrollment
                        <ArrowRight size={18} />
                      </button>

                      <p className="text-center text-xs text-gray-400 leading-relaxed">
                        Cancel anytime from your account dashboard.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
    </div>
  )
}

function SuccessState({ name }: { name: string; email: string }) {
  const firstName = name.split(' ')[0]
  return (
    <div className="card-sequoia p-10 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to Sequoia, {firstName}!
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed mb-1 max-w-sm mx-auto">
        Your membership is being activated. Check your email for next steps.
      </p>

      <div className="mt-8">
        <a href="/resources" className="btn-primary inline-flex items-center gap-2" style={{ color: '#FFFFFF' }}>
          Start Training
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBooking } from '@/contexts/BookingContext'
import HeroVideo from '@/components/HeroVideo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionHeading from '@/components/ui/SectionHeading'
import FadeIn from '@/components/motion/FadeIn'
import StaggerContainer from '@/components/motion/StaggerContainer'
import StaggerItem from '@/components/motion/StaggerItem'
import { MapPin, Phone, Mail, Clock, CheckCircle2, ChevronRight } from 'lucide-react'

// ─── Zod Schema ─────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().refine(
    (val) => !val || /^[\d\s\-\(\)\+]*$/.test(val),
    'Phone must contain only numbers'
  ),
  role: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

// ─── Constants ──────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const contactDetails = [
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    primary: '301-337-8035',
    secondary: 'Monday – Friday, 9 AM – 6 PM ET',
    href: 'tel:+13013378035',
  },
  {
    icon: <Mail size={20} />,
    label: 'General Support',
    primary: 'support@seqsolution.com',
    secondary: 'For funding inquiries & client support',
    href: 'mailto:support@seqsolution.com',
  },
  {
    icon: <Mail size={20} />,
    label: 'Partnership Inquiries',
    primary: 'marketing@seqsolution.com',
    secondary: 'Agent partnerships, referrals & co-marketing',
    href: 'mailto:marketing@seqsolution.com',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Office',
    primary: '9200 Corporate Blvd, Ste 142',
    secondary: 'Rockville, MD 20850',
    href: 'https://maps.google.com/?q=9200+Corporate+Blvd+Ste+142+Rockville+MD+20850',
  },
  {
    icon: <Clock size={20} />,
    label: 'Office Hours',
    primary: 'Mon – Fri: 9:00 AM – 6:00 PM ET',
    secondary: 'Wednesday Training Call: 8:00 PM ET',
    href: null,
  },
]

const roleOptions = [
  { value: '', label: 'Select your role...' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'real-estate-agent', label: 'Real Estate Agent' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
]

export default function ContactPage() {
  const { openBooking } = useBooking()
  const [status, setStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    document.title = 'Contact Sequoia Enterprise Solutions — Rockville, MD'
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', role: '', message: '' },
  })

  async function onSubmit() {
    setStatus('submitting')
    // Simulate network latency (no backend)
    await new Promise((r) => setTimeout(r, 900))
    setStatus('success')
    reset()
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden section-padding">
        <HeroVideo />

        <div className="container-brand relative z-10">
          <FadeIn direction="up">
            <div className="mx-auto max-w-2xl text-center">
              <span className="badge-dark mb-6 inline-flex">Get in Touch</span>
              <h1 className="text-gradient-hero text-4xl font-bold tracking-tight sm:text-5xl">
                Contact Us Today
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-sequoia-200">
                Have a question about funding, partnerships, or our programs? Our team is ready to help
                — reach out and we&apos;ll respond promptly.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-section">
        <div className="container-brand">
          <div className="grid gap-10 lg:grid-cols-5 lg:items-start">

            {/* ── Left column: contact info ─────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <FadeIn direction="up">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-gold-700">
                    Reach Us
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    We&apos;re Here to Help
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    Whether you prefer email, phone, or stopping by our Rockville office — there&apos;s
                    always someone ready to assist.
                  </p>
                </div>
              </FadeIn>

              <StaggerContainer className="flex flex-col gap-4">
                {contactDetails.map(({ icon, label, primary, secondary, href }) => (
                  <StaggerItem key={label}>
                    <Card className="flex items-start gap-4 p-5">
                      <div className="icon-box-sequoia shrink-0">{icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="mt-0.5 block truncate font-semibold text-sequoia-700 hover:text-sequoia-800"
                          >
                            {primary}
                          </a>
                        ) : (
                          <p className="mt-0.5 font-semibold text-sequoia-900">{primary}</p>
                        )}
                        <p className="mt-0.5 text-xs text-gray-500">{secondary}</p>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Wednesday training callout */}
              <FadeIn direction="up" delay={0.1}>
                <Card className="border-gold-200 bg-gold-50 p-5">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-gold-700" />
                    <div>
                      <p className="font-semibold text-gold-900">Wednesday Training Call</p>
                      <p className="mt-1 text-sm leading-relaxed text-gold-800">
                        Join our weekly training every Wednesday at <strong>8:00 PM ET</strong> — open
                        to agents, consultants, and curious business owners.
                      </p>
                      <a
                        href="tel:+13013378035"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold-800"
                      >
                        <Phone size={13} />
                        Call 301-337-8035 to RSVP
                      </a>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            </div>

            {/* ── Right column: contact form ───────────────────────────── */}
            <FadeIn direction="right" className="lg:col-span-3">
              <Card className="p-8">
                {status === 'success' ? (
                  /* Success state */
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sequoia-100">
                      <CheckCircle2 size={32} className="text-sequoia-600" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-sequoia-900">Message Sent!</h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                      Thank you for reaching out. A member of our team will be in touch within one
                      business day. For urgent matters, call us at{' '}
                      <a href="tel:+13013378035" className="font-semibold text-sequoia-700">
                        301-337-8035
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-6 text-sm font-semibold text-sequoia-700 underline underline-offset-2 hover:text-sequoia-800"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <>
                    <div className="mb-7">
                      <h3 className="text-xl font-bold text-sequoia-900">Send Us a Message</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Fill out the form below and we&apos;ll get back to you shortly.
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="space-y-5"
                    >
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Smith"
                          className={`input-brand ${errors.name ? 'border-red-500' : ''}`}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email + Phone row */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
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
                            <p className="mt-1 text-xs text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                          >
                            Phone Number
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
                            <p className="mt-1 text-xs text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label
                          htmlFor="role"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          I am a...
                        </label>
                        <select
                          id="role"
                          className="input-brand appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-10"
                          {...register('role')}
                        >
                          {roleOptions.map(({ value, label }) => (
                            <option key={value} value={value} disabled={value === ''}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          placeholder="Tell us what you need — funding type, loan amount, timeline, or anything else on your mind..."
                          className={`input-brand resize-y ${errors.message ? 'border-red-500' : ''}`}
                          {...register('message')}
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={status === 'submitting'}
                        className="w-full justify-center"
                      >
                        {status === 'submitting' ? (
                          <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ChevronRight size={16} />
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs leading-relaxed text-gray-400">
                        Prefer to talk?{' '}
                        <a
                          href="tel:+13013378035"
                          className="font-semibold text-sequoia-700 hover:text-sequoia-800"
                        >
                          Call 301-337-8035
                        </a>{' '}
                        or join our{' '}
                        <strong className="text-gray-600">Wednesday training at 8 PM ET</strong>.
                      </p>
                    </form>
                  </>
                )}
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Book a Call ────────────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="container-brand">
          <FadeIn direction="up">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-700 mb-2">
                Prefer to schedule directly?
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Skip the form and book a call with our team at a time that works for you.
              </p>
              <Button variant="secondary" size="lg" onClick={() => openBooking()}>
                Book a Call
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  )
}

'use client'

import { createClient } from './client'

type ActionResult = { success: boolean; error?: string }

/**
 * Check whether Supabase env vars are configured.
 * If not, every submit function will fall back to localStorage.
 */
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function saveToLocalStorage(key: string, data: Record<string, unknown>): void {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push({ ...data, _savedAt: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(existing))
  } catch {
    // localStorage not available (SSR, private mode, etc.) — silently ignore
  }
}

// ─── Submit Application (Apply page) ────────────────────────────────────────────

export async function submitApplication(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string
  fundingType: string
  estimatedAmount: string
  description?: string
  referralSource?: string
  isOwner?: string
  state?: string
  timeline?: string
  hasConsultant?: string
  consultantName?: string
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    saveToLocalStorage('sequoia_applications', data)
    return { success: true }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      role: 'applicant',
      message: [
        `Business: ${data.businessName}`,
        `Funding Type: ${data.fundingType}`,
        `Estimated Amount: ${data.estimatedAmount}`,
        data.description ? `Description: ${data.description}` : '',
        data.referralSource ? `Referral Source: ${data.referralSource}` : '',
        data.isOwner ? `Is Owner: ${data.isOwner}` : '',
        data.state ? `State: ${data.state}` : '',
        data.timeline ? `Timeline: ${data.timeline}` : '',
        data.hasConsultant ? `Has Consultant: ${data.hasConsultant}` : '',
        data.consultantName ? `Consultant Name: ${data.consultantName}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('[Sequoia] Supabase insert error (application):', error)
      saveToLocalStorage('sequoia_applications', data)
      return { success: true }
    }

    return { success: true }
  } catch (err) {
    console.error('[Sequoia] Supabase exception (application):', err)
    saveToLocalStorage('sequoia_applications', data)
    return { success: true }
  }
}

// ─── Submit Contact Form ─────────────────────────────────────────────────────────

export async function submitContact(data: {
  name: string
  email: string
  phone?: string
  message: string
  role?: string
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    saveToLocalStorage('sequoia_contacts', data)
    return { success: true }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role || 'general',
      message: data.message,
    })

    if (error) {
      console.error('[Sequoia] Supabase insert error (contact):', error)
      saveToLocalStorage('sequoia_contacts', data)
      return { success: true }
    }

    return { success: true }
  } catch (err) {
    console.error('[Sequoia] Supabase exception (contact):', err)
    saveToLocalStorage('sequoia_contacts', data)
    return { success: true }
  }
}

// ─── Submit Enrollment ───────────────────────────────────────────────────────────

export async function submitEnrollment(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  background: string
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    saveToLocalStorage('sequoia_enrollments', data)
    return { success: true }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      role: 'enrollment',
      message: `Professional Background: ${data.background}`,
    })

    if (error) {
      console.error('[Sequoia] Supabase insert error (enrollment):', error)
      saveToLocalStorage('sequoia_enrollments', data)
      return { success: true }
    }

    return { success: true }
  } catch (err) {
    console.error('[Sequoia] Supabase exception (enrollment):', err)
    saveToLocalStorage('sequoia_enrollments', data)
    return { success: true }
  }
}

// ─── Submit Partner Inquiry ──────────────────────────────────────────────────────

export async function submitPartnerInquiry(data: {
  name: string
  email: string
  phone: string
  role: string
  clientCount: string
  partnershipModel: string
  message?: string
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    saveToLocalStorage('sequoia_partner_inquiries', data)
    return { success: true }
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.from('contact_submissions').insert({
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'partner',
      message: [
        `Professional Role: ${data.role}`,
        `Client Count: ${data.clientCount}`,
        `Partnership Model: ${data.partnershipModel}`,
        data.message ? `Message: ${data.message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('[Sequoia] Supabase insert error (partner):', error)
      saveToLocalStorage('sequoia_partner_inquiries', data)
      return { success: true }
    }

    return { success: true }
  } catch (err) {
    console.error('[Sequoia] Supabase exception (partner):', err)
    saveToLocalStorage('sequoia_partner_inquiries', data)
    return { success: true }
  }
}

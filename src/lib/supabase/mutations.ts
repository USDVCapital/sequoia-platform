'use server'

import { createClient } from './server'

type ActionResult = { success: boolean; error?: string }

// ── Leads / Pipeline ────────────────────────────────────────

export async function createLead(data: {
  consultantId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  businessName?: string
  fundingType: string
  estimatedAmount?: string
  description?: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').insert({
    consultant_id: data.consultantId,
    client_name: data.clientName,
    client_email: data.clientEmail,
    client_phone: data.clientPhone || null,
    business_name: data.businessName || null,
    funding_type: data.fundingType,
    estimated_amount: data.estimatedAmount || null,
    description: data.description || null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateLeadStatus(
  leadId: string,
  status: string,
  fundedAmount?: number
): Promise<ActionResult> {
  const supabase = await createClient()
  const update: Record<string, unknown> = { status }
  if (fundedAmount !== undefined) update.funded_amount = fundedAmount

  const { error } = await supabase.from('leads').update(update).eq('id', leadId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Wellness Enrollments ────────────────────────────────────

export async function createWellnessEnrollment(data: {
  consultantId: string
  companyName: string
  contactName: string
  contactEmail: string
  employeeCount: number
  monthlyRate: number
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('wellness_enrollments').insert({
    consultant_id: data.consultantId,
    company_name: data.companyName,
    contact_name: data.contactName,
    contact_email: data.contactEmail,
    employee_count: data.employeeCount,
    monthly_rate: data.monthlyRate,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Community ───────────────────────────────────────────────

export async function createCommunityPost(data: {
  authorId: string
  content: string
  category: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('community_posts').insert({
    author_id: data.authorId,
    content: data.content,
    category: data.category,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function togglePostLike(
  consultantId: string,
  postId: string
): Promise<ActionResult & { liked?: boolean }> {
  const supabase = await createClient()

  // Check if already liked
  const { data: existing } = await supabase
    .from('community_likes')
    .select('id')
    .eq('consultant_id', consultantId)
    .eq('post_id', postId)
    .single()

  if (existing) {
    // Unlike
    const { error } = await supabase.from('community_likes').delete().eq('id', existing.id)
    if (error) return { success: false, error: error.message }

    // Decrement count
    const { data: post } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', postId)
      .single()
    if (post) {
      await supabase
        .from('community_posts')
        .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
        .eq('id', postId)
    }

    return { success: true, liked: false }
  } else {
    // Like
    const { error } = await supabase.from('community_likes').insert({
      consultant_id: consultantId,
      post_id: postId,
    })
    if (error) return { success: false, error: error.message }

    // Increment count
    const { data: post } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', postId)
      .single()
    if (post) {
      await supabase
        .from('community_posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', postId)
    }

    return { success: true, liked: true }
  }
}

export async function createComment(data: {
  authorId: string
  postId: string
  content: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('community_comments').insert({
    author_id: data.authorId,
    post_id: data.postId,
    content: data.content,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Notifications ───────────────────────────────────────────

export async function markNotificationsRead(
  consultantId: string,
  notificationIds?: string[]
): Promise<ActionResult> {
  const supabase = await createClient()

  let query = supabase
    .from('notifications')
    .update({ read: true })
    .eq('consultant_id', consultantId)

  if (notificationIds && notificationIds.length > 0) {
    query = query.in('id', notificationIds)
  }

  const { error } = await query
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function createNotification(data: {
  consultantId: string
  type: string
  title: string
  message: string
  link?: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('notifications').insert({
    consultant_id: data.consultantId,
    type: data.type,
    title: data.title,
    message: data.message,
    link: data.link || null,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Goals ───────────────────────────────────────────────────

export async function updateConsultantGoals(data: {
  consultantId: string
  year: number
  monthlyIncomeGoal: number
  ehmpEnrolleesGoal: number
  dealsToCloseGoal: number
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('consultant_goals').upsert({
    consultant_id: data.consultantId,
    year: data.year,
    monthly_income_goal: data.monthlyIncomeGoal,
    ehmp_enrollees_goal: data.ehmpEnrolleesGoal,
    deals_to_close_goal: data.dealsToCloseGoal,
  }, { onConflict: 'consultant_id,year' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Onboarding ──────────────────────────────────────────────

export async function updateOnboardingStep(
  consultantId: string,
  stepId: string,
  completed: boolean
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('onboarding_checklist').upsert({
    consultant_id: consultantId,
    step_id: stepId,
    label: '', // Will be overridden by existing data
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  }, { onConflict: 'consultant_id,step_id' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function completeOnboarding(consultantId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('consultants')
    .update({
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', consultantId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Training Progress ───────────────────────────────────────

export async function updateTrainingProgress(data: {
  consultantId: string
  videoId: string
  progress: number
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('training_progress').upsert({
    consultant_id: data.consultantId,
    video_id: data.videoId,
    progress: data.progress,
    completed_at: data.progress >= 100 ? new Date().toISOString() : null,
  }, { onConflict: 'consultant_id,video_id' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Profile ─────────────────────────────────────────────────

export async function updateConsultantProfile(
  consultantId: string,
  data: {
    fullName?: string
    phone?: string
    bio?: string
    professionalBackground?: string
    avatarUrl?: string
  }
): Promise<ActionResult> {
  const supabase = await createClient()
  const update: Record<string, unknown> = {}
  if (data.fullName !== undefined) update.full_name = data.fullName
  if (data.phone !== undefined) update.phone = data.phone
  if (data.bio !== undefined) update.bio = data.bio
  if (data.professionalBackground !== undefined) update.professional_background = data.professionalBackground
  if (data.avatarUrl !== undefined) update.avatar_url = data.avatarUrl

  const { error } = await supabase.from('consultants').update(update).eq('id', consultantId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Admin Mutations ─────────────────────────────────────────

export async function adminUpdateLeadStatus(
  leadId: string,
  status: string,
  fundedAmount?: number
): Promise<ActionResult> {
  const supabase = await createClient()
  const update: Record<string, unknown> = { status }
  if (fundedAmount !== undefined) update.funded_amount = fundedAmount

  const { error } = await supabase.from('leads').update(update).eq('id', leadId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminUpdateConsultantTier(
  consultantId: string,
  tier: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('consultants').update({ tier }).eq('id', consultantId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminDeactivateConsultant(
  consultantId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('consultants').update({ is_active: false }).eq('id', consultantId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminApproveCommissions(
  commissionIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('commissions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .in('id', commissionIds)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminReviewSubmission(
  submissionId: string,
  reviewerId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_submissions').update({
    reviewed: true,
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewerId,
  }).eq('id', submissionId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminCreateTrainingVideo(data: {
  youtubeId: string
  title: string
  category: string
  duration: string
  isNew?: boolean
  isRecommended?: boolean
  sortOrder?: number
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('training_videos').insert({
    youtube_id: data.youtubeId,
    title: data.title,
    category: data.category,
    duration: data.duration,
    is_new: data.isNew ?? false,
    is_recommended: data.isRecommended ?? false,
    sort_order: data.sortOrder ?? 0,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function adminUpdateMaterial(
  materialId: string,
  data: {
    title?: string
    filename?: string
    category?: string
    description?: string
    isComingSoon?: boolean
  }
): Promise<ActionResult> {
  const supabase = await createClient()
  const update: Record<string, unknown> = {}
  if (data.title !== undefined) update.title = data.title
  if (data.filename !== undefined) update.filename = data.filename
  if (data.category !== undefined) update.category = data.category
  if (data.description !== undefined) update.description = data.description
  if (data.isComingSoon !== undefined) update.is_coming_soon = data.isComingSoon

  const { error } = await supabase.from('materials').update(update).eq('id', materialId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ── Contact Form Submissions (Public) ───────────────────────

export async function submitContactForm(data: {
  fullName: string
  email: string
  phone?: string
  role: string
  message: string
  metadata?: Record<string, unknown>
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_submissions').insert({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone || null,
    role: data.role,
    message: data.message,
    metadata: data.metadata || null,
    reviewed: false,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

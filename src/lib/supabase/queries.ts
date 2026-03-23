import { createClient } from './server'
import type {
  Consultant,
  Lead,
  Commission,
  TrainingVideo,
  TrainingProgress,
  LeaderboardStat,
  Notification,
  Material,
  CommunityPost,
  ConsultantGoal,
  OnboardingChecklistItem,
  ConsultantBadge,
  WellnessEnrollment,
  ContactSubmission,
  CommunityPostWithAuthor,
  LeaderboardEntry,
  TrainingVideoWithProgress,
  LeaderboardPeriod,
} from './types'

// ── Consultant ──────────────────────────────────────────────

export async function getConsultantByAuthId(authUserId: string): Promise<Consultant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('consultants')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()
  return data
}

export async function getConsultantById(consultantId: string): Promise<Consultant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('consultants')
    .select('*')
    .eq('id', consultantId)
    .single()
  return data
}

export async function getAllConsultants(filters?: {
  tier?: string
  isActive?: boolean
  role?: string
}): Promise<Consultant[]> {
  const supabase = await createClient()
  let query = supabase.from('consultants').select('*').order('created_at', { ascending: false })

  if (filters?.tier) query = query.eq('tier', filters.tier)
  if (filters?.isActive !== undefined) query = query.eq('is_active', filters.isActive)
  if (filters?.role) query = query.eq('role', filters.role)

  const { data } = await query
  return data ?? []
}

// ── Dashboard Stats ─────────────────────────────────────────

export async function getConsultantStats(consultantId: string) {
  const supabase = await createClient()

  const [leadsResult, enrollmentsResult, commissionsResult] = await Promise.all([
    supabase
      .from('leads')
      .select('id, status, estimated_amount, funded_amount')
      .eq('consultant_id', consultantId),
    supabase
      .from('wellness_enrollments')
      .select('id, employee_count, status')
      .eq('consultant_id', consultantId),
    supabase
      .from('commissions')
      .select('id, amount, status')
      .eq('consultant_id', consultantId),
  ])

  const leads = leadsResult.data ?? []
  const enrollments = enrollmentsResult.data ?? []
  const commissions = commissionsResult.data ?? []

  const activeLeads = leads.filter((l) => l.status !== 'declined' && l.status !== 'funded')
  const pipelineValue = activeLeads.reduce((sum, l) => {
    const amt = l.estimated_amount?.replace(/[^0-9.]/g, '')
    return sum + (amt ? parseFloat(amt) : 0)
  }, 0)

  const pendingCommissions = commissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const totalEnrollees = enrollments
    .filter((e) => e.status === 'active')
    .reduce((sum, e) => sum + e.employee_count, 0)

  const totalFundedDeals = leads.filter((l) => l.status === 'funded').length
  const totalFundedVolume = leads
    .filter((l) => l.status === 'funded' && l.funded_amount)
    .reduce((sum, l) => sum + Number(l.funded_amount), 0)

  return {
    pipelineValue,
    pendingCommissions,
    totalEnrollees,
    totalDeals: leads.length,
    totalFundedDeals,
    totalFundedVolume,
    activeDeals: activeLeads.length,
  }
}

// ── Leads / Pipeline ────────────────────────────────────────

export async function getConsultantLeads(
  consultantId: string,
  status?: string
): Promise<Lead[]> {
  const supabase = await createClient()
  let query = supabase
    .from('leads')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data ?? []
}

export async function getAllLeads(status?: string): Promise<(Lead & { consultant?: Pick<Consultant, 'full_name' | 'tier'> })[]> {
  const supabase = await createClient()
  let query = supabase
    .from('leads')
    .select('*, consultant:consultants(full_name, tier)')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data ?? []
}

// ── Earnings / Commissions ──────────────────────────────────

export async function getConsultantCommissions(
  consultantId: string,
  status?: string
): Promise<Commission[]> {
  const supabase = await createClient()
  let query = supabase
    .from('commissions')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return data ?? []
}

export async function getCommissionSummary(consultantId: string) {
  const supabase = await createClient()
  const { data: commissions } = await supabase
    .from('commissions')
    .select('amount, status, created_at, paid_at')
    .eq('consultant_id', consultantId)

  const all = commissions ?? []
  const now = new Date()
  const thisYear = now.getFullYear()

  const pending = all.filter((c) => c.status === 'pending').reduce((s, c) => s + Number(c.amount), 0)
  const paid = all.filter((c) => c.status === 'paid')
  const lastPaid = paid.sort((a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime())[0]
  const yearTotal = all
    .filter((c) => c.status === 'paid' && new Date(c.paid_at!).getFullYear() === thisYear)
    .reduce((s, c) => s + Number(c.amount), 0)
  const allTimeTotal = paid.reduce((s, c) => s + Number(c.amount), 0)

  return {
    openPeriod: pending,
    lastPeriod: lastPaid ? Number(lastPaid.amount) : 0,
    lastPeriodDate: lastPaid?.paid_at ?? null,
    thisYear: yearTotal + pending,
    allTime: allTimeTotal + pending,
  }
}

// ── Training ────────────────────────────────────────────────

export async function getTrainingVideos(category?: string): Promise<TrainingVideo[]> {
  const supabase = await createClient()
  let query = supabase
    .from('training_videos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data } = await query
  return data ?? []
}

export async function getTrainingVideosWithProgress(
  consultantId: string,
  category?: string
): Promise<TrainingVideoWithProgress[]> {
  const supabase = await createClient()

  let videoQuery = supabase
    .from('training_videos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) videoQuery = videoQuery.eq('category', category)

  const [videosResult, progressResult] = await Promise.all([
    videoQuery,
    supabase
      .from('training_progress')
      .select('video_id, progress, completed_at')
      .eq('consultant_id', consultantId),
  ])

  const videos = videosResult.data ?? []
  const progressMap = new Map(
    (progressResult.data ?? []).map((p) => [p.video_id, p])
  )

  return videos.map((v) => ({
    ...v,
    progress: progressMap.get(v.id)?.progress,
    completed_at: progressMap.get(v.id)?.completed_at,
  }))
}

export async function getTrainingProgress(consultantId: string): Promise<TrainingProgress[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('training_progress')
    .select('*')
    .eq('consultant_id', consultantId)
  return data ?? []
}

// ── Leaderboard ─────────────────────────────────────────────

export async function getLeaderboard(
  period: LeaderboardPeriod = 'monthly'
): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leaderboard_stats')
    .select('*, consultant:consultants(full_name, tier, avatar_url, avatar_color)')
    .eq('period', period)
    .order('rank', { ascending: true })

  return (data ?? []) as LeaderboardEntry[]
}

// ── Community ───────────────────────────────────────────────

export async function getCommunityPosts(
  category?: string,
  limit = 50
): Promise<CommunityPostWithAuthor[]> {
  const supabase = await createClient()
  let query = supabase
    .from('community_posts')
    .select('*, author:consultants(full_name, tier, avatar_url, avatar_color)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data } = await query
  return (data ?? []) as CommunityPostWithAuthor[]
}

export async function getPostLikes(postId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('community_likes')
    .select('consultant_id')
    .eq('post_id', postId)
  return (data ?? []).map((l) => l.consultant_id)
}

// ── Notifications ───────────────────────────────────────────

export async function getNotifications(
  consultantId: string,
  unreadOnly = false
): Promise<Notification[]> {
  const supabase = await createClient()
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })

  if (unreadOnly) query = query.eq('read', false)

  const { data } = await query
  return data ?? []
}

export async function getUnreadNotificationCount(consultantId: string): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('consultant_id', consultantId)
    .eq('read', false)
  return count ?? 0
}

// ── Materials ───────────────────────────────────────────────

export async function getMaterials(category?: string): Promise<Material[]> {
  const supabase = await createClient()
  let query = supabase
    .from('materials')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data } = await query
  return data ?? []
}

// ── Goals ───────────────────────────────────────────────────

export async function getConsultantGoals(
  consultantId: string,
  year: number
): Promise<ConsultantGoal | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('consultant_goals')
    .select('*')
    .eq('consultant_id', consultantId)
    .eq('year', year)
    .single()
  return data
}

// ── Onboarding Checklist ────────────────────────────────────

export async function getOnboardingChecklist(
  consultantId: string
): Promise<OnboardingChecklistItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('onboarding_checklist')
    .select('*')
    .eq('consultant_id', consultantId)
  return data ?? []
}

// ── Badges ──────────────────────────────────────────────────

export async function getConsultantBadges(
  consultantId: string
): Promise<ConsultantBadge[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('consultant_badges')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('earned_at', { ascending: false })
  return data ?? []
}

// ── Wellness Enrollments ────────────────────────────────────

export async function getConsultantEnrollments(
  consultantId: string,
  status?: string
): Promise<WellnessEnrollment[]> {
  const supabase = await createClient()
  let query = supabase
    .from('wellness_enrollments')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return data ?? []
}

export async function getAllEnrollments(status?: string): Promise<(WellnessEnrollment & { consultant?: Pick<Consultant, 'full_name' | 'tier'> })[]> {
  const supabase = await createClient()
  let query = supabase
    .from('wellness_enrollments')
    .select('*, consultant:consultants(full_name, tier)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return data ?? []
}

// ── Contact Submissions (Admin) ─────────────────────────────

export async function getContactSubmissions(
  role?: string,
  reviewed?: boolean
): Promise<ContactSubmission[]> {
  const supabase = await createClient()
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (role) query = query.eq('role', role)
  if (reviewed !== undefined) query = query.eq('reviewed', reviewed)

  const { data } = await query
  return data ?? []
}

// ── Analytics Views ─────────────────────────────────────────

export async function getMonthlyFundedVolume() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('v_monthly_funded_volume')
    .select('*')
    .order('month', { ascending: true })
  return data ?? []
}

export async function getConsultantGrowth() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('v_consultant_growth')
    .select('*')
    .order('month', { ascending: true })
  return data ?? []
}

export async function getEnrollmentTrend() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('v_enrollment_trend')
    .select('*')
    .order('month', { ascending: true })
  return data ?? []
}

export async function getConversionFunnel() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('v_conversion_funnel')
    .select('*')
  return data ?? []
}

// ── Payout Periods ──────────────────────────────────────────

export async function getPayoutPeriods() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payout_periods')
    .select('*')
    .order('period_start', { ascending: false })
  return data ?? []
}

// ── All Commissions (Admin) ─────────────────────────────────

export async function getAllCommissions(status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('commissions')
    .select('*, consultant:consultants(full_name, tier)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data } = await query
  return data ?? []
}

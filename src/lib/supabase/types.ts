// ============================================================
// Sequoia Enterprise Solutions — Supabase Database Types
// ============================================================

export type ConsultantTier = 'associate' | 'active' | 'senior' | 'managing_director'

// Rank system from SPM 7.5 — used for genealogy & revenue sharing qualification
export type ConsultantRank = 'lc_1' | 'lc_2' | 'lc_3' | 'senior_lc' | 'managing_director' | 'executive_director'

// Team member status for genealogy views
export type TeamMemberStatus = 'active' | 'inactive' | 'new' | 'at-risk'

// All income stream types
export type IncomeStream = 'membership' | 'ehmp' | 'real-estate' | 'business-funding' | 'property-restoration' | 'clean-energy' | 'business-services'
export type ConsultantRole = 'consultant' | 'admin'
export type LeadStatus = 'application' | 'in_review' | 'approved' | 'funded' | 'declined'
export type WellnessStatus = 'pending' | 'active' | 'cancelled'
export type CommissionStatus = 'pending' | 'paid' | 'cancelled'
export type CommissionType = 'loan_referral' | 'loan_personal' | 'wellness_commission' | 'wellness_residual' | 'property_restoration' | 'revenue_share' | 'membership_override' | 'business_funding' | 'clean_energy' | 'rank_bonus'
export type PostCategory = 'win' | 'question' | 'tip' | 'announcement'
export type NotificationType = 'deal_update' | 'new_content' | 'community' | 'training' | 'system'
export type VideoCategory = 'Agent Training' | 'Commercial Lending' | 'Wellness/EHMP' | 'Success Stories'
export type MaterialCategory = 'Real Estate' | 'EHMP / Wellness' | 'Business Funding' | 'Clean Energy' | 'Property Claims' | 'Company Materials' | 'Compensation'
export type PayoutPeriodStatus = 'open' | 'closed' | 'paid'
export type LeaderboardPeriod = 'monthly' | 'all_time'

export type Database = {
  public: {
    Tables: {
      consultants: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string
          phone: string | null
          consultant_id: string
          tier: ConsultantTier
          role: ConsultantRole
          professional_background: string | null
          bio: string | null
          avatar_url: string | null
          avatar_color: string | null
          referral_code: string | null
          referred_by: string | null
          is_active: boolean
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['consultants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['consultants']['Insert']>
      }
      leads: {
        Row: {
          id: string
          consultant_id: string
          client_name: string
          client_email: string
          client_phone: string | null
          business_name: string | null
          funding_type: string
          estimated_amount: string | null
          description: string | null
          status: LeadStatus
          funded_amount: number | null
          advisor: string | null
          next_step: string | null
          estimated_close: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      wellness_enrollments: {
        Row: {
          id: string
          consultant_id: string
          company_name: string
          contact_name: string
          contact_email: string
          employee_count: number
          monthly_rate: number
          status: WellnessStatus
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['wellness_enrollments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['wellness_enrollments']['Insert']>
      }
      commissions: {
        Row: {
          id: string
          consultant_id: string
          source_type: 'lead' | 'wellness'
          source_id: string | null
          source_label: string | null
          commission_type: CommissionType
          amount: number
          status: CommissionStatus
          period_start: string | null
          period_end: string | null
          paid_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['commissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['commissions']['Insert']>
      }
      payout_periods: {
        Row: {
          id: string
          period_start: string
          period_end: string
          status: PayoutPeriodStatus
          total_amount: number
          paid_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payout_periods']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payout_periods']['Insert']>
      }
      training_videos: {
        Row: {
          id: string
          youtube_id: string
          title: string
          category: VideoCategory
          duration: string
          thumbnail_url: string | null
          is_new: boolean
          is_recommended: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['training_videos']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['training_videos']['Insert']>
      }
      training_progress: {
        Row: {
          id: string
          consultant_id: string
          video_id: string
          progress: number
          completed_at: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['training_progress']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['training_progress']['Insert']>
      }
      leaderboard_stats: {
        Row: {
          id: string
          consultant_id: string
          period: LeaderboardPeriod
          funded_volume: number
          wellness_enrollees: number
          rank: number | null
          calculated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leaderboard_stats']['Row'], 'id' | 'calculated_at'>
        Update: Partial<Database['public']['Tables']['leaderboard_stats']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          consultant_id: string
          type: NotificationType
          title: string
          message: string
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      materials: {
        Row: {
          id: string
          title: string
          filename: string | null
          category: MaterialCategory
          description: string | null
          is_coming_soon: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['materials']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['materials']['Insert']>
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          content: string
          category: PostCategory
          likes_count: number
          comments_count: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'likes_count' | 'comments_count' | 'is_pinned' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']> & {
          likes_count?: number
          comments_count?: number
          is_pinned?: boolean
        }
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['community_comments']['Insert']>
      }
      community_likes: {
        Row: {
          id: string
          post_id: string
          consultant_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_likes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['community_likes']['Insert']>
      }
      consultant_goals: {
        Row: {
          id: string
          consultant_id: string
          year: number
          monthly_income_goal: number
          ehmp_enrollees_goal: number
          deals_to_close_goal: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['consultant_goals']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['consultant_goals']['Insert']>
      }
      onboarding_checklist: {
        Row: {
          id: string
          consultant_id: string
          step_id: string
          label: string
          description: string | null
          completed: boolean
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['onboarding_checklist']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['onboarding_checklist']['Insert']>
      }
      consultant_badges: {
        Row: {
          id: string
          consultant_id: string
          badge_type: string
          label: string
          description: string | null
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['consultant_badges']['Row'], 'id' | 'earned_at'>
        Update: Partial<Database['public']['Tables']['consultant_badges']['Insert']>
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: string
          message: string
          metadata: Record<string, unknown> | null
          reviewed: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }
    }
    Views: {
      v_monthly_funded_volume: {
        Row: {
          month: string
          total_amount: number
          commission_count: number
        }
      }
      v_consultant_growth: {
        Row: {
          month: string
          new_consultants: number
          total_consultants: number
        }
      }
      v_enrollment_trend: {
        Row: {
          month: string
          new_enrollees: number
          new_companies: number
        }
      }
      v_conversion_funnel: {
        Row: {
          status: LeadStatus
          deal_count: number
          total_amount: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_consultant_id: {
        Args: Record<string, never>
        Returns: string
      }
      get_loan_commission_rate: {
        Args: { consultant_tier: string }
        Returns: number
      }
      get_wellness_payout_rate: {
        Args: { consultant_tier: string }
        Returns: number
      }
      generate_monthly_wellness_commissions: {
        Args: { p_period_start: string; p_period_end: string }
        Returns: number
      }
    }
  }
}

// ── Convenience types ───────────────────────────────────────

export type Consultant = Database['public']['Tables']['consultants']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type WellnessEnrollment = Database['public']['Tables']['wellness_enrollments']['Row']
export type Commission = Database['public']['Tables']['commissions']['Row']
export type PayoutPeriod = Database['public']['Tables']['payout_periods']['Row']
export type TrainingVideo = Database['public']['Tables']['training_videos']['Row']
export type TrainingProgress = Database['public']['Tables']['training_progress']['Row']
export type LeaderboardStat = Database['public']['Tables']['leaderboard_stats']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Material = Database['public']['Tables']['materials']['Row']
export type CommunityPost = Database['public']['Tables']['community_posts']['Row']
export type CommunityComment = Database['public']['Tables']['community_comments']['Row']
export type CommunityLike = Database['public']['Tables']['community_likes']['Row']
export type ConsultantGoal = Database['public']['Tables']['consultant_goals']['Row']
export type OnboardingChecklistItem = Database['public']['Tables']['onboarding_checklist']['Row']
export type ConsultantBadge = Database['public']['Tables']['consultant_badges']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']

// ── Extended types (with joins) ─────────────────────────────

export type CommunityPostWithAuthor = CommunityPost & {
  author: Pick<Consultant, 'full_name' | 'tier' | 'avatar_url' | 'avatar_color'>
}

export type LeaderboardEntry = LeaderboardStat & {
  consultant: Pick<Consultant, 'full_name' | 'tier' | 'avatar_url' | 'avatar_color'>
}

export type TrainingVideoWithProgress = TrainingVideo & {
  progress?: number
  completed_at?: string | null
}

// ── Auth user type ──────────────────────────────────────────

export type AuthUser = {
  id: string
  email: string
  consultant: Consultant
}

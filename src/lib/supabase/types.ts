export type Database = {
  public: {
    Tables: {
      consultants: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          consultant_id: string
          tier: 'associate' | 'active' | 'senior' | 'managing_director'
          professional_background: string | null
          bio: string | null
          avatar_url: string | null
          referral_code: string | null
          referred_by: string | null
          is_active: boolean
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
          status: 'application' | 'in_review' | 'approved' | 'funded' | 'declined'
          funded_amount: number | null
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
          status: 'pending' | 'active' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['wellness_enrollments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['wellness_enrollments']['Insert']>
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          content: string
          category: 'win' | 'question' | 'tip' | 'announcement'
          likes_count: number
          comments_count: number
          is_pinned: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'likes_count' | 'comments_count' | 'is_pinned' | 'created_at'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: string
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }
    }
  }
}

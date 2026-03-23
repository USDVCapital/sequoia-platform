'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Consultant, ConsultantRole } from '@/lib/supabase/types'
import type { User, Session } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  email: string
  name: string
  initials: string
  consultantId: string
  tier: string
  role: ConsultantRole
  avatarUrl: string | null
  avatarColor: string | null
  onboardingCompleted: boolean
  consultant: Consultant | null
}

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  user: AuthUser | null
  session: Session | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatTier(tier: string): string {
  return tier
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function buildAuthUser(supabaseUser: User, consultant: Consultant | null): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: consultant?.full_name ?? supabaseUser.email?.split('@')[0] ?? 'User',
    initials: consultant ? getInitials(consultant.full_name) : 'U',
    consultantId: consultant?.consultant_id ?? '',
    tier: consultant ? formatTier(consultant.tier) : 'Associate',
    role: consultant?.role ?? 'consultant',
    avatarUrl: consultant?.avatar_url ?? null,
    avatarColor: consultant?.avatar_color ?? null,
    onboardingCompleted: consultant?.onboarding_completed ?? false,
    consultant,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const supabase = createClient()

  const fetchConsultant = useCallback(async (authUserId: string): Promise<Consultant | null> => {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()
    if (error) {
      console.error('[Sequoia] Failed to fetch consultant:', error.message)
    }
    return data
  }, [supabase])

  const refreshUser = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    if (currentSession?.user) {
      const consultant = await fetchConsultant(currentSession.user.id)
      setUser(buildAuthUser(currentSession.user, consultant))
      setSession(currentSession)
    }
  }, [supabase, fetchConsultant])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (initialSession?.user) {
          const consultant = await fetchConsultant(initialSession.user.id)
          setUser(buildAuthUser(initialSession.user, consultant))
          setSession(initialSession)
        }
      } catch (err) {
        console.error('[Sequoia] Auth init error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        const consultant = await fetchConsultant(newSession.user.id)
        setUser(buildAuthUser(newSession.user, consultant))
        setSession(newSession)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
        setSession(newSession)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchConsultant])

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error: error.message }
    }
    return {}
  }

  const signup = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (error) {
      return { error: error.message }
    }
    return {}
  }

  const logout = async () => {
    // Sign out client-side first
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    // Hit server-side logout route to clear cookies, then hard redirect
    window.location.href = '/auth/logout'
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        isLoading,
        user,
        session,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronLeft } from 'lucide-react'
import {
  updateConsultantProfile,
  updateOnboardingStep,
  updateConsultantGoals,
  updateTrainingProgress,
  completeOnboarding,
} from '@/lib/supabase/mutations'

import StepWelcome from '@/components/onboarding/StepWelcome'
import StepProfilePhoto from '@/components/onboarding/StepProfilePhoto'
import StepBackground from '@/components/onboarding/StepBackground'
import StepCompliance from '@/components/onboarding/StepCompliance'
import StepTraining from '@/components/onboarding/StepTraining'
import StepGoals from '@/components/onboarding/StepGoals'
import StepComplete from '@/components/onboarding/StepComplete'

const TOTAL_STEPS = 7

const STEP_LABELS = [
  'Welcome',
  'Photo',
  'Background',
  'Compliance',
  'Training',
  'Goals',
  'Complete',
]

const STEP_IDS = [
  'welcome',
  'profile_photo',
  'professional_background',
  'compliance',
  'first_training',
  'set_goals',
  'completion',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const consultantId = user?.consultant?.id ?? ''
  const consultantDbId = user?.consultant?.consultant_id ?? ''

  // ── Save step progress ──────────────────────────────────────
  const markStepDone = useCallback(async (stepIndex: number) => {
    if (!consultantId) return
    try {
      await updateOnboardingStep(consultantId, STEP_IDS[stepIndex], true)
    } catch (err) {
      console.error('[Onboarding] Failed to save step progress:', err)
    }
  }, [consultantId])

  const goNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1))
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  // ── Step handlers ───────────────────────────────────────────

  const handleWelcomeNext = async (data: { fullName: string; phone: string }) => {
    setSaving(true)
    try {
      await updateConsultantProfile(consultantId, {
        fullName: data.fullName,
        phone: data.phone,
      })
      await markStepDone(0)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Welcome step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoNext = async (avatarUrl: string | null) => {
    setSaving(true)
    try {
      if (avatarUrl) {
        await updateConsultantProfile(consultantId, { avatarUrl })
      }
      await markStepDone(1)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Photo step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoSkip = async () => {
    await markStepDone(1)
    goNext()
  }

  const handleBackgroundNext = async (data: { professionalBackground: string; bio: string }) => {
    setSaving(true)
    try {
      await updateConsultantProfile(consultantId, {
        professionalBackground: data.professionalBackground,
        bio: data.bio,
      })
      await markStepDone(2)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Background step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleComplianceNext = async () => {
    setSaving(true)
    try {
      await markStepDone(3)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Compliance step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleTrainingNext = async () => {
    setSaving(true)
    try {
      // Training progress save is best-effort — video ID may not match DB UUID
      try {
        await updateTrainingProgress({
          consultantId,
          videoId: '40000000-0000-0000-0000-000000000011', // The Year of the Hero video UUID
          progress: 100,
        })
      } catch {
        // Non-blocking — training progress is optional
      }
      await markStepDone(4)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Training step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleGoalsNext = async (goals: { monthlyIncome: number; ehmpEnrollees: number; dealsToClose: number }) => {
    setSaving(true)
    try {
      await updateConsultantGoals({
        consultantId,
        year: new Date().getFullYear(),
        monthlyIncomeGoal: goals.monthlyIncome,
        ehmpEnrolleesGoal: goals.ehmpEnrollees,
        dealsToCloseGoal: goals.dealsToClose,
      })
      await markStepDone(5)
      goNext()
    } catch (err) {
      console.error('[Onboarding] Goals step error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEnterPortal = async () => {
    setSaving(true)
    try {
      await markStepDone(6)
      await completeOnboarding(consultantId)
    } catch (err) {
      console.error('[Onboarding] Completion save error (non-blocking):', err)
    }
    // Always redirect to portal, even if save failed
    try {
      await refreshUser()
    } catch {
      // Non-blocking
    }
    // Hard redirect to ensure we leave onboarding
    window.location.href = '/portal'
  }

  // ── Progress bar ────────────────────────────────────────────
  const progressPct = ((currentStep + 1) / TOTAL_STEPS) * 100

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-sequoia-400">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-sequoia-500">
            {STEP_LABELS[currentStep]}
          </span>
        </div>
        <div className="h-1.5 bg-sequoia-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              backgroundColor: '#C8A84E',
            }}
          />
        </div>
        {/* Step dots */}
        <div className="flex items-center justify-between mt-3 px-1">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-gold-500'
                    : i === currentStep
                      ? 'bg-gold-500 ring-4 ring-gold-500/20'
                      : 'bg-sequoia-700'
                }`}
              />
              <span className={`text-[0.6rem] font-medium hidden sm:block ${
                i <= currentStep ? 'text-sequoia-300' : 'text-sequoia-700'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Back button (not on first or last step) */}
      {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1 text-sm text-sequoia-400 hover:text-sequoia-200 transition-colors mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Saving overlay */}
      {saving && (
        <div className="fixed inset-0 bg-sequoia-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-sequoia-700 border-t-gold-500 rounded-full animate-spin" />
            <p className="text-sm text-sequoia-300">Saving...</p>
          </div>
        </div>
      )}

      {/* Step content */}
      {currentStep === 0 && (
        <StepWelcome
          userName={user?.name ?? 'Consultant'}
          userPhone={user?.consultant?.phone ?? ''}
          onNext={handleWelcomeNext}
        />
      )}
      {currentStep === 1 && (
        <StepProfilePhoto
          consultantId={consultantDbId}
          currentAvatarUrl={user?.avatarUrl ?? null}
          onNext={handlePhotoNext}
          onSkip={handlePhotoSkip}
        />
      )}
      {currentStep === 2 && (
        <StepBackground
          initialBackground={user?.consultant?.professional_background ?? ''}
          initialBio={user?.consultant?.bio ?? ''}
          onNext={handleBackgroundNext}
        />
      )}
      {currentStep === 3 && (
        <StepCompliance
          consultantId={consultantDbId}
          onNext={handleComplianceNext}
        />
      )}
      {currentStep === 4 && (
        <StepTraining
          onNext={handleTrainingNext}
        />
      )}
      {currentStep === 5 && (
        <StepGoals
          onNext={handleGoalsNext}
        />
      )}
      {currentStep === 6 && (
        <StepComplete
          userName={user?.name ?? 'Consultant'}
          onEnterPortal={handleEnterPortal}
        />
      )}
    </div>
  )
}

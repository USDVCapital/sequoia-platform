"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Verify the user has a valid session from the reset link
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Please enter a new password.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        setIsSubmitting(false)
      } else {
        setSuccess(true)
        setIsSubmitting(false)
        // Redirect to portal after short delay
        setTimeout(() => {
          router.push("/portal")
        }, 2000)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Loading state while checking session
  if (hasSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    )
  }

  // No valid session — link expired or invalid
  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-10">
            <Image
              src="/logo-black.png"
              alt="Sequoia Enterprise Solutions"
              width={180}
              height={45}
              style={{ height: "45px", width: "auto" }}
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Link expired
          </h2>
          <p className="text-neutral-500 mb-8">
            This password reset link has expired or is invalid. Please request a new one.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block py-3 px-6 rounded-xl bg-black hover:bg-neutral-800 font-semibold transition"
            style={{ color: "#FFFFFF" }}
          >
            Request new link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <Image
            src="/logo-black.png"
            alt="Sequoia Enterprise Solutions"
            width={180}
            height={45}
            style={{ height: "45px", width: "auto" }}
          />
        </div>

        {success ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Password updated
            </h2>
            <p className="text-neutral-500">
              Your password has been reset. Redirecting you to the portal...
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Set a new password
            </h2>
            <p className="text-neutral-500 mb-8">
              Choose a strong password with at least 8 characters.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition pr-12"
                    placeholder="Enter new password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-black hover:bg-neutral-800 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ color: "#FFFFFF" }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

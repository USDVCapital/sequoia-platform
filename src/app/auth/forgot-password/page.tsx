"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address.")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setIsSubmitting(false)
      } else {
        setSent(true)
        setIsSubmitting(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
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

        {sent ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Check your email
            </h2>
            <p className="text-neutral-500 mb-8">
              We sent a password reset link to <strong className="text-neutral-700">{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <p className="text-sm text-neutral-400 mb-6">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSent(false); setEmail("") }}
                className="flex-1 py-3 px-6 rounded-xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-100 transition text-center"
              >
                Try again
              </button>
              <Link
                href="/login"
                className="flex-1 py-3 px-6 rounded-xl bg-black font-semibold hover:bg-neutral-800 transition text-center"
                style={{ color: "#FFFFFF" }}
              >
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Reset your password
            </h2>
            <p className="text-neutral-500 mb-8">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  autoFocus
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
                  "Send reset link"
                )}
              </button>
            </form>

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

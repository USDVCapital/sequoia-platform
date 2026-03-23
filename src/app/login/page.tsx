"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import HeroVideo from '@/components/HeroVideo'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sequoia-200 border-t-sequoia-700" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn, isLoading, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const redirectTo = searchParams.get('redirect') || '/portal'

  useEffect(() => {
    document.title = 'Consultant Login — Sequoia Enterprise Solutions'
  }, [])

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push(redirectTo)
    }
  }, [isLoggedIn, isLoading, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login(form.email, form.password)

      if (result.error) {
        setError(result.error === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : result.error
        )
        setIsSubmitting(false)
      } else {
        // Successful login — redirect via hard navigation to ensure clean state
        window.location.href = redirectTo
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      console.error('[Sequoia] Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <HeroVideo />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <Image
              src="/logo-gold.png"
              alt="Sequoia Enterprise Solutions"
              width={200}
              height={50}
              style={{ height: "50px", width: "auto" }}
            />
          </div>

          <h1
            className="text-4xl font-bold leading-tight mb-6"
            style={{ color: "#FFFFFF" }}
          >
            Your Consultant
            <br />
            <span className="text-gold-400">Command Center</span>
          </h1>

          <p className="text-lg text-white/80 mb-10 max-w-md">
            Access your pipeline, training library, AI assistant, and community
            — all in one place.
          </p>

          <div className="space-y-4">
            {[
              "Track your deals and commissions in real time",
              "190+ training videos at your fingertips",
              "CEA AI Assistant for instant product guidance",
              "Connect with 2,500+ consultants nationwide",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold-400 shrink-0" />
                <p style={{ color: "rgba(255,255,255,0.9)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <Image
              src="/logo-black.png"
              alt="Sequoia Enterprise Solutions"
              width={180}
              height={45}
              style={{ height: "45px", width: "auto" }}
            />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Welcome back
          </h2>
          <p className="text-neutral-500 mb-8">
            Sign in to your consultant portal
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition pr-12"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-800 focus:ring-gold-500"
                />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-neutral-700 hover:text-black font-medium transition"
              >
                Forgot password?
              </button>
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
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Not a consultant yet?{" "}
              <Link
                href="/opportunity"
                className="text-neutral-800 hover:text-black font-medium transition underline underline-offset-2"
              >
                Learn about the opportunity
              </Link>
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              or{" "}
              <Link
                href="/enroll"
                className="text-gold-700 hover:text-gold-800 font-medium transition underline underline-offset-2"
              >
                Enroll now for $29.99/month
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

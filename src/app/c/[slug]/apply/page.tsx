'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ConsultantApplyPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  useEffect(() => {
    router.replace(`/apply?ref=${slug}`)
  }, [router, slug])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-neutral-50">
      <p className="text-brand-neutral-500 text-sm">Redirecting to application&hellip;</p>
    </div>
  )
}

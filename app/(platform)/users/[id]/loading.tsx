'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-surface flex flex-col items-center gap-4 rounded-2xl p-8 shadow-md">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />

        <div className="text-center">
          <p className="text-text-primary text-lg font-semibold">Loading</p>
          <p className="text-text-secondary text-sm">Getting user info...</p>
        </div>
      </div>
    </div>
  )
}

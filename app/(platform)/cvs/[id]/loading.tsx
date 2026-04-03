"use client"

import { Loader2 } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface shadow-md">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />

        <div className="text-center">
          <p className="text-lg font-semibold text-text-primary">Loading</p>
          <p className="text-sm text-text-secondary">Getting CV details...</p>
        </div>
      </div>
    </div>
  )
}

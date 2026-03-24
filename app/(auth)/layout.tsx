import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="w-full max-w-xl px-6 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

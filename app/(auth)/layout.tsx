import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-xl flex-col items-center px-6">
        {children}
      </div>
    </div>
  )
}

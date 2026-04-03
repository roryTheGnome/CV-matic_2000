"use client"

import LoadingPage from "@/app/(platform)/loading"
import { Suspense } from "react"

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-6">
      <Suspense fallback={<LoadingPage />}>
        <div>{children}</div>
      </Suspense>
    </div>
  )
}

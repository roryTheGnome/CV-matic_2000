import React from "react"
import { AuthTabs } from "./_components/AuthTabs"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthTabs />
      <div className="w-full mt-14 text-center">{children}</div>
    </>
  )
}

"use client"

import { useProfileNav } from "@/lib/hooks/useProfileNav"
import { Tabs } from "../Tabs"

export default function ProfileNav() {
  const { user, error, tabs, isActive } = useProfileNav()
  if (error) return <div></div>
  if (!user) {
    return <></>
  }

  return <Tabs tabs={tabs} isActive={isActive} />
}

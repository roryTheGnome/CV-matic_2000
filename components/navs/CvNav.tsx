"use client"

import { useCvNav } from "@/lib/hooks/useCvNav"
import { Tabs } from "../Tabs"

export default function CvNav() {
  const { cv,error , tabs, isActive } = useCvNav()
  if (error) return <></>
  if (!cv) {
    return <></>
  }

  return <Tabs tabs={tabs} isActive={isActive} />
}

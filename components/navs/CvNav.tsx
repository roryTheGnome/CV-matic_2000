"use client"

import { useCvNav } from "@/lib/hooks/useCvNav"
import { Tabs } from "../Tabs"

export default function CvNav({ id }: { id: string }) {
  const { tabs, isActive } = useCvNav(id)

  return <Tabs tabs={tabs} isActive={isActive} />
}

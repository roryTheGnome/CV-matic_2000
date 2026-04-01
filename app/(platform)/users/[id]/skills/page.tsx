"use client"

import LoadingPage from "@/app/(platform)/users/[id]/loading"
import NotFoundPage from "@/app/(platform)/users/not-found"
import { Skills } from "@/components/skills/Skills"
import { useUser } from "@/lib/hooks/userHooks/useUser"

export default function EmployeeSkill() {
  const { user, error } = useUser()

  if (error) return <NotFoundPage />
  if (!user) return <LoadingPage />
  return (
    <>
      <Skills skills={user.profile.skills} />
    </>
  )
}

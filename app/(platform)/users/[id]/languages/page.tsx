"use client"

import LoadingPage from "@/app/(platform)/users/[id]/loading"
import NotFoundPage from "@/app/(platform)/users/not-found"
import { LanguageList } from "@/components/LanguageList"
import { useUser } from "@/lib/hooks/userHooks/useUser"

export default function EmployeeLanguage() {
  const { user, error } = useUser()

  if (error) return <NotFoundPage />
  if (!user) return <LoadingPage />
  return (
    <>
      <LanguageList languages={user.profile.languages} />
    </>
  )
}

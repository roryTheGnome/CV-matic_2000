'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { Loader } from '@/components/ui/Loader'
import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { LanguageForm } from './LanguageForm'

export function ProfileLanguageModal() {
  const { currentUserId } = useCurrentUser()
  const { user, isLoading, error } = useUser(
    currentUserId ? String(currentUserId) : undefined,
  )

  if (isLoading) {
    return <Loader />
  }
  if (error || !user) {
    return <div className="p-6">Failed to load user</div>
  }

  return (
    <ModalLayout title="Add Language">
      <LanguageForm userLanguages={user.profile.languages} />
    </ModalLayout>
  )
}

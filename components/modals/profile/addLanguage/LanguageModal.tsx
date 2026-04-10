'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { Loader } from '@/components/ui/Loader'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useModalStore } from '@/store/modalStore'
import { LanguageForm } from './LanguageForm'
import { useModalStore } from '@/store/modalStore'

export function ProfileLanguageModal() {
  const { data } = useModalStore()

  const id = data?.id
  const { user, isLoading, error } = useUser(id ? String(id) : undefined)

  if (isLoading) {
    return <Loader />
  }
  if (error || !user) {
    return <div className="p-6">Failed to load user</div>
  }

  return (
    <ModalLayout title="Add Language">
      <LanguageForm userLanguages={user.profile.languages} userId={user.id} />
    </ModalLayout>
  )
}

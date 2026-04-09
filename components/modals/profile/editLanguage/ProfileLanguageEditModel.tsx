'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { useModalStore } from '@/store/modalStore'
import { LanguageEditForm } from './LanguageEditForm'

export function ProfileLanguageEditModal() {
  const { data } = useModalStore()

  const language = data?.language
  const id = data?.id

  if (!language) return null

  return (
    <ModalLayout title="Edit Language">
      <LanguageEditForm language={language} userId={id} />
    </ModalLayout>
  )
}

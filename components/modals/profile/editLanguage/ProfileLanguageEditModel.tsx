'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { useModalStore } from '@/store/modalStore'
import { LanguageEditForm } from './LanguageEditForm'

export function ProfileLanguageEditModal() {
  const { data } = useModalStore()

  const language = data?.language

  if (!language) return null

  return (
    <ModalLayout title="Edit Language">
      <LanguageEditForm language={language} />
    </ModalLayout>
  )
}

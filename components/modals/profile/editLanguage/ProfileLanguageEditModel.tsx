'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import { LanguageEditForm } from './LanguageEditForm'

export function ProfileLanguageEditModal() {
  const { data } = useModalStore()

  const language = data?.language
  const id = data?.id
  const t = useTranslations('ProfileModal')
  if (!language) return null

  return (
    <ModalLayout title={t('editLanguage')}>
      <LanguageEditForm language={language} userId={id} />
    </ModalLayout>
  )
}

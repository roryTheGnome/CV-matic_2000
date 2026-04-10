'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { Loader } from '@/components/ui/Loader'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import { LanguageForm } from './LanguageForm'
import { useModalStore } from '@/store/modalStore'

export function ProfileLanguageModal() {
  const { data } = useModalStore()

  const id = data?.id
  const { user, isLoading, error } = useUser(id ? String(id) : undefined)
  const t = useTranslations('ProfileModal')

  if (isLoading) {
    return <Loader />
  }
  if (error || !user) {
    return (
      <ModalLayout title={t('errorOccurred')}>
        <div className="p-6">{error?.message}</div>
      </ModalLayout>
    )
  }

  return (
    <ModalLayout title={t('addLanguage')}>
      <LanguageForm userLanguages={user.profile.languages} userId={user.id} />
    </ModalLayout>
  )
}

'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { SkillEditForm } from '@/components/modals/profile/editSkill/SkillEditForm'
import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'

export function ProfileSkillEditModal() {
  const { data } = useModalStore()
  const t = useTranslations('ProfileModal')
  const skill = data?.skill
  const id = data?.id

  if (!skill) return null

  return (
    <ModalLayout title={t('editSkill')}>
      <SkillEditForm skill={skill} userId={id} />
    </ModalLayout>
  )
}

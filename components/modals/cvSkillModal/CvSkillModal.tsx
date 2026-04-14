'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import { CvSkillForm } from './CvSkillForm'

export function CvSkillModal() {
  const { data, type } = useModalStore()
  const skill = data?.skill
  const t = useTranslations('SkillModal')

  return (
    <ModalLayout
      title={type?.endsWith('_EDIT') ? t('editSkill') : t('addSkill')}
    >
      <CvSkillForm skill={skill} />
    </ModalLayout>
  )
}

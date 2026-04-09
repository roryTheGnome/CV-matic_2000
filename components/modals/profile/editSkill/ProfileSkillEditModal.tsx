'use client'

import { ModalLayout } from '@/components/modals/ModalLayout'
import { useModalStore } from '@/store/modalStore'
import { SkillEditForm } from '@/components/modals/profile/editSkill/SkillEditForm'

export function ProfileSkillEditModal() {
  const { data } = useModalStore()

  const skill = data?.skill
  const id = data?.id

  if (!skill) return null

  return (
    <ModalLayout title="Edit Skill">
      <SkillEditForm skill={skill} userId={id} />
    </ModalLayout>
  )
}

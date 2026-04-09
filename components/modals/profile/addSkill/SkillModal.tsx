'use client'

import { SkillForm } from './SkillForm'
import { ModalLayout } from '@/components/modals/ModalLayout'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useModalStore } from '@/store/modalStore'

export function ProfileSkillModal() {
  const { data } = useModalStore()

  const id = data?.id
  const { user, isLoading, error } = useUser(id ? String(id) : undefined)

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  } //TODO create something gloabal for default
  if (error || !user) {
    return <div className="p-6">Failed to load user</div>
  }
  return (
    <ModalLayout title="Add Skill">
      <SkillForm userSkills={user.profile.skills} userId={user.id} />
    </ModalLayout>
  )
}

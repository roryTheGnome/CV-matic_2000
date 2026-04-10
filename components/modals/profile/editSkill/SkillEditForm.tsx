'use client'

import { UPDATE_PROFILE_SKILL } from '@/api/graphql/mutations/profile'
import { GET_USER } from '@/api/graphql/queries/user'
import { MasterySelect } from '@/components/ui/MasterySelect'
import { useModalStore } from '@/store/modalStore'
import { Mastery, SkillMastery } from '@/types/skills'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { ModalButtons } from '../../ModalButtons'

type Props = {
  skill: SkillMastery
  userId?: string
}

export function SkillEditForm({ skill, userId }: Props) {
  const { closeModal } = useModalStore()

  const [mastery, setMastery] = useState<Mastery>(skill.mastery)

  const [updateSkill, { loading }] = useMutation(UPDATE_PROFILE_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: userId },
      },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) return

    try {
      await updateSkill({
        variables: {
          skill: {
            userId: userId,
            name: skill.name,
            categoryId: skill.categoryId,
            mastery,
          },
        },
      })

      closeModal()
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface text-text-secondary rounded border p-3">
        {skill.name}
      </div>

      <MasterySelect mastery={mastery} setMastery={setMastery} />

      <ModalButtons saving={loading} />
    </form>
  )
}

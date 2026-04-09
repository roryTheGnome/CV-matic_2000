'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useModalStore } from '@/store/modalStore'
import { Button } from '@/components/ui/Button'
import { CancelButton } from '@/components/ui/CancelButton'
import { GET_USER } from '@/api/graphql/queries/user'
import { UPDATE_PROFILE_SKILL } from '@/api/graphql/mutations/profile'
import { SkillMastery, Mastery } from '@/types/skills'
import { Select } from '@/components/ui/select/Select'

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

      <Select
        id="mastery"
        name="mastery"
        value={mastery}
        isRequired={true}
        handleChange={(e) => setMastery(e.target.value as Mastery)}
      >
        <option value="Novice">Novice</option>
        <option value="Advanced">Advanced</option>
        <option value="Competent">Competent</option>
        <option value="Proficient">Proficient</option>
        <option value="Expert">Expert</option>
      </Select>

      <div className="flex justify-end gap-4">
        <CancelButton closeModal={closeModal} />
        <Button type="submit" disabled={loading}>
          {loading ? 'SAVING...' : 'SAVE'}
        </Button>
      </div>
    </form>
  )
}

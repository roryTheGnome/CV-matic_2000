'use client'

import { ADD_PROFILE_SKILL } from '@/api/graphql/mutations/profile'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import { GET_USER } from '@/api/graphql/queries/user'
import { Loader } from '@/components/ui/Loader'
import { MasterySelect } from '@/components/ui/MasterySelect'
import { SkillSelect } from '@/components/ui/SkillSelect'
import { useModalStore } from '@/store/modalStore'
import { GetSkillsData, Mastery, SkillItem } from '@/types/skills'
import { useMutation, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ModalButtons } from '../../ModalButtons'

type SkillFormProps = {
  userSkills: { name: string }[]
  userId?: string
}

export function SkillForm({ userSkills, userId }: SkillFormProps) {
  const { closeModal } = useModalStore()

  const { data, loading, error } = useQuery<GetSkillsData>(GET_SKILLS)

  const [addSkill, { loading: saving }] = useMutation(ADD_PROFILE_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: userId },
      },
    ],
  })

  const [selectedSkill, setSelectedSkill] = useState<Partial<SkillItem> | null>(
    null,
  )
  const [mastery, setMastery] = useState<Mastery>('Novice')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId || !selectedSkill) return

    try {
      await addSkill({
        variables: {
          skill: {
            userId: userId,
            name: selectedSkill.name,
            categoryId: selectedSkill.category?.id,
            mastery,
          },
        },
      })

      closeModal()
    } catch (err) {
      console.error('BIG NO NO:', err)
    }
  }

  if (loading) {
    return <Loader />
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  const availableSkills =
    data?.skills.filter(
      (skill) => !userSkills.some((u) => u.name === skill.name),
    ) || []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SkillSelect
        selectedSkill={selectedSkill}
        availableSkills={availableSkills}
        setSelectedSkill={setSelectedSkill}
      />

      <MasterySelect mastery={mastery} setMastery={setMastery} />

      <ModalButtons saving={saving} />
    </form>
  )
}

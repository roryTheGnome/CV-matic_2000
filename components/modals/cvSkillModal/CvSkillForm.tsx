'use client'

import { MasterySelect } from '@/components/ui/MasterySelect'
import { SkillSelect } from '@/components/ui/SkillSelect'
import { SkillMastery } from '@/types/skills'
import { ModalButtons } from '../ModalButtons'
import { useCvSkillForm } from './_hooks/useCvSkillForm'

export function CvSkillForm({ skill }: { skill: SkillMastery | undefined }) {
  const {
    selectedSkill,
    availableSkills,
    mastery,
    saving,
    handleSubmit,
    setMastery,
    setSelectedSkill,
  } = useCvSkillForm(skill)

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

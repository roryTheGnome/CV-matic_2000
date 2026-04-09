'use client'

import { Button } from '@/components/ui/Button'
import { CancelButton } from '@/components/ui/CancelButton'
import { Select } from '@/components/ui/select/Select'
import { Mastery, SkillMastery } from '@/types/skills'
import { useCvSkillForm } from './_hooks/useCvSkillForm'

export function CvSkillForm({ skill }: { skill: SkillMastery | undefined }) {
  const {
    loading,
    error,
    selectedSkill,
    availableSkills,
    mastery,
    saving,
    type,
    handleSubmit,
    setMastery,
    closeModal,
    setSelectedSkill,
  } = useCvSkillForm(skill)

  if (loading) {
    return <div>Loading skills...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        id="skill"
        name="skill"
        value={selectedSkill?.name ? selectedSkill?.name : ''}
        isRequired={true}
        disabled={type?.endsWith('_EDIT')}
        title="Skill"
        handleChange={(e) => {
          const skill = availableSkills?.find((s) => s.name === e.target.value)
          setSelectedSkill(skill || null)
        }}
      >
        {availableSkills.map((skill) => (
          <option key={skill.name} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </Select>

      <Select
        id="mastery"
        name="mastery"
        value={mastery}
        isRequired={true}
        title="Mastery"
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
        <Button type="submit" disabled={saving || !selectedSkill}>
          {saving ? 'ADDING...' : 'ADD'}
        </Button>
      </div>
    </form>
  )
}

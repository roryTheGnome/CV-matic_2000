import { SkillItem } from '@/types/skills'
import { useTranslations } from 'next-intl'
import { SetStateAction } from 'react'
import { Option } from './select/Option'
import { Select } from './select/Select'

interface Props {
  selectedSkill: Partial<SkillItem> | null
  availableSkills: SkillItem[]
  setSelectedSkill: (value: SetStateAction<Partial<SkillItem> | null>) => void
}

export function SkillSelect({
  availableSkills,
  selectedSkill,
  setSelectedSkill,
}: Props) {
  const t = useTranslations('SkillSelect')

  return (
    <Select
      id="skill"
      name="skill"
      value={selectedSkill?.name || ''}
      isRequired={true}
      title={t('selectSkill')}
      handleChange={(e) => {
        const skill = availableSkills.find((s) => s.name === e.target.value)
        setSelectedSkill(skill || null)
      }}
    >
      {availableSkills.map((skill) => (
        <Option title={skill.name} key={skill.id} value={skill.name} />
      ))}
    </Select>
  )
}

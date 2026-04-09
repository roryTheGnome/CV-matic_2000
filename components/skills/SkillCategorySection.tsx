import { SkillMastery } from '@/types/skills'
import { SkillItem } from './SkillItem'

export const SkillCategorySection = ({
  title,
  skills,
  deleteMode,
  selected,
  onSelect,
}: {
  title: string
  skills: SkillMastery[]
  deleteMode: boolean
  selected: string[]
  onSelect: (name: string) => void
}) => {
  if (!skills.length) return null

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h3 className="text-text-primary text-sm">{title}</h3>

      <div className="flex flex-wrap gap-x-10 gap-y-4">
        {skills.map((skill) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            deleteMode={deleteMode}
            isSelected={selected.includes(skill.name)}
            onClick={() => onSelect(skill.name)}
          />
        ))}
      </div>
    </div>
  )
}

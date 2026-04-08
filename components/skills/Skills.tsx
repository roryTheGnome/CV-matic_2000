import { Button } from '@/components/ui/Button'
import { useModalStore } from '@/store/modalStore'
import { SkillItem, SkillMastery } from '@/types/skills'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SkillCategorySection } from './SkillCategorySection'

export type Props = {
  skills: SkillMastery[]
  allSkills: SkillItem[]
  onDelete?: (names: string[]) => void
  owner: boolean
  userId: string
}

export const Skills = ({
  skills,
  allSkills,
  onDelete,
  owner,
  userId,
}: Props) => {
  const { openModal } = useModalStore()

  const [deleteMode, setDeleteMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const grouped: Record<string, SkillMastery[]> = {}

  const toggleSelect = (name: string) => {
    if (owner) {
      const skill = skills.find((s) => s.name === name)
      if (!skill) return

      if (deleteMode) {
        setSelected((prev) =>
          prev.includes(name)
            ? prev.filter((n) => n !== name)
            : [...prev, name],
        )
      } else {
        openModal('PROFILE_SKILL_EDIT', {
          skill: {
            name: skill.name,
            categoryId: skill.categoryId,
            mastery: skill.mastery,
          },
          id: userId,
        })
      }
    }
  }

  const handleDelete = () => {
    if (!deleteMode) {
      setDeleteMode(true)
      return
    }

    if (selected.length === 0) return

    onDelete?.(selected)

    setSelected([])
    setDeleteMode(false)
  }

  skills.forEach((skill) => {
    const fullSkill = allSkills.find((s) => s.name === skill.name)

    const categoryName = fullSkill?.category_name || 'Other' //i add otehr as fallback but i dont think it will be at use, max for debugging

    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }

    grouped[categoryName].push(skill)
  })

  return (
    <div>
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, skills]) => (
          <SkillCategorySection
            key={category}
            title={category}
            skills={skills}
            deleteMode={deleteMode}
            selected={selected}
            onSelect={toggleSelect}
          />
        ))}
      </div>

      {owner && (
        <div className="flex justify-end gap-4">
          {deleteMode ? (
            <>
              <Button
                isTextButton
                className="disabled:bg-surface-disabled disabled:text-text-primary/40 border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary flex w-full max-w-57 cursor-pointer items-center justify-center rounded-full border bg-transparent p-3 uppercase duration-300 hover:brightness-110"
                onClick={() => {
                  setDeleteMode(false)
                  setSelected([])
                }}
              >
                CANCEL
              </Button>
              <Button
                isTextButton
                className={`flex w-full max-w-57 cursor-pointer items-center justify-center rounded-full border p-3 uppercase duration-300 ${
                  selected.length > 0
                    ? 'bg-primary text-text-primary border-primary hover:brightness-110'
                    : 'border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary bg-transparent'
                } disabled:bg-surface-disabled disabled:text-text-primary/40`}
                onClick={handleDelete}
              >
                CONFIRM ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                Icon={Plus}
                isTextButton
                className="text-gray-400"
                onClick={() =>
                  openModal('PROFILE_SKILL_ADD', {
                    id: userId,
                  })
                }
              >
                ADD SKILLS
              </Button>
              <Button
                Icon={Trash2}
                isTextButton
                className="text-red-400"
                onClick={handleDelete}
              >
                REMOVE SKILLS
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

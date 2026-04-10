import { Button } from '@/components/ui/Button'
import { SkillItem, SkillMastery } from '@/types/skills'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SkillCategorySection } from './SkillCategorySection'
import { useSkill } from './_hooks/useSkill'

export type Props = {
  skills: SkillMastery[] | undefined
  allSkills: SkillItem[]
  owner: boolean
  userId?: string
  modalType?: 'PROFILE_SKILL_ADD' | 'CV_SKILL_ADD'
  cvId?: string
  onDelete?: (names: string[]) => void
}

export const Skills = ({
  skills,
  allSkills,
  userId,
  owner,
  modalType = 'PROFILE_SKILL_ADD',
  cvId,
  onDelete,
}: Props) => {
  const {
    grouped,
    deleteMode,
    selected,
    setDeleteMode,
    setSelected,
    toggleSelect,
    handleDelete,
    handleAddBtn,
  } = useSkill({
    skills,
    allSkills,
    userId,
    owner,
    modalType,
    cvId,
    onDelete,
  })

  const t = useTranslations('Skills')

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
                {t('cancel')}
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
                {t('confirm')} ({selected.length})
              </Button>
            </>
          ) : (
            <>
              <Button
                Icon={Plus}
                isTextButton
                className="text-gray-400"
                onClick={handleAddBtn}
              >
                {t('addSkills')}
              </Button>
              <Button
                Icon={Trash2}
                isTextButton
                className="text-red-400"
                onClick={handleDelete}
              >
                {t('removeSkills')}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

import { useModalStore } from '@/store/modalStore'
import { SkillItem, SkillMastery } from '@/types/skills'
import { useState } from 'react'

export type Props = {
  skills: SkillMastery[] | undefined
  allSkills: SkillItem[]
  owner: boolean
  userId?: string
  modalType: 'PROFILE_SKILL_ADD' | 'CV_SKILL_ADD'
  cvId?: string
  onDelete?: (names: string[]) => void
}

export const useSkill = ({
  owner,
  skills,
  modalType,
  userId,
  cvId,
  onDelete,
  allSkills,
}: Props) => {
  const { openModal } = useModalStore()

  const [deleteMode, setDeleteMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const grouped: Record<string, SkillMastery[]> = {}

  const toggleSelect = (name: string) => {
    if (owner) {
      const skill = skills?.find((s) => s.name === name)
      if (!skill) return

      if (deleteMode) {
        setSelected((prev) =>
          prev.includes(name)
            ? prev.filter((n) => n !== name)
            : [...prev, name],
        )
      } else {
        if (modalType === 'PROFILE_SKILL_ADD') {
          openModal('PROFILE_SKILL_EDIT', {
            skill: {
              name: skill.name,
              categoryId: skill.categoryId,
              mastery: skill.mastery,
            },
            id: userId,
          })
        } else {
          openModal('CV_SKILL_EDIT', {
            id: cvId,
            skill: {
              name: skill.name,
              categoryId: skill.categoryId,
              mastery: skill.mastery,
            },
          })
        }
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

  skills?.forEach((skill) => {
    const fullSkill = allSkills.find((s) => s.name === skill.name)

    const categoryName = fullSkill?.category_name || 'Other' //i add otehr as fallback but i dont think it will be at use, max for debugging

    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }

    grouped[categoryName].push(skill)
  })

  const handleAddBtn = () => {
    if (modalType === 'PROFILE_SKILL_ADD') {
      return openModal(modalType, {
        id: userId,
      })
    } else {
      return openModal(modalType, { id: cvId })
    }
  }

  return {
    grouped,
    deleteMode,
    selected,
    setDeleteMode,
    setSelected,
    toggleSelect,
    handleDelete,
    handleAddBtn,
  }
}

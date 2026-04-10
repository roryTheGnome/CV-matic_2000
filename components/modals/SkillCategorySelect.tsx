import { Option } from '@/components/ui/select/Option'
import { Select } from '@/components/ui/select/Select'

import { useQuery } from '@apollo/client/react'

import { GET_SKILL_CATEGORIES } from '@/api/graphql/queries/skills'
import { GetSkillCategoriesData, SkillModalFormState } from '@/types/skills'
import { useTranslations } from 'next-intl'
import { ChangeEvent } from 'react'

interface Props {
  formId: string
  formData: SkillModalFormState
  handleChange: (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => void
}

export function SkillSelect({ formData, formId, handleChange }: Props) {
  const { data: skillData } =
    useQuery<GetSkillCategoriesData>(GET_SKILL_CATEGORIES)
  const t = useTranslations('Forms')

  return (
    <Select
      id={`${formId}-categoryId`}
      name="categoryId"
      value={formData.categoryId}
      isRequired
      title={t('skill')}
      handleChange={handleChange}
    >
      {skillData?.skillCategories.map((skill) => (
        <Option key={skill.id} value={skill.id} title={skill.name} />
      ))}
    </Select>
  )
}

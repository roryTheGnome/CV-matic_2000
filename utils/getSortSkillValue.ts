import { SkillItem } from '@/types/skills'
import { GlobalSortKey } from '@/types/table'

export const getSortSkillsValue = (
  skill: SkillItem,
  sortKey: GlobalSortKey,
) => {
  switch (sortKey) {
    case 'skill_name':
      return skill.name
    case 'skill_type':
      return skill.category_parent_name
    case 'skill_category':
      return skill.category_name
    default:
      return ''
  }
}

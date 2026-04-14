import { SkillItem } from '@/types/skills'
import { GlobalSortKey } from '@/types/table'
import { getSortSkillsValue } from '../getSortSkillValue'

describe('getSortSkillsValue', () => {
  const mockSkill = {
    name: 'TypeScript',
    category_parent_name: 'Languages',
    category_name: 'Programming',
  } as SkillItem

  it('should return the skill name when sortKey is "skill_name"', () => {
    expect(getSortSkillsValue(mockSkill, 'skill_name' as GlobalSortKey)).toBe(
      'TypeScript',
    )
  })

  it('should return the category parent name when sortKey is "skill_type"', () => {
    expect(getSortSkillsValue(mockSkill, 'skill_type' as GlobalSortKey)).toBe(
      'Languages',
    )
  })

  it('should return the category name when sortKey is "skill_category"', () => {
    expect(
      getSortSkillsValue(mockSkill, 'skill_category' as GlobalSortKey),
    ).toBe('Programming')
  })

  it('should return an empty string when an invalid sortKey is provided', () => {
    expect(
      getSortSkillsValue(mockSkill, 'invalid_key' as unknown as GlobalSortKey),
    ).toBe('')
  })
})

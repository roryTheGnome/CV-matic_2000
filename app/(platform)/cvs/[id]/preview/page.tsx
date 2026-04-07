'use client'

import { useCv } from '@/lib/hooks/cvHooks/useCv'
import MainPage from '@/components/cv/MainPage'
import { useQuery } from '@apollo/client/react'
import { GetSkillsData, SkillMastery } from '@/types/skills'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import ProfecionalSkillsPage from '@/components/cv/ProfecionalSkillsPage'

export default function CvPreview() {
  const { isLoading,cv,error}=useCv()
  const { data } = useQuery<GetSkillsData>(GET_SKILLS)
  const allSkills=data ? data.skills : []

  if(cv===undefined)return;
  const grouped: Record<string, SkillMastery[]> = {}

  cv.skills.forEach((skill) => {
    const fullSkill = allSkills.find((s) => s.name === skill.name)

    const categoryName = fullSkill?.category_name || 'Other' //i add otehr as fallback but i dont think it will be at use, max for debugging

    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }

    grouped[categoryName].push(skill)
  })



  return (
    <div>
      <MainPage cv={cv} grouped={grouped} />
      <ProfecionalSkillsPage grouped={grouped} />
    </div>
  );
}

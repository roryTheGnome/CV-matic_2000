'use client'

import { Skills } from '@/components/skills/Skills'
import { Loader } from '@/components/ui/Loader'
import { useCvSkills } from '../_hooks/useCVSkills'

export default function CvSkill() {
  const { cvData, skillsData, id, error, loading, handleDelete } = useCvSkills()

  if (error) {
    return <div className="text-red-500">Failed to load data.</div>
  }
  if (loading) {
    return <Loader />
  }

  return (
    <Skills
      skills={cvData?.cv.skills}
      allSkills={skillsData?.skills || []}
      owner={true}
      modalType="CV_SKILL_ADD"
      cvId={id}
      onDelete={handleDelete}
    />
  )
}

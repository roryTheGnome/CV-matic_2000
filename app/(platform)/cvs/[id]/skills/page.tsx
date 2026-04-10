'use client'

import { Skills } from '@/components/skills/Skills'
import { Loader } from '@/components/ui/Loader'
import { useTranslations } from 'next-intl'
import { useCvSkills } from '../_hooks/useCVSkills'

export default function CvSkill() {
  const t = useTranslations('Notifications')
  const { cvData, skillsData, id, error, loading, handleDelete } = useCvSkills()

  if (error) {
    return <div className="text-red-500">{t('Notifications')}</div>
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

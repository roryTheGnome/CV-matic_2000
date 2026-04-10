import { CvProject } from '@/types/cvs'
import { SkillMastery } from '@/types/skills'
import { getExperienceYears } from '@/utils/getFirstUsed'
import { getLastUsed } from '@/utils/getLastUsed'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {
  grouped: Record<string, SkillMastery[]>
  projects?: CvProject[]
}

export default function ProfecionalSkillsPage({ grouped, projects }: Props) {
  const t = useTranslations('CvPage')
  return (
    <>
      <h1 className="text-text-primary mb-10 text-4xl font-medium">
        {t('professionalSkills')}
      </h1>
      <div className="flex min-h-screen justify-center p-10">
        <div className="w-full max-w-5xl">
          <div className="text-text-primary mb-4 grid grid-cols-4 text-sm font-semibold">
            <div>{t('skills')}</div>
            <div></div>
            <div className="flex items-start">{t('experienceInYears')}</div>
            <div className="flex items-end justify-center">{t('lastUsed')}</div>
          </div>

          {Object.entries(grouped).map(([category, skills], index) => (
            <div key={category}>
              <div
                className={`${index === 0 ? 'border-t-2 border-red-500 pt-4' : ''}`}
              >
                <div className="text-text-primary grid grid-cols-4 gap-y-3">
                  <div className="flex items-start text-sm font-semibold text-red-600">
                    {category}
                  </div>

                  {skills[0] && (
                    <>
                      <div key={skills[0].name} className="text-xs">
                        {skills[0].name}
                      </div>
                      <div className="flex items-center justify-center text-xs">
                        {getExperienceYears(skills[0].name, projects)
                          ? getExperienceYears(skills[0].name, projects)
                          : ' '}
                      </div>
                      <div className="flex items-center justify-center text-xs">
                        {getLastUsed(skills[0].name, projects)
                          ? getLastUsed(skills[0].name, projects)
                          : ' '}
                      </div>
                    </>
                  )}

                  {skills.slice(1).map((skill) => (
                    <React.Fragment key={skill.name}>
                      <div></div>
                      <div className="text-xs">{skill.name}</div>
                      <div className="flex items-center justify-center text-xs">
                        {getExperienceYears(skill.name, projects)
                          ? getExperienceYears(skill.name, projects)
                          : ' '}
                      </div>
                      <div className="flex items-center justify-center text-xs">
                        {getLastUsed(skill.name, projects)
                          ? getLastUsed(skill.name, projects)
                          : ' '}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="my-8 border-t border-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

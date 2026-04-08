import { SkillMastery } from '@/types/skills'
import React from 'react'

type Props = {
  grouped: Record<string, SkillMastery[]>
}

export default function ProfecionalSkillsPage({ grouped }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-text-primary mb-10 text-4xl font-medium">
          Professional skills
        </h1>

        <div className="text-text-primary mb-4 grid grid-cols-4 text-sm font-semibold">
          <div>SKILLS</div>
          <div></div>
          <div className="flex items-start">EXPERIENCE IN YEARS</div>
          <div className="flex items-end justify-center">LAST USED</div>
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
                      {'X'}
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      {'XXXX'}
                    </div>
                  </>
                )}

                {skills.slice(1).map((skill) => (
                  <React.Fragment key={skill.name}>
                    <div></div>
                    <div className="text-xs">{skill.name}</div>
                    <div className="flex items-center justify-center text-xs">
                      {'X'}
                    </div>
                    <div className="flex items-center justify-center text-xs">
                      {'XXXX'}
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
  )
}

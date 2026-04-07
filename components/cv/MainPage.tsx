import { Cvs } from '@/types/cvs'
import { SkillMastery } from '@/types/skills'
type Props = {
  cv: Cvs
  grouped: Record<string, SkillMastery[]>
}
export default function MainPage({ cv, grouped }: Props) {
  const langs = cv.languages.map((lang) => `${lang.name}`).join(', ') + '.'

  const domains = cv.projects.map((proj) => `${proj.domain}`).join(', ') + '.'

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-5xl">
        <div className="relative grid grid-cols-2 gap-12">
          <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-red-500" />

          <div className="space-y-8 pr-6">
            <div>
              <p className="text-text-primary mb-2 font-semibold">Education</p>
              <p className="text-text-primary text-sm">{cv.education}</p>
            </div>

            <div>
              <p className="text-text-primary mb-2 font-semibold">
                Language proficiency
              </p>
              <p className="text-text-primary text-sm">{langs}</p>
            </div>

            <div>
              <p className="text-text-primary mb-2 font-semibold">Domains</p>
              <p className="text-text-primary text-sm">{domains}</p>
            </div>
          </div>

          <div className="space-y-8 pl-6">
            <div>
              <p className="text-text-primary mb-2 font-semibold">{cv.name}</p>
              <p className="text-text-primary text-sm">{cv.description}</p>
            </div>

            {Object.entries(grouped).map(([category, skills]) => (
              <div key={category}>
                <p className="text-text-primary mb-2 font-semibold">
                  {category}
                </p>
                <p className="text-text-primary text-sm">
                  {skills.map((skill) => `${skill.name}`).join(', ') + '.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { Cvs } from '@/types/cvs'
import { SkillMastery } from '@/types/skills'
type Props={
  cv:Cvs
  grouped: Record<string, SkillMastery[]>
}
export default function MainPage({cv,grouped}:Props){

  const langs = cv.languages
    .map(lang => `${lang.name}`)
    .join(', ') + '.';

  const domains = cv.projects
    .map(proj => `${proj.domain}`)
    .join(', ') + '.';

  return (
    <div className="min-h-screen bg-background flex  justify-center ">
      <div className="w-full max-w-5xl ">
        <div className="grid grid-cols-2 gap-12 relative">
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-red-500 -translate-x-1/2" />

          <div className="space-y-8 pr-6">
            <div>
              <p className="font-semibold text-text-primary mb-2">Education</p>
              <p className="text-text-primary text-sm">{cv.education}</p>
            </div>

            <div>
              <p className="font-semibold text-text-primary mb-2">Language proficiency</p>
              <p className="text-text-primary text-sm">{langs}</p>
            </div>

            <div>
              <p className="font-semibold text-text-primary mb-2">Domains</p>
              <p className="text-text-primary text-sm">{domains}</p>
            </div>
          </div>

          <div className="space-y-8 pl-6">
            <div>
              <p className="font-semibold text-text-primary mb-2">{cv.name}</p>
              <p className="text-text-primary text-sm">{cv.description}</p>
            </div>

            {Object.entries(grouped).map(([category, skills]) => (
              <div key={category}>
                <p className="font-semibold text-text-primary mb-2">{category}</p>
                <p className="text-text-primary text-sm">{skills
                  .map(skill => `${skill.name}`)
                  .join(', ') + '.'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
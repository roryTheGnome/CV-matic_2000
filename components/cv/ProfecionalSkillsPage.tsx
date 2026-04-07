import { SkillMastery } from '@/types/skills'

type Props = {
  grouped: Record<string, SkillMastery[]>
}

export default function ProfecionalSkillsPage({ grouped }: Props) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-medium text-text-primary mb-10">
          Professional skills
        </h1>

        <div className="grid grid-cols-4 text-sm font-semibold text-text-primary mb-4">
          <div>SKILLS</div>
          <div></div>
          <div>EXPERIENCE IN YEARS</div>
          <div>LAST USED</div>
        </div>

        {Object.entries(grouped).map(([category, skills], index) => (
          <div key={category}>
            <div className={`${index === 0 ? "border-t-2 border-red-500 pt-4" : ""}`}>

              <div className="grid grid-cols-4 gap-y-3 text-text-primary">

                <div className="text-red-600 font-semibold">
                  {category}
                </div>

                {skills[0] && (
                  <>
                    <div>{skills[0].name}</div>
                    <div>{ "X"}</div>
                    <div>{"XXXX"}</div>
                  </>
                )}

                {skills.slice(1).map((skill) => (
                  <>
                    <div key={skill.name + "-spacer"}></div>
                    <div key={skill.name}>{skill.name}</div>
                    <div>{"X"}</div>
                    <div>{"XXXX"}</div>
                  </>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-400 my-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
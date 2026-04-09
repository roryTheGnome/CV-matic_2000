import { CvProject } from '@/types/cvs'

function getFirstUsed(
  skillName: string,
  projects: CvProject[] | undefined,
): number | null {
  if (!projects) return null

  const relatedProjects = projects.filter((project) =>
    project.environment?.includes(skillName),
  )

  if (relatedProjects.length === 0) return null

  const sorted = [...relatedProjects].sort((a, b) => {
    const dateA = new Date(a.start_date).getTime()
    const dateB = new Date(b.start_date).getTime()
    return dateA - dateB
  })

  const first = sorted[0]
  return new Date(first.start_date).getFullYear()
}

export function getExperienceYears(
  skillName: string,
  projects: CvProject[] | undefined,
): number | null {
  const firstYear = getFirstUsed(skillName, projects)
  if (!firstYear) return null

  const currentYear = new Date().getFullYear()
  return currentYear - firstYear
}

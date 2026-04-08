import { CvProject } from '@/types/cvs'

export function getLastUsed(
  skillName: string,
  projects: CvProject[] | undefined,
): string | null {
  if (!projects) return null

  const relatedProjects = projects.filter((project) =>
    project.environment?.includes(skillName),
  )

  if (relatedProjects.length === 0) return null

  const sorted = [...relatedProjects].sort((a, b) => {
    const dateA = new Date(a.end_date || a.start_date).getTime()
    const dateB = new Date(b.end_date || b.start_date).getTime()
    return dateB - dateA
  })

  const latest = sorted[0]
  return latest.end_date
}

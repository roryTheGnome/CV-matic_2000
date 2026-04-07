import { Project } from '@/types/project'
import { GlobalSortKey } from '@/types/table'

export const getSortProjectValue = (
  project: Project,
  sortKey: GlobalSortKey,
) => {
  switch (sortKey) {
    case 'project_name':
      return project.name
    case 'project_domain':
      return project.domain
    case 'project_end_date':
      return project.end_date ? project.end_date : ''
    case 'project_start_date':
      return project.start_date
    default:
      return ''
  }
}

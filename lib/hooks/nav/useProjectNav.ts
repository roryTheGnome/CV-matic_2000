import { useProject } from '@/lib/hooks/projectHooks/useProject'

export function useProjectNav() {
  const { project, isLoading, error } = useProject()

  const projectDisplayName = project
    ? `${project.name} ${project.start_date}`
    : 'Unknown Project'

  const projectError=error;
  return {
    project,
    isLoading,
    projectError,
    projectDisplayName
  }
}

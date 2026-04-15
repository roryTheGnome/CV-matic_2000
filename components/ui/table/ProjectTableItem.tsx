import { ProjectsActionsMenu } from '@/components/admin/ProjectsActionsMenu'
import { Project } from '@/types/project'

export function ProjectTableItem({
  project,
  isAdmin,
}: {
  project: Project
  isAdmin: boolean
}) {
  return (
    <>
      <tr className="border-none">
        <td className="px-4 py-2 font-semibold">{project.name}</td>
        <td className="px-4 py-2">{project.domain}</td>
        <td className="px-4 py-2">{project.start_date}</td>
        <td className="px-4 py-2">{project.end_date || 'Till now'}</td>
        <td className="px-4 py-2">
          <ProjectsActionsMenu
            editType="PROJECT_EDIT"
            deleteType="PROJECT_DELETE"
            item={{ id: project.id, name: project.name }}
            isAdmin={isAdmin}
          />
        </td>
      </tr>

      {project.description && (
        <tr className="bg-background">
          <td colSpan={5} className="text-text-secondary px-4 py-1 text-sm">
            {project.description}
          </td>
        </tr>
      )}

      {project.environment?.length > 0 && (
        <tr>
          <td colSpan={5} className="border-b border-gray-300 px-4 py-1">
            <div className="flex flex-wrap gap-2">
              {project.environment.map((env) => (
                <span
                  key={env}
                  className="text-text-secondary mb-2 rounded-full border border-(--color-input-border) px-3 py-1 text-xs"
                >
                  {env}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

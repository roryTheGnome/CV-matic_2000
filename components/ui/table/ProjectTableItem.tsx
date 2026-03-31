import { ActionsMenu } from "@/components/admin/ActionsMenu"
import { Project } from "@/types/project"

export function ProjectTableItem({ project }: { project: Project }) {
  return (
    <tr key={project.id} className="divide-y divide-gray-500 ">
      <td className="px-4 py-3 flex items-center gap-3">{project.name}</td>

      <td className="px-4 py-3">{project.domain}</td>
      <td className="px-4 py-3">{project.start_date}</td>
      <td className="px-4 py-3">{project.end_date}</td>

      <td className="w-8 text-right pr-2">
        <ActionsMenu
          editType={"PROJECT_EDIT"}
          deleteType={"PROJECT_DELETE"}
          item={{
            id: project.id,
            name: `project ${project.name}`,
          }}
        />
      </td>

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  )
}

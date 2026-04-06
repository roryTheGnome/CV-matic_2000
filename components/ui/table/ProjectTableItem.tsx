import { Project } from "@/types/project";
import { ActionsMenu } from "@/components/admin/ActionsMenu";

export function ProjectTableItem({
  project,
  isAdmin,
}: {
  project: Project;
  isAdmin: boolean;
}) {
  return (
    <>
      <tr className="border-none">
        <td className="px-4 py-2 font-semibold">{project.name}</td>
        <td className="px-4 py-2">{project.domain}</td>
        <td className="px-4 py-2">{project.start_date}</td>
        <td className="px-4 py-2">{project.end_date || "Till now"}</td>
        <td className="px-4 py-2">
          {isAdmin && (
            <ActionsMenu
              editType="PROJECT_EDIT"
              deleteType="PROJECT_DELETE"
              item={{ id: project.id, name: project.name }}
            />
          )}
        </td>
      </tr>

      {project.description && (
        <tr className="bg-background">
          <td colSpan={5} className="px-4 py-1 text-sm text-text-secondary">
            {project.description}
          </td>
        </tr>
      )}

      {project.environment?.length > 0 && (
        <tr>
          <td colSpan={5} className="px-4 py-1 border-b border-gray-300 ">
            <div className="flex flex-wrap gap-2  ">
              {project.environment.map((env) => (
                <span
                  key={env}
                  className="text-xs px-3 py-1 mb-2 rounded-full border border-(--color-input-border) text-text-secondary"
                >
                  {env}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

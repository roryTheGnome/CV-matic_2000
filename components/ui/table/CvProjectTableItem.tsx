import { ActionsMenu } from '@/components/admin/ActionsMenu'
import { CvProject } from '@/types/cvs'
import { useParams } from 'next/navigation'

export function CvProjectTableItem({ cvProject }: { cvProject: CvProject }) {
  const { id } = useParams<{ id: string }>()

  return (
    <>
      <tr className="border-none">
        <td className="px-4 py-2 font-semibold">{cvProject.name}</td>
        <td className="px-4 py-2">
          {cvProject.domain || cvProject.project?.domain || ''}
        </td>
        <td className="px-4 py-2">{cvProject.start_date}</td>
        <td className="px-4 py-2">{cvProject.end_date || 'Till now'}</td>
        <td className="px-4 py-2">
          <ActionsMenu
            editType="CV_PROJECT_EDIT"
            deleteType="CV_PROJECT_DELETE"
            item={{
              id,
              projectId: cvProject.project?.id,
              name: cvProject.name,
            }}
          />
        </td>
      </tr>

      {cvProject.description && (
        <tr className="bg-background">
          <td
            colSpan={5}
            className="text-text-secondary border-input-border border-b px-4 py-1 pb-4 text-sm"
          >
            {cvProject.description}
          </td>
        </tr>
      )}
    </>
  )
}

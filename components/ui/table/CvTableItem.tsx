import { ActionsMenu } from "@/components/admin/ActionsMenu"
import { Cvs } from "@/types/cvs"

export function CvTableItem({ cv }: { cv: Cvs }) {
  return (
    <tr key={cv.id} className="divide-y divide-gray-500 ">
      <td className="px-4 py-3 flex items-center gap-3">{cv.name}</td>

      <td className="px-4 py-3">{cv.education}</td>
      <td className="px-4 py-3">{cv.user?.email}</td>

      <td className="w-8 text-right pr-2">
        <ActionsMenu
          editType={"CV_EDIT"}
          deleteType={"CV_DELETE"}
          item={{
            id: cv.id,
            name: `CV ${cv.name}`,
          }}
        />
      </td>

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  )
}

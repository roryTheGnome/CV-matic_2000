import { ActionsMenu } from "@/components/admin/ActionsMenu"

export function NameTableItem({
  item,
}: {
  item: { id: string; name: string }
}) {
  return (
    <tr key={item.id} className="divide-y divide-gray-500 ">
      <td className="p-4">{item.name}</td>

      <td className="w-8 text-right pr-2">
        <ActionsMenu
          editType={"DEPARTMENT_EDIT"}
          deleteType={"DEPARTMENT_DELETE"}
          item={{ id: item.id, name: `department ${item.name}` }}
        />
      </td>

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  )
}

import { ActionsMenu } from "@/components/admin/ActionsMenu"
import { SkillItem } from "@/types/skills"

export function SkillTableItem({ item }: { item: SkillItem }) {
  return (
    <tr key={item.id} className="divide-y divide-gray-500 ">
      <td className="px-4 py-3 flex items-center gap-3">{item.name}</td>

      <td className="px-4 py-3">{item.category_parent_name}</td>
      <td className="px-4 py-3">{item.category_name}</td>

      <td className="w-8 text-right pr-2">
        <ActionsMenu
          editType={"SKILL_EDIT"}
          deleteType={"SKILL_DELETE"}
          item={{
            id: item.id,
            name: item.name,
          }}
        />
      </td>

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  )
}

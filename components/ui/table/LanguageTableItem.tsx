import { ActionsMenu } from "@/components/admin/ActionsMenu"
import { LanguageItem } from "@/types/languages"

export function LanguageTableItem({ item }: { item: LanguageItem }) {
  return (
    <tr key={item.id} className="divide-y divide-gray-500 ">
      <td className="px-4 py-3 flex items-center gap-3">{item.name}</td>

      <td className="px-4 py-3">{item.native_name}</td>
      <td className="px-4 py-3">{item.iso2}</td>

      <td className="w-8 text-right pr-2">
        <ActionsMenu
          editType={"LANGUAGE_EDIT"}
          deleteType={"LANGUAGE_DELETE"}
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

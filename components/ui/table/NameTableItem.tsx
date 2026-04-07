import { ActionsMenu } from "@/components/admin/ActionsMenu"
import { ModalData, ModalType } from "@/store/modalStore"

interface Props {
  item: ModalData
  editType: ModalType
  deleteType: ModalType
  isAdmin: boolean
}

export function NameTableItem({ item, editType, deleteType,isAdmin }: Props) {
  return (
    <tr key={item.id} className="divide-y divide-gray-500 ">
      <td className="p-4">{item.name}</td>

      {isAdmin && (
        <td className="w-8 text-right pr-2">
          <ActionsMenu
            editType={editType}
            deleteType={deleteType}
            item={{ id: item.id, name: item.name }}
          />
        </td>
      )}

      <td className="last:border-b last:border-gray-500"></td>
    </tr>
  );
}

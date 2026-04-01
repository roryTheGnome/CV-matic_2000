import { useAuthStore } from "@/store/authStore"
import { ModalType, useModalStore } from "@/store/modalStore"
import { Plus } from "lucide-react"
import { Button } from "./Button"

interface Props {
  search: string
  createButtonText: string
  typeOfCreateModal: ModalType
  userCanInteract?: boolean
  setSearch: (search: string) => void
}

export function TableSearch({
  search,
  createButtonText,
  typeOfCreateModal,
  userCanInteract = false,
  setSearch,
}: Props) {
  const { isAdmin } = useAuthStore()
  const { openModal } = useModalStore()
  return (
    <div className="flex justify-between items-center">
      <input
        type="text"
        placeholder="Search.."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-500 rounded-4xl w-full max-w-sm"
      />
      {(isAdmin || userCanInteract) && (
        <Button
          Icon={Plus}
          isTextButton
          className="text-red-400"
          onClick={() => openModal(typeOfCreateModal)}
        >
          {createButtonText}
        </Button>
      )}
    </div>
  )
}

import { ModalData } from "@/store/modalStore"
import { Button } from "../ui/Button"
import { CancelButton } from "../ui/CancelButton"
import { ModalLayout } from "./ModalLayout"

interface Props {
  data: ModalData | undefined
  loading: boolean
  deleteText: string
  headingText: string
  closeModal: () => void
  handleDelete: () => void
}

export function DeleteModal({
  data,
  loading,
  deleteText,
  headingText,
  closeModal,
  handleDelete,
}: Props) {
  return (
    <ModalLayout title={`Delete ${headingText}`} maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        <p className="text-gray-300 text-lg">
          Are you sure you want to delete {deleteText}?
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <CancelButton closeModal={closeModal} />

          <Button onClick={handleDelete} disabled={loading || !data?.id}>
            {loading ? "DELETING..." : "CONFIRM"}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

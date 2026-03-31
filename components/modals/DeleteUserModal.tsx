import { useDeleteUser } from "@/lib/hooks/useDeleteUser"

import { Button } from "../ui/Button"
import { CancelButton } from "../ui/CancelButton"
import { ModalLayout } from "./ModalLayout"

interface Props {
  data: { id: string; name: string } | undefined
  closeModal: () => void
}

export function DeleteModal({ closeModal, data }: Props) {
  const { handleDelete, loading } = useDeleteUser(data?.id, closeModal)

  return (
    <ModalLayout title="Delete user" maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        <p className="text-gray-300 text-lg">
          Are you sure you want to delete {data?.name}?
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

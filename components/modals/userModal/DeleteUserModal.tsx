import { useDeleteUser } from "@/lib/hooks/userHooks/useDeleteUser"

import { DeleteModal } from "../DeleteModal"

export function DeleteUserModal() {
  const { modalData: data, loading, closeModal, handleDelete } = useDeleteUser()

  return (
    <DeleteModal
      deleteText={`user ${data?.name}`}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

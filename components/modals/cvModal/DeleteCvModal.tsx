import { useDeleteCv } from "@/lib/hooks/cvHooks/useDeleteCv"
import { DeleteModal } from "../DeleteModal"

export function DeleteCvModal() {
  const { modalData: data, loading, closeModal, handleDelete } = useDeleteCv()

  return (
    <DeleteModal
      deleteText={`CV ${data?.name}`}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

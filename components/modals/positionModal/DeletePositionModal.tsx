import { useDeletePosition } from "@/lib/hooks/positionHooks/useDeletePosition"
import { DeleteModal } from "../DeleteModal"

export function DeletePositionModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeletePosition()

  return (
    <DeleteModal
      deleteText={`position ${data?.name}`}
      headingText="position"
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

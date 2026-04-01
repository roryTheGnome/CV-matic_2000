import { useDeleteDepartment } from "@/lib/hooks/departmentHooks/useDeleteDepartment"
import { DeleteModal } from "../DeleteModal"

export function DeleteDepartmentModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteDepartment()

  return (
    <DeleteModal
      deleteText={`department ${data?.name}`}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

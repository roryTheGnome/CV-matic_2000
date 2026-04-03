import { useDeleteProject } from "@/lib/hooks/projectHooks/useDeleteProject"
import { DeleteModal } from "../DeleteModal"

export function DeleteProjectModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteProject()

  return (
    <DeleteModal
      deleteText={`project ${data?.name}`}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

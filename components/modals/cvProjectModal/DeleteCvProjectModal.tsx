import { DeleteModal } from '../DeleteModal'
import { useDeleteCvProject } from './_hooks/useDeleteCvProject'

export function DeleteCvProjectModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteCvProject()

  return (
    <DeleteModal
      deleteText={`project ${data?.name} from the CV`}
      headingText="project"
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

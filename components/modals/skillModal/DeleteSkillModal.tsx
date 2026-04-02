import { useDeleteSkill } from "@/lib/hooks/skillHooks/useDeleteSkill"
import { DeleteModal } from "../DeleteModal"

export function DeleteSkillModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteSkill()

  return (
    <DeleteModal
      deleteText={`skill ${data?.name}`}
      headingText="skill"
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

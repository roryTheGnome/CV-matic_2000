import { useDeleteLanguage } from "@/lib/hooks/languageHooks/useDeleteLanguage"
import { DeleteModal } from "../DeleteModal"

export function DeleteLanguageModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteLanguage()

  return (
    <DeleteModal
      deleteText={`language ${data?.name}`}
      headingText="language"
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

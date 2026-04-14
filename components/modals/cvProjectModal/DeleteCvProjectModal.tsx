import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'
import { useDeleteCvProject } from './_hooks/useDeleteCvProject'

export function DeleteCvProjectModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteCvProject()

  const t = useTranslations('CvModal')

  return (
    <DeleteModal
      deleteText={`${t('deleteProjectModalHeading')} ${data?.name} ${t('deleteProjectModalDeleteText')}`}
      headingText={t('deleteProjectModalHeading')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

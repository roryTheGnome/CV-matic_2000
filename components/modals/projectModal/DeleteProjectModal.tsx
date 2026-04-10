import { useDeleteProject } from '@/lib/hooks/projectHooks/useDeleteProject'
import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeleteProjectModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteProject()

  const t = useTranslations('ProjectModal')

  return (
    <DeleteModal
      deleteText={`${t('project')} ${data?.name}`}
      headingText={t('project')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

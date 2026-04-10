import { useDeleteDepartment } from '@/lib/hooks/departmentHooks/useDeleteDepartment'
import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeleteDepartmentModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteDepartment()

  const t = useTranslations('DepartmentModal')

  return (
    <DeleteModal
      deleteText={`${t('department')} ${data?.name}`}
      headingText={t('department')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

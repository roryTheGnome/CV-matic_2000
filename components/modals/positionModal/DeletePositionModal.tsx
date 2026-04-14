import { useDeletePosition } from '@/lib/hooks/positionHooks/useDeletePosition'
import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeletePositionModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeletePosition()

  const t = useTranslations('PositionModal')

  return (
    <DeleteModal
      deleteText={`${t('position')} ${data?.name}`}
      headingText={t('position')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

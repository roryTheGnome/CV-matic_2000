import { useDeleteUser } from '@/lib/hooks/userHooks/useDeleteUser'

import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeleteUserModal() {
  const { modalData: data, loading, closeModal, handleDelete } = useDeleteUser()

  const t = useTranslations('UserModal')

  return (
    <DeleteModal
      deleteText={`${t('user')} ${data?.name}`}
      headingText={t('user')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

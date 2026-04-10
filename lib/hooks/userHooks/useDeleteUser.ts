import { DELETE_USER_MUTATION } from '@/api/graphql/mutations/user'
import { useModalStore } from '@/store/modalStore'
import { DeleteUserResponse, DeleteUserVariables } from '@/types/user'
import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export function useDeleteUser() {
  const { data: modalData, closeModal } = useModalStore()
  const t = useTranslations('UserToast')
  const [deleteUser, { loading }] = useMutation<
    DeleteUserResponse,
    DeleteUserVariables
  >(DELETE_USER_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'User', id: modalData?.id }),
      })
      cache.gc()
    },

    onCompleted: (data) => {
      if (data.deleteUser.affected > 0) {
        toast.success(t('userDeleteSuccess'))
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || t('userDeleteError'))
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error(t('userIdMissing'))
      return
    }

    deleteUser({
      variables: { userId: modalData?.id },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

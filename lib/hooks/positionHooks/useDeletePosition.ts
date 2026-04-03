import { DELETE_POSITION_MUTATION } from '@/api/graphql/mutations/position'
import { useModalStore } from '@/store/modalStore'
import {
  DeletePositionResponse,
  DeletePositionVariables,
} from '@/types/position'

import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'

export function useDeletePosition() {
  const { data: modalData, closeModal } = useModalStore()

  const [deletePosition, { loading }] = useMutation<
    DeletePositionResponse,
    DeletePositionVariables
  >(DELETE_POSITION_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Position', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deletePosition.affected > 0) {
        toast.success('Position successfully deleted')
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete position')
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error('Position ID is missing!')
      return
    }

    deletePosition({
      variables: { position: { positionId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

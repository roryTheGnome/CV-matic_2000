import { DELETE_CV_MUTATION } from '@/api/graphql/mutations/cv'

import { useModalStore } from '@/store/modalStore'
import { DeleteCvResponse, DeleteCvVariables } from '@/types/cvs'

import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'

export function useDeleteCv() {
  const { data: modalData, closeModal } = useModalStore()

  const [deleteCv, { loading }] = useMutation<
    DeleteCvResponse,
    DeleteCvVariables
  >(DELETE_CV_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Cv', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deleteCv.affected > 0) {
        toast.success('Cv successfully deleted')
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete cv')
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error('Cv ID is missing!')
      return
    }

    deleteCv({
      variables: { cv: { cvId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

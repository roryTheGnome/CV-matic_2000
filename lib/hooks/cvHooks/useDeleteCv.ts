import { DELETE_CV_MUTATION } from '@/api/graphql/mutations/cv'

import { useModalStore } from '@/store/modalStore'
import { DeleteCvResponse, DeleteCvVariables } from '@/types/cvs'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export function useDeleteCv() {
  const { data: modalData, closeModal } = useModalStore()
  const t = useTranslations('CvToast')
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
        toast.success(t('cvDeleteSuccess'))
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || t('cvDeleteError'))
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error(t('cvIdMissing'))
      return
    }

    deleteCv({
      variables: { cv: { cvId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

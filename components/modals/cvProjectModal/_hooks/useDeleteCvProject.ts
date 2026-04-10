import { REMOVE_CV_PROJECT_MUTATION } from '@/api/graphql/mutations/cv'
import { useModalStore } from '@/store/modalStore'
import { RemoveCvProjectData, RemoveCvProjectVariables } from '@/types/cvs'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export function useDeleteCvProject() {
  const t = useTranslations('ProjectToast')
  const { data: modalData, closeModal } = useModalStore()
  const { id } = useParams<{ id: string }>()

  const [removeCvProject, { loading }] = useMutation<
    RemoveCvProjectData,
    RemoveCvProjectVariables
  >(REMOVE_CV_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success(t('cvProjectRemoved'))
      closeModal()
    },
    onError: (err) => {
      toast.error(t('errorOccurred') + err.message)
    },
  })

  const handleDelete = () => {
    if (!modalData?.projectId) {
      toast.error('Project ID is missing!')
      return
    }

    removeCvProject({
      variables: {
        project: {
          cvId: id,
          projectId: modalData?.projectId,
        },
      },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

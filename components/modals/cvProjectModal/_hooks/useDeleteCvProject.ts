import { REMOVE_CV_PROJECT_MUTATION } from '@/api/graphql/mutations/cv'
import { useModalStore } from '@/store/modalStore'
import { RemoveCvProjectData, RemoveCvProjectVariables } from '@/types/cvs'

import { useMutation } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export function useDeleteCvProject() {
  const { data: modalData, closeModal } = useModalStore()
  const { id } = useParams<{ id: string }>()
  const [removeCvProject, { loading }] = useMutation<
    RemoveCvProjectData,
    RemoveCvProjectVariables
  >(REMOVE_CV_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success('Project successfully removed from CV!')
      closeModal()
    },
    onError: (err) => {
      toast.error('Failed to remove project: ' + err.message)
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

import { DELETE_PROJECT_MUTATION } from '@/api/graphql/mutations/project'
import { useModalStore } from '@/store/modalStore'
import { DeleteProjectResponse, DeleteProjectVariables } from '@/types/project'

import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'

export function useDeleteProject() {
  const { data: modalData, closeModal } = useModalStore()

  const [deleteProject, { loading }] = useMutation<
    DeleteProjectResponse,
    DeleteProjectVariables
  >(DELETE_PROJECT_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Project', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deleteProject.affected > 0) {
        toast.success('Project successfully deleted')
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete project')
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error('Project ID is missing!')
      return
    }

    deleteProject({
      variables: { project: { projectId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

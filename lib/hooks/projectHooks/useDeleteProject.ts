import { DELETE_PROJECT_MUTATION } from '@/api/graphql/mutations/project'
import { useModalStore } from '@/store/modalStore'
import { DeleteProjectResponse, DeleteProjectVariables } from '@/types/project'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export function useDeleteProject() {
  const { data: modalData, closeModal } = useModalStore()
  const t = useTranslations('ProjectToast')
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
        toast.success(t('projectDeleteSuccess'))
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || t('projectDeleteError'))
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error(t('projectIdMissing'))
      return
    }

    deleteProject({
      variables: { project: { projectId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

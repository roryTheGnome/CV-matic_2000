import { DELETE_SKILL_MUTATION } from '@/api/graphql/mutations/skills'
import { useModalStore } from '@/store/modalStore'
import { DeleteSkillResponse, DeleteSkillVariables } from '@/types/skills'

import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'

export function useDeleteSkill() {
  const { data: modalData, closeModal } = useModalStore()

  const [deleteSkill, { loading }] = useMutation<
    DeleteSkillResponse,
    DeleteSkillVariables
  >(DELETE_SKILL_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Skill', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deleteSkill.affected > 0) {
        toast.success('Skill successfully deleted')
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete skill')
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error('Skill ID is missing!')
      return
    }

    deleteSkill({
      variables: { skill: { skillId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

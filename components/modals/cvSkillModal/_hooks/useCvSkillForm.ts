import {
  ADD_CV_SKILL_MUTATION,
  UPDATE_CV_SKILL_MUTATION,
} from '@/api/graphql/mutations/cv'
import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import { useModalStore } from '@/store/modalStore'
import {
  CreateCvSkillInput,
  Cvs,
  GetCvByIdData,
  GetCvByIdVariables,
  UpdateCvSkillInput,
} from '@/types/cvs'
import { GetSkillsData, Mastery, SkillItem, SkillMastery } from '@/types/skills'
import { useMutation, useQuery } from '@apollo/client/react'
import { SubmitEvent, useState } from 'react'
import toast from 'react-hot-toast'

export const useCvSkillForm = (skill: SkillMastery | undefined) => {
  const { data: modalData, type, closeModal } = useModalStore()

  const { data: allSkillsData } = useQuery<GetSkillsData>(GET_SKILLS, {
    fetchPolicy: 'cache-and-network',
  })
  const {
    data: cvData,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: modalData?.id ? modalData?.id : '' },
    fetchPolicy: 'cache-and-network',
  })

  const [addCvSkill, { loading: addSaving }] = useMutation<
    Cvs,
    CreateCvSkillInput
  >(ADD_CV_SKILL_MUTATION, {
    refetchQueries: [
      {
        query: GET_CV_BY_ID,
        variables: { cvId: modalData?.id },
      },
    ],
  })
  const [updateCvSkill, { loading: updateSaving }] = useMutation<
    Cvs,
    UpdateCvSkillInput
  >(UPDATE_CV_SKILL_MUTATION, {
    refetchQueries: [
      {
        query: GET_CV_BY_ID,
        variables: { cvId: modalData?.id },
      },
    ],
  })

  const [selectedSkill, setSelectedSkill] = useState<Partial<SkillItem> | null>(
    type === 'CV_SKILL_EDIT' ? { name: skill?.name } : null,
  )
  const [mastery, setMastery] = useState<Mastery>(
    skill?.mastery ? skill?.mastery : 'Novice',
  )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedSkill) return

    try {
      if (type === 'CV_SKILL_ADD' && 'category' in selectedSkill) {
        await addCvSkill({
          variables: {
            skill: {
              cvId: modalData?.id ? modalData?.id : '',
              name: selectedSkill.name ? selectedSkill.name : '',
              categoryId: selectedSkill.category?.id,
              mastery,
            },
          },
        })
      } else if (modalData?.skill?.mastery) {
        await updateCvSkill({
          variables: {
            skill: {
              cvId: modalData?.id ? modalData?.id : '',
              name: selectedSkill.name ? selectedSkill.name : '',
              categoryId: modalData?.skill?.categoryId,
              mastery,
            },
          },
        })
      }

      closeModal()
    } catch (err) {
      toast.error('Error while adding a skill to the cv' + err)
    }
  }

  const availableSkills =
    allSkillsData?.skills.filter(
      (skillLocal) =>
        !cvData?.cv.skills.some(
          (u) => u.name === skillLocal.name && u.name !== skill?.name,
        ),
    ) || []

  const saving = addSaving || updateSaving

  return {
    loading,
    error,
    selectedSkill,
    availableSkills,
    mastery,
    saving,
    type,
    handleSubmit,
    setMastery,
    closeModal,
    setSelectedSkill,
  }
}

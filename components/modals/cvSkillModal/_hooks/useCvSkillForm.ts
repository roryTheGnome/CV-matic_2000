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
import { useTranslations } from 'next-intl'
import { SubmitEvent, useState } from 'react'
import toast from 'react-hot-toast'

export const useCvSkillForm = (skill: SkillMastery | undefined) => {
  const { data: modalData, type, closeModal } = useModalStore()
  const t = useTranslations('CvToast')

  const isEdit = type === 'CV_SKILL_EDIT'

  const { data: allSkillsData } = useQuery<GetSkillsData>(GET_SKILLS, {
    fetchPolicy: 'cache-and-network',
  })

  const { data: cvData } = useQuery<GetCvByIdData, GetCvByIdVariables>(
    GET_CV_BY_ID,
    {
      variables: { cvId: modalData?.id ?? '' },
      fetchPolicy: 'cache-and-network',
    },
  )

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
    skill ? { name: skill.name } : null,
  )

  const [mastery, setMastery] = useState<Mastery>(skill?.mastery ?? 'Novice')

  const isDirty =
    selectedSkill == undefined
      ? false
      : !isEdit ||
        mastery !== skill?.mastery ||
        selectedSkill?.name !== skill?.name

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedSkill?.name) return

    try {
      if (isEdit) {
        await updateCvSkill({
          variables: {
            skill: {
              cvId: modalData?.id ?? '',
              name: selectedSkill.name,
              categoryId: skill?.categoryId,
              mastery,
            },
          },
        })
      } else {
        if (!selectedSkill.category?.id) return

        await addCvSkill({
          variables: {
            skill: {
              cvId: modalData?.id ?? '',
              name: selectedSkill.name,
              categoryId: selectedSkill.category.id,
              mastery,
            },
          },
        })
      }

      closeModal()
    } catch (err) {
      toast.error(t('errorOccurred'))
    }
  }

  const availableSkills =
    allSkillsData?.skills.filter(
      (s) =>
        !cvData?.cv.skills.some(
          (u) => u.name === s.name && u.name !== skill?.name,
        ),
    ) ?? []

  return {
    selectedSkill,
    availableSkills,
    mastery,
    saving: addSaving || updateSaving,
    handleSubmit,
    setMastery,
    setSelectedSkill,
    isDirty,
  }
}

import {
  CREATE_SKILL_MUTATION,
  UPDATE_SKILL_MUTATION,
} from "@/api/graphql/mutations/skills"
import { GET_SKILLS } from "@/api/graphql/queries/skills"
import { useModalStore } from "@/store/modalStore"
import {
  CreateSkillData,
  CreateSkillVariables,
  GetSkillsData,
  SkillModalFormState,
  UpdateSkillData,
  UpdateSkillVariables,
} from "@/types/skills"

import { useMutation } from "@apollo/client/react"
import { ChangeEvent, SubmitEvent, useId, useState } from "react"
import toast from "react-hot-toast"

export function useSkillActions(
  initialData?: SkillModalFormState,
  skillId?: string,
) {
  const formId = useId()
  const { type, data: modalData, closeModal } = useModalStore()

  const [formData, setFormData] = useState<SkillModalFormState>(
    initialData || {
      name: "",
      categoryId: "",
    },
  )

  const [createSkill, { loading: creating }] = useMutation<
    CreateSkillData,
    CreateSkillVariables
  >(CREATE_SKILL_MUTATION, {
    update(cache, { data }) {
      if (!data?.createSkill) return

      const existingData = cache.readQuery<GetSkillsData>({
        query: GET_SKILLS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_SKILLS,
          data: {
            skills: [data.createSkill, ...existingData.skills],
          },
        })
      }
    },
    onCompleted: () => {
      toast.success("Skill created successfully!")
      closeModal()
    },
    onError: err => {
      toast.error(err.message)
    },
  })

  const [updateSkill, { loading: updating }] = useMutation<
    UpdateSkillData,
    UpdateSkillVariables
  >(UPDATE_SKILL_MUTATION, {
    onCompleted: () => {
      toast.success("Skill updated successfully!")
      closeModal()
    },
    onError: err => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid =
    formData.name.trim() !== "" && formData.categoryId.trim() !== ""

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      key =>
        formData[key as keyof SkillModalFormState] !==
        initialData[key as keyof SkillModalFormState],
    )

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isDirty) {
      closeModal()
      return
    }

    if (skillId) {
      updateSkill({
        variables: {
          skill: {
            skillId: modalData?.id ? modalData.id : "",
            name: formData.name,
            categoryId: formData.categoryId,
          },
        },
      })
    } else {
      createSkill({
        variables: {
          skill: {
            name: formData.name,
            categoryId: formData.categoryId,
          },
        },
      })
    }
  }

  return {
    formData,
    formId,
    loading,
    isFormValid,
    isDirty,
    type,
    closeModal,
    handleChange,
    handleSubmit,
  }
}

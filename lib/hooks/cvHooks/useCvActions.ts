import {
  CREATE_CV_MUTATION,
  UPDATE_CV_MUTATION,
} from '@/api/graphql/mutations/cv'
import { GET_CVS } from '@/api/graphql/queries/cvs'
import { useModalStore } from '@/store/modalStore'
import {
  CreateCvData,
  CreateCvModalFormState,
  CreateCvVariables,
  GetCvsData,
  UpdateCvData,
  UpdateCvVariables,
} from '@/types/cvs'

import { useMutation } from '@apollo/client/react'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

export function useCvActions(
  initialData?: CreateCvModalFormState,
  cvId?: string,
) {
  const formId = useId()
  const { type, closeModal } = useModalStore()
  const { currentUserId } = useAuthStore()

  const [formData, setFormData] = useState<CreateCvModalFormState>(
    initialData || {
      name: '',
      education: '',
      description: '',
      user: null,
    },
  )

  const [createCv, { loading: creating }] = useMutation<
    CreateCvData,
    CreateCvVariables
  >(CREATE_CV_MUTATION, {
    update(cache, { data }) {
      if (!data?.createCv) return

      const existingData = cache.readQuery<GetCvsData>({
        query: GET_CVS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_CVS,
          data: {
            cvs: [data.createCv, ...existingData.cvs],
          },
        })
      }
    },
    onCompleted: (data) => {
      toast.success('CV created successfully!')
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const [updateCv, { loading: updating }] = useMutation<
    UpdateCvData,
    UpdateCvVariables
  >(UPDATE_CV_MUTATION, {
    onCompleted: () => {
      toast.success('CV updated successfully!')
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid =
    formData.name.trim() !== '' && formData.description.trim() !== ''

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof CreateCvModalFormState] !==
        initialData[key as keyof CreateCvModalFormState],
    )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isDirty) {
      closeModal()
      return
    }

    if (cvId) {
      updateCv({
        variables: {
          cv: {
            cvId,
            name: formData.name,
            education:
              formData.education.trim() === '' ? null : formData.education,
            description: formData.description,
          },
        },
      })
    } else {
      createCv({
        variables: {
          cv: {
            name: formData.name,
            education:
              formData.education.trim() === '' ? null : formData.education,
            description: formData.description,
            userId: currentUserId ? `${currentUserId}` : null,
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

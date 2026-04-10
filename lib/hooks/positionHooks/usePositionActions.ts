import {
  CREATE_POSITION_MUTATION,
  UPDATE_POSITION_MUTATION,
} from '@/api/graphql/mutations/position'
import { GET_POSITIONS } from '@/api/graphql/queries/positions'
import { useModalStore } from '@/store/modalStore'
import {
  CreatePositionModalFormState,
  CreatePositionVariables,
  GetPositionsResponse,
  PositionData,
  UpdatePositionVariables,
} from '@/types/position'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function usePositionActions(
  initialData?: CreatePositionModalFormState,
  positionId?: string,
) {
  const formId = useId()
  const { type, closeModal } = useModalStore()
  const t = useTranslations('PositionToast')
  const [formData, setFormData] = useState<CreatePositionModalFormState>(
    initialData || {
      name: '',
    },
  )

  const [createPosition, { loading: creating }] = useMutation<
    PositionData,
    CreatePositionVariables
  >(CREATE_POSITION_MUTATION, {
    update(cache, { data }) {
      if (!data?.createPosition) return

      const existingData = cache.readQuery<GetPositionsResponse>({
        query: GET_POSITIONS,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_POSITIONS,
          data: {
            positions: [data.createPosition, ...existingData.positions],
          },
        })
      }
    },
    onCompleted: () => {
      toast.success(t('positionCreatedSuccess'))
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const [updatePosition, { loading: updating }] = useMutation<
    PositionData,
    UpdatePositionVariables
  >(UPDATE_POSITION_MUTATION, {
    onCompleted: () => {
      toast.success(t('positionUpdatedSuccess'))
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid = formData.name.trim() !== '' && formData.name.trim() !== ''

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof CreatePositionModalFormState] !==
        initialData[key as keyof CreatePositionModalFormState],
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

    if (positionId) {
      updatePosition({
        variables: {
          position: {
            positionId: positionId,
            name: formData.name,
          },
        },
      })
    } else {
      createPosition({
        variables: {
          position: {
            name: formData.name,
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

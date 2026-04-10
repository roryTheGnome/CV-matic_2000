import {
  CREATE_LANGUAGE_MUTATION,
  UPDATE_LANGUAGE_MUTATION,
} from '@/api/graphql/mutations/languages'
import { GET_LANGUAGES } from '@/api/graphql/queries/languages'
import { useModalStore } from '@/store/modalStore'
import {
  CreateLanguageData,
  CreateLanguageVariables,
  GetLanguagesData,
  LanguageModalFormState,
  UpdateLanguageData,
  UpdateLanguageVariables,
} from '@/types/languages'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, SubmitEvent, useId, useState } from 'react'
import toast from 'react-hot-toast'

export function useLanguageActions(
  initialData?: LanguageModalFormState,
  languageId?: string,
) {
  const formId = useId()
  const { type, data: modalData, closeModal } = useModalStore()
  const t = useTranslations('LanguageToast')
  const [formData, setFormData] = useState<LanguageModalFormState>(
    initialData || {
      name: '',
      native_name: '',
      iso2: '',
    },
  )

  const [createLanguage, { loading: creating }] = useMutation<
    CreateLanguageData,
    CreateLanguageVariables
  >(CREATE_LANGUAGE_MUTATION, {
    update(cache, { data }) {
      if (!data?.createLanguage) return

      const existingData = cache.readQuery<GetLanguagesData>({
        query: GET_LANGUAGES,
      })

      if (existingData) {
        cache.writeQuery({
          query: GET_LANGUAGES,
          data: {
            languages: [data.createLanguage, ...existingData.languages],
          },
        })
      }
    },
    onCompleted: () => {
      toast.success(t('languageCreatedSuccess'))
      closeModal()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const [updateLanguage, { loading: updating }] = useMutation<
    UpdateLanguageData,
    UpdateLanguageVariables
  >(UPDATE_LANGUAGE_MUTATION, {
    onCompleted: () => {
      toast.success(t('languageUpdatedSuccess'))
      closeModal()
    },
    onError: (err) => toast.error(err.message),
  })

  const loading = creating || updating

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.iso2.trim() !== '' &&
    formData.native_name.trim() !== ''

  const isDirty =
    !initialData ||
    Object.keys(formData).some(
      (key) =>
        formData[key as keyof LanguageModalFormState] !==
        initialData[key as keyof LanguageModalFormState],
    )

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement, Element>,
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

    if (languageId) {
      updateLanguage({
        variables: {
          language: {
            languageId: modalData?.id ? modalData.id : '',
            name: formData.name,
            iso2: formData.iso2,
            native_name: formData.native_name,
          },
        },
      })
    } else {
      createLanguage({
        variables: {
          language: {
            name: formData.name,
            iso2: formData.iso2,
            native_name: formData.native_name,
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

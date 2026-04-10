import { DELETE_LANGUAGE_MUTATION } from '@/api/graphql/mutations/languages'
import { useModalStore } from '@/store/modalStore'
import {
  DeleteLanguageResponse,
  DeleteLanguageVariables,
} from '@/types/languages'

import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

export function useDeleteLanguage() {
  const { data: modalData, closeModal } = useModalStore()
  const t = useTranslations('LanguageToast')
  const [deleteLanguage, { loading }] = useMutation<
    DeleteLanguageResponse,
    DeleteLanguageVariables
  >(DELETE_LANGUAGE_MUTATION, {
    update(cache) {
      cache.evict({
        id: cache.identify({ __typename: 'Language', id: modalData?.id }),
      })
      cache.gc()
    },
    onCompleted: (data) => {
      if (data.deleteLanguage.affected > 0) {
        toast.success(t('languageDeleteSuccess'))
        closeModal()
      }
    },
    onError: (err) => {
      toast.error(err.message || t('languageDeleteError'))
    },
  })

  const handleDelete = () => {
    if (!modalData?.id) {
      toast.error(t('languageIdMissing'))
      return
    }

    deleteLanguage({
      variables: { language: { languageId: modalData?.id } },
    })
  }

  return { modalData, loading, closeModal, handleDelete }
}

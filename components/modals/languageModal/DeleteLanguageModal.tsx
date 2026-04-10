import { useDeleteLanguage } from '@/lib/hooks/languageHooks/useDeleteLanguage'
import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeleteLanguageModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteLanguage()

  const t = useTranslations('LanguageModal')

  return (
    <DeleteModal
      deleteText={`${t('language')} ${data?.name}`}
      headingText={t('language')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

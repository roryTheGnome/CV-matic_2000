import { useDeleteSkill } from '@/lib/hooks/skillHooks/useDeleteSkill'
import { useTranslations } from 'next-intl'
import { DeleteModal } from '../DeleteModal'

export function DeleteSkillModal() {
  const {
    modalData: data,
    loading,
    closeModal,
    handleDelete,
  } = useDeleteSkill()

  const t = useTranslations('SkillModal')

  return (
    <DeleteModal
      deleteText={`${t('skill')} ${data?.name}`}
      headingText={t('skill')}
      data={data}
      loading={loading}
      closeModal={closeModal}
      handleDelete={handleDelete}
    />
  )
}

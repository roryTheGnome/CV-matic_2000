import { ModalData } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/Button'
import { CancelButton } from '../ui/CancelButton'
import { ModalLayout } from './ModalLayout'

interface Props {
  data: ModalData | undefined
  loading: boolean
  deleteText: string
  headingText: string
  closeModal: () => void
  handleDelete: () => void
}

export function DeleteModal({
  data,
  loading,
  deleteText,
  headingText,
  closeModal,
  handleDelete,
}: Props) {
  const t = useTranslations('DeleteModal')

  return (
    <ModalLayout title={`Delete ${headingText}`} maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        <p className="text-lg text-gray-300">
          {t('aYouSure')} {deleteText}?
        </p>

        <div className="flex flex-col justify-end gap-4 sm:flex-row">
          <CancelButton closeModal={closeModal} />

          <Button onClick={handleDelete} disabled={loading || !data?.id}>
            {loading ? t('deleting') : t('confirm')}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

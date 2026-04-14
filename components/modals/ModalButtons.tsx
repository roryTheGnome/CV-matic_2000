import { useModalStore } from '@/store/modalStore'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/Button'
import { CancelButton } from '../ui/CancelButton'

interface Props {
  saving: boolean
  isFormValid?: boolean
  isDirty?: boolean
  isModal?: boolean
}

export function ModalButtons({
  saving,
  isFormValid = true,
  isDirty,
  isModal = true,
}: Props) {
  const { closeModal, type } = useModalStore()
  const t = useTranslations('Forms')

  return (
    <div className="mt-10 flex justify-end gap-4">
      {isModal && <CancelButton closeModal={closeModal} />}
      <Button type="submit" disabled={!isFormValid || saving || !isDirty}>
        {saving
          ? type?.endsWith('_CREATE')
            ? t('btnCreating')
            : t('btnSaving')
          : type?.endsWith('_CREATE')
            ? t('btnCreate')
            : t('btnSave')}
      </Button>
    </div>
  )
}

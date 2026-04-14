import { useTranslations } from 'next-intl'

interface Props {
  closeModal: () => void
}

export function CancelButton({ closeModal }: Props) {
  const t = useTranslations('CancelBtn')

  return (
    <button
      type="button"
      onClick={() => closeModal()}
      className="disabled:bg-surface-disabled disabled:text-text-primary/40 border-input-border text-text-secondary hover:text-text-primary hover:border-text-primary flex w-full max-w-57 cursor-pointer items-center justify-center rounded-full border bg-transparent p-3 uppercase duration-300 hover:brightness-110"
    >
      {t('cancel')}
    </button>
  )
}

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ActionEditButton({ handleEdit }: { handleEdit: () => void }) {
  const t = useTranslations('ActionMenu')
  return (
    <button
      onClick={handleEdit}
      className="text-text-secondary hover:bg-surface-active hover:text-text-primary flex w-full items-center px-4 py-2.5 text-sm transition-colors"
    >
      <Pencil size={16} className="text-text-secondary mr-3" />
      {t('edit')}
    </button>
  )
}

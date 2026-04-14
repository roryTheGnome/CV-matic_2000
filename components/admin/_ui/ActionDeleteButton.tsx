import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ActionDeleteButton({
  handleDelete,
}: {
  handleDelete: () => void
}) {
  const t = useTranslations('ActionMenu')

  return (
    <button
      onClick={handleDelete}
      className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
    >
      <Trash2 size={16} className="mr-3" />
      {t('delete')}
    </button>
  )
}

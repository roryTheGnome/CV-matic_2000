import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ActionEditButton({ handleEdit }: { handleEdit: () => void }) {
  const t = useTranslations('ActionMenu')
  return (
    <button
      onClick={handleEdit}
      className="flex w-full items-center px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-black/10 hover:text-white"
    >
      <Pencil size={16} className="mr-3 text-gray-400" />
      {t('edit')}
    </button>
  )
}

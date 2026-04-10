import { MoreVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { RefObject } from 'react'

interface Props {
  children: React.ReactNode
  menuRef: RefObject<HTMLDivElement | null>
  setIsOpen: () => void
}

export function ActionMenuLayout({ children, menuRef, setIsOpen }: Props) {
  const t = useTranslations('ActionMenu')
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={setIsOpen}
        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white"
        aria-label={t('openActionsAria')}
      >
        <MoreVertical size={20} />
      </button>
      {children}
    </div>
  )
}

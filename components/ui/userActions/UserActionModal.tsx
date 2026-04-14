import { PRIVATE_ROUTES } from '@/config/routes'
import { CircleUserRound, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { LogoutButton } from '../LogoutButton'

type Props = {
  userId: string | undefined
  onClose: () => void
}

export function UserActionModal({ userId, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const t = useTranslations('UserActionModal')

  return (
    <div
      ref={modalRef}
      className="bg-surface border-input-border absolute bottom-full left-2 z-100 mb-2 w-full max-w-56 rounded border shadow-lg"
    >
      <div className="flex flex-col">
        <Link
          href={`${PRIVATE_ROUTES.USERS}/${userId}`}
          className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
          onClick={onClose}
        >
          <CircleUserRound size={20} className="text-text-primary h-5 w-5" />
          <span>{t('profile')}</span>
        </Link>
        <Link
          href={PRIVATE_ROUTES.SETTINGS}
          className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
          onClick={onClose}
        >
          <Settings size={20} className="text-text-primary h-5 w-5" />
          <span>{t('settings')}</span>
        </Link>
        <div className="border-input-border border-t" />
        <LogoutButton />
      </div>
    </div>
  )
}

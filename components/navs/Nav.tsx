'use client'

import { adminNavItems, navItems } from '@/constants/navLinks'
import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useAuthStore } from '@/store/authStore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserActionModal } from '../ui/userActions/UserActionModal'

export default function Nav() {
  const pathname = usePathname()
  const { isAdmin } = useAuthStore()
  const t = useTranslations('Navigation')
  const { currentUserId } = useCurrentUser()

  const [open, setOpen] = useState(false)

  const { user } = useUser(currentUserId ? String(currentUserId) : undefined)

  const checkOnAdmin = () => {
    if (isAdmin) {
      return adminNavItems
    }
    return navItems
  }

  return (
    <>
      <nav className="bg-background hidden h-full flex-col justify-between p-4 pl-0 md:flex">
        <div className="flex flex-col gap-2">
          {checkOnAdmin().map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-r-full px-5 py-4 transition ${isActive ? `bg-surface-active` : `hover:bg-surface-active`}`}
              >
                <Icon
                  size={20}
                  className="text-text-secondary hidden h-5 w-5 lg:inline"
                />
                <span>{t(item.name)}</span>
              </Link>
            )
          })}
        </div>

        <div className="relative flex items-center gap-3 px-2">
          <button
            onClick={() => setOpen((isopen) => !isopen)}
            className="hover:bg-surface-active flex w-full items-center gap-3 rounded p-2 transition"
          >
            {user?.profile?.avatar ? (
              <Image
                src={user.profile.avatar}
                className="bg-primary flex h-10 w-10 items-center justify-center rounded-full"
                alt="User avatar"
                width={40}
                height={40}
              />
            ) : (
              <div className="bg-primary text-text-primary flex h-10 w-10 items-center justify-center rounded-full">
                {user?.profile?.first_name?.at(0) ?? 'U'}
              </div>
            )}

            <span className="truncate">
              {user?.profile.first_name} {user?.profile.last_name}
            </span>
          </button>
          {open && (
            <UserActionModal userId={user?.id} onClose={() => setOpen(false)} />
          )}
        </div>
      </nav>
    </>
  )
}

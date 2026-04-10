import { LogoutButton } from '@/components/ui/LogoutButton'
import { PRIVATE_ROUTES } from '@/config/routes'
import { adminNavItems, navItems } from '@/constants/navLinks'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useAuthStore } from '@/store/authStore'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  CircleUserRound,
  Settings,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Nav({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
}) {
  const pathname = usePathname()
  const { currentUserId, isAdmin } = useAuthStore()

  const [open, setOpen] = useState(false)

  const { user } = useUser(currentUserId ? currentUserId : undefined)

  const checkOnAdmin = isAdmin ? adminNavItems : navItems

  return (
    <>
      <nav className="bg-background hidden h-full flex-col justify-between p-4 pl-0 lg:flex">
        <div className="flex flex-col gap-2">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="flex w-full justify-end gap-3 rounded p-2 transition"
            >
              <ArrowRightToLine
                size={20}
                className="text-text-secondary hidden h-5 w-5 lg:inline"
              />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="flex w-full justify-end gap-3 rounded p-2 transition"
            >
              <ArrowLeftToLine
                size={20}
                className="text-text-secondary hidden h-5 w-5 lg:inline"
              />
            </button>
          )}
          {checkOnAdmin.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-r-full px-5 py-4 transition ${isActive ? `bg-surface-active` : `hover:bg-surface-active`}`}
              >
                {collapsed ? (
                  <Icon size={20} className="text-text-secondary h-5 w-5" />
                ) : (
                  <>
                    <Icon
                      size={20}
                      className="text-text-secondary hidden h-5 w-5 lg:inline"
                    />
                    <span className="text-text-secondary">{item.name}</span>
                  </>
                )}
              </Link>
            )
          })}
        </div>

        <div className="relative flex items-center gap-3 px-2">
          <button
            onClick={() => setOpen((isopen) => !isopen)}
            className="hover:bg-surface-active flex w-full items-center gap-3 rounded p-2 transition"
          >
            {collapsed ? (
              <>
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
              </>
            ) : (
              <>
                {user?.profile?.avatar ? (
                  <Image
                    src={user.profile.avatar}
                    className="bg-primary hidden h-10 w-10 items-center justify-center rounded-full lg:flex"
                    alt="User avatar"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="bg-primary text-text-primary hidden h-10 w-10 items-center justify-center rounded-full lg:flex">
                    {user?.profile?.first_name?.at(0) ?? 'U'}
                  </div>
                )}

                <span className="truncate">
                  {user?.profile.first_name} {user?.profile.last_name}
                </span>
              </>
            )}
          </button>
          {open && (
            <div className="bg-surface border-input-border absolute bottom-full left-2 z-50 mb-2 w-56 rounded border shadow-lg">
              <div className="flex flex-col">
                <Link
                  href={`${PRIVATE_ROUTES.USERS}/${currentUserId}`}
                  className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
                >
                  <CircleUserRound
                    size={20}
                    className="text-text-primary h-5 w-5"
                  />
                  <span>Profile</span>
                </Link>
                <Link
                  href={PRIVATE_ROUTES.SETTINGS}
                  className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
                >
                  <Settings size={20} className="text-text-primary h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <div className="border-input-border border-t" />
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </nav>

      <nav className="bg-background fixed bottom-2 left-1/2 z-999 flex w-[95%] -translate-x-1/2 items-center justify-around rounded-xl lg:hidden">
        {checkOnAdmin.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 text-xs ${isActive ? 'text-primary' : 'text-text-secondary'}`}
            >
              <Icon size={22} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          )
        })}

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col items-center justify-center p-2 text-xs"
        >
          {user?.profile?.avatar ? (
            <Image
              src={user.profile.avatar}
              alt="avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs text-white">
              {user?.profile?.first_name?.at(0) ?? 'U'}
            </div>
          )}
          <span className="text-[10px]">
            {user?.profile.first_name} {user?.profile.last_name}
          </span>
        </button>
        {open && (
          <div className="bg-surface border-input-border absolute right-1 bottom-full z-50 mb-2 w-56 rounded border shadow-lg">
            <div className="flex flex-col">
              <Link
                href={`${PRIVATE_ROUTES.USERS}/${currentUserId}`}
                className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
              >
                <CircleUserRound
                  size={20}
                  className="text-text-primary h-5 w-5"
                />
                <span>Profile</span>
              </Link>
              <Link
                href={PRIVATE_ROUTES.SETTINGS}
                className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
              >
                <Settings size={20} className="text-text-primary h-5 w-5" />
                <span>Settings</span>
              </Link>
              <div className="border-input-border border-t" />
              <LogoutButton />
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

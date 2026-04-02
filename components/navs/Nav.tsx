"use client"

import { adminNavItems, navItems } from "@/constants/navLinks"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Nav() {
  const pathname = usePathname()
  const { isAdmin } = useAuthStore()

  const { currentUserId } = useCurrentUser()

  const { user } = useUser(currentUserId ? String(currentUserId) : undefined)

  const checkOnAdmin = () => {
    if (isAdmin) {
      return adminNavItems
    }
    return navItems
  }

  return (
    <>
      <nav className="hidden md:flex h-full flex-col justify-between p-4 pl-0 bg-background">
        <div className="flex flex-col gap-2">
          {checkOnAdmin().map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-4 rounded-r-full transition
                ${isActive ? `bg-surface-active` : `hover:bg-surface-active`}`}
              >
                <Icon size={20} className="w-5 h-5 text-text-secondary" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.profile?.first_name?.at(0) ?? "U"}
          </div>
          <span>
            {user?.profile.first_name} {user?.profile.last_name}
          </span>
        </div>
      </nav>
    </>
  )
}

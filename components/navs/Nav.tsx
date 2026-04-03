"use client"

import { adminNavItems, navItems } from "@/constants/navLinks"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import { useAuthStore } from "@/store/authStore"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {useState} from "react";
import {LogoutButton} from "@/components/ui/LogoutButton";
import {CircleUserRound, Settings} from "lucide-react";

export default function Nav() {
  const pathname = usePathname()
  const { isAdmin } = useAuthStore()

  const { currentUserId } = useCurrentUser()

  const[open,setOpen]= useState(false);

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

        <div className="flex items-center gap-3 px-2 relative" >
          <button
              onClick={() => setOpen((isopen) => !isopen)}
              className="flex items-center gap-3 px-2 hover:bg-surface-active rounded transition"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-text-primary">
              {user?.profile?.first_name?.at(0) ?? "U"}
            </div>
            <span>
              {user?.profile.first_name} {user?.profile.last_name}
            </span>
          </button>
          {open && (
              <div className="absolute bottom-full left-0 mb-2 w-56
                  bg-surface border border-input-border
                  rounded shadow-lg z-50 ">

                <div className="flex flex-col py-2">

                  <Link href={`/users/${user?.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-surface-active transition">
                    <CircleUserRound size={20} className="w-5 h-5 text-text-primary " /><span>Profile</span>
                  </Link>
                  <Link href={'/'} className="flex items-center gap-3 px-5 py-4 hover:bg-surface-active transition">
                    <Settings size={20} className="w-5 h-5 text-text-primary" /><span>Settings</span>
                  </Link>
                  <div className="border-t border-input-border my-2" />
                  <LogoutButton />

                </div>
              </div>
          )}
        </div>
      </nav>
    </>
  )
}

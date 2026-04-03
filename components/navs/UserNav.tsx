"use client"

import { useUserNav } from "@/lib/hooks/userHooks/useUserNav"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function UserNav() {
  const { user, error, displayName, currentPiece, formatLabel } = useUserNav()

  if (error) return <div></div>

  return (
    <nav className="mb-4 text-sm text-text-secondary flex items-center gap-2">
      <Link href="/users" className="text-xl hover:text-text-primary">
        Employees
      </Link>
      {user && (
        <>
          <ChevronRight size={20} />
          <Link href={`/users/${user.id}`} className="text-xl text-primary">
            {displayName}
          </Link>

          {currentPiece && (
            <>
              <ChevronRight size={16} />
              <Link
                href={`/users/${user.id}/${formatLabel(currentPiece).toLowerCase()}`}
                className="text-xl hover:text-text-primary"
              >
                {formatLabel(currentPiece)}
              </Link>
            </>
          )}
        </>
      )}
    </nav>
  )
}

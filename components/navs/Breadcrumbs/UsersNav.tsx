import { useUserNav } from '@/lib/hooks/nav/useUserNav'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function UsersNav(){
  const { user, displayName, currentPiece, formatLabel } = useUserNav()

  return (
    <>
      {user && (
        <>
          <ChevronRight size={20} />
          <Link href={`/users/${user.id}`} className="text-primary sm:text-xl">
            {displayName}
          </Link>
          {currentPiece && (
            <>
              <ChevronRight size={16} />
              <Link
                href={`/users/${user.id}/${formatLabel(currentPiece).toLowerCase()}`}
                className="hover:text-text-primary sm:text-xl"
              >
                {formatLabel(currentPiece)}
              </Link>
            </>
          )}
        </>
      )}
    </>
  )
}
'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useUserNav } from '@/lib/hooks/nav/useUserNav'
import { useProjectNav } from '@/lib/hooks/nav/useProjectNav'
import { useCVsNav } from '@/lib/hooks/nav/useCVsNav'

const ROUTE_LABELS: Record<string, string> = {
  users: 'Employees',
  languages: 'Languages',
  skills: 'Skills',
  cvs: 'CVs',
  departments: 'Departments',
  projects: 'Projects',
  positions: 'Positions',
}

export default function GlobalNav() {
  const pathname = usePathname()

  const { user, error, displayName, currentPiece, formatLabel } = useUserNav()
  const { cv, cvError, cvName, currentCvPiece, formatCvLabel } = useCVsNav()
  const { project, projectError, projectDisplayName } = useProjectNav()

  if (cvError) console.log(cvError)
  const segments = pathname.split('/').filter(Boolean)

  const root = segments[0]
  const rootLabel = ROUTE_LABELS[root] || root

  if (
    (root === 'users' && error) ||
    (root === 'projects' && projectError) ||
    (root === 'cvs' && cvError)
  ) {
    return null
  }

  return (
    <nav className="text-text-secondary mb-4 flex items-center text-sm">
      <Link href={`/${root}`} className="hover:text-text-primary sm:text-xl">
        {rootLabel}
      </Link>

      {root === 'users' && user && (
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
      {root === 'projects' && project && (
        <>
          <ChevronRight size={20} />
          <Link
            href={`/projects/${project.id}`}
            className="text-primary sm:text-xl"
          >
            {projectDisplayName}
          </Link>
        </>
      )}
      {root === 'cvs' && cv && (
        <>
          <ChevronRight size={20} />
          <Link href={`/cvs/${cv.id}`} className="text-primary sm:text-xl">
            {cvName}
          </Link>
          {currentCvPiece && (
            <>
              <ChevronRight size={16} />
              <Link
                href={`/cvs/${cv.id}/${formatCvLabel(currentCvPiece).toLowerCase()}`}
                className="hover:text-text-primary sm:text-xl"
              >
                {formatCvLabel(currentCvPiece)}
              </Link>
            </>
          )}
        </>
      )}
    </nav>
  )
}

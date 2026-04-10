'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import UsersNav from '@/components/navs/Breadcrumbs/UsersNav'
import ProjectsNav from '@/components/navs/Breadcrumbs/ProjectsNav'
import CvNav from '@/components/navs/Breadcrumbs/CvNav'

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


  const segments = pathname.split('/').filter(Boolean)

  const root = segments[0]
  const rootLabel = ROUTE_LABELS[root] || root



  return (
    <nav className="text-text-secondary mb-4 flex items-center text-sm">
      <Link href={`/${root}`} className="hover:text-text-primary sm:text-xl">
        {rootLabel}
      </Link>

      {root === 'users' &&  (
        <UsersNav />
      )}
      {root === 'projects' && (
        <ProjectsNav/>
      )}
      {root === 'cvs' && (
        <CvNav />
      )}
    </nav>
  )
}

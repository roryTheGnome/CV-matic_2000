import { PRIVATE_ROUTES } from '@/config/routes'
import { usePathname } from 'next/navigation'
import { useCv } from '@/lib/hooks/cvHooks/useCv'

export function useCvNav(id?: string) {
  const pathname = usePathname()
  const { cv, isLoading, error } = useCv()
  if (!cv) {
    return { error }
  }

  const tabs = [
    { label: 'Details', path: `${PRIVATE_ROUTES.CVS}/${cv.id}` },
    { label: 'Skills', path: `${PRIVATE_ROUTES.CVS}/${cv.id}/skills` },
    { label: 'Projects', path: `${PRIVATE_ROUTES.CVS}/${cv.id}/projects` },
    { label: 'Preview', path: `${PRIVATE_ROUTES.CVS}/${cv.id}/preview` },
  ]

  const isActive = (tabPath: string) => {
    if (pathname === tabPath) return true
    if (
      tabPath !== `${PRIVATE_ROUTES.CVS}/${cv.id}` &&
      pathname.startsWith(tabPath + '/')
    )
      return true
    return false
  }

  return { cv, isLoading, error, tabs, isActive }
}

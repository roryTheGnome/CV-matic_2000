import { PRIVATE_ROUTES } from '@/config/routes'
import { usePathname } from 'next/navigation'
import { useCv } from '@/lib/hooks/cvHooks/useCv'
import { useTranslations } from 'next-intl'

export function useCvNav(id?: string) {
  const pathname = usePathname()
  const { cv, isLoading, error } = useCv()
  const t = useTranslations('CvNavItems')
  if (!cv) {
    return { error }
  }

  const tabs = [
    { label: t('details'), path: `${PRIVATE_ROUTES.CVS}/${cv.id}` },
    { label: t('skills'), path: `${PRIVATE_ROUTES.CVS}/${cv.id}/skills` },
    { label: t('projects'), path: `${PRIVATE_ROUTES.CVS}/${cv.id}/projects` },
    { label: t('preview'), path: `${PRIVATE_ROUTES.CVS}/${cv.id}/preview` },
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

import { PRIVATE_ROUTES } from '@/config/routes'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export function useProfileNav() {
  const pathname = usePathname()
  const { user, isLoading, error } = useUser()
  const t = useTranslations('ProfileNavItems')
  if (!user) {
    return { error }
  }
  const tabs = [
    { label: t('profile'), path: `${PRIVATE_ROUTES.USERS}/${user.id}` },
    { label: t('skills'), path: `${PRIVATE_ROUTES.USERS}/${user.id}/skills` },
    {
      label: t('languages'),
      path: `${PRIVATE_ROUTES.USERS}/${user.id}/languages`,
    },
  ]
  const isActive = (tabPath: string) => {
    if (pathname === tabPath) return true
    if (
      tabPath !== `${PRIVATE_ROUTES.USERS}/${user.id}` &&
      pathname.startsWith(tabPath + '/')
    )
      return true
    return false
  }

  return { user, isLoading, error, tabs, isActive }
}

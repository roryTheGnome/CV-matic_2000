import { useUser } from '@/lib/hooks/userHooks/useUser'
import { usePathname } from 'next/navigation'

export function useProfileNav() {
  const pathname = usePathname()
  const { user, isLoading, error } = useUser()
  if (!user) {
    return { error }
  }
  const tabs = [
    { label: 'Profile', path: `/users/${user.id}` },
    { label: 'Skills', path: `/users/${user.id}/skills` },
    { label: 'Languages', path: `/users/${user.id}/languages` },
  ]
  const isActive = (tabPath: string) => {
    if (pathname === tabPath) return true
    if (tabPath !== `/users/${user.id}` && pathname.startsWith(tabPath + '/'))
      return true
    return false
  }

  return { user, isLoading, error, tabs, isActive }
}

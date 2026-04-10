'use client'

import { removeAuthTokens } from '@/actions/auth'
import { PUBLIC_ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/authStore'
import { useApolloClient } from '@apollo/client/react'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function LogoutButton() {
  const router = useRouter()
  const client = useApolloClient()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await removeAuthTokens()

      await client.clearStore()
      logout()

      toast.success('Successfully logged out.', { duration: 2000 })

      router.push(PUBLIC_ROUTES.LOGIN)
    } catch (error) {
      console.error('Error while logout:', error)
    }
  }

  const t = useTranslations('LogoutBtn')

  return (
    <button
      onClick={handleLogout}
      className="hover:bg-surface-active flex items-center gap-3 px-5 py-4 transition"
    >
      <LogOut size={20} className="text-text-primary h-5 w-5" />
      <span>{t('logout')}</span>
    </button>
  )
}

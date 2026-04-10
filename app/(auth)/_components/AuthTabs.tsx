import { PUBLIC_ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { AuthTab } from './AuthTab'

export function AuthTabs() {
  const t = useTranslations('Auth')

  return (
    <div className="absolute top-0 left-0 flex w-full justify-center text-sm font-semibold tracking-wider">
      <AuthTab href={PUBLIC_ROUTES.LOGIN} name={t('loginTab')} />
      <AuthTab href={PUBLIC_ROUTES.REGISTER} name={t('signupTab')} />
    </div>
  )
}

import { PUBLIC_ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { AuthForm } from '../../_components/AuthForm'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'

export default function Login() {
  const t = useTranslations('Auth')
  return (
    <>
      <AuthHeading title={t('loginTitle')} subtitle={t('loginSubtitle')} />

      <AuthForm />
      <AuthLink
        text={t('forgotPasswordTitle')}
        href={PUBLIC_ROUTES.FORGOT_PASSWORD}
      />
    </>
  )
}

import { PUBLIC_ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { AuthForm } from '../../_components/AuthForm'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'

export default function Register() {
  const t = useTranslations('Auth')
  return (
    <>
      <AuthHeading
        title={t('registerTitle')}
        subtitle={t('registerSubtitle')}
      />
      <AuthForm />

      <AuthLink text={t('haveAnAccount')} href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}

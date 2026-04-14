'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/inputField/InputField'
import { PUBLIC_ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'
import { useForgotPasswordForm } from './_hooks/useForgotPasswordForm'

export default function ForgotPassword() {
  const { error, loading, handleSubmit } = useForgotPasswordForm()
  const t = useTranslations('Auth')

  return (
    <>
      <AuthHeading
        title={t('forgotPasswordTitle')}
        subtitle={t('forgotPasswordSubtitle')}
      />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mb-4 flex flex-col items-center gap-4"
      >
        <InputField
          required
          inputId="email"
          label={t('emailLabel')}
          type="email"
          name="email"
          autoComplete="email"
          maxLength={100}
        />
        <span className="text-primary h-6">{error?.message}</span>
        <Button disabled={loading} className="mt-2">
          {t('resetPasswordButton')}
        </Button>
      </form>

      <AuthLink text="Cancel" href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}

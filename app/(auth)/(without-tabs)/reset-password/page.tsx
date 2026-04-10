'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/inputField/InputField'
import { PUBLIC_ROUTES } from '@/config/routes'
import { useTranslations } from 'next-intl'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'
import { useResetPasswordForm } from './_hooks/useResetPasswordForm'

export default function ResetPassword() {
  const { loading, error, handleSubmit } = useResetPasswordForm()
  const t = useTranslations('Auth')
  return (
    <>
      <AuthHeading
        title={t('setNewPasswordTitle')}
        subtitle={t('setNewPasswordSubtitle')}
      />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mb-4 flex flex-col items-center gap-4"
      >
        <InputField
          required
          inputId="password"
          label={t('passwordLabel')}
          type="password"
          name="password"
          autoComplete="new-password"
          maxLength={100}
          minLength={5}
        />
        <span className="text-primary h-6">{error?.message}</span>
        <Button disabled={loading} className="mt-2">
          {t('resetPasswordButton')}
        </Button>
      </form>
      <AuthLink text={t('backToLoginLink')} href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}

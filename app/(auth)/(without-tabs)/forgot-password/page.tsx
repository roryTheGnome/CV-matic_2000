'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/inputField/InputField'
import { PUBLIC_ROUTES } from '@/config/routes'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'
import { useForgotPasswordForm } from './_hooks/useForgotPasswordForm'

export default function ForgotPassword() {
  const { error, loading, handleSubmit } = useForgotPasswordForm()

  return (
    <>
      <AuthHeading
        title="Forgot password"
        subtitle="We will sent you an email with further instructions"
      />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mb-4 flex flex-col items-center gap-4"
      >
        <InputField
          required
          inputId="email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          maxLength={100}
        />
        <span className="text-primary h-6">
          {error?.message}
          {loading && 'Loading...'}
        </span>
        <Button disabled={loading} className="mt-2">
          Reset password
        </Button>
      </form>

      <AuthLink text="Cancel" href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}

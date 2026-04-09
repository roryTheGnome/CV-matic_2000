'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/inputField/InputField'
import { PUBLIC_ROUTES } from '@/config/routes'
import { AuthHeading } from '../../_components/AuthHeading'
import { AuthLink } from '../../_components/AuthLink'
import { useResetPasswordForm } from './_hooks/useResetPasswordForm'

export default function ResetPassword() {
  const { loading, error, handleSubmit } = useResetPasswordForm()

  return (
    <>
      <AuthHeading
        title="Set a new password"
        subtitle="Almost done! Now create a new password"
      />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mb-4 flex flex-col items-center gap-4"
      >
        <InputField
          required
          inputId="password"
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          maxLength={100}
          minLength={5}
        />
        <span className="text-primary h-6">
          {error?.message}
          {loading && 'Loading...'}
        </span>
        <Button disabled={loading} className="mt-2">
          Reset password
        </Button>
      </form>
      <AuthLink text="Back to Log in" href={PUBLIC_ROUTES.LOGIN} />
    </>
  )
}

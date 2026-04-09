'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/inputField/InputField'

import { PUBLIC_ROUTES } from '@/config/routes'
import { useAuthForm } from '../(with-tabs)/_hooks/useAuthForm'

export function AuthForm() {
  const { currentError, isLoading, pathname, handleSubmit } = useAuthForm()

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="mb-4 flex flex-col items-center gap-4"
    >
      <InputField
        required
        inputId="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
      />
      <InputField
        required
        inputId="password"
        label="Password"
        name="password"
        type="password"
        autoComplete={
          pathname === PUBLIC_ROUTES.LOGIN ? 'current-password' : 'new-password'
        }
        maxLength={100}
        minLength={5}
      />
      <span className="text-primary h-6">{currentError?.message}</span>
      <Button isLoading={isLoading} className="mt-2">
        {pathname === PUBLIC_ROUTES.LOGIN ? 'Log in' : 'Create Account'}
      </Button>
    </form>
  )
}

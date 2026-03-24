"use client"

import { Button } from "@/components/ui/Button"
import { InputField } from "@/components/ui/inputField/InputField"

import { PUBLIC_ROUTES } from "@/config/routes"
import { useAuthForm } from "../_hooks/useAuthForm"

export function AuthForm() {
  const { currentError, isLoading, pathname, handleSubmit } = useAuthForm()

  return (
    <form
      onSubmit={e => handleSubmit(e)}
      className="flex flex-col gap-4 items-center mb-4"
    >
      <InputField
        required
        inputId="email"
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
      />
      <InputField
        required
        minLength={5}
        inputId="password"
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete={
          pathname === PUBLIC_ROUTES.LOGIN ? "current-password" : "new-password"
        }
      />
      <span className="h-6 text-primary">{currentError?.message}</span>
      <Button isLoading={isLoading} className="mt-2">
        {pathname === PUBLIC_ROUTES.LOGIN ? "Log in" : "Create Account"}
      </Button>
    </form>
  )
}

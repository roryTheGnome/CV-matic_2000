"use client"

import { Button } from "@/components/ui/Button"
import { InputField } from "@/components/ui/inputField/InputField"
import { PUBLIC_ROUTES } from "@/config/routes"
import { AuthLink } from "../(with-tabs)/_components/AuthLink"
import { useForgotPasswordForm } from "./_hooks/useForgotPasswordForm"

export default function ForgotPassword() {
  const { error, loading, handleSubmit } = useForgotPasswordForm()

  return (
    <div className="w-full mt-14 text-center">
      <div className="mb-10">
        <h1 className="font-normal">Forgot password</h1>
        <span>We will sent you an email with further instructions</span>
      </div>
      <form
        onSubmit={e => handleSubmit(e)}
        className="flex flex-col gap-4 items-center mb-4"
      >
        <InputField
          required
          inputId="email"
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
        />
        <span className="h-6 text-primary">
          {error?.message}
          {loading && "Loading..."}
        </span>
        <Button disabled={loading} className="mt-2">
          Reset password
        </Button>
      </form>

      <AuthLink text="Cancel" href={PUBLIC_ROUTES.LOGIN} />
    </div>
  )
}

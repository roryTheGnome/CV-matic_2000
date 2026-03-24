import { FORGOT_PASSWORD_MUTATION } from "@/api/graphql/mutations/auth"
import { useMutation } from "@apollo/client/react"

import { SubmitEvent } from "react"

export const useForgotPasswordForm = () => {
  const [forgotPasswordInput, { loading, error }] = useMutation<void>(
    FORGOT_PASSWORD_MUTATION,
  )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const email = formatData.get("email") as string

    try {
      await forgotPasswordInput({
        variables: {
          auth: {
            email: email,
          },
        },
      })

      // router.push(PUBLIC_ROUTES.LOGIN)
    } catch (error) {
      console.error("Forgot password error:", error)
    }
  }

  return {
    error,
    loading,
    handleSubmit,
  }
}

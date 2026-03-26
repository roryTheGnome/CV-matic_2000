import { FORGOT_PASSWORD_MUTATION } from "@/api/graphql/mutations/auth"
import { ForgotPasswordData, ForgotPasswordVariables } from "@/types/auth"
import { useMutation } from "@apollo/client/react"

import { SubmitEvent } from "react"
import toast from "react-hot-toast"

export const useForgotPasswordForm = () => {
  const [forgotPassword, { loading, error }] = useMutation<
    ForgotPasswordData,
    ForgotPasswordVariables
  >(FORGOT_PASSWORD_MUTATION)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const email = formatData.get("email") as string

    toast.promise(
      forgotPassword({
        variables: {
          auth: {
            email: email,
          },
        },
      }),
      {
        loading: "Sending...",
        success: "Check your inbox.",
        error: error?.message || "Error occured.",
      },
      { id: "forgot-password" },
    )
  }

  return {
    error,
    loading,
    handleSubmit,
  }
}

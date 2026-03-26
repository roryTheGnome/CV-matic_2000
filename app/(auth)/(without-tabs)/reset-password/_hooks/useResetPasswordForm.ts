import { RESET_PASSWORD_MUTATION } from "@/api/graphql/mutations/auth"
import { ResetPasswordData, ResetPasswordVariables } from "@/types/auth"
import { useMutation } from "@apollo/client/react"

import { SubmitEvent } from "react"
import toast from "react-hot-toast"

export const useResetPasswordForm = () => {
  const [resetPassword, { loading, error }] = useMutation<
    ResetPasswordData,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const password = formatData.get("password") as string

    toast.promise(
      resetPassword({
        variables: {
          auth: {
            newPassword: password,
          },
        },
      }),
      {
        loading: "Updating...",
        success: "Password successfully updated.",
        error: error?.message || "Error occured.",
      },
      { id: "reset-password" },
    )
  }

  return {
    error,
    loading,
    handleSubmit,
  }
}

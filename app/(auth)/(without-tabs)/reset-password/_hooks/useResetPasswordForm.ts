import { RESET_PASSWORD_MUTATION } from '@/api/graphql/mutations/auth'
import { ResetPasswordData, ResetPasswordVariables } from '@/types/auth'
import { useMutation } from '@apollo/client/react'

import { SubmitEvent } from 'react'
import toast from 'react-hot-toast'

export const useResetPasswordForm = () => {
  const t = useTranslations('Notifications')
  const [resetPassword, { loading, error }] = useMutation<
    ResetPasswordData,
    ResetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const password = formatData.get('password') as string

    const token =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('token')
        : null

    if (!token) {
      toast.error('Invalid or missing token')
      return
    }

    toast.promise(
      resetPassword({
        variables: {
          auth: {
            newPassword: password,
          },
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }),
      {
        loading: t('updating'),
        success: t('passwordUpdatedSuccess'),
        error: error?.message || t('errorOccurred'),
      },
      { id: 'reset-password' },
    )
  }

  return {
    error,
    loading,
    handleSubmit,
  }
}

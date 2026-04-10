import { FORGOT_PASSWORD_MUTATION } from '@/api/graphql/mutations/auth'
import { ForgotPasswordData, ForgotPasswordVariables } from '@/types/auth'
import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'

import { SubmitEvent } from 'react'
import toast from 'react-hot-toast'

export const useForgotPasswordForm = () => {
  const t = useTranslations('Notifications')
  const [forgotPassword, { loading, error }] = useMutation<
    ForgotPasswordData,
    ForgotPasswordVariables
  >(FORGOT_PASSWORD_MUTATION)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formatData = new FormData(e.currentTarget)
    const email = formatData.get('email') as string

    toast.promise(
      forgotPassword({
        variables: {
          auth: {
            email: email,
          },
        },
      }),
      {
        loading: t('sending'),
        success: t('checkInbox'),
        error: error?.message || t('errorOccurred'),
      },
      { id: 'forgot-password' },
    )
  }

  return {
    error,
    loading,
    handleSubmit,
  }
}

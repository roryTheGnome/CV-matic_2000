'use client'

import { DELETE_PROFILE_LANGUAGE } from '@/api/graphql/mutations/profile'
import { GET_USER } from '@/api/graphql/queries/user'
import LoadingPage from '@/app/(platform)/users/[id]/loading'
import { LanguageList } from '@/components/LanguageList'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useMutation } from '@apollo/client/react'
import NotFoundPage from '@/app/(platform)/not-found'
import { useAuthStore } from '@/store/authStore'

export default function EmployeeLanguage() {
  const { user, error } = useUser()

  const { currentUserId, isAdmin } = useAuthStore()
  const [deleteLanguages] = useMutation(DELETE_PROFILE_LANGUAGE, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: user?.id },
      },
    ],
  })

  if (error) return <NotFoundPage />
  if (!user) return <LoadingPage />

  const handleDelete = async (names: string[]) => {
    await deleteLanguages({
      variables: {
        language: {
          userId: user.id,
          name: names,
        },
      },
    })
  }

  return (
    <>
      <LanguageList
        languages={user.profile.languages}
        onDelete={handleDelete}
        owner={currentUserId === user.id || isAdmin}
        userId={user.id}
      />
    </>
  )
}

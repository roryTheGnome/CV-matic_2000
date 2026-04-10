'use client'

import { DELETE_PROFILE_LANGUAGE } from '@/api/graphql/mutations/profile'
import { GET_USER } from '@/api/graphql/queries/user'
import NotFoundPage from '@/app/(platform)/not-found'
import { LanguageList } from '@/components/LanguageList'
import { Loader } from '@/components/ui/Loader'
import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { useMutation } from '@apollo/client/react'

export default function EmployeeLanguage() {
  const { user, error } = useUser()

  const { currentUserId, currentUserRole } = useCurrentUser()

  const [deleteLanguages] = useMutation(DELETE_PROFILE_LANGUAGE, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: user?.id },
      },
    ],
  })

  if (error) return <NotFoundPage />
  if (!user) return <Loader />

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
        owner={currentUserId === Number(user.id) || currentUserRole === 'Admin'}
        userId={user.id}
      />
    </>
  )
}

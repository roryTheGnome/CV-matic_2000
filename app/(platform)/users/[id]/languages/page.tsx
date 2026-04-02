"use client"

import { DELETE_PROFILE_LANGUAGE } from "@/api/graphql/mutations/profile"
import { GET_USER } from "@/api/graphql/queries/user"
import LoadingPage from "@/app/(platform)/users/[id]/loading"
import NotFoundPage from "@/app/(platform)/users/not-found"
import { LanguageList } from "@/components/LanguageList"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import { useMutation } from "@apollo/client/react"

export default function EmployeeLanguage() {
  const { user, error } = useUser()

  const { currentUserId } = useCurrentUser()

  const [deleteLanguages] = useMutation(DELETE_PROFILE_LANGUAGE, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: currentUserId },
      },
    ],
  })

  if (error) return <NotFoundPage />
  if (!user) return <LoadingPage />

  const handleDelete = async (names: string[]) => {
    await deleteLanguages({
      variables: {
        language: {
          userId: currentUserId,
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
        owner={currentUserId === Number(user.id)}
      />
    </>
  )
}

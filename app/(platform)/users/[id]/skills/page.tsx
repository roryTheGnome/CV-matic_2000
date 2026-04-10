'use client'

import { DELETE_PROFILE_SKILL } from '@/api/graphql/mutations/profile'
import { GET_SKILLS } from '@/api/graphql/queries/skills'
import { GET_USER } from '@/api/graphql/queries/user'
import NotFoundPage from '@/app/(platform)/not-found'
import { Skills } from '@/components/skills/Skills'
import { Loader } from '@/components/ui/Loader'
import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser'
import { useUser } from '@/lib/hooks/userHooks/useUser'
import { GetSkillsData } from '@/types/skills'
import { useMutation, useQuery } from '@apollo/client/react'

export default function EmployeeSkill() {
  const { user, error } = useUser()
  const { data: skillsData } = useQuery<GetSkillsData>(GET_SKILLS)

  const { currentUserId, currentUserRole } = useCurrentUser()

  const [deleteSkills] = useMutation(DELETE_PROFILE_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: user?.id },
      },
    ],
  })

  const handleDelete = async (names: string[]) => {
    await deleteSkills({
      variables: {
        skill: {
          userId: user?.id,
          name: names,
        },
      },
    })
  }

  if (error) return <NotFoundPage />
  if (!user) return <Loader />
  return (
    <>
      <Skills
        skills={user.profile.skills}
        allSkills={skillsData?.skills || []}
        onDelete={handleDelete}
        owner={currentUserId === Number(user.id) || currentUserRole === 'Admin'}
        userId={user.id}
      />
    </>
  )
}

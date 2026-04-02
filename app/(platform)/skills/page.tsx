"use client"

import { DELETE_PROFILE_SKILL } from "@/api/graphql/mutations/profile"
import { GET_SKILLS } from "@/api/graphql/queries/skills"
import { GET_USER } from "@/api/graphql/queries/user"
import LoadingPage from "@/app/(platform)/users/[id]/loading"
import { Skills } from "@/components/skills/Skills"
import { SkillTableItem } from "@/components/ui/table/SkillTableItem"
import TableBody from "@/components/ui/table/TableBody"
import { TableHeader } from "@/components/ui/table/TableHeader"
import { TableSearch } from "@/components/ui/TableSearch"
import { skillsHeaders } from "@/constants/tableHeaders"
import { usePageWithTable } from "@/lib/hooks/usePageWithTable"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import { useAuthStore } from "@/store/authStore"
import {GetSkillsData, SkillItem} from "@/types/skills"
import { getSortSkillsValue } from "@/utils/getSortSkillValue"
import { useMutation, useQuery } from "@apollo/client/react"
import NotFoundPage from "@/app/(platform)/not-found";

export default function SkillsPage() {
  const { currentUserId } = useCurrentUser()
  const { isAdmin } = useAuthStore()
  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  const { data: skillsData } = useQuery<GetSkillsData>(GET_SKILLS)

  const { user, error } = useUser(
    currentUserId ? String(currentUserId) : undefined,
  )
  const [deleteSkills] = useMutation(DELETE_PROFILE_SKILL, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: currentUserId },
      },
    ],
  })

  const handleDelete = async (names: string[]) => {
    await deleteSkills({
      variables: {
        skill: {
          userId: currentUserId,
          name: names,
        },
      },
    })
  }

  const {
    data,
    loading,
    error: skillError,
  } = useQuery<GetSkillsData>(GET_SKILLS)

  if (error || skillError) return <NotFoundPage />
  if (!user || loading) return <LoadingPage />

  return (
    <div className="p-6">

      {isAdmin ? (
        <>
          <TableSearch
            search={search}
            createButtonText="CREATE SKILL"
            typeOfCreateModal={"SKILL_CREATE"}
            setSearch={setSearch}
          />

          <div className="overflow-x-auto rounded-lg ">
            <table className="min-w-full divide-y divide-gray-500 ">
              <TableHeader
                handleSort={handleSort}
                headers={skillsHeaders}
                sortDir={sortDir}
                sortKey={sortKey}
              />

              <TableBody<SkillItem>
                arrayOfItems={data?.skills ?? []}
                search={search}
                sortKey={sortKey}
                sortDir={sortDir}
                getSearchText={skill => `${skill.name}`}
                getSortValue={skill => getSortSkillsValue(skill, sortKey)}
                renderRow={skill => (
                  <SkillTableItem key={skill.id} item={skill} />
                )}
              />
            </table>
          </div>
        </>
      ) : (
        <Skills
          skills={user.profile.skills}
          allSkills={skillsData?.skills || []}
          onDelete={handleDelete}
          owner={true}
        />
      )}
    </div>
  )
}

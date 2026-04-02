"use client"

import { GET_LANGUAGES } from "@/api/graphql/queries/languages"
import LoadingPage from "@/app/(platform)/users/[id]/loading"
import NotFoundPage from "@/app/(platform)/users/not-found"
import { LanguageList } from "@/components/LanguageList"
import { LanguageTableItem } from "@/components/ui/table/LanguageTableItem"

import TableBody from "@/components/ui/table/TableBody"
import { TableHeader } from "@/components/ui/table/TableHeader"
import { TableSearch } from "@/components/ui/TableSearch"
import { languageHeaders } from "@/constants/tableHeaders"

import { usePageWithTable } from "@/lib/hooks/usePageWithTable"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUser } from "@/lib/hooks/userHooks/useUser"
import { useAuthStore } from "@/store/authStore"
import { GetLanguagesData, LanguageItem } from "@/types/languages"
import { getSortLanguageValue } from "@/utils/getSortLanguageValue"

import { useQuery } from "@apollo/client/react"

export default function Language() {
  const { currentUserId } = useCurrentUser()
  const { isAdmin } = useAuthStore()
  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  const { user, error } = useUser(
    currentUserId ? String(currentUserId) : undefined,
  )

  const {
    data,
    loading,
    error: languageError,
  } = useQuery<GetLanguagesData>(GET_LANGUAGES)

  if (error || languageError) return <NotFoundPage />
  if (!user || loading) return <LoadingPage />

  return (
    <div className="p-6">
      <h1 className="mb-4">Languages Page</h1>
      {isAdmin ? (
        <>
          <TableSearch
            search={search}
            createButtonText="CREATE LANGUAGE"
            typeOfCreateModal={"LANGUAGE_CREATE"}
            setSearch={setSearch}
          />

          <div className="overflow-x-auto rounded-lg ">
            <table className="min-w-full divide-y divide-gray-500 ">
              <TableHeader
                handleSort={handleSort}
                headers={languageHeaders}
                sortDir={sortDir}
                sortKey={sortKey}
              />

              <TableBody<LanguageItem>
                arrayOfItems={data?.languages ?? []}
                search={search}
                sortKey={sortKey}
                sortDir={sortDir}
                getSearchText={language => `${language.name}`}
                getSortValue={language =>
                  getSortLanguageValue(language, sortKey)
                }
                renderRow={language => (
                  <LanguageTableItem key={language.id} item={language} />
                )}
              />
            </table>
          </div>
        </>
      ) : (
        <LanguageList languages={user.profile.languages} />
      )}
    </div>
  )
}

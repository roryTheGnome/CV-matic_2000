"use client"
import NotFoundPage from "@/app/(platform)/users/not-found"
import EmployeesList from "@/components/EmployeesList"
import SortHeader from "@/components/SortHeader"
import { TableSearch } from "@/components/ui/TableSearch"
import { headers } from "@/constants/tableHeaders"
import { useCurrentUser } from "@/lib/hooks/userHooks/useCurrentUser"
import { useUsers } from "@/lib/hooks/userHooks/useUsers"
import LoadingPage from "./loading"

export default function Employees() {
  const {
    users,
    error,
    search,
    sortKey,
    sortDir,
    setSearch,
    handleSort,
    isLoading,
  } = useUsers()

  const { currentUserId } = useCurrentUser()

  if (error) return <NotFoundPage />

  return (
    <div>
      <TableSearch
        search={search}
        createButtonText="CREATE USER"
        typeOfCreateModal={"USER_CREATE"}
        setSearch={setSearch}
      />

      <div className="overflow-x-auto rounded-lg ">
        {isLoading ? (
          <LoadingPage />
        ) : (
          <table className="min-w-full divide-y divide-gray-500 ">
            <thead>
              <tr>
                {headers.map(header => (
                  <SortHeader
                    key={header.key}
                    label={header.label}
                    sortKeyValue={header.key}
                    currentSortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                ))}
              </tr>
            </thead>
            <EmployeesList
              users={users}
              search={search}
              sortKey={sortKey}
              sortDir={sortDir}
              currentUserId={currentUserId}
            />
          </table>
        )}
      </div>
    </div>
  )
}

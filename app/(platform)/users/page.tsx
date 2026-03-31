"use client"
import EmployeesList from "@/components/EmployeesList"
import SortHeader from "@/components/SortHeader"
import { Button } from "@/components/ui/Button"
import { headers } from "@/constants/tableHeaders"
import { useUsers } from "@/lib/hooks/useUsers"
import { useAuthStore } from "@/store/authStore"
import { useModalStore } from "@/store/modalStore"
import { Plus } from "lucide-react"

export default function Employees() {
  const { isAdmin } = useAuthStore()
  const { openModal } = useModalStore()

  const {
    users,
    isLoading,
    error,
    search,
    sortKey,
    sortDir,
    setSearch,
    handleSort,
  } = useUsers()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-500 rounded-4xl w-full max-w-sm"
        />
        {isAdmin && (
          <Button
            Icon={Plus}
            isTextButton
            className="text-red-400"
            onClick={() => openModal("USER_CREATE")}
          >
            CREATE USER
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg ">
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
          />
        </table>
      </div>
    </div>
  )
}

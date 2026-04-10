'use client'

import { TableHeader } from '@/components/ui/table/TableHeader'
import { onlyNameHeaders } from '@/constants/tableHeaders'
import { useQuery } from '@apollo/client/react'

import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { NameTableItem } from '@/components/ui/table/NameTableItem'
import TableBody from '@/components/ui/table/TableBody'
import { TableSearch } from '@/components/ui/TableSearch'
import { usePageWithTable } from '@/lib/hooks/usePageWithTable'
import { Department, GetDepartmentsResponse } from '@/types/department'
import { getSortByName } from '@/utils/getSortByName'
import { useAuthStore } from '@/store/authStore'

export default function Departments() {
  const { data, loading, error } =
    useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS)

  const { isAdmin } = useAuthStore()

  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      <TableSearch
        search={search}
        createButtonText="CREATE DEPARTMENT"
        typeOfCreateModal={'DEPARTMENT_CREATE'}
        setSearch={setSearch}
      />

      <div className="min-h-screen overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-500">
          <TableHeader
            handleSort={handleSort}
            headers={onlyNameHeaders}
            sortDir={sortDir}
            sortKey={sortKey}
          />

          <TableBody<Department>
            arrayOfItems={data?.departments ?? []}
            search={search}
            sortKey={sortKey}
            sortDir={sortDir}
            getSearchText={(department) => `${department.name}`}
            getSortValue={(department) => getSortByName(department, sortKey)}
            renderRow={(department) => (
              <NameTableItem
                key={department.id}
                item={department}
                editType={'DEPARTMENT_EDIT'}
                deleteType={'DEPARTMENT_DELETE'}
                isAdmin={isAdmin}
              />
            )}
          />
        </table>
      </div>
    </div>
  )
}

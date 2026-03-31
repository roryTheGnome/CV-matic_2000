"use client"

import { TableHeader } from "@/components/ui/table/TableHeader"
import { onlyNameHeaders } from "@/constants/tableHeaders"
import { useQuery } from "@apollo/client/react"

import { GET_POSITIONS } from "@/api/graphql/queries/positions"
import { NameTableItem } from "@/components/ui/table/DepartmentTableItem"
import TableBody from "@/components/ui/table/TableBody"
import { TableSearch } from "@/components/ui/TableSearch"
import { usePageWithTable } from "@/lib/hooks/usePageWithTable"
import { GetPositionsResponse } from "@/types/position"
import { Position } from "@/types/user"
import { getSortByName } from "@/utils/getSortByName"

export default function Positions() {
  const { data, loading, error } = useQuery<GetPositionsResponse>(GET_POSITIONS)

  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div >
      <TableSearch search={search} setSearch={setSearch} />

      <div className="overflow-x-auto rounded-lg ">
        <table className="min-w-full divide-y divide-gray-500 ">
          <TableHeader
            handleSort={handleSort}
            headers={onlyNameHeaders}
            sortDir={sortDir}
            sortKey={sortKey}
          />

          <TableBody<Position>
            arrayOfItems={data?.positions ?? []}
            search={search}
            sortKey={sortKey}
            sortDir={sortDir}
            getSearchText={position => `${position.name}`}
            getSortValue={position => getSortByName(position, sortKey)}
            renderRow={position => (
              <NameTableItem key={position.id} item={position} />
            )}
          />
        </table>
      </div>
    </div>
  )
}

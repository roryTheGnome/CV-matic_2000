"use client"

import { GET_PROJECTS } from "@/api/graphql/queries/projects"
import { ProjectTableItem } from "@/components/ui/table/ProjectTableItem"
import TableBody from "@/components/ui/table/TableBody"
import { TableHeader } from "@/components/ui/table/TableHeader"
import { TableSearch } from "@/components/ui/TableSearch"
import { projectsHeaders } from "@/constants/tableHeaders"
import { usePageWithTable } from "@/lib/hooks/usePageWithTable"
import { GetProjectsData, Project } from "@/types/project"
import { getSortProjectValue } from "@/utils/getSortProjectValue"
import { useQuery } from "@apollo/client/react"

export default function Projects() {
  const { loading, error, data } = useQuery<GetProjectsData>(GET_PROJECTS)
  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      <TableSearch
        search={search}
        createButtonText="CREATE PROJECT"
        typeOfCreateModal={"PROJECT_CREATE"}
        setSearch={setSearch}
      />
      <div className="overflow-x-auto rounded-lg ">
        <table className="min-w-full divide-y divide-gray-500 ">
          <TableHeader
            handleSort={handleSort}
            headers={projectsHeaders}
            sortDir={sortDir}
            sortKey={sortKey}
          />

          <TableBody<Project>
            arrayOfItems={data?.projects ?? []}
            search={search}
            sortKey={sortKey}
            sortDir={sortDir}
            getSearchText={project => `${project.name}`}
            getSortValue={project => getSortProjectValue(project, sortKey)}
            renderRow={project => (
              <ProjectTableItem key={project.id} project={project} />
            )}
          />
        </table>
      </div>
    </div>
  )
}

'use client'

import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { Loader } from '@/components/ui/Loader'
import { CvProjectTableItem } from '@/components/ui/table/CvProjectTableItem'
import TableBody from '@/components/ui/table/TableBody'
import { TableHeader } from '@/components/ui/table/TableHeader'
import { TableSearch } from '@/components/ui/TableSearch'
import { projectsHeaders } from '@/constants/tableHeaders'
import { usePageWithTable } from '@/lib/hooks/usePageWithTable'
import { CvProject, GetCvByIdData, GetCvByIdVariables } from '@/types/cvs'
import { getSortProjectValue } from '@/utils/getSortProjectValue'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function CvProjects() {
  const t = useTranslations('TableActions')
  const n = useTranslations('Notifications')
  const { id }: { id: string } = useParams()
  const {
    data: cvData,
    loading,
    error,
  } = useQuery<GetCvByIdData, GetCvByIdVariables>(GET_CV_BY_ID, {
    variables: { cvId: id },
  })
  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  if (loading) {
    return <Loader />
  }
  if (error) {
    return <div>{n('errorOccurred')}</div>
  }

  return (
    <div>
      <TableSearch
        search={search}
        createButtonText={t('addProject')}
        typeOfCreateModal={'CV_PROJECT_ADD'}
        setSearch={setSearch}
      />
      <div className="min-h-screen overflow-x-auto rounded-lg">
        <table className="min-w-full border-separate border-spacing-y-3">
          <TableHeader
            handleSort={handleSort}
            headers={projectsHeaders}
            sortDir={sortDir}
            sortKey={sortKey}
          />
          <TableBody<CvProject>
            arrayOfItems={cvData?.cv.projects ?? []}
            search={search}
            sortKey={sortKey}
            sortDir={sortDir}
            getSearchText={(cvProject) => `${cvProject.name}`}
            getSortValue={(cvProject) =>
              getSortProjectValue(cvProject, sortKey)
            }
            renderRow={(cvProject) => (
              <CvProjectTableItem key={cvProject.id} cvProject={cvProject} />
            )}
          />
        </table>
      </div>
    </div>
  )
}

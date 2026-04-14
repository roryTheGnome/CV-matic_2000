'use client'

import { GET_CVS } from '@/api/graphql/queries/cvs'
import { CvTableItem } from '@/components/ui/table/CvTableItem'

import LoadingPage from '@/app/(platform)/loading'
import NotFoundPage from '@/app/(platform)/not-found'
import TableBody from '@/components/ui/table/TableBody'
import { TableHeader } from '@/components/ui/table/TableHeader'
import { TableSearch } from '@/components/ui/TableSearch'
import { cvsHeaders } from '@/constants/tableHeaders'
import { usePageWithTable } from '@/lib/hooks/usePageWithTable'
import { Cvs, GetCvsData } from '@/types/cvs'
import { getSortCvsValue } from '@/utils/getSortCvsValue'
import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'

export default function CVs() {
  const { loading, error, data } = useQuery<GetCvsData>(GET_CVS)
  const t = useTranslations('TableActions')

  const { search, sortKey, sortDir, setSearch, handleSort } = usePageWithTable()

  if (loading) return <LoadingPage />
  if (error) return <NotFoundPage />

  return (
    <div className="p-6">
      <TableSearch
        search={search}
        createButtonText={t('createCv')}
        typeOfCreateModal={'CV_CREATE'}
        userCanInteract
        setSearch={setSearch}
      />

      <div className="min-h-screen overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-500">
          <TableHeader
            handleSort={handleSort}
            headers={cvsHeaders}
            sortDir={sortDir}
            sortKey={sortKey}
          />

          <TableBody<Cvs>
            arrayOfItems={data?.cvs ?? []}
            search={search}
            sortKey={sortKey}
            sortDir={sortDir}
            getSearchText={(cv) => `${cv.name}`}
            getSortValue={(cv) => getSortCvsValue(cv, sortKey)}
            renderRow={(cv) => <CvTableItem key={cv.id} cv={cv} />}
          />
        </table>
      </div>
    </div>
  )
}

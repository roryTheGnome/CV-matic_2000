'use client'
import NotFoundPage from '@/app/(platform)/not-found'
import EmployeesList from '@/components/EmployeesList'
import { Loader } from '@/components/ui/Loader'
import { TableHeader } from '@/components/ui/table/TableHeader'
import { TableSearch } from '@/components/ui/TableSearch'
import { headers } from '@/constants/tableHeaders'
import { useUsers } from '@/lib/hooks/userHooks/useUsers'
import { useAuthStore } from '@/store/authStore'
import { useTranslations } from 'next-intl'

export default function Employees() {
  const t = useTranslations('TableActions')
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

  const { currentUserId } = useAuthStore()
  if (error) return <NotFoundPage />

  return (
    <div>
      <TableSearch
        search={search}
        createButtonText={t('createUser')}
        typeOfCreateModal={'USER_CREATE'}
        setSearch={setSearch}
      />

      <div className="overflow-x-auto rounded-lg">
        {isLoading ? (
          <Loader />
        ) : (
          <table className="min-w-full divide-y divide-gray-500">
            <TableHeader
              handleSort={handleSort}
              headers={headers}
              sortDir={sortDir}
              sortKey={sortKey}
            />
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

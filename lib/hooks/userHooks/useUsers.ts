import { GET_USERS } from '@/api/graphql/queries/user'
import { GlobalSortKey } from '@/types/table'
import { GetUsersResponse } from '@/types/user'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

export function useUsers() {
  const { data, loading, error } = useQuery<GetUsersResponse>(GET_USERS)

  const [search, setSearch] = useState('')

  const [sortKey, setSortKey] = useState<GlobalSortKey>('first_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: GlobalSortKey) => {
    if (key == sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return {
    users: data?.users ?? [],
    search,
    isLoading: loading,
    sortKey,
    sortDir,
    error,
    handleSort,
    setSearch,
  }
}

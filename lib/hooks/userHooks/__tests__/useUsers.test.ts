import { act, renderHook } from '@testing-library/react'

import { GlobalSortKey } from '@/types/table'
import { GetUsersResponse } from '@/types/user'
import { QueryResult, useQuery } from '@apollo/client/react'
import { useUsers } from '../useUsers'

jest.mock('../../../../api/graphql/queries/user.ts', () => ({
  GET_USERS: 'GET_USERS',
}))
jest.mock('@apollo/client/react')

const mockUseQuery = useQuery as unknown as jest.Mock

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    expect(result.current.users).toEqual([])
    expect(result.current.search).toBe('')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('asc')
    expect(result.current.error).toBeUndefined()
  })

  it('should return loading state correctly', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    expect(result.current.isLoading).toBe(true)
  })

  it('should return error state correctly', () => {
    const mockError = new Error('Network error')
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    expect(result.current.error).toEqual(mockError)
  })

  it('should return users array when data is present', () => {
    const mockUsersData = {
      users: [
        { id: '1', profile: { first_name: 'John', last_name: 'Doe' } },
        { id: '2', profile: { first_name: 'Jane', last_name: 'Smith' } },
      ],
    }

    mockUseQuery.mockReturnValue({
      data: mockUsersData,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    expect(result.current.users).toEqual(mockUsersData.users)
  })

  it('should update search term when setSearch is called', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.setSearch('query string')
    })

    expect(result.current.search).toBe('query string')
  })

  it('should toggle sort direction when handleSort is called with the current sort key', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.handleSort('first_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('desc')

    act(() => {
      result.current.handleSort('first_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('first_name')
    expect(result.current.sortDir).toBe('asc')
  })

  it('should set new sort key and reset direction to asc when handleSort is called with a different key', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUsersResponse>)

    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.handleSort('last_name' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('last_name')
    expect(result.current.sortDir).toBe('asc')

    act(() => {
      result.current.handleSort('department' as GlobalSortKey)
    })

    expect(result.current.sortKey).toBe('department')
    expect(result.current.sortDir).toBe('asc')
  })
})

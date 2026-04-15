import { renderHook } from '@testing-library/react'

import { GetUserResponse, User } from '@/types/user'
import { QueryResult, useQuery } from '@apollo/client/react'
import { useParams } from 'next/navigation'
import { useUser } from '../useUser'

jest.mock('../../../../api/graphql/queries/user.ts', () => ({
  GET_USER: 'GET_USER',
}))
jest.mock('@apollo/client/react')
jest.mock('next/navigation')

const mockUseQuery = useQuery as unknown as jest.Mock
const mockUseParams = useParams as jest.Mock

const mockUser: User = {
  id: '123',
  profile: {
    first_name: 'John',
    last_name: 'Doe',
    avatar: 'avatar.png',
  },
} as User

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({ id: 'url-param-id' })
  })

  it('should use the provided userId over the URL parameter id', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetUserResponse>)

    renderHook(() => useUser('explicit-user-id'))

    expect(mockUseQuery).toHaveBeenCalledWith('GET_USER', {
      variables: { userId: 'explicit-user-id' },
      skip: false,
      fetchPolicy: 'cache-and-network',
    })
  })

  it('should fall back to the URL parameter id if userId is not provided', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetUserResponse>)

    renderHook(() => useUser())

    expect(mockUseQuery).toHaveBeenCalledWith('GET_USER', {
      variables: { userId: 'url-param-id' },
      skip: false,
      fetchPolicy: 'cache-and-network',
    })
  })

  it('should skip the query if neither userId nor URL parameter id is present', () => {
    mockUseParams.mockReturnValue({})
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUserResponse>)

    renderHook(() => useUser())

    expect(mockUseQuery).toHaveBeenCalledWith('GET_USER', {
      variables: { userId: undefined },
      skip: true,
      fetchPolicy: 'cache-and-network',
    })
  })

  it('should return correct loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as unknown as QueryResult<GetUserResponse>)

    const { result } = renderHook(() => useUser('123'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.user).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })

  it('should return correct error state', () => {
    const mockError = new Error('Network error')
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as unknown as QueryResult<GetUserResponse>)

    const { result } = renderHook(() => useUser('123'))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.user).toBeUndefined()
    expect(result.current.error).toEqual(mockError)
  })

  it('should return user data when query is successful', () => {
    mockUseQuery.mockReturnValue({
      data: { user: mockUser },
      loading: false,
      error: undefined,
    } as unknown as QueryResult<GetUserResponse>)

    const { result } = renderHook(() => useUser('123'))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBeUndefined()
  })
})

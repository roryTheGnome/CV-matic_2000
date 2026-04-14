import { renderHook, waitFor } from '@testing-library/react'

import { GET_PROJECT_BY_ID } from '@/api/graphql/queries/projects'
import { MockedProvider } from '@apollo/client/testing/react'
import { useParams } from 'next/navigation'
import { useProject } from '../useProject'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

describe('useProject', () => {
  const mockProject = {
    id: '1',
    name: 'Project Alpha',
    domain: 'Healthcare',
  }

  const mocks = [
    {
      request: {
        query: GET_PROJECT_BY_ID,
        variables: { projectId: '1' },
      },
      result: {
        data: {
          project: mockProject,
        },
      },
    },
    {
      request: {
        query: GET_PROJECT_BY_ID,
        variables: { projectId: '2' },
      },
      error: new Error('GraphQL Error'),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return project data successfully when valid id is provided', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    const { result } = renderHook(() => useProject(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.project).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.project).toEqual(mockProject)
    expect(result.current.error).toBeUndefined()
  })

  it('should return an error when the query fails', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '2' })

    const { result } = renderHook(() => useProject(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.project).toBeUndefined()
  })

  it('should skip the query if no id is provided in params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useProject(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.project).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })
})

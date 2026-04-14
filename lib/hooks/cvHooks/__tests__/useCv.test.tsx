import { renderHook, waitFor } from '@testing-library/react'

import { useParams } from 'next/navigation'

import { GET_CV_BY_ID } from '@/api/graphql/queries/cvs'
import { MockedProvider } from '@apollo/client/testing/react'
import { useCv } from '../useCv'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

describe('useCv', () => {
  const mockCv = {
    id: '1',
    name: 'Frontend Developer',
    education: 'BSc Computer Science',
  }

  const mocks = [
    {
      request: {
        query: GET_CV_BY_ID,
        variables: { cvId: '1' },
      },
      result: {
        data: {
          cv: mockCv,
        },
      },
    },
    {
      request: {
        query: GET_CV_BY_ID,
        variables: { cvId: '2' },
      },
      error: new Error('Network error'),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return cv data successfully when valid id is provided', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    const { result } = renderHook(() => useCv(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.cv).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.cv).toEqual(mockCv)
    expect(result.current.error).toBeUndefined()
  })

  it('should return an error when the query fails', async () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '2' })

    const { result } = renderHook(() => useCv(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.cv).toBeUndefined()
  })

  it('should skip the query if no id is provided in params', () => {
    ;(useParams as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useCv(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.cv).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })
})

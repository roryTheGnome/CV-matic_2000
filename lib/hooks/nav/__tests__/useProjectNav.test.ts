import { useProject } from '@/lib/hooks/projectHooks/useProject'
import { renderHook } from '@testing-library/react'
import { useProjectNav } from '../useProjectNav'

jest.mock('../../projectHooks/useProject.ts', () => ({
  useProject: jest.fn(),
}))

describe('useProjectNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct navigation data when project is loaded', () => {
    ;(useProject as jest.Mock).mockReturnValue({
      project: { name: 'Apollo', start_date: '2024-01-01' },
      isLoading: false,
      error: undefined,
    })

    const { result } = renderHook(() => useProjectNav())

    expect(result.current.project).toEqual({
      name: 'Apollo',
      start_date: '2024-01-01',
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.projectError).toBeUndefined()
    expect(result.current.projectDisplayName).toBe('Apollo 2024-01-01')
  })

  it('should return default display name and loading state when project is not available', () => {
    ;(useProject as jest.Mock).mockReturnValue({
      project: undefined,
      isLoading: true,
      error: undefined,
    })

    const { result } = renderHook(() => useProjectNav())

    expect(result.current.project).toBeUndefined()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.projectError).toBeUndefined()
    expect(result.current.projectDisplayName).toBe('Unknown Project')
  })

  it('should return error state when useProject encounters an error', () => {
    const mockError = new Error('Network Error')
    ;(useProject as jest.Mock).mockReturnValue({
      project: undefined,
      isLoading: false,
      error: mockError,
    })

    const { result } = renderHook(() => useProjectNav())

    expect(result.current.projectError).toEqual(mockError)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.projectDisplayName).toBe('Unknown Project')
  })
})

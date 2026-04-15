import { DELETE_PROJECT_MUTATION } from '@/api/graphql/mutations/project'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeleteProject } from '../useDeleteProject'

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}))

jest.mock('../../../../store/modalStore.ts', () => ({
  useModalStore: jest.fn(),
}))

describe('useDeleteProject', () => {
  const mockCloseModal = jest.fn()
  const mockDeleteProject = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: 'proj-123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_PROJECT_MUTATION) {
        return [mockDeleteProject, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeleteProject())

    expect(result.current.modalData).toEqual({ id: 'proj-123' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteProject())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('projectIdMissing')
    expect(mockDeleteProject).not.toHaveBeenCalled()
  })

  it('should call deleteProject mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeleteProject())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteProject).toHaveBeenCalledWith({
      variables: { project: { projectId: 'proj-123' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeleteProject())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_PROJECT_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteProject: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('projectDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeleteProject())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_PROJECT_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteProject: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeleteProject())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_PROJECT_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('Project deletion failed'))
    })

    expect(toast.error).toHaveBeenCalledWith('Project deletion failed')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeleteProject())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_PROJECT_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('projectDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeleteProject())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_PROJECT_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Project:proj-123'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Project',
      id: 'proj-123',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Project:proj-123' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

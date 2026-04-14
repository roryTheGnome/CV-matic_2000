import { DELETE_DEPARTMENT_MUTATION } from '@/api/graphql/mutations/departments'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeleteDepartment } from '../useDeleteDepartment'

jest.mock('react-hot-toast')

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}))

jest.mock('../../../../store/modalStore.ts', () => ({
  useModalStore: jest.fn(),
}))

describe('useDeleteDepartment', () => {
  const mockCloseModal = jest.fn()
  const mockDeleteDepartment = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: '456' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_DEPARTMENT_MUTATION) {
        return [mockDeleteDepartment, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeleteDepartment())

    expect(result.current.modalData).toEqual({ id: '456' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteDepartment())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('departmentIdMissing')
    expect(mockDeleteDepartment).not.toHaveBeenCalled()
  })

  it('should call deleteDepartment mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeleteDepartment())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteDepartment).toHaveBeenCalledWith({
      variables: { department: { departmentId: '456' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeleteDepartment())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_DEPARTMENT_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteDepartment: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('departmentDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeleteDepartment())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_DEPARTMENT_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteDepartment: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeleteDepartment())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_DEPARTMENT_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('Network failure'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network failure')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeleteDepartment())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_DEPARTMENT_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('departmentDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeleteDepartment())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_DEPARTMENT_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Department:456'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Department',
      id: '456',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Department:456' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

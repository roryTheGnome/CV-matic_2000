import { DELETE_CV_MUTATION } from '@/api/graphql/mutations/cv'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeleteCv } from '../useDeleteCv'

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

describe('useDeleteCv', () => {
  const mockCloseModal = jest.fn()
  const mockDeleteCv = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: '123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_CV_MUTATION) {
        return [mockDeleteCv, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeleteCv())

    expect(result.current.modalData).toEqual({ id: '123' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteCv())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('cvIdMissing')
    expect(mockDeleteCv).not.toHaveBeenCalled()
  })

  it('should call deleteCv mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeleteCv())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteCv).toHaveBeenCalledWith({
      variables: { cv: { cvId: '123' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeleteCv())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_CV_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteCv: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('cvDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeleteCv())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_CV_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteCv: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeleteCv())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_CV_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('Custom GraphQL Error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Custom GraphQL Error')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeleteCv())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_CV_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('cvDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeleteCv())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_CV_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Cv:123'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Cv',
      id: '123',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Cv:123' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

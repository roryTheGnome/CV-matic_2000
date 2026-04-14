import { DELETE_POSITION_MUTATION } from '@/api/graphql/mutations/position'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeletePosition } from '../useDeletePosition'

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

describe('useDeletePosition', () => {
  const mockCloseModal = jest.fn()
  const mockDeletePosition = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: 'pos-123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_POSITION_MUTATION) {
        return [mockDeletePosition, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeletePosition())

    expect(result.current.modalData).toEqual({ id: 'pos-123' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeletePosition())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('positionIdMissing')
    expect(mockDeletePosition).not.toHaveBeenCalled()
  })

  it('should call deletePosition mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeletePosition())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeletePosition).toHaveBeenCalledWith({
      variables: { position: { positionId: 'pos-123' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeletePosition())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_POSITION_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deletePosition: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('positionDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeletePosition())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_POSITION_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deletePosition: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeletePosition())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_POSITION_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('GraphQL Error'))
    })

    expect(toast.error).toHaveBeenCalledWith('GraphQL Error')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeletePosition())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_POSITION_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('positionDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeletePosition())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_POSITION_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Position:pos-123'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Position',
      id: 'pos-123',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Position:pos-123' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

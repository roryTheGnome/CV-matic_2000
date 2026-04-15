import { act, renderHook } from '@testing-library/react'

import { useModalStore } from '@/store/modalStore'
import { DeleteUserResponse, DeleteUserVariables } from '@/types/user'
import { ApolloCache, DefaultContext } from '@apollo/client'
import { MutationTuple, useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useDeleteUser } from '../useDeleteUser'

jest.mock('../../../../api/graphql/mutations/user.ts', () => ({
  DELETE_USER_MUTATION: 'DELETE_USER_MUTATION',
}))
jest.mock('../../../../store/modalStore.ts')
jest.mock('@apollo/client/react')

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockUseModalStore = useModalStore as unknown as jest.Mock
const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockToastError = toast.error as jest.Mock
const mockToastSuccess = toast.success as jest.Mock

interface MutationOptions {
  update?: (cache: ApolloCache) => void
  onCompleted?: (data: DeleteUserResponse) => void
  onError?: (error: Error) => void
}

describe('useDeleteUser', () => {
  let mockCloseModal: jest.Mock
  let mockDeleteUser: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockCloseModal = jest.fn()
    mockDeleteUser = jest.fn()

    mockUseModalStore.mockReturnValue({
      data: { id: '123' },
      closeModal: mockCloseModal,
    })

    mockUseTranslations.mockReturnValue((key: string) => key)

    mockUseMutation.mockReturnValue([
      mockDeleteUser,
      { loading: false },
    ] as unknown as MutationTuple<
      DeleteUserResponse,
      DeleteUserVariables,
      DefaultContext,
      ApolloCache
    >)
  })

  it('should initialize correctly with default values', () => {
    const { result } = renderHook(() => useDeleteUser())

    expect(result.current.modalData).toEqual({ id: '123' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should display error toast and abort deletion if user id is missing', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteUser())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockToastError).toHaveBeenCalledWith('userIdMissing')
    expect(mockDeleteUser).not.toHaveBeenCalled()
  })

  it('should invoke deleteUser mutation with correct variables when user id is present', () => {
    const { result } = renderHook(() => useDeleteUser())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteUser).toHaveBeenCalledWith({
      variables: { userId: '123' },
    })
  })

  it('should display success toast and close modal when onCompleted is triggered with affected rows', () => {
    let onCompletedCallback: ((data: DeleteUserResponse) => void) | undefined

    mockUseMutation.mockImplementation((_, options?: MutationOptions) => {
      onCompletedCallback = options?.onCompleted
      return [mockDeleteUser, { loading: false }]
    })

    renderHook(() => useDeleteUser())

    act(() => {
      if (onCompletedCallback) {
        onCompletedCallback({ deleteUser: { affected: 1 } })
      }
    })

    expect(mockToastSuccess).toHaveBeenCalledWith('userDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should neither display success toast nor close modal if affected rows count is zero', () => {
    let onCompletedCallback: ((data: DeleteUserResponse) => void) | undefined

    mockUseMutation.mockImplementation((_, options?: MutationOptions) => {
      onCompletedCallback = options?.onCompleted
      return [mockDeleteUser, { loading: false }]
    })

    renderHook(() => useDeleteUser())

    act(() => {
      if (onCompletedCallback) {
        onCompletedCallback({ deleteUser: { affected: 0 } })
      }
    })

    expect(mockToastSuccess).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should display specific error message when onError is triggered', () => {
    let onErrorCallback: ((err: Error) => void) | undefined

    mockUseMutation.mockImplementation((_, options?: MutationOptions) => {
      onErrorCallback = options?.onError
      return [mockDeleteUser, { loading: false }]
    })

    renderHook(() => useDeleteUser())

    act(() => {
      if (onErrorCallback) {
        onErrorCallback(new Error('Network failure'))
      }
    })

    expect(mockToastError).toHaveBeenCalledWith('Network failure')
  })

  it('should display fallback translation when onError is triggered without a specific message', () => {
    let onErrorCallback: ((err: Error) => void) | undefined

    mockUseMutation.mockImplementation((_, options?: MutationOptions) => {
      onErrorCallback = options?.onError
      return [mockDeleteUser, { loading: false }]
    })

    renderHook(() => useDeleteUser())

    act(() => {
      if (onErrorCallback) {
        onErrorCallback(new Error(''))
      }
    })

    expect(mockToastError).toHaveBeenCalledWith('userDeleteError')
  })

  it('should correctly evict user entity from cache and trigger garbage collection on update', () => {
    let updateCallback: ((cache: ApolloCache) => void) | undefined

    mockUseMutation.mockImplementation((_, options?: MutationOptions) => {
      updateCallback = options?.update
      return [mockDeleteUser, { loading: false }]
    })

    renderHook(() => useDeleteUser())

    const mockIdentify = jest.fn().mockReturnValue('User:123')
    const mockEvict = jest.fn()
    const mockGc = jest.fn()

    const mockCache = {
      identify: mockIdentify,
      evict: mockEvict,
      gc: mockGc,
    } as unknown as ApolloCache

    act(() => {
      if (updateCallback) {
        updateCallback(mockCache)
      }
    })

    expect(mockIdentify).toHaveBeenCalledWith({ __typename: 'User', id: '123' })
    expect(mockEvict).toHaveBeenCalledWith({ id: 'User:123' })
    expect(mockGc).toHaveBeenCalled()
  })
})

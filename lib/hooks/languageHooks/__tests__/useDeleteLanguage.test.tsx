import { DELETE_LANGUAGE_MUTATION } from '@/api/graphql/mutations/languages'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeleteLanguage } from '../useDeleteLanguage'

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

describe('useDeleteLanguage', () => {
  const mockCloseModal = jest.fn()
  const mockDeleteLanguage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: '789' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_LANGUAGE_MUTATION) {
        return [mockDeleteLanguage, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeleteLanguage())

    expect(result.current.modalData).toEqual({ id: '789' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteLanguage())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('languageIdMissing')
    expect(mockDeleteLanguage).not.toHaveBeenCalled()
  })

  it('should call deleteLanguage mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeleteLanguage())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteLanguage).toHaveBeenCalledWith({
      variables: { language: { languageId: '789' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeleteLanguage())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_LANGUAGE_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteLanguage: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('languageDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeleteLanguage())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_LANGUAGE_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteLanguage: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeleteLanguage())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_LANGUAGE_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('Server timeout'))
    })

    expect(toast.error).toHaveBeenCalledWith('Server timeout')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeleteLanguage())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_LANGUAGE_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('languageDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeleteLanguage())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_LANGUAGE_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Language:789'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Language',
      id: '789',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Language:789' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

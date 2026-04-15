import { DELETE_SKILL_MUTATION } from '@/api/graphql/mutations/skills'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDeleteSkill } from '../useDeleteSkill'

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

describe('useDeleteSkill', () => {
  const mockCloseModal = jest.fn()
  const mockDeleteSkill = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: { id: 'skill-123' },
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === DELETE_SKILL_MUTATION) {
        return [mockDeleteSkill, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useDeleteSkill())

    expect(result.current.modalData).toEqual({ id: 'skill-123' })
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
  })

  it('should show error toast and abort if modalData ID is missing', () => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteSkill())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('skillIdMissing')
    expect(mockDeleteSkill).not.toHaveBeenCalled()
  })

  it('should call deleteSkill mutation with correct variables when ID is present', () => {
    const { result } = renderHook(() => useDeleteSkill())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockDeleteSkill).toHaveBeenCalledWith({
      variables: { skill: { skillId: 'skill-123' } },
    })
  })

  it('should handle onCompleted callback successfully', () => {
    renderHook(() => useDeleteSkill())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_SKILL_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteSkill: { affected: 1 } })
    })

    expect(toast.success).toHaveBeenCalledWith('skillDeleteSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onCompleted callback without showing toast if affected is 0', () => {
    renderHook(() => useDeleteSkill())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_SKILL_MUTATION)[1]

    act(() => {
      mutationConfig.onCompleted({ deleteSkill: { affected: 0 } })
    })

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('should handle onError callback and show provided error message', () => {
    renderHook(() => useDeleteSkill())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_SKILL_MUTATION)[1]

    act(() => {
      mutationConfig.onError(new Error('Skill deletion failed'))
    })

    expect(toast.error).toHaveBeenCalledWith('Skill deletion failed')
  })

  it('should handle onError callback and show fallback translation if error message is empty', () => {
    renderHook(() => useDeleteSkill())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_SKILL_MUTATION)[1]

    act(() => {
      mutationConfig.onError({ message: '' } as unknown as Error)
    })

    expect(toast.error).toHaveBeenCalledWith('skillDeleteError')
  })

  it('should evict item from cache and call gc on update', () => {
    renderHook(() => useDeleteSkill())

    const mutationConfig = (
      useMutation as unknown as jest.Mock
    ).mock.calls.find((call) => call[0] === DELETE_SKILL_MUTATION)[1]

    const mockCache = {
      identify: jest.fn().mockReturnValue('Skill:skill-123'),
      evict: jest.fn(),
      gc: jest.fn(),
    }

    act(() => {
      mutationConfig.update(mockCache)
    })

    expect(mockCache.identify).toHaveBeenCalledWith({
      __typename: 'Skill',
      id: 'skill-123',
    })
    expect(mockCache.evict).toHaveBeenCalledWith({ id: 'Skill:skill-123' })
    expect(mockCache.gc).toHaveBeenCalled()
  })
})

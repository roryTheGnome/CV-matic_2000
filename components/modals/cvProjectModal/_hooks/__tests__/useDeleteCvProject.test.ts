import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { useDeleteCvProject } from '../useDeleteCvProject'

jest.mock('@apollo/client/react')
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))
jest.mock('../../../../../store/modalStore', () => ({
  useModalStore: jest.fn(),
}))
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../../../../../api/graphql/mutations/cv', () => ({
  REMOVE_CV_PROJECT_MUTATION: 'REMOVE_CV_PROJECT_MUTATION',
}))

const mockUseMutation = useMutation as unknown as jest.Mock
const mockUseTranslations = useTranslations as jest.Mock
const mockUseParams = useParams as jest.Mock
const mockUseModalStore = useModalStore as unknown as jest.Mock

describe('useDeleteCvProject', () => {
  const mockCloseModal = jest.fn()
  const mockRemoveCvProject = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTranslations.mockReturnValue((key: string) => key)
    mockUseParams.mockReturnValue({ id: 'cv-123' })

    mockUseMutation.mockReturnValue([mockRemoveCvProject, { loading: false }])
  })

  it('should return modalData and loading state correctly', () => {
    const mockData = { projectId: 'project-456', name: 'Test Project' }
    mockUseModalStore.mockReturnValue({
      data: mockData,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteCvProject())

    expect(result.current.modalData).toEqual(mockData)
    expect(result.current.loading).toBe(false)
  })

  it('should show error toast and not call mutation if projectId is missing', () => {
    mockUseModalStore.mockReturnValue({
      data: null,
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteCvProject())

    act(() => {
      result.current.handleDelete()
    })

    expect(toast.error).toHaveBeenCalledWith('Project ID is missing!')
    expect(mockRemoveCvProject).not.toHaveBeenCalled()
  })

  it('should call removeCvProject mutation with correct variables', () => {
    mockUseModalStore.mockReturnValue({
      data: { projectId: 'project-456' },
      closeModal: mockCloseModal,
    })

    const { result } = renderHook(() => useDeleteCvProject())

    act(() => {
      result.current.handleDelete()
    })

    expect(mockRemoveCvProject).toHaveBeenCalledWith({
      variables: {
        project: {
          cvId: 'cv-123',
          projectId: 'project-456',
        },
      },
    })
  })

  it('should handle onCompleted correctly', () => {
    let onCompletedCallback: () => void = () => {}

    mockUseMutation.mockImplementation((mutation, options) => {
      onCompletedCallback = options.onCompleted
      return [mockRemoveCvProject, { loading: false }]
    })

    mockUseModalStore.mockReturnValue({
      data: { projectId: 'project-456' },
      closeModal: mockCloseModal,
    })

    renderHook(() => useDeleteCvProject())

    act(() => {
      onCompletedCallback()
    })

    expect(toast.success).toHaveBeenCalledWith('cvProjectRemoved')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle onError correctly', () => {
    let onErrorCallback: (err: { message: string }) => void = () => {}

    mockUseMutation.mockImplementation((mutation, options) => {
      onErrorCallback = options.onError
      return [mockRemoveCvProject, { loading: false }]
    })

    mockUseModalStore.mockReturnValue({
      data: { projectId: 'project-456' },
      closeModal: mockCloseModal,
    })

    renderHook(() => useDeleteCvProject())

    act(() => {
      onErrorCallback({ message: 'Network Error' })
    })

    expect(toast.error).toHaveBeenCalledWith('errorOccurredNetwork Error')
  })
})

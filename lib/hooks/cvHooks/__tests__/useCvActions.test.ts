import {
  CREATE_CV_MUTATION,
  UPDATE_CV_MUTATION,
} from '@/api/graphql/mutations/cv'
import { useAuthStore } from '@/store/authStore'
import { useModalStore } from '@/store/modalStore'
import { CreateCvModalFormState } from '@/types/cvs'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useCvActions } from '../useCvActions'

jest.mock('react-hot-toast')
jest.mock('@apollo/client/react', () => ({
  useMutation: jest.fn(),
}))
jest.mock('../../../../store/modalStore.ts', () => ({
  useModalStore: jest.fn(),
}))
jest.mock('../../../../store/authStore.ts', () => ({
  useAuthStore: jest.fn(),
}))

describe('useCvActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreateCv = jest.fn()
  const mockUpdateCv = jest.fn()

  const defaultInitialData: CreateCvModalFormState = {
    name: 'Frontend CV',
    education: 'University',
    description: 'Experienced developer',
    user: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'CV_CREATE',
      closeModal: mockCloseModal,
    })
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      currentUserId: '123',
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_CV_MUTATION) {
        return [mockCreateCv, { loading: false }]
      }
      if (mutation === UPDATE_CV_MUTATION) {
        return [mockUpdateCv, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values if no initial data is provided', () => {
    const { result } = renderHook(() => useCvActions())

    expect(result.current.formData).toEqual({
      name: '',
      education: '',
      description: '',
      user: null,
    })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() => useCvActions(defaultInitialData))

    expect(result.current.formData).toEqual(defaultInitialData)
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation states on input change', () => {
    const { result } = renderHook(() => useCvActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'New CV Name' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('New CV Name')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should invalidate form if required fields are cleared', () => {
    const { result } = renderHook(() => useCvActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.isFormValid).toBe(false)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() => useCvActions(defaultInitialData))
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreateCv).not.toHaveBeenCalled()
    expect(mockUpdateCv).not.toHaveBeenCalled()
  })

  it('should call createCv mutation when form is dirty and cvId is not provided', () => {
    const { result } = renderHook(() => useCvActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'My new CV' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreateCv).toHaveBeenCalledWith({
      variables: {
        cv: {
          name: 'My new CV',
          education: null,
          description: '',
          userId: '123',
        },
      },
    })
  })

  it('should call updateCv mutation when form is dirty and cvId is provided', () => {
    const { result } = renderHook(() =>
      useCvActions(defaultInitialData, 'cv-456'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'description', value: 'Updated desc' },
      } as React.ChangeEvent<HTMLTextAreaElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateCv).toHaveBeenCalledWith({
      variables: {
        cv: {
          cvId: 'cv-456',
          name: 'Frontend CV',
          education: 'University',
          description: 'Updated desc',
        },
      },
    })
  })

  it('should correctly map empty education string to null in mutation variables', () => {
    const { result } = renderHook(() =>
      useCvActions({ ...defaultInitialData, education: '' }, 'cv-456'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'description', value: 'Updated desc' },
      } as React.ChangeEvent<HTMLTextAreaElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateCv).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          cv: expect.objectContaining({
            education: null,
          }),
        },
      }),
    )
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => useCvActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_CV_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('CV created successfully!')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => useCvActions())
    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_CV_MUTATION,
    )[1]

    act(() => {
      updateConfig.onError(new Error('Network error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network error')
  })
})

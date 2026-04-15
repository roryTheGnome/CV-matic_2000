import {
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
} from '@/api/graphql/mutations/project'
import { GET_PROJECTS } from '@/api/graphql/queries/projects'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useProjectActions } from '../useProjectActions'

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

describe('useProjectActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreateProject = jest.fn()
  const mockUpdateProject = jest.fn()

  const defaultInitialData = {
    name: 'Apollo',
    domain: 'Healthcare',
    start_date: '2023-01-01',
    end_date: '',
    description: 'Main project',
    environment: 'React, Node.js',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'PROJECT_CREATE',
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_PROJECT_MUTATION) {
        return [mockCreateProject, { loading: false }]
      }
      if (mutation === UPDATE_PROJECT_MUTATION) {
        return [mockUpdateProject, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values if no initial data is provided', () => {
    const { result } = renderHook(() => useProjectActions())

    expect(result.current.formData).toEqual({
      name: '',
      domain: '',
      start_date: '',
      end_date: '',
      description: '',
      environment: '',
    })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() => useProjectActions(defaultInitialData))

    expect(result.current.formData).toEqual(defaultInitialData)
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation states on input change', () => {
    const { result } = renderHook(() => useProjectActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Apollo V2' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('Apollo V2')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should invalidate form if required fields are cleared', () => {
    const { result } = renderHook(() => useProjectActions(defaultInitialData))

    act(() => {
      result.current.handleChange({
        target: { name: 'domain', value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.isFormValid).toBe(false)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() => useProjectActions(defaultInitialData))
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreateProject).not.toHaveBeenCalled()
    expect(mockUpdateProject).not.toHaveBeenCalled()
  })

  it('should call createProject mutation when form is dirty and projectId is not provided', () => {
    const { result } = renderHook(() => useProjectActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'New Proj' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'domain', value: 'Finance' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'start_date', value: '2024-01-01' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'description', value: 'Desc' },
      } as React.ChangeEvent<HTMLInputElement>)
      result.current.handleChange({
        target: { name: 'environment', value: 'React, Vue,  Angular ' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreateProject).toHaveBeenCalledWith({
      variables: {
        project: {
          name: 'New Proj',
          domain: 'Finance',
          start_date: '2024-01-01',
          description: 'Desc',
          environment: ['React', 'Vue', 'Angular'],
        },
      },
    })
  })

  it('should call updateProject mutation when form is dirty and projectId is provided', () => {
    const { result } = renderHook(() =>
      useProjectActions(defaultInitialData, 'proj-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'end_date', value: '2024-12-31' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateProject).toHaveBeenCalledWith({
      variables: {
        project: {
          projectId: 'proj-123',
          name: 'Apollo',
          domain: 'Healthcare',
          start_date: '2023-01-01',
          end_date: '2024-12-31',
          description: 'Main project',
          environment: ['React', 'Node.js'],
        },
      },
    })
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => useProjectActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_PROJECT_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('projectCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle successful update callbacks', () => {
    renderHook(() => useProjectActions(defaultInitialData, 'proj-123'))
    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_PROJECT_MUTATION,
    )[1]

    act(() => {
      updateConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('projectUpdatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => useProjectActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_PROJECT_MUTATION,
    )[1]

    act(() => {
      createConfig.onError(new Error('Server error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Server error')
  })

  it('should update apollo cache successfully on create', () => {
    renderHook(() => useProjectActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_PROJECT_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest
        .fn()
        .mockReturnValue({ projects: [{ id: '1', name: 'Legacy' }] }),
      writeQuery: jest.fn(),
    }

    const mockData = {
      createProject: { id: '2', name: 'New Project' },
    }

    act(() => {
      createConfig.update(mockCache, { data: mockData })
    })

    expect(mockCache.readQuery).toHaveBeenCalledWith({ query: GET_PROJECTS })
    expect(mockCache.writeQuery).toHaveBeenCalledWith({
      query: GET_PROJECTS,
      data: {
        projects: [mockData.createProject, { id: '1', name: 'Legacy' }],
      },
    })
  })

  it('should not throw if cache read returns null during update', () => {
    renderHook(() => useProjectActions())
    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_PROJECT_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest.fn().mockReturnValue(null),
      writeQuery: jest.fn(),
    }

    act(() => {
      createConfig.update(mockCache, {
        data: { createProject: { id: '2', name: 'New Project' } },
      })
    })

    expect(mockCache.readQuery).toHaveBeenCalled()
    expect(mockCache.writeQuery).not.toHaveBeenCalled()
  })
})

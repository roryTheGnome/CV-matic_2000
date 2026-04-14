import {
  CREATE_DEPARTMENT_MUTATION,
  UPDATE_DEPARTMENT_MUTATION,
} from '@/api/graphql/mutations/departments'
import { GET_DEPARTMENTS } from '@/api/graphql/queries/departments'
import { useModalStore } from '@/store/modalStore'
import { useMutation } from '@apollo/client/react'
import { act, renderHook } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useDepartmentActions } from '../useDepartmentActions'

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

describe('useDepartmentActions', () => {
  const mockCloseModal = jest.fn()
  const mockCreateDepartment = jest.fn()
  const mockUpdateDepartment = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
      type: 'DEPARTMENT_CREATE',
      closeModal: mockCloseModal,
    })
    ;(useMutation as unknown as jest.Mock).mockImplementation((mutation) => {
      if (mutation === CREATE_DEPARTMENT_MUTATION) {
        return [mockCreateDepartment, { loading: false }]
      }
      if (mutation === UPDATE_DEPARTMENT_MUTATION) {
        return [mockUpdateDepartment, { loading: false }]
      }
      return [jest.fn(), { loading: false }]
    })
  })

  it('should initialize with default empty values', () => {
    const { result } = renderHook(() => useDepartmentActions())

    expect(result.current.formData).toEqual({ name: '' })
    expect(result.current.isFormValid).toBe(false)
    expect(result.current.isDirty).toBe(true)
  })

  it('should initialize with provided initial data', () => {
    const { result } = renderHook(() => useDepartmentActions({ name: 'HR' }))

    expect(result.current.formData).toEqual({ name: 'HR' })
    expect(result.current.isFormValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update formData and validation on input change', () => {
    const { result } = renderHook(() => useDepartmentActions({ name: 'HR' }))

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Engineering' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.formData.name).toBe('Engineering')
    expect(result.current.isDirty).toBe(true)
    expect(result.current.isFormValid).toBe(true)
  })

  it('should close modal immediately on submit if data is not dirty', () => {
    const { result } = renderHook(() => useDepartmentActions({ name: 'HR' }))
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(mockCreateDepartment).not.toHaveBeenCalled()
    expect(mockUpdateDepartment).not.toHaveBeenCalled()
  })

  it('should call createDepartment mutation when form is dirty and no ID is provided', () => {
    const { result } = renderHook(() => useDepartmentActions())
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Sales' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockCreateDepartment).toHaveBeenCalledWith({
      variables: {
        department: { name: 'Sales' },
      },
    })
  })

  it('should call updateDepartment mutation when form is dirty and ID is provided', () => {
    const { result } = renderHook(() =>
      useDepartmentActions({ name: 'HR' }, 'dept-123'),
    )
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.SubmitEvent<HTMLFormElement>

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Human Resources' },
      } as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSubmit(mockEvent)
    })

    expect(mockUpdateDepartment).toHaveBeenCalledWith({
      variables: {
        department: {
          departmentId: 'dept-123',
          name: 'Human Resources',
        },
      },
    })
  })

  it('should handle successful creation callbacks', () => {
    renderHook(() => useDepartmentActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_DEPARTMENT_MUTATION,
    )[1]

    act(() => {
      createConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('departmentCreatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle successful update callbacks', () => {
    renderHook(() => useDepartmentActions({ name: 'HR' }, 'dept-123'))

    const updateConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === UPDATE_DEPARTMENT_MUTATION,
    )[1]

    act(() => {
      updateConfig.onCompleted()
    })

    expect(toast.success).toHaveBeenCalledWith('departmentUpdatedSuccess')
    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('should handle mutation errors gracefully', () => {
    renderHook(() => useDepartmentActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_DEPARTMENT_MUTATION,
    )[1]

    act(() => {
      createConfig.onError(new Error('Network error'))
    })

    expect(toast.error).toHaveBeenCalledWith('Network error')
  })

  it('should update apollo cache successfully on create', () => {
    renderHook(() => useDepartmentActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_DEPARTMENT_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest
        .fn()
        .mockReturnValue({ departments: [{ id: '1', name: 'HR' }] }),
      writeQuery: jest.fn(),
    }

    const mockData = {
      createDepartment: { id: '2', name: 'IT' },
    }

    act(() => {
      createConfig.update(mockCache, { data: mockData })
    })

    expect(mockCache.readQuery).toHaveBeenCalledWith({ query: GET_DEPARTMENTS })
    expect(mockCache.writeQuery).toHaveBeenCalledWith({
      query: GET_DEPARTMENTS,
      data: {
        departments: [mockData.createDepartment, { id: '1', name: 'HR' }],
      },
    })
  })

  it('should not throw if cache read returns null during update', () => {
    renderHook(() => useDepartmentActions())

    const createConfig = (useMutation as unknown as jest.Mock).mock.calls.find(
      (call) => call[0] === CREATE_DEPARTMENT_MUTATION,
    )[1]

    const mockCache = {
      readQuery: jest.fn().mockReturnValue(null),
      writeQuery: jest.fn(),
    }

    act(() => {
      createConfig.update(mockCache, {
        data: { createDepartment: { id: '2', name: 'IT' } },
      })
    })

    expect(mockCache.readQuery).toHaveBeenCalled()
    expect(mockCache.writeQuery).not.toHaveBeenCalled()
  })
})
